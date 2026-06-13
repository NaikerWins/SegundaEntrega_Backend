import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { PqrsService } from "./pqrs.service";
import { CreatePqrsDto } from "./dto/create-pqrs.dto";

@Controller("pqrs")
export class PqrsController {
    constructor(private readonly pqrsService: PqrsService) {}

    @Post()
    create(@Body() dto: CreatePqrsDto) {
        return this.pqrsService.create(dto);
    }

    @Get()
    findAll() {
        return this.pqrsService.findAll();
    }

    @Post('agendar-cita')
    async agendarCita(@Body() body: any) {
        const response = await fetch('http://localhost:5678/webhook/agendar-cita', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return response.json();
    }

    @Get('disponibilidad')
    async getDisponibilidad() {
        const response = await fetch('http://localhost:5678/webhook/disponibilidad');
        return response.json();
    }

    @Get('cancelar-cita/:eventId')
    async cancelarCita(@Param('eventId') eventId: string, @Res() res: any) {
        await fetch('http://localhost:5678/webhook/cancelar-cita', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId }),
        });
        res.redirect('http://localhost:5173/cita-cancelada');
    }

    @Post('notificar')
    async notificarPqrs(@Body() body: any) {
        const response = await fetch('http://localhost:5678/webhook/pqrs-notificar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return response.json();
    }

    @Post('con-radicado')
    createConRadicado(@Body() body: any) {
        return this.pqrsService.createConRadicado(body);
    }

    @Post(':radicado/estado')
    async cambiarEstado(
        @Param('radicado') radicado: string,
        @Body() body: { estado: string; respuesta?: string }
    ) {
        const pqrs = await this.pqrsService.cambiarEstado(radicado, body.estado, body.respuesta);
        
        // Notificar al usuario por N8N
        await fetch('http://localhost:5678/webhook/pqrs-estado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: pqrs.email,
                radicado: pqrs.radicado,
                estado: pqrs.estado,
                respuesta: pqrs.respuesta ?? '',
                tipo: pqrs.tipo,
                descripcion: pqrs.descripcion,
            }),
        });
        
        return pqrs;
    }

    @Get(":radicado")
    findOne(@Param("radicado") radicado: string) {
        return this.pqrsService.findByRadicado(radicado);
    }

}