import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';

// Modelo único de un documento subido por un estudiante (CV, certificado,
// diploma, logros...).
export interface DocumentoRegistro {
  id: number;
  tipo: string;   // 'CV' | 'Certificado de Inglés' | 'Diploma' | 'Logros'
  titulo: string;
  estudiante: string;
  codigo: string;
  tamano: string; // Ej: "2.3 MB"
  fecha: string;
  estado: string; // 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado'
}

// ==========================================================================
// SERVICIO: DocumentosService
// ¿Para qué sirve?: Habla por HTTP con BakendPasantias (/api/documentos),
// que persiste los documentos en Postgres. Cuando un estudiante sube un
// archivo en "Mis Documentos", queda "Pendiente" en la base de datos real y
// aparece de inmediato en "Gestión Documental" del administrador, quien
// puede aprobarlo o rechazarlo (si no toca ningún botón, sigue Pendiente).
// ==========================================================================
@Injectable({ providedIn: 'root' })
export class DocumentosService {
  private readonly API = `${API_BASE_URL}/documentos`;

  documentos: DocumentoRegistro[] = [];

  constructor(private http: HttpClient) {
    this.cargar();
  }

  // Se usa para la carga automática inicial (constructor). Los componentes
  // que necesiten reaccionar justo cuando termine deben usar cargar$() y
  // suscribirse ellos mismos (ver DocumentosAdminComponent.ngOnInit).
  cargar(): void {
    this.cargar$().subscribe();
  }

  cargar$(): Observable<DocumentoRegistro[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(datos => datos.map(d => this.mapear(d))),
      tap(documentos => this.documentos = documentos)
    );
  }

  // Devuelve todos los documentos de un estudiante según su código (usado
  // en el modal de detalle de una solicitud para mostrar CV/Diploma/etc.)
  obtenerPorCodigo(codigo: string): DocumentoRegistro[] {
    return this.documentos.filter(doc => doc.codigo === codigo);
  }

  // Se llama desde "Mis Documentos" del estudiante al elegir un archivo. Sube
  // el archivo real (multipart/form-data); el backend lo guarda en disco, crea
  // (o reemplaza si ya había uno de ese mismo tipo) el registro y lo deja en
  // estado "Pendiente" para que el admin lo revise.
  registrarDocumento(datos: { codigo: string; estudiante: string; tipo: string; titulo: string; tamano: string }, archivo: File): Observable<DocumentoRegistro> {
    const formData = new FormData();
    formData.append('codigoEstudiante', datos.codigo);
    formData.append('estudianteNombre', datos.estudiante);
    formData.append('tipo', datos.tipo);
    formData.append('titulo', datos.titulo);
    formData.append('tamano', datos.tamano);
    formData.append('archivo', archivo, archivo.name);

    return this.http.post<any>(this.API, formData).pipe(
      map(dto => this.mapear(dto)),
      tap(doc => this.actualizarEnLista(doc))
    );
  }

  // Usado por el administrador desde "Gestión Documental" para aprobar o rechazar un documento
  actualizarEstado(id: number, nuevoEstado: 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado'): Observable<DocumentoRegistro> {
    return this.http.patch<any>(`${this.API}/${id}/estado`, { estado: nuevoEstado }).pipe(
      map(dto => this.mapear(dto)),
      tap(doc => this.actualizarEnLista(doc))
    );
  }

  private actualizarEnLista(doc: DocumentoRegistro): void {
    const indice = this.documentos.findIndex(d => d.id === doc.id);
    if (indice >= 0) {
      this.documentos[indice] = doc;
    } else {
      this.documentos.push(doc);
    }
  }

  private mapear(dto: any): DocumentoRegistro {
    return {
      id: dto.id,
      tipo: dto.tipo,
      titulo: dto.titulo,
      estudiante: dto.estudianteNombre,
      codigo: dto.estudianteCodigo,
      tamano: dto.tamano,
      fecha: dto.fecha,
      estado: dto.estado
    };
  }
}
