import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

function getUserId(req: any): string {
  const auth = req.headers?.authorization ?? '';
  const token = auth.replace('Bearer ', '');

  if (!token) return '';

  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf8'),
    );

    return payload.id ?? payload.sub ?? '';
  } catch {
    return '';
  }
}

@Controller('grupos')
export class GruposController {
  constructor(
    private readonly gruposService: GruposService,
  ) {}

  @Get()
  findAll(@Query('tipo') tipo?: string) {
    if (tipo === 'PUBLIC') {
      return this.gruposService.findPublicos();
    }

    return this.gruposService.findAll();
  }

  @Get('mine')
  findMine(@Req() req: any) {
    return this.gruposService.findMisGrupos(
      getUserId(req),
    );
  }

  @Get('usuario/:userId')
  findByUsuario(
    @Param('userId') userId: string,
  ) {
    return this.gruposService.findByUsuario(
      userId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.gruposService.findOne(id);
  }

  @Get(':id/members')
  findMiembros(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.gruposService.findMiembros(id);
  }

  // =========================
  // API NUEVA (JWT)
  // =========================

  @Post()
  create(
    @Body() dto: CreateGrupoDto,
    @Req() req: any,
  ) {
    return this.gruposService.create(
      dto,
      getUserId(req),
    );
  }

  @Post(':id/join')
  unirse(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.gruposService.unirse(
      id,
      getUserId(req),
    );
  }

  @Delete(':id/leave')
  salir(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.gruposService.salir(
      id,
      getUserId(req),
    );
  }

  @Post(':id/members/:uid/promote')
  promover(
    @Param('id', ParseIntPipe) id: number,
    @Param('uid') uid: string,
    @Req() req: any,
  ) {
    return this.gruposService.promover(
      id,
      uid,
      getUserId(req),
    );
  }

  @Delete(':id/members/:uid')
  remover(
    @Param('id', ParseIntPipe) id: number,
    @Param('uid') uid: string,
    @Req() req: any,
  ) {
    return this.gruposService.remover(
      id,
      uid,
      getUserId(req),
    );
  }

  @Post(':id/members/:uid/block')
  bloquear(
    @Param('id', ParseIntPipe) id: number,
    @Param('uid') uid: string,
    @Req() req: any,
  ) {
    return this.gruposService.bloquear(
      id,
      uid,
      getUserId(req),
    );
  }

  // =========================
  // API LEGACY
  // =========================

  @Post(':adminId/:adminNombre')
  createLegacy(
    @Param('adminId') adminId: string,
    @Param('adminNombre') adminNombre: string,
    @Body() dto: CreateGrupoDto,
  ) {
    return this.gruposService.createLegacy(
      adminId,
      adminNombre,
      dto,
    );
  }

  @Post(':id/unirse/:userId/:nombre')
  unirseLegacy(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
    @Param('nombre') nombre: string,
  ) {
    return this.gruposService.unirse(
      id,
      userId,
      nombre,
    );
  }

  @Delete(':id/salir/:userId')
  salirLegacy(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
  ) {
    return this.gruposService.salir(
      id,
      userId,
    );
  }

  @Delete(':id/remover/:adminId/:userId')
  removerLegacy(
    @Param('id', ParseIntPipe) id: number,
    @Param('adminId') adminId: string,
    @Param('userId') userId: string,
  ) {
    return this.gruposService.removerMiembro(
      id,
      adminId,
      userId,
    );
  }

  @Patch(':id/bloquear/:adminId/:userId')
  bloquearLegacy(
    @Param('id', ParseIntPipe) id: number,
    @Param('adminId') adminId: string,
    @Param('userId') userId: string,
  ) {
    return this.gruposService.bloquearMiembro(
      id,
      adminId,
      userId,
    );
  }

  @Patch(':id/promover/:adminId/:userId')
  promoverLegacy(
    @Param('id', ParseIntPipe) id: number,
    @Param('adminId') adminId: string,
    @Param('userId') userId: string,
  ) {
    return this.gruposService.promoverMiembro(
      id,
      adminId,
      userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGrupoDto,
  ) {
    return this.gruposService.update(
      id,
      dto,
    );
  }
}