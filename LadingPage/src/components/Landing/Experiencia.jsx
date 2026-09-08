import { CheckCircle, Users, MapPin, Building2, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";

const indicadores = [
  { icon: Building2, valor: "150+", label: "Empresas asesoradas" },
  { icon: Users, valor: "12,000+", label: "Trabajadores atendidos" },
  { icon: TrendingUp, valor: "8,500+", label: "Capacitaciones ejecutadas" },
  { icon: MapPin, valor: "Nacional", label: "Cobertura geográfica" }
];

const testimonios = [
  {
    texto: "La plataforma y el acompañamiento presencial nos permitió organizar finalmente todos nuestros expedientes médicos de manera segura y cumplir con el Ministerio de Trabajo.",
    autor: "Gerente de Recursos Humanos",
    empresa: "Sector Industrial"
  },
  {
    texto: "Desde que implementamos los programas de capacitación y la dotación de EPP con MEDI&SEG, nuestros índices de accidentabilidad se redujeron notablemente.",
    autor: "Jefe de Seguridad Ocupacional",
    empresa: "Sector Construcción"
  }
];

export function Experiencia() {
  return (
    <section id="nosotros" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-blue">
            Confianza y Trayectoria
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Respaldo profesional y tecnológico
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Contamos con un equipo multidisciplinario experto en diferentes sectores industriales, mineros y de servicios.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {indicadores.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div key={idx} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <Icon className="h-10 w-10 text-brand-blue mb-4" />
                <p className="text-3xl font-bold text-slate-900">{ind.valor}</p>
                <p className="mt-1 text-sm text-slate-600">{ind.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid gap-6">
            {testimonios.map((testimonio, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-1 mb-4 text-amber-400">
                  <Star fill="currentColor" className="w-5 h-5" />
                  <Star fill="currentColor" className="w-5 h-5" />
                  <Star fill="currentColor" className="w-5 h-5" />
                  <Star fill="currentColor" className="w-5 h-5" />
                  <Star fill="currentColor" className="w-5 h-5" />
                </div>
                <p className="text-slate-700 italic mb-6">"{testimonio.texto}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonio.autor}</p>
                  <p className="text-sm text-slate-500">{testimonio.empresa}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
              alt="Equipo profesional MEDI&SEG" 
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
