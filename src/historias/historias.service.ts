import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleto } from '../boletos/entities/boleto.entity';

@Injectable()
export class HistoriasService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
  ) {}

  // HU-2-005: Historial de viajes de un ciudadano
  async getHistorialCiudadano(ciudadano_id: string) {
    const boletos = await this.boletoRepo.find({
      where: { ciudadano_id, estado: 'completado' },
      relations: [
        'programacion',
        'programacion.ruta',
        'programacion.ruta.nodos',
        'programacion.ruta.nodos.paradero',
        'paradero_abordaje',
        'paradero_descenso',
      ],
      order: { fecha_abordaje: 'DESC' },
    });

    return boletos.map((boleto) => {
      const ruta = boleto.programacion?.ruta;
      const paraderos = ruta?.nodos
        ?.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        .map((nodo) => nodo.paradero) || [];

      // Calcular tiempo total de viaje en minutos
      let tiempo_total: number | null = null;
      if (boleto.fecha_abordaje && boleto.fecha_descenso) {
        const diff =
          new Date(boleto.fecha_descenso).getTime() -
          new Date(boleto.fecha_abordaje).getTime();
        tiempo_total = Math.round(diff / 60000);
      }

      return {
        boleto_id: boleto.id,
        estado: boleto.estado,
        monto: boleto.monto,
        fecha_abordaje: boleto.fecha_abordaje,
        fecha_descenso: boleto.fecha_descenso,
        tiempo_total_minutos: tiempo_total,
        bus_id: boleto.programacion?.bus?.id,
        conductor_id: boleto.programacion?.conductor_id,
        ruta: {
          id: ruta?.id,
          nombre: ruta?.nombre,
          paraderos_completos: paraderos,
        },
        paradero_abordaje: boleto.paradero_abordaje,
        paradero_descenso: boleto.paradero_descenso,
      };
    });
  }
}
