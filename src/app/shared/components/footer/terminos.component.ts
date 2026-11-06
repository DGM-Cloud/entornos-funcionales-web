import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY_INFO } from '../../legal/company-info';

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="w-full bg-white pt-[120px] pb-24 md:pt-[160px] md:pb-32">
      <div class="max-w-4xl mx-auto px-5 md:px-6">

        <div class="mb-16 md:mb-24">
          <div class="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-slate-200 bg-[#F8FAFC] rounded-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-[#5C968D]"></div>
            <span class="font-inter text-[#101827] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Documento Legal</span>
          </div>
          <h1 class="font-inter text-[36px] md:text-[56px] font-medium leading-[1.1] tracking-tighter text-[#101827] mb-6">
            Términos y Condiciones.
          </h1>
          <p class="font-inter text-slate-500 text-sm tracking-widest uppercase">Última actualización: Noviembre 2026</p>
        </div>

        <div class="font-inter text-slate-600 font-light leading-relaxed space-y-10">

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">1. Titular del sitio</h2>
            <p>
              Este sitio web es operado por <strong>{{ company.razonSocial }}</strong>, RUC {{ company.ruc }},
              con domicilio en {{ company.domicilio }}.
              Contacto: {{ company.telefono }} ·
              <a href="mailto:cotizaciones@entornosfuncionales.com" class="text-[#5C968D] hover:underline">cotizaciones&#64;entornosfuncionales.com</a>.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">2. Naturaleza de la plataforma</h2>
            <p>
              El sitio tiene carácter institucional e informativo sobre servicios de ingeniería, remodelación y acabados arquitectónicos.
              La información publicada es referencial y no constituye, por sí sola, una oferta comercial vinculante ni un contrato de obra.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">3. Solicitudes de cotización</h2>
            <p>
              Las solicitudes enviadas mediante el formulario de contacto permiten iniciar una evaluación técnica y comercial.
              Todo servicio requerirá, cuando corresponda, evaluación documentada o presencial y la formalización mediante cotización y/o contrato
              que regirá los términos definitivos de ejecución.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">4. Uso adecuado del sitio</h2>
            <p>
              El usuario se compromete a utilizar el sitio de manera lícita, sin alterar su funcionamiento, sin intentar accesos no autorizados
              y sin emplear los formularios para envíos abusivos, fraudulentos o ajenos a su finalidad.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">5. Propiedad intelectual</h2>
            <p>
              Los contenidos del sitio (diseño, textos, fotografías de proyectos, logotipos y demás elementos protegibles)
              son de titularidad de {{ company.razonSocial }} o se utilizan con autorización.
              Queda prohibida su reproducción, distribución o modificación sin autorización previa por escrito,
              sin perjuicio de los usos permitidos por la ley.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">6. Privacidad y Libro de Reclamaciones</h2>
            <p>
              El tratamiento de datos personales se rige por la
              <a routerLink="/privacidad" class="text-[#5C968D] hover:underline font-medium">Política de Privacidad</a>.
              Los consumidores pueden registrar reclamos o quejas en el
              <a routerLink="/libro-reclamaciones" class="text-[#5C968D] hover:underline font-medium">Libro de Reclamaciones</a>
              virtual, sin perjuicio de otras vías legales disponibles.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">7. Enlaces externos</h2>
            <p>
              El sitio puede contener enlaces a recursos de terceros. {{ company.razonSocial }} no controla esos contenidos
              ni asume responsabilidad por ellos.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">8. Limitación de responsabilidad</h2>
            <p>
              En la medida permitida por la ley, la información del sitio se ofrece con fines informativos.
              Nada en estos términos limita los derechos irrenunciables de los consumidores reconocidos por la normativa peruana,
              ni excluye responsabilidades que no puedan limitarse legalmente.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">9. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República del Perú.
              Sin perjuicio de las vías administrativas ante el INDECOPI u otras autoridades competentes,
              las controversias derivadas del uso del sitio podrán someterse a los jueces y tribunales del Distrito Judicial de Lima,
              cuando corresponda conforme a derecho.
            </p>
          </div>

        </div>

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
export class TerminosComponent {
  readonly company = COMPANY_INFO;
}
