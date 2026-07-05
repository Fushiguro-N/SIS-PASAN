import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';
import { Estudiante } from './estudiantes.service';

export interface Docente {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  estudiantesAsignados: Estudiante[];
}

// ==========================================================================
// SERVICIO: DocentesService
// ¿Para qué sirve?: Habla por HTTP con BakendPasantias (/api/docentes), que
// persiste a los docentes en Postgres. Permite registrar docentes y
// asignarles qué estudiante van a tutorear en sus prácticas; el backend ya
// se encarga de que un estudiante con tutor asignado no vuelva a aparecer
// en la lista de "disponibles" para otro docente.
//
// cargarDocentes$()/cargarEstudiantes$() devuelven Observable en vez de
// suscribirse ellos mismos: así el componente que los use puede suscribirse
// también y disparar su propia detección de cambios justo cuando los datos
// llegan (ver DocentesComponent.ngOnInit).
// ==========================================================================
@Injectable({ providedIn: 'root' })
export class DocentesService {
  private readonly API = `${API_BASE_URL}/docentes`;

  docentes: Docente[] = [];
  estudiantesDisponibles: Estudiante[] = [];

  constructor(private http: HttpClient) {
    this.cargar();
  }

  // Se usa para la primera carga automática (constructor); los componentes
  // que necesiten reaccionar cuando termine deben usar las versiones $ de abajo.
  cargar(): void {
    this.cargarDocentes$().subscribe();
    this.cargarEstudiantes$().subscribe();
  }

  cargarDocentes$(): Observable<Docente[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(datos => datos.map(d => this.mapear(d))),
      tap(docentes => this.docentes = docentes)
    );
  }

  cargarEstudiantes$(): Observable<Estudiante[]> {
    return this.http.get<any[]>(`${this.API}/estudiantes-disponibles`).pipe(
      map(datos => datos.map(d => this.mapearEstudiante(d))),
      tap(estudiantes => this.estudiantesDisponibles = estudiantes)
    );
  }

  registrar(datos: { codigo: string; nombres: string; apellidos: string; correo: string; telefono: string }): Observable<Docente> {
    const body = {
      codigoDocente: datos.codigo,
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      correo: datos.correo,
      telefono: datos.telefono
    };

    return this.http.post<any>(this.API, body).pipe(
      map(dto => this.mapear(dto)),
      tap(doc => this.docentes.push(doc))
    );
  }

  // Asigna al estudiante indicado como tutorado del docente indicado, y
  // refresca la lista de disponibles (ese estudiante ya no debe aparecer)
  asignarEstudiante(docenteId: number, estudianteId: number): Observable<Docente> {
    return this.http.patch<any>(`${this.API}/${docenteId}/asignar/${estudianteId}`, {}).pipe(
      map(dto => this.mapear(dto)),
      tap(docenteActualizado => {
        const indice = this.docentes.findIndex(d => d.id === docenteActualizado.id);
        if (indice >= 0) this.docentes[indice] = docenteActualizado;
        this.cargarEstudiantes$().subscribe();
      })
    );
  }

  private mapear(dto: any): Docente {
    return {
      id: dto.id,
      codigo: dto.codigoDocente,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      correo: dto.correo,
      telefono: dto.telefono,
      estudiantesAsignados: (dto.estudiantesAsignados || []).map((e: any) => this.mapearEstudiante(e))
    };
  }

  // Traduce un EstudianteResponseDTO del backend (codigoEstudiantil,
  // correoElectronicoInstitucional...) al modelo Estudiante que usa el frontend.
  private mapearEstudiante(dto: any): Estudiante {
    return {
      id: dto.id,
      nombre: dto.nombre,
      apellido: dto.apellido,
      codigo: dto.codigoEstudiantil,
      correo: dto.correoElectronicoInstitucional,
      telefono: dto.telefono,
      ciclo: dto.ciclo,
      docenteAsignado: dto.docenteAsignado
    };
  }
}
