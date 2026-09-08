import { CheckCircle2, MessageSquareText } from "lucide-react";

const examenes = [
  "Laboratorio clínico",
  "Audiometrías",
  "Espirometrías",
  "Radiografías de tórax y columna lumbar",
  "Rayos X portátiles",
  "Pruebas de alcohol y drogas",
  "Evaluaciones médicas ocupacionales",
  "Nutrición",
  "Rehabilitación física",
  "Odontología",
  "Otros servicios complementarios"
];

export function ExamenesOcupacionales() {
  return (
    <section id="examenes" className="py-20 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Exámenes Ocupacionales y Diagnóstico
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Contamos con tecnología de punta y profesionales capacitados para realizar evaluaciones completas y precisas.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {examenes.map((examen, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-teal flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-200">{examen}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-10 rounded-2xl bg-white/10 p-6 backdrop-blur flex items-start gap-4">
              <MessageSquareText className="h-8 w-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Resultados en tu bolsillo</h4>
                <p className="mt-1 text-sm text-slate-300">
                  El trabajador recibirá una notificación por WhatsApp y podrá consultar de forma segura sus resultados autorizados directamente desde su portal.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80" 
              alt="Laboratorio Médico" 
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
