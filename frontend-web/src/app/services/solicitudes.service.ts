import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';

// Modelo único de una solicitud de práctica, tal como lo usan la vista de
// Solicitudes del admin, el dashboard y el formulario de postulación del
// estudiante. Se arma a partir de la respuesta real del backend (ver
// mapear()); "id" es un texto para mostrar y "idReal" es el id de la fila en
// la base de datos, el que hay que mandar cuando se cambia de estado.
export interface Solicitud {
  id: string;
  idReal: number;
  iniciales: string;
  estudiante: string;
  codigo: string;
  empresa: string;
  tutor: string;
  estado: string; // 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado'
  css: string;    // 'pending' | 'review' | 'approved' | 'rejected'
  fecha: string;
  correo: string;
  telefono: string;
  carrera: string;
  ciclo: string;
  area: string;
  fechaInicio: string;
  motivo: string;
}

// ==========================================================================
// SERVICIO: SolicitudesService
// ¿Para qué sirve?: Antes guardaba las solicitudes en un array en memoria
// (se perdían al recargar la página). Ahora habla por HTTP con
// BakendPasantias (/api/solicitudes), que persiste todo en Postgres. El
// array "solicitudes" se mantiene igual (mismo nombre y forma) para que el
// resto de componentes no tengan que cambiar cómo lo leen; solo cambia CÓMO
// se llena: se carga con cargar() y se actualiza automáticamente cada vez
// que se postula o se cambia un estado.
// ==========================================================================
@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly API = `${API_BASE_URL}/solicitudes`;

  solicitudes: Solicitud[] = [];

  constructor(private http: HttpClient) {
    this.cargar();
  }

  // Se usa para la carga automática inicial (constructor). Los componentes
  // que necesiten reaccionar justo cuando termine deben usar cargar$() y
  // suscribirse ellos mismos (ver SolicitudesComponent.ngOnInit).
  cargar(): void {
    this.cargar$().subscribe();
  }

  cargar$(): Observable<Solicitud[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(datos => datos.map(d => this.mapear(d))),
      tap(solicitudes => this.solicitudes = solicitudes)
    );
  }

  // Busca la solicitud de un estudiante por su código (usado para precargar
  // "Mi Solicitud" en el dashboard del estudiante cuando vuelve a iniciar sesión)
  buscarPorCodigo(codigo: string): Solicitud | undefined {
    return this.solicitudes.find(s => s.codigo === codigo);
  }

  // Se llama desde el formulario "Postular a Práctica" del estudiante. El
  // backend crea la solicitud (o la actualiza si ya existía una) con estado
  // "Pendiente"; el componente que llama debe suscribirse para saber cuándo
  // terminó y mostrar el resultado al usuario.
  registrarPostulacion(datos: { codigo: string; estudiante: string; empresaId: number; area: string; fechaInicio: string; motivo: string }): Observable<Solicitud> {
    const body = {
      codigoEstudiante: datos.codigo,
      estudianteNombre: datos.estudiante,
      empresaId: datos.empresaId,
      area: datos.area,
      fechaInicio: datos.fechaInicio,
      motivo: datos.motivo
    };

    return this.http.post<any>(`${this.API}/postular`, body).pipe(
      map(dto => this.mapear(dto)),
      tap(sol => this.actualizarEnLista(sol))
    );
  }

  // Usado por el administrador desde el modal de detalle para aprobar,
  // rechazar o dejar pendiente/en revisión una solicitud.
  actualizarEstado(idReal: number, nuevoEstado: 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado'): Observable<Solicitud> {
    return this.http.patch<any>(`${this.API}/${idReal}/estado`, { estado: nuevoEstado }).pipe(
      map(dto => this.mapear(dto)),
      tap(sol => this.actualizarEnLista(sol))
    );
  }

  // Reemplaza (o agrega) la solicitud recién creada/actualizada dentro del
  // array local, así todas las vistas que lo leen (dashboard, tabla, modal)
  // se refrescan sin tener que recargar toda la lista desde el backend.
  private actualizarEnLista(sol: Solicitud): void {
    const indice = this.solicitudes.findIndex(s => s.idReal === sol.idReal);
    if (indice >= 0) {
      this.solicitudes[indice] = sol;
    } else {
      this.solicitudes.push(sol);
    }
  }

  private mapear(dto: any): Solicitud {
    return {
      id: `SOL-${String(dto.id).padStart(4, '0')}`,
      idReal: dto.id,
      iniciales: this.obtenerIniciales(dto.estudianteNombre),
      estudiante: dto.estudianteNombre,
      codigo: dto.estudianteCodigo,
      empresa: dto.empresaNombre,
      tutor: dto.tutor,
      estado: dto.estado,
      css: this.mapEstadoACss(dto.estado),
      fecha: dto.fecha,
      correo: dto.estudianteCorreo,
      telefono: dto.estudianteTelefono,
      carrera: dto.carrera,
      ciclo: dto.estudianteCiclo,
      area: dto.area,
      fechaInicio: dto.fechaInicio,
      motivo: dto.motivo
    };
  }

  private mapEstadoACss(estado: string): string {
    switch (estado) {
      case 'Aprobado': return 'approved';
      case 'En Revisión': return 'review';
      case 'Rechazado': return 'rejected';
      default: return 'pending';
    }
  }

  private obtenerIniciales(nombreCompleto: string): string {
    const partes = (nombreCompleto || '').trim().split(/\s+/);
    const primeras = (partes[0]?.[0] || '') + (partes[1]?.[0] || '');
    return primeras.toUpperCase() || 'ES';
  }
}
