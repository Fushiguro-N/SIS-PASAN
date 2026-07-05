import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresasService } from '../services/empresas.service';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit {
  // Cuando el panel es de un ESTUDIANTE, se pasa soloLectura=true para ocultar
  // el botón "Agregar Empresa" y el formulario de alta (solo el admin gestiona empresas).
  @Input() soloLectura: boolean = false;

  // Texto del buscador del topbar (panel.component.html lo pasa por @Input).
  // Filtra la grilla de empresas por nombre o rubro mientras se escribe.
  @Input() filtroTexto: string = '';

  // Controla si el formulario de alta de empresa está visible o no
  mostrarFormulario = false;

  // Modelo del formulario "Agregar Empresa" (incluye RUC, dirección y
  // teléfono porque el backend real los exige para registrar la empresa)
  nuevaEmpresa = {
    nombre: '',
    ruc: '',
    rubro: '',
    direccion: '',
    ubicacion: '',
    telefono: '',
    totalVacantes: 1,
    contacto: ''
  };

  constructor(private empresasService: EmpresasService, private cdr: ChangeDetectorRef) {}

  // Se vuelve a pedir la lista cada vez que se entra a esta vista, forzando
  // el repintado apenas llega la respuesta (evita que la grilla se quede
  // vacía si esta vista se abre después de que Angular ya "hidrató" la página).
  ngOnInit(): void {
    this.empresasService.cargar$().subscribe(() => this.cdr.detectChanges());
  }

  // Lista completa de empresas: viene siempre del servicio compartido, así
  // el dashboard del admin (EmpresasService.totalPlazasDisponibles, etc.)
  // refleja exactamente lo mismo que se ve aquí.
  get empresasMock() {
    return this.empresasService.empresas;
  }

  // Lista que realmente se pinta en el HTML: las empresas del servicio
  // filtradas por lo que el admin escribió en el buscador del topbar.
  get empresasFiltradas() {
    const texto = this.filtroTexto?.trim().toLowerCase();
    if (!texto) {
      return this.empresasService.empresas;
    }
    return this.empresasService.empresas.filter(emp =>
      emp.nombre.toLowerCase().includes(texto) || emp.rubro.toLowerCase().includes(texto)
    );
  }

  // Muestra u oculta el formulario de alta al presionar "Agregar Empresa"
  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  // Se ejecuta al enviar el formulario de alta: valida los campos y le pide
  // a EmpresasService que la registre en el backend (queda guardada en Postgres).
  agregarEmpresa(): void {
    if (!this.nuevaEmpresa.nombre || !this.nuevaEmpresa.ruc || !this.nuevaEmpresa.rubro || !this.nuevaEmpresa.ubicacion) {
      alert('Por favor, completa nombre, RUC, rubro y ubicación de la empresa.');
      return;
    }

    this.empresasService.agregarEmpresa(this.nuevaEmpresa).subscribe({
      next: () => {
        this.nuevaEmpresa = { nombre: '', ruc: '', rubro: '', direccion: '', ubicacion: '', telefono: '', totalVacantes: 1, contacto: '' };
        this.mostrarFormulario = false;
        this.cdr.detectChanges();
        alert('Empresa registrada correctamente en la base de datos.');
      },
      error: err => {
        console.error(err);
        alert('No se pudo registrar la empresa. Verifica que el RUC no esté repetido.');
      }
    });
  }
}
