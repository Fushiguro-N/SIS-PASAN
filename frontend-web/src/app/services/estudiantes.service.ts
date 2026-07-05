import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  codigo: string;
  correo: string;
  telefono: string;
  ciclo: string;
  docenteAsignado: string | null;
}

// ==========================================================================
// SERVICIO: EstudiantesService
// ¿Para qué sirve?: Habla por HTTP con BakendPasantias (/api/estudiantes),
// que persiste a los estudiantes en Postgres. Lo usa la vista "Usuarios"
// (alta y listado de estudiantes) y el módulo "Docentes" (para saber qué
// estudiantes ya tienen tutor asignado).
// ==========================================================================
@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private readonly API = `${API_BASE_URL}/estudiantes`;

  estudiantes: Estudiante[] = [];

  constructor(private http: HttpClient) {
    this.cargar();
  }

  // Se usa para la carga automática inicial (constructor). Los componentes
  // que necesiten reaccionar justo cuando termine deben usar cargar$() y
  // suscribirse ellos mismos (ver UsuariosComponent.ngOnInit).
  cargar(): void {
    this.cargar$().subscribe();
  }

  cargar$(): Observable<Estudiante[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(datos => datos.map(d => this.mapear(d))),
      tap(estudiantes => this.estudiantes = estudiantes)
    );
  }

  // Se llama desde el formulario "Nuevo Estudiante" de Usuarios. Si el
  // código ya existía (por ejemplo, el estudiante ya había postulado o
  // subido un documento antes), el backend actualiza sus datos en vez de
  // fallar.
  registrar(datos: { codigo: string; nombre: string; apellido: string; correo: string; telefono: string; ciclo: string }): Observable<Estudiante> {
    const body = {
      codigoEstudiantil: datos.codigo,
      nombre: datos.nombre,
      apellido: datos.apellido,
      correoElectronicoInstitucional: datos.correo,
      telefono: datos.telefono,
      ciclo: datos.ciclo
    };

    return this.http.post<any>(`${this.API}/registrar`, body).pipe(
      map(dto => this.mapear(dto)),
      tap(est => this.actualizarEnLista(est))
    );
  }

  // Autoregistro del estudiante desde la pantalla de login (con contraseña).
  // Si el código ya tiene una cuenta creada, el backend responde 409 y el
  // componente de login muestra el mensaje de error que venga en el body.
  registrarCuenta(datos: { codigo: string; nombre: string; apellido: string; correo: string; telefono: string; ciclo: string; password: string }): Observable<Estudiante> {
    const body = {
      codigoEstudiantil: datos.codigo,
      nombre: datos.nombre,
      apellido: datos.apellido,
      correoElectronicoInstitucional: datos.correo,
      telefono: datos.telefono,
      ciclo: datos.ciclo,
      password: datos.password
    };

    return this.http.post<any>(`${this.API}/registro-cuenta`, body).pipe(
      map(dto => this.mapear(dto)),
      tap(est => this.actualizarEnLista(est))
    );
  }

  // Login real del estudiante: valida código + contraseña contra la base de datos
  login(codigo: string, password: string): Observable<Estudiante> {
    return this.http.post<any>(`${this.API}/login`, { codigoEstudiantil: codigo, password }).pipe(
      map(dto => this.mapear(dto))
    );
  }

  private actualizarEnLista(est: Estudiante): void {
    const indice = this.estudiantes.findIndex(e => e.codigo === est.codigo);
    if (indice >= 0) {
      this.estudiantes[indice] = est;
    } else {
      this.estudiantes.push(est);
    }
  }

  private mapear(dto: any): Estudiante {
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
