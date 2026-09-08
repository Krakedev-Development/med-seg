import { CheckCircle2 } from "lucide-react";

const beneficiosTrabajador = [
  "Consultar resultados autorizados",
  "Descargar certificados",
  "Revisar recomendaciones ocupacionales",
  "Consultar próximas citas",
  "Ver capacitaciones realizadas",
  "Completar contenidos complementarios",
  "Ver documentos ya socializados",
  "Consultar EPP entregado",
  "Reportar condiciones inseguras",
  "Solicitar ayuda",
];

export function SeccionTrabajadores() {
  return (
    <section id="trabajadores" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="order-2 lg:order-1 relative aspect-video lg:aspect-square overflow-hidden rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80"
              alt="Trabajador usando la plataforma"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
              Portal del Trabajador
            </h2>
            <p className="mt-4 text-lg font-medium text-slate-700">
              Tu seguridad, salud y formación también están en tus manos. MEDI&SEG te ofrece acompañamiento, información y acceso seguro.
            </p>
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {beneficiosTrabajador.map((beneficio, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-brand-blue flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-600">{beneficio}</span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
