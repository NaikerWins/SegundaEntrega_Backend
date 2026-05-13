import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
    constructor(private readonly reporteService: ReportesService) {}
        
    @Get('ingresos/:meses')
    ingresosPorMetodoPago(@Param('meses') meses: string) {
        return this.reporteService.ingresosPorMetodoPago(+meses);
    }

    @Get('exportar/:meses')
    exportarIngresos(@Param('meses') meses: string) {
        return this.reporteService.exportarIngresos(+meses);
    }

    @Get('distribucionporcentual')
    distribucionPorcentual(
        @Query('fechaInicio') fechaInicio?: string,
        @Query('fechaFin') fechaFin?: string
    ) {
        return this.reporteService.distribucionEtaria(fechaInicio, fechaFin);
    }

    @Get('incidentes/:meses')
    tendenciaIncidentes(@Param('meses') meses: string) {
        return this.reporteService.tendenciaIncidentes(+meses);
    }

}


