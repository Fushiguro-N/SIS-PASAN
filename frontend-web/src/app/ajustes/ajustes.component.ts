import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ==========================================================================
// COMPONENTE: AjustesComponent (Administrador y Estudiante)
// ¿Para qué sirve?: Reemplaza el ítem "Ajustes" que antes estaba
// deshabilitado. Muestra un formulario de perfil distinto según el rol:
// - Administrador: nombre, correo, teléfono y cargo.
// - Estudiante: código (no editable), nombre, correo, carrera y ciclo.
// También se abre al presionar el ícono de engranaje del topbar.
// ==========================================================================
@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent implements OnChanges {
  // Rol del usuario logueado ('ADMIN' | 'ESTUDIANTE'), decide qué formulario mostrar
  @Input() rolUsuario: string = '';

  // Código/usuario con el que inició sesión, se precarga en el formulario
  @Input() nombreUsuario: string = '';

  get esAdmin(): boolean {
    return this.rolUsuario === 'ADMIN';
  }

  // Perfil editable del administrador (mock, se guarda solo localmente)
  perfilAdmin = {
    nombre: 'Administrador General',
    correo: 'admin@upeu.edu.pe',
    telefono: '',
    cargo: 'Coordinador de Prácticas Pre-Profesionales'
  };

  // Perfil editable del estudiante (mock, se guarda solo localmente)
  perfilEstudiante = {
    codigo: '',
    nombre: '',
    correo: '',
    carrera: 'Administración y Negocios Internacionales',
    ciclo: 'VIII'
  };

  // Cada vez que cambia el @Input nombreUsuario (ej. justo después del login),
  // se precarga el código del estudiante en su formulario de perfil.
  ngOnChanges(): void {
    if (!this.esAdmin && this.nombreUsuario) {
      this.perfilEstudiante.codigo = this.nombreUsuario;
    }
  }

  guardarAdmin(): void {
    alert('Datos del administrador actualizados correctamente (guardado local).');
  }

  guardarEstudiante(): void {
    alert('Tus datos de perfil fueron actualizados correctamente (guardado local).');
  }
}
