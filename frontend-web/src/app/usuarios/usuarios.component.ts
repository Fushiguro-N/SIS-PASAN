import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudiantesService } from '../services/estudiantes.service';

// ==========================================================================
// COMPONENTE: UsuariosComponent (solo Administrador)
// ¿Para qué sirve?: Lista y registra a los estudiantes de la escuela,
// persistidos de verdad en la base de datos (a través de EstudiantesService
// -> BakendPasantias -> Postgres). El acceso de administrador sigue siendo
// una cuenta fija del login (no hay todavía un módulo de cuentas de admin
// en la base de datos), por eso esta vista es específicamente de Estudiantes.
// ==========================================================================
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  // Texto del buscador del topbar, filtra la tabla por nombre/código/correo
  @Input() filtroTexto: string = '';

  // Controla si el formulario "Nuevo Estudiante" está visible
  mostrarFormulario = false;

  // Modelo del formulario de alta de estudiante
  nuevoEstudiante = {
    codigo: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    ciclo: ''
  };

  constructor(private estudiantesService: EstudiantesService, private cdr: ChangeDetectorRef) {}

  // Se vuelve a pedir la lista cada vez que se entra a esta vista, y se
  // fuerza el repintado apenas llega la respuesta (evita que la tabla se
  // quede vacía si esta vista se abre después de que Angular ya "hidrató" la
  // página, un momento en el que a veces no se dispara un repintado solo).
  ngOnInit(): void {
    this.estudiantesService.cargar$().subscribe(() => this.cdr.detectChanges());
  }

  // Lista que se pinta en la tabla, ya filtrada por el buscador del topbar
  get usuariosFiltrados() {
    const texto = this.filtroTexto?.trim().toLowerCase();
    if (!texto) {
      return this.estudiantesService.estudiantes;
    }
    return this.estudiantesService.estudiantes.filter(u =>
      u.codigo.toLowerCase().includes(texto) ||
      u.nombre.toLowerCase().includes(texto) ||
      u.apellido.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto)
    );
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  // Valida y registra al estudiante en el backend (se guarda en Postgres)
  agregarUsuario(): void {
    if (!this.nuevoEstudiante.codigo || !this.nuevoEstudiante.nombre || !this.nuevoEstudiante.apellido || !this.nuevoEstudiante.correo) {
      alert('Por favor, completa código, nombre, apellido y correo institucional.');
      return;
    }

    this.estudiantesService.registrar(this.nuevoEstudiante).subscribe({
      next: () => {
        this.nuevoEstudiante = { codigo: '', nombre: '', apellido: '', telefono: '', correo: '', ciclo: '' };
        this.mostrarFormulario = false;
        this.cdr.detectChanges();
        alert('Estudiante registrado correctamente en la base de datos.');
      },
      error: err => {
        console.error(err);
        alert('No se pudo registrar al estudiante. Verifica que el código o correo no estén repetidos.');
      }
    });
  }
}
