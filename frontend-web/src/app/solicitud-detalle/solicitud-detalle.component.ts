import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentosService } from '../services/documentos.service';

// Los 4 documentos que se espera que un estudiante tenga registrados.
// Si no aparecen en DocumentosService, la ficha los muestra como "No registrado".
const TIPOS_DOCUMENTO = ['CV', 'Certificado de Inglés', 'Diploma', 'Logros'];

// ==========================================================================
// COMPONENTE: SolicitudDetalleComponent
// ¿Para qué sirve?: Es la "ficha" (modal emergente) que muestra TODOS los
// datos de un estudiante y su solicitud cuando el administrador hace click
// en una fila de la tabla de Solicitudes, incluyendo qué documentos (CV,
// diploma, certificado, logros) tiene registrados y en qué estado.
// Solo recibe la solicitud seleccionada por @Input y avisa con @Output
// cuando el usuario quiere cerrarla o cambiar su estado.
// ==========================================================================
@Component({
  selector: 'app-solicitud-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitud-detalle.component.html',
  styleUrl: './solicitud-detalle.component.css'
})
export class SolicitudDetalleComponent {
  // Objeto solicitud+estudiante a mostrar (viene de SolicitudesComponent o del dashboard del panel)
  @Input() solicitud: any = null;

  // Solo el administrador puede aprobar/rechazar/dejar pendiente una solicitud;
  // el estudiante nunca abre este modal, pero se deja el flag por si se reutiliza.
  @Input() esAdmin: boolean = false;

  // Avisa al componente padre que debe ocultar este modal (click en "X" o en el fondo)
  @Output() cerrar = new EventEmitter<void>();

  // Avisa al padre con el nuevo estado elegido por el admin, para que lo
  // guarde en el SolicitudesService (única fuente de verdad de los datos)
  @Output() cambiarEstado = new EventEmitter<string>();

  constructor(private documentosService: DocumentosService) {}

  // Arma la lista de los 4 documentos esperados para el estudiante de esta
  // solicitud, tomando su estado real de DocumentosService cuando existe.
  get documentosEstudiante() {
    const registrados = this.documentosService.obtenerPorCodigo(this.solicitud?.codigo || '');

    return TIPOS_DOCUMENTO.map(tipo => {
      const doc = registrados.find(d => d.tipo === tipo);
      return {
        tipo,
        estado: doc?.estado || 'No registrado',
        registrado: !!doc
      };
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

  onCambiarEstado(nuevoEstado: string): void {
    this.cambiarEstado.emit(nuevoEstado);
  }
}
