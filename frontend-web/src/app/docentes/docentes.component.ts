import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocentesService } from '../services/docentes.service';

// ==========================================================================
// COMPONENTE: DocentesComponent (solo Administrador)
// ¿Para qué sirve?: Lista los docentes disponibles para dar tutoría a los
// estudiantes en sus prácticas, permite registrar nuevos y asignarles un
// estudiante. Un estudiante que ya tiene tutor asignado no vuelve a
// aparecer en el selector de "estudiantes disponibles" (lo filtra el backend).
// ==========================================================================
@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docentes.component.html',
  styleUrl: './docentes.component.css'
})
export class DocentesComponent implements OnInit {
  @Input() filtroTexto: string = '';

  mostrarFormulario = false;

  nuevoDocente = {
    codigo: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: ''
  };

  // Guarda, por docente, qué estudiante se eligió en su selector de asignación
  seleccionPorDocente: { [docenteId: number]: string } = {};

  constructor(private docentesService: DocentesService, private cdr: ChangeDetectorRef) {}

  // Se vuelve a pedir la lista cada vez que se entra a esta vista (en vez de
  // confiar solo en la carga inicial del servicio), para que siempre se vean
  // los datos más recientes de docentes y estudiantes disponibles. Se
  // suscribe aquí mismo (en vez de solo llamar a docentesService.cargar())
  // para poder forzar el repintado apenas cada respuesta llega.
  ngOnInit(): void {
    this.docentesService.cargarDocentes$().subscribe(() => this.cdr.detectChanges());
    this.docentesService.cargarEstudiantes$().subscribe(() => this.cdr.detectChanges());
  }

  get docentesFiltrados() {
    const texto = this.filtroTexto?.trim().toLowerCase();
    const lista = this.docentesService.docentes;
    if (!texto) return lista;

    return lista.filter(d =>
      d.codigo.toLowerCase().includes(texto) ||
      d.nombres.toLowerCase().includes(texto) ||
      d.apellidos.toLowerCase().includes(texto)
    );
  }

  get estudiantesDisponibles() {
    return this.docentesService.estudiantesDisponibles;
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  agregarDocente(): void {
    if (!this.nuevoDocente.codigo || !this.nuevoDocente.nombres || !this.nuevoDocente.apellidos || !this.nuevoDocente.correo) {
      alert('Por favor, completa código, nombres, apellidos y correo del docente.');
      return;
    }

    this.docentesService.registrar(this.nuevoDocente).subscribe({
      next: () => {
        this.nuevoDocente = { codigo: '', nombres: '', apellidos: '', correo: '', telefono: '' };
        this.mostrarFormulario = false;
        this.cdr.detectChanges();
        alert('Docente registrado correctamente en la base de datos.');
      },
      error: err => {
        console.error(err);
        alert('No se pudo registrar al docente. Verifica que el código o correo no estén repetidos.');
      }
    });
  }

  // Asigna al estudiante elegido en el <select> del docente indicado
  asignarEstudiante(docenteId: number): void {
    const estudianteId = Number(this.seleccionPorDocente[docenteId]);
    if (!estudianteId) {
      alert('Selecciona un estudiante para asignar.');
      return;
    }

    this.docentesService.asignarEstudiante(docenteId, estudianteId).subscribe({
      next: () => {
        delete this.seleccionPorDocente[docenteId];
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        alert('No se pudo asignar el estudiante al docente.');
      }
    });
  }
}
