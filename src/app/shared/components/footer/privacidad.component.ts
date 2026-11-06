import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY_INFO } from '../../legal/company-info';
import { AnalyticsConsentService } from '../../service/analytics-consent.service';

@Component({
  selector: 'app-privacidad',
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
            Políticas de Privacidad.
          </h1>
          <p class="font-inter text-slate-500 text-sm tracking-widest uppercase">Última actualización: Noviembre 2026</p>
          <p class="font-inter text-slate-500 text-xs mt-3 leading-relaxed">
            Borrador sujeto a validación del cliente o asesor jurídico. La publicación de este texto no constituye por sí sola una declaración de cumplimiento legal completo.
          </p>
        </div>

        <div class="font-inter text-slate-600 font-light leading-relaxed space-y-10">

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de los datos personales es
              <strong>{{ company.razonSocial }}</strong>, con RUC {{ company.ruc }},
              domicilio en {{ company.domicilio }}, teléfono {{ company.telefono }}.
            </p>
            <p class="mt-3">
              Canal para ejercer derechos sobre datos personales:
              <a href="mailto:reclamos@entornosfuncionales.com" class="text-[#5C968D] hover:underline font-medium">reclamos&#64;entornosfuncionales.com</a>.
              La gestión corresponde al {{ company.areaAdministrativa }}.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">2. Marco normativo</h2>
            <p>
              El tratamiento se realiza de conformidad con la Ley N.º 29733, Ley de Protección de Datos Personales,
              y su Reglamento aprobado por el Decreto Supremo N.º 016-2024-JUS, así como con las demás normas peruanas aplicables.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">3. Finalidades del tratamiento</h2>

            <h3 class="font-jakarta text-base font-medium text-[#101827] mt-4 mb-2">3.1 Formulario de contacto</h3>
            <p>
              Los datos proporcionados (nombre, empresa, correo, teléfono, partida, ubicación y descripción del requerimiento)
              se utilizan para atender consultas, coordinar comunicaciones y preparar cotizaciones.
              Se procesan mediante Cloudflare Pages Functions y Resend, y llegan al buzón corporativo
              {{ company.correoCotizaciones }} (Zoho Mail). Estos datos no se almacenan en Cloudflare D1.
            </p>

            <h3 class="font-jakarta text-base font-medium text-[#101827] mt-4 mb-2">3.2 Libro de Reclamaciones</h3>
            <p>
              Los datos del consumidor y, cuando corresponda, de su padre, madre o representante, se utilizan para registrar
              reclamos o quejas, cumplir las obligaciones de atención previstas en la normativa de protección al consumidor,
              enviar la constancia electrónica y conservar evidencias del registro.
              Se almacenan en Cloudflare D1 y se transmiten mediante Resend a
              {{ company.correoReclamosArco }} y al correo declarado por el consumidor.
            </p>

            <h3 class="font-jakarta text-base font-medium text-[#101827] mt-4 mb-2">3.3 Seguridad</h3>
            <p>
              Utilizamos Cloudflare Turnstile y validaciones en el servidor para proteger los formularios frente a envíos abusivos o automatizados.
              Turnstile opera con independencia de la preferencia de analítica.
            </p>

            <h3 class="font-jakarta text-base font-medium text-[#101827] mt-4 mb-2">3.4 Analítica</h3>
            <p>
              Si usted acepta expresamente, utilizamos Cloudflare Web Analytics para medir el uso del sitio de forma agregada
              y mejorar la experiencia técnica. Sin aceptación, no cargamos este medidor desde la aplicación.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">4. Proveedores y transferencias</h2>
            <p>
              Para operar el sitio intervienen proveedores tecnológicos necesarios, entre ellos Cloudflare (hosting, Functions, D1, Turnstile y, en su caso, Web Analytics),
              Resend (envío transaccional de correos) y Zoho Mail (buzones corporativos).
              Estos proveedores actúan como encargados o destinatarios según el servicio prestado.
            </p>
            <p class="mt-3">
              Parte del tratamiento puede realizarse fuera del territorio peruano a través de infraestructura cloud.
              No afirmamos que los datos se almacenen exclusivamente en el Perú.
              No vendemos datos personales ni los compartimos con fines publicitarios de terceros.
            </p>
            <p class="mt-3">
              La calificación jurídica precisa de cada relación (encargado, destinatario o transferencia internacional)
              y las bases legales aplicables deberán validarse con asesoría jurídica antes de considerar el texto definitivo.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">5. Conservación</h2>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Reclamaciones:</strong> política operativa de conservación mínima de dos (2) años,
                sin perjuicio de obligaciones legales superiores, controversias pendientes u otras causas justificadas.
              </li>
              <li>
                <strong>Consultas de contacto:</strong> política operativa de conservación de doce (12) meses,
                salvo relación contractual u otra justificación legítima para conservarlas por más tiempo.
              </li>
            </ul>
            <p class="mt-3">
              La revisión y eliminación se realizan de forma manual por el {{ company.areaAdministrativa }}.
              No existe un procedimiento automático de borrado en el sistema.
              Estos plazos constituyen una política operativa sujeta a validación jurídica.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">6. Derechos de los titulares</h2>
            <p>
              Los titulares pueden ejercer los derechos de acceso, rectificación, cancelación, oposición y demás derechos
              reconocidos por la normativa peruana vigente, dirigiendo una solicitud a
              <a href="mailto:reclamos@entornosfuncionales.com" class="text-[#5C968D] hover:underline font-medium">reclamos&#64;entornosfuncionales.com</a>,
              gestionada por el {{ company.areaAdministrativa }}.
            </p>
            <p class="mt-3">
              Este canal también recibe reclamaciones de consumo del Libro de Reclamaciones.
              Al escribir, indique si su solicitud corresponde a una reclamación de consumo o al ejercicio de derechos sobre datos personales,
              e incluya datos suficientes para identificarlo y atender su pedido.
              Los plazos y requisitos de respuesta se regirán por la normativa aplicable vigente.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">7. Cookies y tecnologías similares</h2>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Preferencia de analítica:</strong> utilizamos <code>localStorage</code> (<code>ef_analytics_consent</code>)
                para recordar si aceptó o rechazó Cloudflare Web Analytics. No guarda datos de identificación personal.
              </li>
              <li>
                <strong>Cloudflare Web Analytics:</strong> medición agregada del tráfico, cargada solo tras aceptación expresa.
              </li>
              <li>
                <strong>Cloudflare Turnstile:</strong> verificación de seguridad en formularios; no depende del consentimiento de analítica.
              </li>
            </ul>
            <p class="mt-3">
              No todas las tecnologías de medición utilizan cookies tradicionales. Distinguimos almacenamiento local, scripts de medición y controles de seguridad.
              No empleamos cookies publicitarias de terceros en este sitio, según el inventario técnico actual.
            </p>
            <p class="mt-3">
              Puede modificar su preferencia en cualquier momento:
              <button type="button"
                      (click)="abrirPreferencias()"
                      class="text-[#5C968D] hover:underline font-medium">
                gestionar preferencias de analítica
              </button>.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">8. Medidas de seguridad</h2>
            <p>
              Aplicamos medidas técnicas y organizativas razonables, entre ellas transmisión HTTPS, validaciones en el backend,
              Cloudflare Turnstile en formularios y restricción de acceso a credenciales del servidor.
              Ningún sistema es absolutamente seguro; no afirmamos certificaciones que no hayan sido verificadas.
            </p>
          </div>

          <div>
            <h2 class="font-jakarta text-xl font-medium text-[#101827] mb-4">9. Actualizaciones</h2>
            <p>
              Esta política puede actualizarse para reflejar cambios operativos o normativos.
              La versión vigente se publicará en esta página con su fecha de actualización.
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
export class PrivacidadComponent {
  readonly company = COMPANY_INFO;
  private readonly analytics = inject(AnalyticsConsentService);

  abrirPreferencias(): void {
    this.analytics.openPreferences();
  }
}
