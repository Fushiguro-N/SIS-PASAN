import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { PanelComponent } from './panel/panel.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { LoginComponent } from './login/login.component';

// Dejamos las rutas raíz como están, ya que tu navegación real ocurre por dentro del PanelComponent usando *ngIf
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: PanelComponent },
  { path: 'solicitudes', component: SolicitudesComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideRouter(routes),
    // Habilita HttpClient para que los servicios hablen con la API real de
    // BakendPasantias (http://localhost:8080) en vez de usar arrays en memoria
    provideHttpClient(withFetch())
  ]
};
