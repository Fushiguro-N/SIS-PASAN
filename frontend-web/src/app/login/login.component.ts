import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudiantesService } from '../services/estudiantes.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  isLoginTab = true;

  regCode = '';
  regNombre = '';
  regApellido = '';
  regTelefono = '';
  regCiclo = '';
  regEmail = '';
  regPassword = '';

  // Único usuario administrador del sistema (no hay backend de usuarios/roles
  // admin; los estudiantes sí se validan contra la base de datos real).
  private readonly admin = { username: 'ADMIN', password: 'admin523', role: 'ADMIN' };

  // 2. EL EVENTO EMITE EL USUARIO Y SU ROL AL APP.TS
  // Se emite un objeto (no solo el rol) para que app.ts también pueda mostrar
  // el nombre/código de usuario en el panel (ej. saludo del estudiante, avatar, etc.)
  @Output() loginSuccess = new EventEmitter<{ username: string; role: string }>();

  constructor(private estudiantesService: EstudiantesService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  setActiveTab(isLogin: boolean): void {
    this.isLoginTab = isLogin;
    this.clearFields();
  }

  private clearFields(): void {
    this.username = '';
    this.password = '';
    this.regCode = '';
    this.regNombre = '';
    this.regApellido = '';
    this.regTelefono = '';
    this.regCiclo = '';
    this.regEmail = '';
    this.regPassword = '';
  }

  // ==========================================
  // INICIO DE SESIÓN: el admin sigue siendo fijo; el estudiante se valida
  // contra la base de datos real (código + contraseña que él mismo creó
  // al registrarse en la pestaña "Registrarse").
  // ==========================================
  onSubmit() {
    const userTrimmed = this.username.trim();
    const passTrimmed = this.password.trim();

    if (userTrimmed === this.admin.username && passTrimmed === this.admin.password) {
      this.loginSuccess.emit({ username: this.admin.username, role: this.admin.role });
      return;
    }

    this.estudiantesService.login(userTrimmed, passTrimmed).subscribe({
      next: est => this.loginSuccess.emit({ username: est.codigo, role: 'ESTUDIANTE' }),
      error: () => alert('Credenciales incorrectas. Por favor, introduce tus credenciales institucionales válidas.')
    });
  }

  // ==========================================
  // REGISTRO: crea la cuenta real del estudiante en la base de datos
  // ==========================================
  onRegisterSubmit() {
    const codeTrimmed = this.regCode.trim();
    const passTrimmed = this.regPassword.trim();

    if (!codeTrimmed || !this.regNombre.trim() || !this.regApellido.trim() || !this.regEmail.trim() || !passTrimmed) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    this.estudiantesService.registrarCuenta({
      codigo: codeTrimmed,
      nombre: this.regNombre.trim(),
      apellido: this.regApellido.trim(),
      correo: this.regEmail.trim(),
      telefono: this.regTelefono.trim(),
      ciclo: this.regCiclo.trim(),
      password: passTrimmed
    }).subscribe({
      next: () => {
        alert(`¡Registro exitoso! Ahora ya puedes iniciar sesión con tu código: ${codeTrimmed}`);
        this.setActiveTab(true);
      },
      error: err => {
        const mensaje = err?.error?.mensaje || 'No se pudo completar el registro. Intenta de nuevo.';
        alert(mensaje);
      }
    });
  }
}
