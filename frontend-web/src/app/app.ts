import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent, PanelComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Estado de autenticación global
  isLoggedIn: boolean = false;

  // Control de navegación principal
  currentView: string = 'dashboard';

  // Almacena el rol del usuario actual ('ADMIN' o 'ESTUDIANTE')
  userRole: string = '';

  // Almacena el usuario/código con el que inició sesión
  userName: string = '';

  // Recibe el usuario y su rol desde el Login ($event)
  onLoginSuccess(user: { username: string; role: string }) {
    this.isLoggedIn = true;
    this.userRole = user.role; // Guarda el rol detectado para pasarlo al panel
    this.userName = user.username;
    this.currentView = 'dashboard';
    console.log('Sesión iniciada con éxito. Rol:', this.userRole);
  }

  // Al presionar salir, limpiamos el estado completo
  logout() {
    this.isLoggedIn = false;
    this.userRole = ''; // Resetea el rol por seguridad
    this.userName = '';
    console.log('Sesión cerrada correctamente.');
  }

  // Cambia dinámicamente la vista interna del panel
  changeView(view: string) {
    this.currentView = view;
  }
}
