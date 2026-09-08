import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const beneficios = [
  "Cumplimiento del Reglamento SISAT y del Anexo 1",
  "Documentación organizada por empresa",
  "Auditoría digital",
  "Alertas de vencimiento",
  "Seguimiento de acciones correctivas",
  "Vigilancia de la salud",
  "Resultados e indicadores",
  "Capacitaciones y registros",
  "Control de EPP",
  "Acceso a informes ejecutivos",
];

export function SeccionEmpresas() {
  return (
    <section id="empresas" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
              Soluciones para Empresas
            </h2>
            <p className="mt-4 text-lg font-medium text-slate-700">
              Controle su gestión SST, documentos, exámenes, capacitaciones, auditorías, vencimientos y acciones correctivas desde un solo lugar.
            </p>
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {beneficios.map((beneficio, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-brand-teal flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-600">{beneficio}</span>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => {}}>Solicitar una demostración</Button>
              <Button size="lg" variant="outline" onClick={() => {}}>Solicitar diagnóstico SST</Button>
              <Button size="lg" variant="secondary" onClick={() => {}}>Cotizar nuestros servicios</Button>
            </div>
          </div>
          <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80"
              alt="Plataforma empresarial"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
