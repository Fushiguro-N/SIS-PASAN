import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentosService } from '../services/documentos.service';
import { API_BASE_URL } from '../services/api.config';

// ==========================================================================
// COMPONENTE: DocumentosAdminComponent (solo Administrador)
// ¿Para qué sirve?: "Gestión Documental" — muestra en tarjetas cada
// documento subido por los estudiantes (CV, diploma, certificado, logros...)
// con su estado. Al pasar el cursor sobre una tarjeta aparecen los botones
// Ver / Aprobar / Rechazar para revisarlo.
// ==========================================================================
@Component({
  selector: 'app-documentos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos-admin.component.html',
  styleUrl: './documentos-admin.component.css'
})
export class DocumentosAdminComponent implements OnInit {
  // Texto del buscador del topbar, filtra por estudiante o título del documento
  @Input() filtroTexto: string = '';

  constructor(private documentosService: DocumentosService, private cdr: ChangeDetectorRef) {}

  // Se vuelve a pedir la lista al entrar a esta vista, forzando el repintado
  // apenas llega la respuesta (evita que la grilla se quede vacía si esta
  // vista se abre después de que Angular ya "hidrató" la página).
  ngOnInit(): void {
    this.documentosService.cargar$().subscribe(() => this.cdr.detectChanges());
  }

  get documentosFiltrados() {
    const texto = this.filtroTexto?.trim().toLowerCase();
    if (!texto) {
      return this.documentosService.documentos;
    }
    return this.documentosService.documentos.filter(doc =>
      doc.estudiante.toLowerCase().includes(texto) ||
      doc.titulo.toLowerCase().includes(texto) ||
      doc.tipo.toLowerCase().includes(texto)
    );
  }

  // Traduce el estado a la clase CSS del badge, igual que en Solicitudes
  cssEstado(estado: string): string {
    switch (estado) {
      case 'Aprobado': return 'approved';
      case 'En Revisión': return 'review';
      case 'Rechazado': return 'rejected';
      default: return 'pending';
    }
  }

  // Abre el archivo real (CV, diploma, etc.) que el estudiante subió,
  // servido directamente por el backend.
  verDocumento(doc: { id: number }): void {
    window.open(`${API_BASE_URL}/documentos/${doc.id}/archivo`, '_blank');
  }

  aprobarDocumento(doc: { id: number }): void {
    this.documentosService.actualizarEstado(doc.id, 'Aprobado').subscribe({
      next: () => this.cdr.detectChanges(),
      error: err => console.error('No se pudo aprobar el documento.', err)
    });
  }

  rechazarDocumento(doc: { id: number }): void {
    this.documentosService.actualizarEstado(doc.id, 'Rechazado').subscribe({
      next: () => this.cdr.detectChanges(),
      error: err => console.error('No se pudo rechazar el documento.', err)
    });
  }
}
