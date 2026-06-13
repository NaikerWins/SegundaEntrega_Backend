import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Programacion } from '../programaciones/entities/programaciones.entity';
import { MonitoreoGateway } from './monitoreo.gateway';
import { Bus } from '../buses/entities/bus.entity';
import { Ruta } from '../rutas/entities/ruta.entity';
import { Nodo } from '../nodos/entities/nodo.entity';
import { Incidente } from '../incidentes/entities/incidente.entity';
import { SuscripcionParadero } from './entities/suscripcion-paradero.entity';
import { PreferenciasClima } from './entities/preferencias-clima.entity';
import { WeatherService } from './weather.service';
import { CreateSuscripcionDto } from './dto/suscripcion-paradero.dto';
import { UpdatePreferenciasClimaDto } from './dto/update-preferencias-clima.dto';

@Injectable()
export class MonitoreoService {
  constructor(
    @InjectRepository(Programacion)
    private readonly programacionRepository: Repository<Programacion>,

    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,

    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,

    @InjectRepository(Nodo)
    private readonly nodoRepository: Repository<Nodo>,

    @InjectRepository(Incidente)
    private readonly incidenteRepository: Repository<Incidente>,

    @InjectRepository(SuscripcionParadero)
    private readonly suscripcionRepository: Repository<SuscripcionParadero>,

    @InjectRepository(PreferenciasClima)
    private readonly preferenciasClimaRepository: Repository<PreferenciasClima>,

    private readonly monitoreoGateway: MonitoreoGateway,

    @Inject(WeatherService)
    private readonly weatherService: WeatherService,
  ) {}

  async getBusesActivosPorRuta(rutaId: number) {
    const programaciones = await this.programacionRepository.find({
      where: { ruta: { id: rutaId }, estado: 'activa' },
      relations: ['bus', 'ruta'],
    });
    return programaciones.map(p => ({
      busId: p.bus?.id,
      placa: p.bus?.placa,
      ubicacion: p.bus?.ubicacion,
      ocupacion: p.ocupacion_actual,
      capacidad: p.capacidad_maxima,
      destino: p.ruta?.nombre,
      ultima_actualizacion: p.bus?.ultima_actualizacion,
    }));
  }

@Cron('*/5 * * * * *')  // Cada 5 segundos para ver movimiento más rápido
async moverBusesYNotificar() {
  const programacionesActivas = await this.programacionRepository.find({
    where: { estado: 'activa' },
    relations: ['bus', 'ruta'],
  });

  for (const prog of programacionesActivas) {
    const bus = prog.bus;
    if (!bus || !prog.ruta) continue;

    const nodos = await this.nodoRepository.find({
      where: { ruta: { id: prog.ruta.id } },
      relations: ['paradero'],
      order: { orden: 'ASC' },
    });

    if (nodos.length === 0) {
      console.log(`Ruta ${prog.ruta.id} sin paraderos`);
      continue;
    }

    let indiceActual = bus.paraderoActualIndice ?? 0;
    let ubicacion = bus.ubicacion;

    // Si no tiene ubicación, empezar en el primer paradero
    if (!ubicacion) {
      const primerParadero = nodos[0]?.paradero;
      if (!primerParadero || !primerParadero.latitud || !primerParadero.longitud) continue;
      ubicacion = {
        lat: Number(primerParadero.latitud),
        lng: Number(primerParadero.longitud),
      };
      console.log(`Bus ${bus.placa} iniciado en paradero: ${primerParadero.nombre}`);
    }

    // Obtener el siguiente paradero
    const siguienteIndice = (indiceActual + 1) % nodos.length;
    const siguienteNodo = nodos[siguienteIndice];
    const siguienteParadero = siguienteNodo?.paradero;

    if (!siguienteParadero || !siguienteParadero.latitud || !siguienteParadero.longitud) continue;

    const destino = {
      lat: Number(siguienteParadero.latitud),
      lng: Number(siguienteParadero.longitud),
    };

    // Calcular distancia
    const distancia = this.calcularDistancia(
      ubicacion.lat, ubicacion.lng,
      destino.lat, destino.lng,
    );

    // Si está muy cerca del paradero (menos de 50 metros), avanzar al siguiente
    if (distancia < 0.05) {
      bus.paraderoActualIndice = siguienteIndice;
      ubicacion = { lat: destino.lat, lng: destino.lng };
      console.log(`Bus ${bus.placa} LLEGÓ a paradero: ${siguienteParadero.nombre}. Avanzando al siguiente.`);
    } else {
      // Mover hacia el destino (más rápido)
      const paso = 0.01; // Aumentado para ver movimiento
      const factor = Math.min(paso / distancia, 1); // No exceder 1
      ubicacion = {
        lat: ubicacion.lat + (destino.lat - ubicacion.lat) * factor,
        lng: ubicacion.lng + (destino.lng - ubicacion.lng) * factor,
      };
    }

    bus.ubicacion = ubicacion;
    bus.ultima_actualizacion = new Date();
    await this.busRepository.save(bus);
  }

  // Emitir ubicaciones
  const rutas = await this.rutaRepository.find();
  for (const ruta of rutas) {
    if (!ruta.id) continue;
    const buses = await this.getBusesActivosPorRuta(ruta.id);
    if (buses.length > 0) {
      this.monitoreoGateway.emitirUbicacionesRuta(ruta.id, buses);
    }
  }
}

