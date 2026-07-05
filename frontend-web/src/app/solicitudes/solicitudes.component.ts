import { ChangeDetectorRef, Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudDetalleComponent } from '../solicitud-detalle/solicitud-detalle.component';
import { SolicitudesService } from '../services/solicitudes.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, SolicitudDetalleComponent],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit, OnChanges {
  @Input() filtroInicial: string = 'Todos';

  // Texto escrito en el buscador del topbar (panel.component.html lo pasa
  // por @Input). Se usa junto con el filtro de estado para acotar la tabla.
  @Input() filtroTexto: string = '';

  // Filtro activo de la botonera superior
  filtroActivo: string = 'Todos';

  // Solicitud actualmente abierta en el modal de detalle. null = modal cerrado.
  solicitudSeleccionada: any = null;

  // Lista que realmente se pinta: siempre son las solicitudes del servicio
  // compartido (incluye las nuevas postulaciones de los estudiantes), ya
  // filtradas por estado y por el texto del buscador.
  solicitudesFiltradas: any[] = [];

  constructor(private solicitudesService: SolicitudesService, private cdr: ChangeDetectorRef) {}

  // Se vuelve a pedir la lista al entrar a esta vista, forzando el repintado
  // apenas llega la respuesta (evita que la tabla se quede vacía si esta
  // vista se abre después de que Angular ya "hidrató" la página).
  ngOnInit() {
    if (this.filtroInicial && this.filtroInicial !== 'Todos') {
      this.filtrar(this.filtroInicial);
    } else {
      this.aplicarFiltros();
    }

    this.solicitudesService.cargar$().subscribe(() => {
      this.aplicarFiltros();
      this.cdr.detectChanges();
    });
  }

  get solicitudesOriginales() {
    return this.solicitudesService.solicitudes;
  }

  filtrar(estado: string) {
    this.filtroActivo = estado;
    this.aplicarFiltros();
  }

  // Combina el filtro de estado (botonera) con el texto del buscador del
  // topbar, comparando contra nombre, código y empresa del estudiante.
  private aplicarFiltros(): void {
    let resultado = this.solicitudesService.solicitudes;

    if (this.filtroActivo !== 'Todos') {
      resultado = resultado.filter(sol => sol.estado.toLowerCase() === this.filtroActivo.toLowerCase());
    }

    const texto = this.filtroTexto?.trim().toLowerCase();
    if (texto) {
      resultado = resultado.filter(sol =>
        sol.estudiante.toLowerCase().includes(texto) ||
        sol.codigo.toLowerCase().includes(texto) ||
        sol.empresa.toLowerCase().includes(texto)
      );
    }

    this.solicitudesFiltradas = resultado;
  }

  // Angular llama a este setter cada vez que panel.component.html actualiza
  // [filtroTexto]; así la tabla se filtra en vivo mientras el admin escribe.
  ngOnChanges(): void {
    this.aplicarFiltros();
  }

  // Abre el modal con todos los datos del estudiante seleccionado
  verDetalle(sol: any): void {
    this.solicitudSeleccionada = sol;
  }

  cerrarDetalle(): void {
    this.solicitudSeleccionada = null;
  }

  // El admin aprobó/rechazó/dejó pendiente la solicitud desde el modal de
  // detalle. Se guarda en el backend (idReal es el id real en la base de
  // datos) y, cuando confirma, se refresca la tabla para que, si había un
  // filtro de estado activo, la fila desaparezca o aparezca según corresponda.
  onCambiarEstado(nuevoEstado: string): void {
    if (!this.solicitudSeleccionada) return;
    this.solicitudesService.actualizarEstado(this.solicitudSeleccionada.idReal, nuevoEstado as any).subscribe({
      next: () => {
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: err => console.error('No se pudo actualizar el estado de la solicitud.', err)
    });
  }
}
