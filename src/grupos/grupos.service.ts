import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Grupo } from './entities/grupo.entity';
import { GrupoPersona } from './entities/grupo-persona.entity';

import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

import { MensajeriaGateway } from '../mensajeria/mensajeria.gateway';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,

    @InjectRepository(GrupoPersona)
    private readonly grupoPersonaRepository: Repository<GrupoPersona>,

    private readonly mensajeriaGateway: MensajeriaGateway,
  ) {}

  async findPublicos(): Promise<Grupo[]> {
    return this.grupoRepository.find({
      where: [{ tipo: 'PUBLIC' }, { tipo: 'publico' }],
      relations: ['miembros'],
      order: { id: 'DESC' },
    });
  }

  async findAll(): Promise<Grupo[]> {
    return this.grupoRepository.find({
      relations: ['miembros'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { id },
      relations: ['miembros'],
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    return grupo;
  }

  async findByUsuario(userId: string): Promise<Grupo[]> {
    const membresias = await this.grupoPersonaRepository.find({
      where: {
        userId,
        bloqueado: false,
      },
      relations: ['grupo', 'grupo.miembros'],
    });

    return membresias.map((m) => m.grupo);
  }

  async findMisGrupos(userId: string): Promise<Grupo[]> {
    return this.findByUsuario(userId);
  }

  async findMiembros(grupoId: number): Promise<GrupoPersona[]> {
    return this.grupoPersonaRepository.find({
      where: {
        grupo: { id: grupoId },
      },
      order: {
        fechaUnion: 'ASC',
      },
    });
  }

  // =========================
  // CREATE (VERSIÓN NUEVA)
  // =========================

  async create(
    dto: CreateGrupoDto,
    userId: string,
  ): Promise<Grupo> {
    const grupo = this.grupoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      imagen: dto.imagen,
      tipo: dto.tipo ?? 'PUBLIC',
      creadoPor: userId,
      activo: true,
    });

    const grupoGuardado = await this.grupoRepository.save(grupo);

    const admin = this.grupoPersonaRepository.create({
      userId,
      nombre: 'Administrador',
      rol: 'admin',
      grupo: grupoGuardado,
    });

    await this.grupoPersonaRepository.save(admin);

    return this.findOne(grupoGuardado.id!);
  }

  // =========================
  // CREATE (LEGACY)
  // =========================

  async createLegacy(
    adminId: string,
    adminNombre: string,
    dto: CreateGrupoDto,
  ): Promise<Grupo> {
    if ((dto.miembros?.length ?? 0) < 2) {
      throw new BadRequestException(
        'El grupo debe tener al menos 2 miembros además del creador',
      );
    }

    const grupo = this.grupoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      imagen: dto.imagen,
      tipo: dto.tipo,
      adminId,
      adminNombre,
      activo: true,
    });

    const grupoGuardado = await this.grupoRepository.save(grupo);

    const adminMiembro = this.grupoPersonaRepository.create({
      userId: adminId,
      nombre: adminNombre,
      rol: 'admin',
      grupo: grupoGuardado,
    });

    await this.grupoPersonaRepository.save(adminMiembro);

    const miembros = (dto.miembros ?? []).map((m) =>
      this.grupoPersonaRepository.create({
        userId: m.userId,
        nombre: m.nombre,
        rol: 'miembro',
        grupo: grupoGuardado,
      }),
    );

    await this.grupoPersonaRepository.save(miembros);

    (dto.miembros ?? []).forEach((m) => {
      this.mensajeriaGateway.enviarMensajeDirecto(m.userId, {
        tipo: 'bienvenida_grupo',
        grupoId: grupoGuardado.id,
        grupoNombre: grupoGuardado.nombre,
        mensaje: `Fuiste agregado al grupo "${grupoGuardado.nombre}"`,
      });
    });

    return this.findOne(grupoGuardado.id!);
  }

  // =========================
  // JOIN NUEVO
  // =========================

  async unirse(
    grupoId: number,
    userId: string,
    nombre?: string,
  ): Promise<GrupoPersona> {
    const grupo = await this.findOne(grupoId);

    if (
      grupo.tipo === 'privado' ||
      grupo.tipo === 'PRIVATE'
    ) {
      throw new ForbiddenException(
        'Este grupo es privado',
      );
    }

    const existente =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (existente) {
      if (existente.bloqueado) {
        throw new BadRequestException(
          'Estás bloqueado de este grupo',
        );
      }

      throw new BadRequestException(
        'Ya eres miembro de este grupo',
      );
    }

    const miembro = this.grupoPersonaRepository.create({
      userId,
      nombre: nombre ?? 'Usuario',
      rol: 'miembro',
      grupo,
    });

    return this.grupoPersonaRepository.save(miembro);
  }

  async salir(
    grupoId: number,
    userId: string,
  ): Promise<any> {
    const miembro =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (!miembro) {
      throw new NotFoundException(
        'No eres miembro de este grupo',
      );
    }

    if (miembro.rol === 'admin') {
      const admins =
        await this.grupoPersonaRepository.count({
          where: {
            grupo: { id: grupoId },
            rol: 'admin',
          },
        });

      if (admins <= 1) {
        throw new BadRequestException(
          'Eres el único administrador. Promueve a otro antes de salir.',
        );
      }
    }

    await this.grupoPersonaRepository.remove(miembro);

    return {
      success: true,
      mensaje: 'Saliste del grupo correctamente',
    };
  }

  async removerMiembro(
    grupoId: number,
    adminId: string,
    userId: string,
  ): Promise<{ mensaje: string }> {
    const grupo = await this.findOne(grupoId);

    if (grupo.adminId !== adminId) {
      throw new BadRequestException(
        'Solo el administrador puede remover miembros',
      );
    }

    const miembro =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (!miembro) {
      throw new NotFoundException(
        'El miembro no existe en este grupo',
      );
    }

    this.mensajeriaGateway.enviarMensajeDirecto(
      userId,
      {
        tipo: 'removido_grupo',
        grupoId,
        grupoNombre: grupo.nombre,
        mensaje: `Fuiste removido del grupo "${grupo.nombre}"`,
      },
    );

    await this.grupoPersonaRepository.remove(miembro);

    return {
      mensaje: 'Miembro removido correctamente',
    };
  }

  async bloquearMiembro(
    grupoId: number,
    adminId: string,
    userId: string,
  ): Promise<{ mensaje: string }> {
    const grupo = await this.findOne(grupoId);

    if (grupo.adminId !== adminId) {
      throw new BadRequestException(
        'Solo el administrador puede bloquear miembros',
      );
    }

    const miembro =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (!miembro) {
      throw new NotFoundException(
        'El miembro no existe',
      );
    }

    miembro.bloqueado = true;

    await this.grupoPersonaRepository.save(miembro);

    return {
      mensaje: 'Miembro bloqueado correctamente',
    };
  }

  async promoverMiembro(
    grupoId: number,
    adminId: string,
    userId: string,
  ): Promise<GrupoPersona> {
    const grupo = await this.findOne(grupoId);

    if (grupo.adminId !== adminId) {
      throw new BadRequestException(
        'Solo el administrador puede promover miembros',
      );
    }

    const miembro =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (!miembro) {
      throw new NotFoundException(
        'El miembro no existe',
      );
    }

    miembro.rol = 'admin';

    return this.grupoPersonaRepository.save(miembro);
  }

  // =========================
  // API NUEVA
  // =========================

  async promover(
    grupoId: number,
    userId: string,
    solicitanteId: string,
  ) {
    await this.verificarAdmin(
      grupoId,
      solicitanteId,
    );

    const miembro =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (!miembro) {
      throw new NotFoundException(
        'Miembro no encontrado',
      );
    }

    miembro.rol = 'admin';

    await this.grupoPersonaRepository.save(miembro);

    return { success: true };
  }

  async remover(
    grupoId: number,
    userId: string,
    solicitanteId: string,
  ) {
    await this.verificarAdmin(
      grupoId,
      solicitanteId,
    );

    const miembro =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (!miembro) {
      throw new NotFoundException(
        'Miembro no encontrado',
      );
    }

    await this.grupoPersonaRepository.remove(miembro);

    return { success: true };
  }

  async bloquear(
    grupoId: number,
    userId: string,
    solicitanteId: string,
  ) {
    await this.verificarAdmin(
      grupoId,
      solicitanteId,
    );

    const miembro =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
        },
      });

    if (!miembro) {
      throw new NotFoundException(
        'Miembro no encontrado',
      );
    }

    miembro.bloqueado = true;

    await this.grupoPersonaRepository.save(miembro);

    return { success: true };
  }

  private async verificarAdmin(
    grupoId: number,
    userId: string,
  ) {
    const admin =
      await this.grupoPersonaRepository.findOne({
        where: {
          grupo: { id: grupoId },
          userId,
          rol: 'admin',
        },
      });

    if (!admin) {
      throw new ForbiddenException(
        'Solo los administradores pueden hacer esto',
      );
    }
  }

  async update(
    id: number,
    dto: UpdateGrupoDto,
  ): Promise<Grupo> {
    const grupo = await this.findOne(id);

    Object.assign(grupo, dto);

    return this.grupoRepository.save(grupo);
  }
}