import { CheckCircle2, PlayCircle } from "lucide-react";

const beneficiosDigitales = [
  "Registrar asistencia",
  "Cargar registros de firmas",
  "Incorporar certificados al expediente",
  "Enviar convocatorias y recordatorios",
  "Presentar microvideos",
  "Reforzar contenidos",
  "Realizar evaluaciones cortas",
  "Registrar cumplimiento",
  "Programar inducciones y reinducciones"
];

export function Capacitaciones() {
  return (
    <section id="capacitaciones" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl">
            Capacitaciones Prácticas y Presenciales
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Nuestras capacitaciones continúan siendo principalmente presenciales, prácticas y adaptadas a los riesgos reales de cada empresa.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80" 
              alt="Capacitación presencial" 
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              El complemento digital perfecto
            </h3>
            <p className="mt-4 text-slate-600">
              La plataforma no reemplaza el trabajo presencial, sino que lo potencia. Los microvideos sirven de refuerzo para recordar procedimientos y uso de EPP, accesibles desde cualquier celular.
            </p>
            
            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {beneficiosDigitales.map((beneficio, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-blue flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{beneficio}</span>
                </div>
              ))}
            </dl>

            <div className="mt-8 rounded-xl bg-brand-light/30 border border-brand-blue/10 p-4 flex items-center gap-4">
              <PlayCircle className="h-10 w-10 text-brand-blue flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Microvideos de refuerzo</p>
                <p className="text-sm text-slate-600">Videos de 1 a 3 minutos con subtítulos y bajo consumo de datos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
