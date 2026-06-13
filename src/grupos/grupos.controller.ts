import {
  Body, Controller, Delete, Get,
  Param, ParseIntPipe, Post, Query, Req,
} from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';

function getUserId(req: any): string {
  const auth = req.headers?.authorization ?? '';
  const token = auth.replace('Bearer ', '');
  if (!token) return '';
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf8')
    );
    return payload.id ?? payload.sub ?? '';
  } catch {
    return '';
  }
}

@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Get()
  findAll(@Query('tipo') tipo?: string) {
    if (tipo === 'PUBLIC') return this.gruposService.findPublicos();
    return this.gruposService.findAll();
  }

  @Get('mine')
  findMine(@Req() req: any) {
    return this.gruposService.findMisGrupos(getUserId(req));
  }

  @Get(':id/members')
  findMiembros(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.findMiembros(id);
  }

  @Post()
  create(@Body() dto: CreateGrupoDto, @Req() req: any) {
    return this.gruposService.create(dto, getUserId(req));
  }

  @Post(':id/join')
  unirse(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.gruposService.unirse(id, getUserId(req));
  }

  @Delete(':id/leave')
  salir(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.gruposService.salir(id, getUserId(req));
  }

  @Post(':id/members/:uid/promote')
  promover(
    @Param('id', ParseIntPipe) id: number,
    @Param('uid') uid: string,
    @Req() req: any,
  ) {
    return this.gruposService.promover(id, uid, getUserId(req));
  }

  @Delete(':id/members/:uid')
  remover(
    @Param('id', ParseIntPipe) id: number,
    @Param('uid') uid: string,
    @Req() req: any,
  ) {
    return this.gruposService.remover(id, uid, getUserId(req));
  }

  @Post(':id/members/:uid/block')
  bloquear(
    @Param('id', ParseIntPipe) id: number,
    @Param('uid') uid: string,
    @Req() req: any,
  ) {
    return this.gruposService.bloquear(id, uid, getUserId(req));
  }
}