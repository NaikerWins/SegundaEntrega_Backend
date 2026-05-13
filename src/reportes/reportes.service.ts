import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaccion } from '../transacciones/entities/transacciones.entity';
import axios from 'axios';
import { MetodoPagoCiudadano } from 'src/metodospagociudadano/entities/metodospagociudadano.entity';
import { Between } from 'typeorm';

export class ReportesService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionesRepository: Repository<Transaccion>,

    @InjectRepository(MetodoPagoCiudadano)
    private readonly mpcRepository: Repository<MetodoPagoCiudadano>

  ) {}

    async ingresosPorMetodoPago(meses: number) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - meses);

        return this.transaccionesRepository
            .createQueryBuilder('t')
            .innerJoin('t.metodopagociudadano', 'mpc')
            .innerJoin('mpc.metodopago', 'mp')
            .select('mp.tipo', 'tipo')
            .addSelect('MONTH(t.fecha)', 'mes')
            .addSelect('YEAR(t.fecha)', 'anio')
            .addSelect('SUM(t.monto)', 'total')
            .where('t.fecha >= :fecha', { fecha })
            .andWhere('t.estado = :estado', { estado: 'Aceptada' })
            .groupBy('mp.tipo')
            .addGroupBy('YEAR(t.fecha)')
            .addGroupBy('MONTH(t.fecha)')
            .orderBy('YEAR(t.fecha)', 'ASC')
            .addOrderBy('MONTH(t.fecha)', 'ASC')
            .getRawMany();
    }

  async exportarIngresos(meses: number) {
    const encabezado = 'tipo,mes,anio,total';
    const datos = await this.ingresosPorMetodoPago(meses);
    const filas = datos.map(d => `${d.tipo},${d.mes},${d.anio},${d.total}`);
    return [encabezado, ...filas].join('\n');

  }

  async distribucionEtaria(fechaInicio?: string, fechaFin?: string) {

    const url = `${process.env.MS_SECURITY}/users`;
    const response = await axios.get(url);
    const usuarios = response.data;
    const rangos = { '0-17': 0, '18-25': 0, '26-40': 0, '41-60': 0, '60+': 0, 'Sin información': 0 };    
    let ciudadanoIds: string[] = [];

    if (fechaInicio && fechaFin) {
        const transacciones = await this.transaccionesRepository.find({
            where: {
                fecha: Between(new Date(fechaInicio), new Date(fechaFin)),
                estado: 'Aceptada'
            },
            relations: ['metodopagociudadano']
        });

        ciudadanoIds = [...new Set(
            transacciones.map(t => t.metodopagociudadano?.id_ciudadano).filter(Boolean)
        )] as string[];
    }
  
    const usuariosFiltrados = ciudadanoIds.length > 0 
    ? usuarios.filter(u => ciudadanoIds.includes(u.id)): usuarios;

    usuariosFiltrados.forEach(usuario => {
      const edad = parseInt(usuario.age);

        if (!usuario.age || isNaN(edad)) {
            rangos['Sin información']++;
            return;
        }

        if (edad >= 0 && edad <= 17) rangos['0-17']++;
        else if (edad >= 18 && edad <= 25 ) rangos['18-25']++;
        else if (edad >= 26 && edad <= 40 ) rangos['26-40']++;
        else if (edad >= 41 && edad <= 60 ) rangos['41-60']++;
        else rangos['60+']++; })

    const total = Object.values(rangos).reduce((sum, val) => sum + val, 0);

    const porcentajes = {};
    Object.entries(rangos).forEach(([rango, cantidad]) => {
      porcentajes[rango] = total > 0 ? ((cantidad / total) * 100).toFixed(1) + '%' : '0%';
      });
    
    return {
        rangos,           // conteos absolutos
        porcentajes,      // porcentajes
        total,            // total de usuarios
    };

  }

  async tendenciaIncidentes(meses: number) {
      // TODO: implementar cuando el Integrante 2 cree el módulo de Incidentes
      // Necesita: InjectRepository(Incidente)
      // Query: agrupar por tipo, mes y empresa filtrando por período
      return { mensaje: 'Pendiente de implementación' };
  }

}