  async estimarLlegada(rutaId: number, paraderoId: number, busId?: number) {
    const nodos = await this.nodoRepository.find({
      where: { ruta: { id: rutaId } },
      relations: ['paradero'],
      order: { orden: 'ASC' },
    });
    const paraderoDestino = nodos.find(n => n.paradero?.id === paraderoId);
    if (!paraderoDestino) throw new NotFoundException('Paradero no está en la ruta');

    const paradero = paraderoDestino.paradero;
    if (!paradero || paradero.latitud == null || paradero.longitud == null) {
      throw new NotFoundException('El paradero no tiene coordenadas registradas');
    }

    const buses = await this.getBusesActivosPorRuta(rutaId);
    if (buses.length === 0) throw new NotFoundException('No hay buses activos en esa ruta');

    const bus = busId ? buses.find(b => b.busId === busId) : buses[0];
    if (!bus || !bus.ubicacion) throw new NotFoundException('Bus sin ubicación');

    const distancia = this.calcularDistancia(
      bus.ubicacion.lat, bus.ubicacion.lng,
      Number(paradero.latitud), Number(paradero.longitud),
    );
    const velocidadPromedioKmh = 30;
    const tiempoMin = (distancia / (velocidadPromedioKmh / 60));

    const ruta = await this.rutaRepository.findOne({ where: { id: rutaId } });
    const nombreRuta = ruta?.nombre ?? '';

    return {
      busId: bus.busId,
      placa: bus.placa,
      distancia_km: distancia.toFixed(2),
      tiempo_estimado_min: Math.ceil(tiempoMin),
      paradero: paraderoDestino.paradero?.nombre,
      rutaNombre: nombreRuta,
    };
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.gradosARadianes(lat2 - lat1);
    const dLon = this.gradosARadianes(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.gradosARadianes(lat1)) * Math.cos(this.gradosARadianes(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private gradosARadianes(grados: number): number {
    return grados * (Math.PI / 180);
  }

  async getEstadoFlota() {
    const programaciones = await this.programacionRepository.find({
      where: { estado: 'activa' },
      relations: ['bus', 'ruta'],
    });
    return programaciones.map(p => ({
      busId: p.bus?.id,
      placa: p.bus?.placa,
      ubicacion: p.bus?.ubicacion,
      ocupacion: p.ocupacion_actual,
      capacidad: p.capacidad_maxima,
      ruta: p.ruta?.nombre,
      incidentesActivos: 0,
    }));
  }

  async getPasajerosEnTransito(): Promise<number> {
    const result = await this.programacionRepository
      .createQueryBuilder('p')
      .select('SUM(p.ocupacion_actual)', 'total')
      .where('p.estado = :estado', { estado: 'activa' })
      .getRawOne();
    return Number(result?.total) || 0;
  }

  async getIncidentesActivos(): Promise<Incidente[]> {
    return this.incidenteRepository.find({
      where: { estado: Not('resuelto') },
      relations: ['bus', 'conductor'],
    });
  }

  async getAlertasOcupacionMaxima() {
    const programaciones = await this.programacionRepository.find({
      where: { estado: 'activa' },
      relations: ['bus'],
    });
    return programaciones
      .filter(p => (p.ocupacion_actual ?? 0) >= (p.capacidad_maxima ?? 0))
      .map(p => ({
        busId: p.bus?.id,
        placa: p.bus?.placa,
        ocupacion: p.ocupacion_actual,
        capacidad: p.capacidad_maxima,
      }));
  }

  @Cron('*/10 * * * * *')
  async emitirDatosPanel() {
    const estado = await this.getEstadoFlota();
    const pasajeros = await this.getPasajerosEnTransito();
    const incidentes = await this.getIncidentesActivos();
    const alertasOcupacion = await this.getAlertasOcupacionMaxima();
    this.monitoreoGateway.emitirEstadoPanel({
      estado,
      pasajeros,
      incidentes,
      alertasOcupacion,
    });
  }

  async crearSuscripcion(ciudadanoId: string, dto: CreateSuscripcionDto) {
    const suscripcion = this.suscripcionRepository.create({
      ...dto,
      ciudadano_id: ciudadanoId,
    });
    return this.suscripcionRepository.save(suscripcion);
  }

  @Cron('*/10 * * * * *')
  async verificarBusesCercanos() {
    const suscripciones = await this.suscripcionRepository.find({ where: { activa: true } });
    for (const sub of suscripciones) {
      try {
        const eta = await this.estimarLlegada(sub.ruta_id, sub.paradero_id);
        if (eta && eta.tiempo_estimado_min <= sub.minutos_anticipacion) {
          this.monitoreoGateway.notificarCiudadano(sub.ciudadano_id, 'bus-cercano', {
            ruta: eta.rutaNombre,
            tiempoEstimado: eta.tiempo_estimado_min,
            placa: eta.placa,
          });
        }
      } catch (e) {
        // ignorar si no hay buses activos
      }
    }
  }

  @Cron('0 6 * * *')
  async enviarAlertasClima() {
    const usuarios = await this.preferenciasClimaRepository.find({
      where: { alertas_activas: true },
    });
    for (const user of usuarios) {
      const pronostico = await this.weatherService.obtenerPronostico(user.ciudad);
      if (!pronostico) continue;

      const ahora = new Date();
      const [h, m] = user.horario_viaje.split(':');
      const horarioViaje = new Date();
      horarioViaje.setHours(+h, +m, 0);
      const diffHoras = Math.abs(horarioViaje.getTime() - ahora.getTime()) / 3600000;
      if (diffHoras > 2) continue;

      let mensaje: string;
      if (pronostico.lluvia_prob > 50) {
        mensaje = `🌧️ Hoy lloverá (${pronostico.lluvia_prob}% prob.). Temp: ${pronostico.temp}°C. Sal 15 min antes. ¡Lleva paraguas!`;
      } else {
        mensaje = `☀️ Clima favorable. Temp: ${pronostico.temp}°C. ¡Buen viaje!`;
      }

      this.monitoreoGateway.notificarCiudadano(user.ciudadano_id, 'alerta-clima', mensaje);
    }
  }

  async guardarPreferencias(userId: string, dto: UpdatePreferenciasClimaDto) {
    let pref = await this.preferenciasClimaRepository.findOne({ where: { ciudadano_id: userId } });
    if (pref) {
      Object.assign(pref, dto);
    } else {
      pref = this.preferenciasClimaRepository.create({ ...dto, ciudadano_id: userId });
    }
    return this.preferenciasClimaRepository.save(pref);
  }

  async obtenerPreferencias(userId: string) {
    return this.preferenciasClimaRepository.findOne({ where: { ciudadano_id: userId } });
  }
}