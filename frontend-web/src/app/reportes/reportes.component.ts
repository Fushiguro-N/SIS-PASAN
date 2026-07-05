import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../services/solicitudes.service';
import { EmpresasService } from '../services/empresas.service';

// ==========================================================================
// COMPONENTE: ReportesComponent (solo Administrador)
// ¿Para qué sirve?: Reemplaza el ítem "Reportes" que antes estaba
// deshabilitado en el menú del admin. Resume en tarjetas y una barra
// horizontal por empresa cuántas plazas están ocupadas vs. disponibles, y un
// desglose de solicitudes por ciclo. Todo calculado en vivo desde
// SolicitudesService/EmpresasService (ya no son valores fijos).
// ==========================================================================
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  constructor(
    private solicitudesService: SolicitudesService,
    private empresasService: EmpresasService
  ) {}

  get totalSolicitudes(): number {
    return this.solicitudesService.solicitudes.length;
  }

  get tasaAprobacion(): number {
    const aprobadas = this.solicitudesService.solicitudes.filter(s => s.estado === 'Aprobado').length;
    return this.totalSolicitudes > 0 ? Math.round((aprobadas / this.totalSolicitudes) * 1000) / 10 : 0;
  }

  // Resumen por empresa: cuántas plazas ocupadas tiene sobre el total
  get reportePorEmpresa() {
    return this.empresasService.empresas.map(emp => ({
      empresa: emp.nombre,
      ocupadas: emp.ocupadas,
      total: emp.totalVacantes
    }));
  }

  // Todos los estudiantes son de la misma carrera (Administración y Negocios
  // Internacionales), así que en vez de un desglose por carrera se muestra
  // por ciclo, que sí varía de un estudiante a otro.
  get reportePorCiclo() {
    const conteo: { [ciclo: string]: number } = {};

    this.solicitudesService.solicitudes.forEach(sol => {
      if (sol.ciclo && sol.ciclo !== 'No registrado') {
        conteo[sol.ciclo] = (conteo[sol.ciclo] || 0) + 1;
      }
    });

    return Object.keys(conteo)
      .sort()
      .map(ciclo => ({ ciclo, cantidad: conteo[ciclo] }));
  }

  // Calcula el % de ocupación de una empresa para dibujar la barra
  porcentaje(ocupadas: number, total: number): number {
    return total > 0 ? Math.round((ocupadas / total) * 100) : 0;
  }
}
