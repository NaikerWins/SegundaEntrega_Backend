import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { MiembroGrupo } from './entities/miembro-grupo.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(MiembroGrupo)
    private readonly miembroRepo: Repository<MiembroGrupo>,
  ) {}

  async findPublicos(): Promise<Grupo[]> {
    return this.grupoRepo.find({
      where: { tipo: 'PUBLIC' },
      relations: ['miembros'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findAll(): Promise<Grupo[]> {
    return this.grupoRepo.find({
      relations: ['miembros'],
      order: { nombre: 'ASC' },
    });
  }

  async findMisGrupos(usuarioId: string): Promise<Grupo[]> {
    const membresias = await this.miembroRepo.find({
      where: { usuarioId },
      relations: ['grupo', 'grupo.miembros'],
    });
    return membresias
      .filter((m) => !m.bloqueadoEn)
      .map((m) => m.grupo!);
  }

  async create(dto: CreateGrupoDto, usuarioId: string): Promise<Grupo> {
    const grupo = this.grupoRepo.create({
      ...dto,
      tipo: dto.tipo ?? 'PUBLIC',
      creadoPor: usuarioId,
    });
    const saved = await this.grupoRepo.save(grupo);
    const miembro = this.miembroRepo.create({
      usuarioId,
      rol: 'ADMIN',
      grupo: saved,
    });
    await this.miembroRepo.save(miembro);
    return saved;
  }

  async unirse(grupoId: number, usuarioId: string): Promise<MiembroGrupo> {
    const grupo = await this.grupoRepo.findOne({ where: { id: grupoId } });
    if (!grupo) throw new NotFoundException('Grupo no encontrado');
    if (grupo.tipo === 'PRIVATE') throw new ForbiddenException('Grupo privado');

    const existente = await this.miembroRepo.findOne({
      where: { grupo: { id: grupoId }, usuarioId },
    });
    if (existente) throw new BadRequestException('Ya eres miembro de este grupo');

    const miembro = this.miembroRepo.create({ usuarioId, rol: 'MEMBER', grupo });
    return this.miembroRepo.save(miembro);
  }

  async salir(grupoId: number, usuarioId: string): Promise<{ success: boolean }> {
    const miembro = await this.miembroRepo.findOne({
      where: { grupo: { id: grupoId }, usuarioId },
    });
    if (!miembro) throw new NotFoundException('No eres miembro de este grupo');

    if (miembro.rol === 'ADMIN') {
      const otrosAdmins = await this.miembroRepo.count({
        where: { grupo: { id: grupoId }, rol: 'ADMIN' },
      });
      if (otrosAdmins <= 1)
        throw new BadRequestException('Eres el único admin. Promueve a otro antes de salir.');
    }
    await this.miembroRepo.remove(miembro);
    return { success: true };
  }

  async findMiembros(grupoId: number): Promise<MiembroGrupo[]> {
    return this.miembroRepo.find({
      where: { grupo: { id: grupoId } },
      order: { rol: 'ASC', unidoEn: 'ASC' },
    });
  }

  async promover(grupoId: number, usuarioId: string, solicitanteId: string) {
    await this.verificarAdmin(grupoId, solicitanteId);
    const miembro = await this.miembroRepo.findOne({
      where: { grupo: { id: grupoId }, usuarioId },
    });
    if (!miembro) throw new NotFoundException('Miembro no encontrado');
    miembro.rol = 'ADMIN';
    await this.miembroRepo.save(miembro);
    return { success: true };
  }

  async remover(grupoId: number, usuarioId: string, solicitanteId: string) {
    await this.verificarAdmin(grupoId, solicitanteId);
    const miembro = await this.miembroRepo.findOne({
      where: { grupo: { id: grupoId }, usuarioId },
    });
    if (!miembro) throw new NotFoundException('Miembro no encontrado');
    await this.miembroRepo.remove(miembro);
    return { success: true };
  }

  async bloquear(grupoId: number, usuarioId: string, solicitanteId: string) {
    await this.verificarAdmin(grupoId, solicitanteId);
    const miembro = await this.miembroRepo.findOne({
      where: { grupo: { id: grupoId }, usuarioId },
    });
    if (!miembro) throw new NotFoundException('Miembro no encontrado');
    miembro.bloqueadoEn = new Date();
    await this.miembroRepo.save(miembro);
    return { success: true };
  }

  private async verificarAdmin(grupoId: number, usuarioId: string) {
    const admin = await this.miembroRepo.findOne({
      where: { grupo: { id: grupoId }, usuarioId, rol: 'ADMIN' },
    });
    if (!admin) throw new ForbiddenException('Solo los administradores pueden hacer esto');
  }
}