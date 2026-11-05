import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="w-full bg-white pt-[120px] pb-24 md:pt-[160px] md:pb-32">
      <div class="max-w-4xl mx-auto px-5 md:px-6">

        <!-- Header de la página -->
        <div class="mb-16 md:mb-24">
          <div class="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-slate-200 bg-[#F8FAFC] rounded-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-[#5C968D]"></div>
            <span class="font-inter text-[#101827] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Documento Legal</span>
          </div>
          <h1 class="font-inter text-[36px] md:text-[56px] font-medium leading-[1.1] tracking-tighter text-[#101827] mb-6">
            Políticas de Privacidad.
          </h1>
          <p class="font-inter text-slate-500 text-sm tracking-widest uppercase">Última actualización: Octubre 2026</p>
        </div>

        <!-- Contenido Legal -->
        <div class="font-inter text-slate-600 font-light leading-relaxed space-y-10">

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">1. Marco Legal y Compromiso</h2>
            <p>
              De conformidad con la Ley N° 29733, Ley de Protección de Datos Personales en el Perú, y su Reglamento, el Decreto Supremo N° 003-2013-JUS, <strong>Entornos Funcionales - Reconstrucción & Acabados</strong> asegura la estricta confidencialidad y protección de los datos personales proporcionados por nuestros clientes, proveedores y usuarios a través de esta plataforma digital.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">2. Finalidad del Tratamiento de Datos</h2>
            <p>Los datos solicitados en nuestros formularios (nombre, correo electrónico, número telefónico y empresa) serán utilizados exclusivamente para:</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li>Evaluar requerimientos técnicos y estructurar propuestas o cotizaciones formales.</li>
              <li>Establecer comunicación directa referente a los proyectos de ingeniería y acabados solicitados.</li>
              <li>Envío de información corporativa estrictamente vinculada a nuestros servicios.</li>
            </ul>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">3. Derechos ARCO</h2>
            <p>
              El usuario tiene total potestad para ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) en cualquier momento. Para ello, puede dirigir una solicitud formal al correo electrónico:
              <a href="mailto:reclamos@entornosfuncionales.com" class="text-[#5C968D] hover:underline font-medium">reclamos&#64;entornosfuncionales.com</a>.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">4. Seguridad y Confidencialidad</h2>
            <p>
              Implementamos rigurosos estándares técnicos y organizativos para evitar la pérdida, alteración o acceso no autorizado a su información. Sus datos no serán comercializados, cedidos ni compartidos con terceros ajenos a la ejecución operativa de Entornos Funcionales sin su consentimiento expreso.
            </p>
          </div>

        </div>

        <!-- Botón de retorno -->
        <div class="mt-16 pt-8 border-t border-slate-200">
          <a routerLink="/" class="inline-flex items-center gap-2 font-jakarta font-bold text-[11px] text-[#101827] hover:text-[#5C968D] uppercase tracking-[0.15em] transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform rotate-180"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            Volver al inicio
          </a>
        </div>

      </div>
    </section>
  `
})
export class PrivacidadComponent {}
