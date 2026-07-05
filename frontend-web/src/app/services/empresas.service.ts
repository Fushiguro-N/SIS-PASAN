import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';

// Modelo de una empresa aliada tal como lo pinta EmpresasComponent.
export interface Empresa {
  id: number;
  nombre: string;
  rubro: string;
  ubicacion: string;
  bar: string;          // Ancho de la barra de ocupación, ej. "50%"
  ocupadas: number;      // Calculado por el backend: solicitudes Aprobadas hacia esta empresa
  totalVacantes: number;
  libres: string;
  contacto: string;
  colorClass: string;
}

// ==========================================================================
// SERVICIO: EmpresasService
// ¿Para qué sirve?: Habla por HTTP con BakendPasantias (/api/empresas), que
// persiste las empresas en Postgres. "ocupadas" ya viene calculado por el
// backend contando solicitudes Aprobadas, así que la ocupación que se ve en
// pantalla siempre refleja a los estudiantes que realmente van a esa empresa.
// ==========================================================================
@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private readonly API = `${API_BASE_URL}/empresas`;

  empresas: Empresa[] = [];

  constructor(private http: HttpClient) {
    this.cargar();
  }

  // Se usa para la carga automática inicial (constructor). Los componentes
  // que necesiten reaccionar justo cuando termine deben usar cargar$() y
  // suscribirse ellos mismos (ver EmpresasComponent.ngOnInit).
  cargar(): void {
    this.cargar$().subscribe();
  }

  cargar$(): Observable<Empresa[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(datos => datos.map(d => this.mapear(d))),
      tap(empresas => this.empresas = empresas)
    );
  }

  // Se llama desde el formulario "Agregar Empresa": el backend la guarda en
  // la base de datos y devuelve la empresa ya creada (con ocupadas = 0).
  agregarEmpresa(datos: { nombre: string; ruc: string; rubro: string; direccion: string; ubicacion: string; telefono: string; contacto: string; totalVacantes: number }): Observable<Empresa> {
    const body = {
      nombre: datos.nombre,
      ruc: datos.ruc,
      actividadEconomica: datos.rubro,
      direccion: datos.direccion,
      ciudad: datos.ubicacion,
      telefono: datos.telefono,
      correoElectronico: datos.contacto,
      totalVacantes: Number(datos.totalVacantes) || 1
    };

    return this.http.post<any>(`${this.API}/registrar1`, body).pipe(
      map(dto => this.mapear(dto)),
      tap(emp => this.empresas.push(emp))
    );
  }

  get totalPlazasDisponibles(): number {
    return this.empresas.reduce((acumulado, emp) => acumulado + (emp.totalVacantes - emp.ocupadas), 0);
  }

  private mapear(dto: any): Empresa {
    const ocupadas = dto.ocupadas ?? 0;
    const total = dto.totalVacantes ?? 0;
    const libres = Math.max(total - ocupadas, 0);
    const porcentaje = total > 0 ? (ocupadas / total) * 100 : 0;

    return {
      id: dto.id,
      nombre: dto.nombre,
      rubro: dto.actividadEconomica,
      ubicacion: dto.ciudad,
      bar: `${porcentaje}%`,
      ocupadas,
      totalVacantes: total,
      libres: `${libres} ${libres === 1 ? 'plaza libre' : 'plazas libres'}`,
      contacto: dto.correoElectronico,
      colorClass: porcentaje > 50 ? 'progress-orange' : 'progress-green'
    };
  }
}
