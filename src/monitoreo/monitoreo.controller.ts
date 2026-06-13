import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { MonitoreoService } from './monitoreo.service';
import { CreateSuscripcionDto } from './dto/suscripcion-paradero.dto';
import { UpdatePreferenciasClimaDto } from './dto/update-preferencias-clima.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenciasClima } from './entities/preferencias-clima.entity';
import type { Request } from 'express';

/** Decodifica el payload de un JWT sin verificar firma (ya fue verificada por SecurityGuard). */
function getUserIdFromToken(req: Request): string {
  const authHeader = req.headers['authorization'];
  if (!authHeader) throw new Error('Token no encontrado');
  const token = authHeader.replace('Bearer ', '').trim();
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
  // El JwtService de ms_security guarda el id en el claim "id" (CLAIM_USER_ID = "id")
  const userId = payload['id'] ?? payload['sub'];
  if (!userId) throw new Error('No se encontró el ID de usuario en el token');
  return userId;
}

@Controller('monitoreo')
export class MonitoreoController {
  constructor(
    private readonly monitoreoService: MonitoreoService,
    @InjectRepository(PreferenciasClima)
    private readonly preferenciasClimaRepository: Repository<PreferenciasClima>,
  ) {}

  @Get('estado')
  getEstado() {
    return this.monitoreoService.getEstadoFlota();
  }

  @Get('pasajeros')
  getPasajeros() {
    return this.monitoreoService.getPasajerosEnTransito();
  }

  // ✅ Endpoint que faltaba — causaba el 404 en SeguimientoRuta.tsx
  @Get('estimar-llegada/:rutaId/:paraderoId')
  estimarLlegada(
    @Param('rutaId') rutaId: string,
    @Param('paraderoId') paraderoId: string,
  ) {
    return this.monitoreoService.estimarLlegada(Number(rutaId), Number(paraderoId));
  }

  // ✅ Corregido: extrae userId del JWT en vez de req.user (que nunca se popula)
  @Post('suscripcion')
  async crearSuscripcion(
    @Body() dto: CreateSuscripcionDto,
    @Req() req: Request,
  ) {
    const userId = getUserIdFromToken(req);
    return this.monitoreoService.crearSuscripcion(userId, dto);
  }

  // ✅ Corregido: misma solución para preferencias-clima
  @Post('preferencias-clima')
  async guardarPreferencias(
    @Body() dto: UpdatePreferenciasClimaDto,
    @Req() req: Request,
  ) {
    const userId = getUserIdFromToken(req);
    const existente = await this.preferenciasClimaRepository.findOne({
      where: { ciudadano_id: userId },
    });
    if (existente) {
      Object.assign(existente, dto);
      return this.preferenciasClimaRepository.save(existente);
    }
    const nueva = this.preferenciasClimaRepository.create({
      ...dto,
      ciudadano_id: userId,
    });
    return this.preferenciasClimaRepository.save(nueva);
  }

  // ✅ Corregido: misma solución para obtener preferencias
  @Get('preferencias-clima')
  async obtenerPreferencias(@Req() req: Request) {
    const userId = getUserIdFromToken(req);
    return this.preferenciasClimaRepository.findOne({
      where: { ciudadano_id: userId },
    });
  }
}