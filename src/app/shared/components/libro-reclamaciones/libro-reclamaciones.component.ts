import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import {
  ReclamacionApiSuccess,
  ReclamacionesApiService,
} from '../../service/reclamaciones-api.service';

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

@Component({
  selector: 'app-libro-reclamaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="w-full bg-[#F8FAFC] pt-[120px] pb-24 md:pt-[160px] md:pb-32">
      <div class="max-w-3xl mx-auto px-5 md:px-6">

        <div class="bg-white p-8 md:p-12 border-t-4 border-[#1E3E62] shadow-sm mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-200 pb-6">
            <div>
              <h1 class="font-inter text-2xl md:text-3xl font-bold text-[#101827] mb-2 uppercase tracking-tight">Libro de Reclamaciones</h1>
              <p class="font-inter text-sm text-slate-500 font-medium">Hoja de Reclamación Virtual</p>
            </div>
            <img src="assets/libro-reclamaciones.png" alt="Libro Oficial" class="h-12 object-contain">
          </div>

          <div class="bg-slate-50 border border-slate-200 p-4 rounded-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Proveedor</span>
                <span class="font-inter text-sm text-[#101827] font-medium block">ENTORNOS FUNCIONALES S.A.C.</span>
              </div>
              <div>
                <span class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">RUC</span>
                <span class="font-inter text-sm text-[#101827] font-medium block">20613342002</span>
              </div>
              <div class="md:col-span-2 border-t border-slate-200 pt-3 mt-1">
                <span class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Domicilio</span>
                <span class="font-inter text-sm text-[#101827] font-medium block">MZ.E LT 40 CMTE 5 FLOR DE AMANCAES</span>
              </div>
            </div>
          </div>
        </div>

        @if (confirmacion(); as conf) {
          <div class="bg-white p-8 md:p-12 shadow-sm border border-[#0D9488]/20 space-y-4" role="status" aria-live="polite">
            <h2 class="font-jakarta text-xl font-bold text-[#0D9488] uppercase tracking-wide">Reclamación registrada</h2>
            <p class="font-inter text-sm text-[#101827] leading-relaxed">{{ conf.message }}</p>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-sm">
              <div>
                <dt class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-widest">Código de reclamación</dt>
                <dd class="font-inter text-lg text-[#101827] font-bold tracking-wide mt-1">{{ conf.codigo }}</dd>
              </div>
              <div>
                <dt class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fecha de registro</dt>
                <dd class="font-inter text-sm text-[#101827] font-medium mt-1">{{ conf.fecha }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-widest">Constancia por correo</dt>
                <dd class="font-inter text-sm text-[#101827] font-medium mt-1">{{ conf.constanciaLabel }}</dd>
              </div>
            </dl>
            <p class="font-inter text-xs text-slate-500 leading-relaxed">
              Conserve este código. Le permitirá identificar su caso ante Entornos Funcionales S.A.C.
              (reclamos&#64;entornosfuncionales.com).
            </p>
            <button type="button"
                    (click)="nuevaReclamacion()"
                    class="mt-2 px-8 py-3 border border-[#1E3E62] text-[#1E3E62] font-inter text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-slate-50 transition-colors">
              Registrar otra reclamación
            </button>
          </div>
        } @else {
          <form [formGroup]="reclamoForm" (ngSubmit)="enviarReclamo()" class="space-y-8 bg-white p-8 md:p-12 shadow-sm" novalidate>

            <div class="space-y-6">
              <h3 class="font-jakarta text-lg font-bold text-[#1E3E62] border-b border-slate-200 pb-2 uppercase tracking-wide">1. Identificación del Consumidor Reclamante</h3>

              <div class="flex flex-col gap-2 mb-6 bg-slate-50 p-4 border border-slate-200 rounded-sm">
                <label class="font-inter text-xs font-bold text-[#101827] uppercase">¿El consumidor es menor de edad?</label>
                <div class="flex gap-6 mt-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" formControlName="esMenor" [value]="true" (change)="toggleApoderado()" class="accent-[#1E3E62] w-4 h-4">
                    <span class="font-inter text-sm text-[#101827]">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" formControlName="esMenor" [value]="false" (change)="toggleApoderado()" class="accent-[#1E3E62] w-4 h-4">
                    <span class="font-inter text-sm text-[#101827]">No</span>
                  </label>
                </div>
              </div>

              @if (reclamoForm.get('esMenor')?.value) {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-5 rounded-sm border border-blue-100 mb-6">
                  <div class="md:col-span-2">
                    <p class="font-inter text-xs text-[#1E3E62] font-medium mb-2">Por favor, ingrese el nombre del padre, madre o apoderado.</p>
                  </div>
                  <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="nombreApoderado">Nombre Completo del Apoderado *</label>
                    <input id="nombreApoderado" type="text" formControlName="nombreApoderado" maxlength="120"
                           class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                           [class.border-red-400]="showError('nombreApoderado')">
                    @if (showError('nombreApoderado')) {
                      <p class="font-inter text-xs text-red-600">Ingrese el nombre del apoderado.</p>
                    }
                  </div>
                </div>
              }

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="nombre">
                    Nombre Completo {{ reclamoForm.get('esMenor')?.value ? '(del menor)' : '' }} *
                  </label>
                  <input id="nombre" type="text" formControlName="nombre" maxlength="120"
                         class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                         [class.border-red-400]="showError('nombre')">
                  @if (showError('nombre')) {
                    <p class="font-inter text-xs text-red-600">El nombre es obligatorio.</p>
                  }
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="documento">DNI / CE *</label>
                  <input id="documento" type="text" formControlName="documento" maxlength="20"
                         class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                         [class.border-red-400]="showError('documento')">
                  @if (showError('documento')) {
                    <p class="font-inter text-xs text-red-600">El documento es obligatorio.</p>
                  }
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="telefono">Teléfono *</label>
                  <input id="telefono" type="tel" formControlName="telefono" maxlength="30"
                         class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                         [class.border-red-400]="showError('telefono')">
                  @if (showError('telefono')) {
                    <p class="font-inter text-xs text-red-600">El teléfono es obligatorio.</p>
                  }
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="domicilio">Domicilio *</label>
                  <input id="domicilio" type="text" formControlName="domicilio" maxlength="300"
                         class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                         [class.border-red-400]="showError('domicilio')">
                  @if (showError('domicilio')) {
                    <p class="font-inter text-xs text-red-600">El domicilio es obligatorio.</p>
                  }
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="correo">E-Mail (Correo Electrónico) *</label>
                  <input id="correo" type="email" formControlName="correo" maxlength="254"
                         class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                         [class.border-red-400]="showError('correo')">
                  @if (showError('correo')) {
                    <p class="font-inter text-xs text-red-600">Ingrese un correo electrónico válido.</p>
                  }
                </div>
              </div>
            </div>

            <div class="space-y-6 pt-4">
              <h3 class="font-jakarta text-lg font-bold text-[#1E3E62] border-b border-slate-200 pb-2 uppercase tracking-wide">2. Identificación del Bien Contratado</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="tipoBien">Tipo de Bien *</label>
                  <select id="tipoBien" formControlName="tipoBien"
                          class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]">
                    <option value="Servicio">Servicio</option>
                    <option value="Producto">Producto</option>
                  </select>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="montoReclamado">Monto Reclamado (Opcional)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-inter text-sm text-slate-500">S/</span>
                    <input id="montoReclamado" type="number" formControlName="montoReclamado" min="0" step="0.01"
                           class="w-full pl-9 pr-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                           placeholder="0.00"
                           [class.border-red-400]="showError('montoReclamado')">
                  </div>
                  @if (showError('montoReclamado')) {
                    <p class="font-inter text-xs text-red-600">Monto inválido.</p>
                  }
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="descripcionBien">Descripción del Producto o Servicio *</label>
                  <input id="descripcionBien" type="text" formControlName="descripcionBien" maxlength="300"
                         class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                         [class.border-red-400]="showError('descripcionBien')">
                  @if (showError('descripcionBien')) {
                    <p class="font-inter text-xs text-red-600">Describa el producto o servicio.</p>
                  }
                </div>
              </div>
            </div>

            <div class="space-y-6 pt-4">
              <h3 class="font-jakarta text-lg font-bold text-[#1E3E62] border-b border-slate-200 pb-2 uppercase tracking-wide">3. Detalle de la Reclamación y Pedido del Consumidor</h3>

              <div class="bg-slate-50 p-4 border border-slate-200 rounded-sm mb-4">
                <div class="flex flex-col sm:flex-row gap-6">
                  <label class="flex items-start gap-2 cursor-pointer">
                    <input type="radio" formControlName="tipoReclamo" value="Reclamo" class="accent-[#1E3E62] mt-1 w-4 h-4">
                    <div>
                      <span class="font-inter text-sm font-bold text-[#101827] block">RECLAMO</span>
                      <span class="font-inter text-[11px] text-slate-500 block leading-tight mt-0.5">Disconformidad relacionada a los productos o servicios.</span>
                    </div>
                  </label>
                  <label class="flex items-start gap-2 cursor-pointer">
                    <input type="radio" formControlName="tipoReclamo" value="Queja" class="accent-[#1E3E62] mt-1 w-4 h-4">
                    <div>
                      <span class="font-inter text-sm font-bold text-[#101827] block">QUEJA</span>
                      <span class="font-inter text-[11px] text-slate-500 block leading-tight mt-0.5">Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="detalle">Detalle *</label>
                <textarea id="detalle" formControlName="detalle" rows="5" maxlength="4000"
                          class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                          [class.border-red-400]="showError('detalle')"></textarea>
                @if (showError('detalle')) {
                  <p class="font-inter text-xs text-red-600">Describa el detalle de los hechos.</p>
                }
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-inter text-xs font-bold text-slate-600 uppercase" for="pedido">Pedido *</label>
                <textarea id="pedido" formControlName="pedido" rows="3" maxlength="4000"
                          class="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm font-inter text-sm text-[#101827] focus:outline-none focus:border-[#5C968D]"
                          [class.border-red-400]="showError('pedido')"></textarea>
                @if (showError('pedido')) {
                  <p class="font-inter text-xs text-red-600">Indique su pedido.</p>
                }
              </div>
            </div>

            <div class="space-y-2">
              <label class="font-inter text-xs font-bold text-slate-600 uppercase">Verificación de seguridad *</label>
              <div #turnstileHost class="min-h-[65px]" aria-live="polite"></div>
              @if (showError('turnstileToken')) {
                <p class="font-inter text-xs text-red-600">Complete la verificación de seguridad.</p>
              }
              @if (turnstileSiteKeyMissing()) {
                <p class="font-inter text-xs text-amber-700">
                  Falta configurar la Site Key pública de Turnstile en <code>src/environments/environment.ts</code>.
                </p>
              }
            </div>

            @if (mensajeError()) {
              <div class="bg-red-50 border border-red-200 p-4 rounded-sm" role="alert">
                <p class="font-inter text-sm text-red-600 font-medium">{{ mensajeError() }}</p>
              </div>
            }

            <div class="border-t border-slate-200 pt-6 space-y-2">
              <p class="font-inter text-[10px] text-slate-500 leading-relaxed text-justify">
                * La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
              </p>
              <p class="font-inter text-[10px] text-slate-500 leading-relaxed text-justify">
                * El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.
              </p>
            </div>

            <div class="pt-4">
              <button type="submit"
                      [disabled]="enviando() || turnstileSiteKeyMissing()"
                      class="w-full md:w-auto px-10 py-4 bg-[#1E3E62] hover:bg-[#335092] text-white font-inter text-sm font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ enviando() ? 'Registrando reclamación…' : 'Enviar Hoja de Reclamación' }}
              </button>
            </div>

          </form>
        }
      </div>
    </section>
  `
})
export class LibroReclamacionesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('turnstileHost') turnstileHost?: ElementRef<HTMLDivElement>;

  private readonly fb = inject(FormBuilder);
  private readonly reclamacionesApi = inject(ReclamacionesApiService);

  reclamoForm: FormGroup;
  enviando = signal(false);
  mensajeError = signal('');
  submitted = signal(false);
  confirmacion = signal<{
    message: string;
    codigo: string;
    fecha: string;
    constanciaLabel: string;
  } | null>(null);

  private turnstileWidgetId: string | null = null;
  private turnstileRenderAttempts = 0;
  private idempotencyKey = crypto.randomUUID();

  constructor() {
    this.reclamoForm = this.fb.group({
      esMenor: [false, Validators.required],
      nombreApoderado: [''],
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      documento: ['', [Validators.required, Validators.maxLength(20)]],
      domicilio: ['', [Validators.required, Validators.maxLength(300)]],
      telefono: ['', [Validators.required, Validators.maxLength(30)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      tipoBien: ['Servicio', Validators.required],
      montoReclamado: [''],
      descripcionBien: ['', [Validators.required, Validators.maxLength(300)]],
      tipoReclamo: ['Reclamo', Validators.required],
      detalle: ['', [Validators.required, Validators.maxLength(4000)]],
      pedido: ['', [Validators.required, Validators.maxLength(4000)]],
      turnstileToken: ['', Validators.required],
    });
  }

  turnstileSiteKeyMissing(): boolean {
    return (
      !environment.turnstileSiteKey ||
      environment.turnstileSiteKey === 'REPLACE_WITH_TURNSTILE_SITE_KEY'
    );
  }

  showError(controlName: string): boolean {
    const control = this.reclamoForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  toggleApoderado() {
    const esMenor = this.reclamoForm.get('esMenor')?.value;
    const nombreApoderadoControl = this.reclamoForm.get('nombreApoderado');

    if (esMenor) {
      nombreApoderadoControl?.setValidators([Validators.required, Validators.maxLength(120)]);
    } else {
      nombreApoderadoControl?.clearValidators();
      nombreApoderadoControl?.setValue('');
    }

    nombreApoderadoControl?.updateValueAndValidity();
  }

  enviarReclamo() {
    this.submitted.set(true);
    this.mensajeError.set('');
    this.reclamoForm.markAllAsTouched();

    if (this.turnstileSiteKeyMissing()) {
      this.mensajeError.set(
        'La verificación de seguridad no está configurada. Contacte al administrador del sitio.',
      );
      return;
    }

    if (this.reclamoForm.invalid || this.enviando()) {
      return;
    }

    this.enviando.set(true);
    const raw = this.reclamoForm.getRawValue();
    const monto =
      raw.montoReclamado === null || raw.montoReclamado === undefined || raw.montoReclamado === ''
        ? ''
        : String(raw.montoReclamado);

    const payload = {
      esMenor: !!raw.esMenor,
      nombreApoderado: raw.esMenor ? String(raw.nombreApoderado ?? '').trim() : '',
      nombre: String(raw.nombre ?? '').trim(),
      documento: String(raw.documento ?? '').trim(),
      telefono: String(raw.telefono ?? '').trim(),
      domicilio: String(raw.domicilio ?? '').trim(),
      correo: String(raw.correo ?? '').trim(),
      tipoBien: raw.tipoBien as 'Servicio' | 'Producto',
      montoReclamado: monto,
      descripcionBien: String(raw.descripcionBien ?? '').trim(),
      tipoReclamo: raw.tipoReclamo as 'Reclamo' | 'Queja',
      detalle: String(raw.detalle ?? '').trim(),
      pedido: String(raw.pedido ?? '').trim(),
      turnstileToken: String(raw.turnstileToken ?? ''),
    };

    this.reclamacionesApi.enviar(payload, this.idempotencyKey).subscribe({
      next: (res) => {
        this.enviando.set(false);
        this.showConfirmacion(res);
      },
      error: (err: unknown) => {
        this.enviando.set(false);
        this.mensajeError.set(this.mapErrorMessage(err));
        this.resetTurnstile();
        this.idempotencyKey = crypto.randomUUID();
      },
    });
  }

  nuevaReclamacion() {
    this.confirmacion.set(null);
    this.resetFormAfterSuccess();
    setTimeout(() => this.scheduleTurnstileRender(), 50);
  }

  ngAfterViewInit() {
    this.scheduleTurnstileRender();
  }

  ngOnDestroy() {
    if (this.turnstileWidgetId && window.turnstile) {
      try {
        window.turnstile.remove(this.turnstileWidgetId);
      } catch {
        // ignore
      }
    }
  }

  private showConfirmacion(res: ReclamacionApiSuccess) {
    const mail = res.data?.mail;
    let constanciaLabel = 'Estado no disponible';
    if (mail?.constancia === 'sent') {
      constanciaLabel = 'Constancia enviada al correo declarado.';
    } else if (mail?.constancia === 'failed' || mail?.overall === 'mail_pending' || mail?.overall === 'partial') {
      constanciaLabel =
        'Registro exitoso. La notificación electrónica está pendiente o no pudo confirmarse.';
    } else if (mail?.constancia === 'pending') {
      constanciaLabel = 'Constancia pendiente de envío.';
    }

    this.confirmacion.set({
      message:
        res.message ||
        'Su reclamación fue registrada correctamente. Conserve su código de reclamación.',
      codigo: res.data.codigo,
      fecha: this.formatFecha(res.data.createdAt),
      constanciaLabel,
    });
    this.idempotencyKey = crypto.randomUUID();
  }

  private formatFecha(iso: string): string {
    try {
      return new Date(iso).toLocaleString('es-PE', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  private scheduleTurnstileRender() {
    if (this.turnstileSiteKeyMissing() || this.confirmacion()) {
      return;
    }

    const tryRender = () => {
      this.turnstileRenderAttempts += 1;
      if (!this.turnstileHost || !window.turnstile) {
        if (this.turnstileRenderAttempts < 40) {
          setTimeout(tryRender, 150);
        }
        return;
      }

      if (this.turnstileWidgetId) {
        try {
          window.turnstile.remove(this.turnstileWidgetId);
        } catch {
          // ignore
        }
        this.turnstileWidgetId = null;
      }

      this.turnstileWidgetId = window.turnstile.render(this.turnstileHost.nativeElement, {
        sitekey: environment.turnstileSiteKey,
        theme: 'light',
        callback: (token: string) => {
          this.reclamoForm.get('turnstileToken')?.setValue(token);
          this.reclamoForm.get('turnstileToken')?.markAsDirty();
        },
        'expired-callback': () => {
          this.reclamoForm.get('turnstileToken')?.setValue('');
        },
        'error-callback': () => {
          this.reclamoForm.get('turnstileToken')?.setValue('');
          this.mensajeError.set(
            'No pudimos cargar la verificación de seguridad. Recargue la página e intente nuevamente.',
          );
        },
      });
    };

    this.turnstileRenderAttempts = 0;
    setTimeout(tryRender, 100);
  }

  private resetTurnstile() {
    this.reclamoForm.get('turnstileToken')?.setValue('');
    if (this.turnstileWidgetId && window.turnstile) {
      window.turnstile.reset(this.turnstileWidgetId);
    }
  }

  private resetFormAfterSuccess() {
    this.reclamoForm.reset({
      esMenor: false,
      nombreApoderado: '',
      nombre: '',
      documento: '',
      domicilio: '',
      telefono: '',
      correo: '',
      tipoBien: 'Servicio',
      montoReclamado: '',
      descripcionBien: '',
      tipoReclamo: 'Reclamo',
      detalle: '',
      pedido: '',
      turnstileToken: '',
    });
    this.toggleApoderado();
    this.submitted.set(false);
    this.mensajeError.set('');
    this.idempotencyKey = crypto.randomUUID();
    this.resetTurnstile();
  }

  private mapErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const apiMessage = (err.error as { error?: { message?: string } } | null)?.error?.message;
      if (apiMessage) {
        return apiMessage;
      }
      if (err.status === 0) {
        return 'No hay conexión con el servidor. Verifique su red e intente nuevamente.';
      }
      if (err.status === 403) {
        return 'No pudimos verificar la solicitud. Complete nuevamente la verificación de seguridad.';
      }
      if (err.status === 409) {
        return 'Esta solicitud ya fue procesada con datos distintos. Recargue e intente nuevamente.';
      }
    }
    return 'Ocurrió un error al procesar el documento. Por favor, intente nuevamente.';
  }
}
