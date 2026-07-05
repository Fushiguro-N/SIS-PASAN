import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { EmpresasComponent } from '../empresas/empresas.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { DocumentosAdminComponent } from '../documentos-admin/documentos-admin.component';
import { ReportesComponent } from '../reportes/reportes.component';
import { AjustesComponent } from '../ajustes/ajustes.component';
import { SolicitudDetalleComponent } from '../solicitud-detalle/solicitud-detalle.component';
import { DocentesComponent } from '../docentes/docentes.component';
import { SolicitudesService } from '../services/solicitudes.service';
import { EmpresasService } from '../services/empresas.service';
import { DocumentosService } from '../services/documentos.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SolicitudesComponent,
    EmpresasComponent,
    UsuariosComponent,
    DocumentosAdminComponent,
    ReportesComponent,
    AjustesComponent,
    SolicitudDetalleComponent,
    DocentesComponent
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {

  constructor(
    private solicitudesService: SolicitudesService,
    private empresasService: EmpresasService,
    private documentosService: DocumentosService,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================================
  // COMUNICACIÓN CON APP.TS (RAÍZ)
  // ==========================================
  @Input() rolUsuario: string = '';
  @Input() nombreUsuario: string = '';

  // Getter usado en TODO el HTML del panel para decidir qué menú, qué
  // dashboard y qué secciones mostrar: true = vista Administrador, false = vista Estudiante
  get esAdmin(): boolean {
    return this.rolUsuario === 'ADMIN';
  }

  // Setter para actualizar instantáneamente la vista interna cuando cambia el padre
  @Input()
  set vistaActual(value: string) {
    this._vistaActual = value;
    this.currentView = value;
  }
  get vistaActual(): string {
    return this._vistaActual;
  }
  private _vistaActual: string = 'dashboard';

  @Output() cambiarVistaEvent = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();

  // UNIFICADO: Un solo método para controlar la navegación interna y externa.
  // También cierra el dropdown de notificaciones y el tooltip del gráfico de
  // barras al cambiar de sección: como PanelComponent nunca se destruye (solo
  // se oculta/muestra cada <section> con *ngIf), si el tooltip quedaba
  // "true" justo antes de navegar, reaparecía pegado al volver al dashboard
  // aunque el mouse ya no estuviera encima de ninguna barra.
  navegarA(vista: string) {
    this.currentView = vista;
    this.mostrarNotificaciones = false;
    this.ocultarTooltipMes();
    this.cambiarVistaEvent.emit(vista);
  }

  // Traduce la clave interna de cada vista (usada en *ngIf) a un título
  // legible para el breadcrumb del topbar (ej. "documentos-admin" -> "Documentos").
  private nombresVista: { [key: string]: string } = {
    dashboard: 'Dashboard',
    solicitudes: 'Solicitudes',
    empresas: 'Empresas',
    usuarios: 'Estudiantes',
    docentes: 'Docentes',
    'documentos-admin': 'Documentos',
    reportes: 'Reportes',
    ajustes: 'Ajustes',
    postular: 'Postular',
    documentos: 'Mis Documentos'
  };

  get tituloVistaActual(): string {
    return this.nombresVista[this.currentView] || this.currentView;
  }

  // ==========================================
  // VARIABLES INTERNAS DEL PANEL
  // ==========================================
  currentView: string = 'dashboard';
  textoDona: string = 'Estado General';

  // ==========================================
  // BUSCADOR DEL TOPBAR
  // Texto escrito en el <input> de "Buscar..." del header. Se pasa como
  // @Input "filtroTexto" a los componentes hijos (Solicitudes, Empresas,
  // Usuarios, Documentos) para que cada uno filtre su propia lista. Además,
  // funciona en CUALQUIER vista (incluido el Dashboard) mostrando un
  // desplegable de sugerencias: al escribir aparecen coincidencias de
  // solicitudes/empresas, y al hacer click te lleva directo a esa sección.
  // ==========================================
  terminoBusqueda: string = '';
  mostrarSugerencias: boolean = false;

  get sugerenciasBusqueda() {
    const texto = this.terminoBusqueda?.trim().toLowerCase();
    if (!texto || !this.esAdmin) return [];

    const deSolicitudes = this.solicitudesService.solicitudes
      .filter(sol => sol.estudiante.toLowerCase().includes(texto) || sol.codigo.toLowerCase().includes(texto))
      .slice(0, 5)
      .map(sol => ({
        icono: 'assignment',
        titulo: sol.estudiante,
        subtitulo: `Solicitud ${sol.id} — ${sol.empresa}`,
        destino: 'solicitud',
        solicitud: sol
      }));

    const deEmpresas = this.empresasService.empresas
      .filter(emp => emp.nombre.toLowerCase().includes(texto))
      .slice(0, 5)
      .map(emp => ({
        icono: 'corporate_fare',
        titulo: emp.nombre,
        subtitulo: `${emp.ocupadas}/${emp.totalVacantes} plazas ocupadas`,
        destino: 'empresas',
        solicitud: null
      }));

    return [...deSolicitudes, ...deEmpresas];
  }

  ocultarSugerenciasConRetraso(): void {
    // Pequeño retraso para que el (click) de una sugerencia alcance a
    // dispararse antes de que el (blur) del input la oculte
    setTimeout(() => this.mostrarSugerencias = false, 150);
  }

  irASugerencia(sug: any): void {
    this.terminoBusqueda = '';
    this.mostrarSugerencias = false;

    if (sug.destino === 'solicitud' && sug.solicitud) {
      this.navegarA('dashboard');
      this.solicitudSeleccionada = sug.solicitud;
      return;
    }

    this.navegarA(sug.destino);
  }

  // ==========================================
  // NOTIFICACIONES DEL TOPBAR
  // Controla si el dropdown de notificaciones está visible.
  // - Estudiante: mock genérico (avisos varios de la plataforma).
  // - Administrador: SOLO avisos de solicitudes (Pendientes o En Revisión que
  //   necesitan su atención), generados en vivo desde SolicitudesService.
  // ==========================================
  mostrarNotificaciones: boolean = false;

  // "destino" indica a dónde navegar al hacer click: una vista simple del
  // panel, o 'solicitud' para abrir directamente el modal de esa solicitud.
  notificacionesEstudianteMock = [
    { icono: 'corporate_fare', texto: 'Nueva empresa aliada: revisa las plazas disponibles', tiempo: 'Hace 1 día', destino: 'empresas' },
    { icono: 'upload_file', texto: 'Recuerda completar tus documentos pendientes', tiempo: 'Hace 3 días', destino: 'documentos' }
  ];

  // Notificaciones que ve el administrador: una por cada solicitud que sigue
  // "Pendiente" o "En Revisión", es decir, que todavía necesita una decisión.
  // Cada una guarda la solicitud completa para poder abrir su ficha al hacer click.
  get notificacionesAdmin() {
    return this.solicitudesService.solicitudes
      .filter(sol => sol.estado === 'Pendiente' || sol.estado === 'En Revisión')
      .map(sol => ({
        icono: sol.estado === 'Pendiente' ? 'assignment_late' : 'schedule',
        texto: `${sol.estudiante} postuló a ${sol.empresa} — ${sol.estado}`,
        tiempo: sol.fecha,
        destino: 'solicitud',
        solicitud: sol
      }));
  }

  // Lista que realmente se pinta en el dropdown, según el rol del usuario logueado
  get notificaciones() {
    return this.esAdmin ? this.notificacionesAdmin : this.notificacionesEstudianteMock;
  }

  toggleNotificaciones(): void {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }

  // Al hacer click en una notificación, navega a donde corresponde: si trae
  // una solicitud, abre directamente su ficha de detalle (con acciones para
  // el admin); si no, simplemente cambia a la vista indicada en "destino".
  irANotificacion(notif: any): void {
    this.navegarA(notif.destino === 'solicitud' ? 'dashboard' : notif.destino);

    if (notif.destino === 'solicitud' && notif.solicitud) {
      this.solicitudSeleccionada = notif.solicitud;
    }
  }

  // --- VARIABLES PARA EL TOOLTIP FLOTANTE DEL GRÁFICO DE BARRAS ---
  tooltipMesVisible: boolean = false;
  tooltipMesNombre: string = '';
  tooltipMesSolicitudes: number = 0;
  tooltipMesAprobadas: number = 0;
  tooltipX: number = 0;
  tooltipY: number = 0;

  // Solicitud actualmente abierta en el modal de detalle de la lista
  // "Solicitudes Recientes" del dashboard del administrador.
  solicitudSeleccionada: any = null;

  // Lista que pinta la tarjeta "Solicitudes Recientes" del dashboard del
  // administrador: viene siempre de SolicitudesService (única fuente de
  // verdad), así que apenas un estudiante postula, aparece aquí de inmediato.
  // Se muestran las más nuevas primero.
  get solicitudesRecientes() {
    return [...this.solicitudesService.solicitudes].reverse();
  }

  verDetalle(sol: any): void {
    this.solicitudSeleccionada = sol;
  }

  cerrarDetalle(): void {
    this.solicitudSeleccionada = null;
  }

  // El admin aprobó/rechazó/dejó pendiente la solicitud desde el modal
  // abierto en el dashboard (misma lógica que en SolicitudesComponent)
  onCambiarEstado(nuevoEstado: string): void {
    if (!this.solicitudSeleccionada) return;
    this.solicitudesService.actualizarEstado(this.solicitudSeleccionada.idReal, nuevoEstado as any).subscribe({
      next: () => this.cdr.detectChanges(),
      error: err => console.error('No se pudo actualizar el estado de la solicitud.', err)
    });
  }

  // ==========================================
  // MÉTRICAS DEL DASHBOARD DEL ADMINISTRADOR
  // Ya no son números fijos: se calculan en vivo a partir de las solicitudes
  // y empresas reales guardadas en SolicitudesService/EmpresasService, así
  // que apenas cambia un estado o se agrega una empresa, se reflejan aquí.
  // ==========================================
  private contarPorEstado(estado: string): number {
    return this.solicitudesService.solicitudes.filter(sol => sol.estado === estado).length;
  }

  get totalSolicitudes(): number {
    return this.solicitudesService.solicitudes.length;
  }

  get totalAprobadas(): number {
    return this.contarPorEstado('Aprobado');
  }

  get totalEnRevision(): number {
    return this.contarPorEstado('En Revisión');
  }

  get totalPendientes(): number {
    return this.contarPorEstado('Pendiente');
  }

  get totalRechazadas(): number {
    return this.contarPorEstado('Rechazado');
  }

  get porcentajeAprobadas(): number {
    return this.totalSolicitudes > 0 ? Math.round((this.totalAprobadas / this.totalSolicitudes) * 1000) / 10 : 0;
  }

  // Cuántas solicitudes se registraron en el mes actual (mismo formato de
  // fecha "DD Mes AAAA" que genera SolicitudesService al crear una nueva)
  get solicitudesEsteMes(): number {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mesActual = meses[new Date().getMonth()];
    return this.solicitudesService.solicitudes.filter(sol => sol.fecha.split(' ')[1] === mesActual).length;
  }

  get totalEmpresas(): number {
    return this.empresasService.empresas.length;
  }

  get plazasDisponibles(): number {
    return this.empresasService.totalPlazasDisponibles;
  }

  // ==========================================
  // GRÁFICO DE BARRAS "SOLICITUDES POR MES"
  // Agrupa las solicitudes reales por el mes de su campo "fecha" (en vez de
  // valores fijos de Ene-Jun), contando el total y cuántas de ellas se aprobaron.
  // ==========================================
  get datosPorMes() {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const conteo: { [mes: string]: { total: number; aprobadas: number } } = {};
    meses.forEach(m => conteo[m] = { total: 0, aprobadas: 0 });

    this.solicitudesService.solicitudes.forEach(sol => {
      const mes = sol.fecha.split(' ')[1];
      if (conteo[mes]) {
        conteo[mes].total++;
        if (sol.estado === 'Aprobado') conteo[mes].aprobadas++;
      }
    });

    // Solo se muestran los meses que ya tienen alguna solicitud registrada
    const mesesConDatos = meses.filter(m => conteo[m].total > 0);
    const maxValor = Math.max(...mesesConDatos.map(m => conteo[m].total), 1);

    return mesesConDatos.map(mes => ({
      mes,
      total: conteo[mes].total,
      aprobadas: conteo[mes].aprobadas,
      porcentajeTotal: (conteo[mes].total / maxValor) * 100,
      porcentajeAprobadas: (conteo[mes].aprobadas / maxValor) * 100
    }));
  }

  // Etiquetas del eje Y del gráfico de barras (4 escalones + el 0), en
  // función del mes con más solicitudes en vez de un "28" fijo.
  get ejeYBarras(): number[] {
    const max = Math.max(...this.datosPorMes.map(d => d.total), 1);
    return [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];
  }

  // ==========================================
  // DONUT "ESTADO GENERAL"
  // Dibuja un círculo SVG por segmentos usando el truco del radio 15.9155
  // (2πr ≈ 100), así cada porcentaje se puede usar directamente como
  // longitud de trazo. Se calculan en vivo con los 4 estados reales.
  // ==========================================
  get segmentosDona() {
    const total = this.totalSolicitudes;
    const pct = (n: number) => total > 0 ? (n / total) * 100 : 0;

    const datos = [
      { estado: 'Aprobadas', valor: this.totalAprobadas, color: '#10b981' },
      { estado: 'En Revisión', valor: this.totalEnRevision, color: '#f59e0b' },
      { estado: 'Pendientes', valor: this.totalPendientes, color: '#94a3b8' },
      { estado: 'Rechazadas', valor: this.totalRechazadas, color: '#ef4444' }
    ];

    let acumulado = 0;
    return datos.map(d => {
      const porcentaje = pct(d.valor);
      const segmento = {
        ...d,
        porcentaje,
        dasharray: `${porcentaje} ${100 - porcentaje}`,
        dashoffset: 25 - acumulado
      };
      acumulado += porcentaje;
      return segmento;
    });
  }

  // ==========================================
  // VISTA ESTUDIANTE: solicitud, documentos y empresas
  // ==========================================

  // Empresas que aparecen como opciones en el <select> del formulario de
  // postulación (vista "postular"). Es la misma lista real que administra
  // el admin en EmpresasComponent (id + nombre, para poder enviar el id al backend).
  get empresasDisponibles() {
    return this.empresasService.empresas;
  }

  // Guarda la solicitud de práctica del estudiante logueado.
  // "estado" avanza: Sin registrar -> Pendiente (al postular) -> En Revisión/Aprobado/Rechazado (los pone el admin)
  miSolicitud = {
    nombre: '',
    empresaId: null as number | null,
    empresa: '', // Nombre de la empresa, solo para mostrar en el dashboard
    area: '',
    fechaInicio: '',
    motivo: '',
    estado: 'Sin registrar' // Sin registrar | Pendiente | En Revisión | Aprobado | Rechazado
  };

  // Estado de los 3 documentos que el estudiante debe subir. "subido" controla
  // el badge (Pendiente/Subido) y "nombre" guarda el nombre del archivo elegido.
  misDocumentos = {
    cv: { nombre: '', subido: false },
    certificadoIngles: { nombre: '', subido: false },
    diploma: { nombre: '', subido: false }
  };

  ngOnInit(): void {
    this.currentView = this.vistaActual;

    // Si el estudiante ya había postulado antes (queda guardado en la base
    // de datos aunque cierre sesión), se precarga su solicitud para que el
    // dashboard y el formulario reflejen el estado real. Como las
    // solicitudes/empresas se cargan por HTTP, puede que aún no hayan
    // llegado al primer intento; por eso se reintenta un momento después.
    if (!this.esAdmin && this.nombreUsuario) {
      this.precargarMiSolicitud();
      setTimeout(() => this.precargarMiSolicitud(), 800);
    }
  }

  private precargarMiSolicitud(): void {
    const existente = this.solicitudesService.buscarPorCodigo(this.nombreUsuario);
    if (!existente) return;

    const empresaEncontrada = this.empresasService.empresas.find(e => e.nombre === existente.empresa);

    this.miSolicitud = {
      nombre: existente.estudiante,
      empresaId: empresaEncontrada ? empresaEncontrada.id : null,
      empresa: existente.empresa,
      area: existente.area,
      fechaInicio: existente.fechaInicio,
      motivo: existente.motivo,
      estado: existente.estado
    };
    this.cdr.detectChanges();
  }

  // Se ejecuta al enviar el formulario "Postular a Práctica". Valida los
  // campos obligatorios y le pide al backend que registre (o actualice) la
  // solicitud; recién cuando el servidor confirma se avisa al estudiante y
  // se vuelve al dashboard, para no mostrar un éxito que todavía no ocurrió.
  postularSolicitud(): void {
    if (!this.miSolicitud.nombre || !this.miSolicitud.empresaId || !this.miSolicitud.area || !this.miSolicitud.fechaInicio) {
      alert('Por favor, completa los campos obligatorios de la postulación.');
      return;
    }

    this.solicitudesService.registrarPostulacion({
      codigo: this.nombreUsuario,
      estudiante: this.miSolicitud.nombre,
      empresaId: this.miSolicitud.empresaId,
      area: this.miSolicitud.area,
      fechaInicio: this.miSolicitud.fechaInicio,
      motivo: this.miSolicitud.motivo
    }).subscribe({
      next: sol => {
        this.miSolicitud.estado = sol.estado;
        this.miSolicitud.empresa = sol.empresa;
        this.navegarA('dashboard');
        this.cdr.detectChanges();
        alert('¡Tu solicitud de práctica fue enviada! Quedará en estado "Pendiente" hasta que el administrador la revise.');
      },
      error: err => {
        console.error(err);
        alert('No se pudo enviar la solicitud. Verifica tu conexión con el servidor e intenta de nuevo.');
      }
    });
  }

  // Traduce la clave interna del documento al "tipo" y título que usa
  // DocumentosService (y que ve el admin en Gestión Documental)
  private tipoDocumentoLabel: { [key: string]: string } = {
    cv: 'CV',
    certificadoIngles: 'Certificado de Inglés',
    diploma: 'Diploma'
  };
  private tituloDocumentoDefault: { [key: string]: string } = {
    cv: 'Curriculum Vitae',
    certificadoIngles: 'Certificado de Inglés',
    diploma: 'Diploma / Certificado de Estudios'
  };

  // Se dispara con el evento (change) de cada <input type="file"> en "Mis
  // Documentos". Se sube el nombre/tamaño al backend (queda "Pendiente" en
  // la base de datos) y solo se marca como "subido" en pantalla cuando el
  // servidor confirma que lo guardó; así el admin lo ve de inmediato en
  // Gestión Documental.
  onDocumentoSeleccionado(event: Event, tipo: 'cv' | 'certificadoIngles' | 'diploma'): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files && input.files.length > 0 ? input.files[0] : null;
    if (!archivo) return;

    this.documentosService.registrarDocumento({
      codigo: this.nombreUsuario,
      estudiante: this.miSolicitud.nombre || this.nombreUsuario,
      tipo: this.tipoDocumentoLabel[tipo],
      titulo: this.tituloDocumentoDefault[tipo],
      tamano: this.formatearTamano(archivo.size)
    }, archivo).subscribe({
      next: () => {
        this.misDocumentos[tipo] = { nombre: archivo.name, subido: true };
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        alert('No se pudo subir el documento. Intenta de nuevo.');
      }
    });
  }

  // Convierte bytes a un texto legible tipo "890 KB" o "2.3 MB"
  private formatearTamano(bytes: number): string {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Cuenta cuántos de los 3 documentos ya se subieron, usado en la tarjeta
  // "DOCUMENTOS SUBIDOS" del dashboard del estudiante (ej. "2/3").
  get documentosSubidosCount(): number {
    return Object.values(this.misDocumentos).filter(doc => doc.subido).length;
  }

  // ==========================================
  // MÉTODOS DEL GRÁFICO DONA
  // ==========================================
  actualizarTooltipDona(estado: string, valor: number): void {
    this.textoDona = `${estado} : ${valor}`;
  }

  resetearTooltipDona(): void {
    this.textoDona = 'Estado General';
  }

  // ==========================================
  // MÉTODOS DEL GRÁFICO DE BARRAS
  // ==========================================
  mostrarTooltipMes(mes: string = 'Mes', solicitudes: number = 0, aprobadas: number = 0, event?: MouseEvent) {
    this.tooltipMesNombre = mes;
    this.tooltipMesSolicitudes = solicitudes;
    this.tooltipMesAprobadas = aprobadas;

    if (event) {
      const element = event.currentTarget as HTMLElement;
      if (element) {
        this.tooltipX = element.offsetLeft + (element.offsetWidth / 2) - 75;
        this.tooltipY = element.offsetTop - 95;
      }
    } else {
      this.tooltipX = 120;
      this.tooltipY = 30;
    }

    this.tooltipMesVisible = true;
  }

  ocultarTooltipMes() {
    this.tooltipMesVisible = false;
  }

  // ==========================================
  // ACCIONES FINALES
  // ==========================================
  emitLogout() {
    this.logoutEvent.emit();
  }

  irAEmpresas() {
    this.navegarA('empresas');
  }
}
