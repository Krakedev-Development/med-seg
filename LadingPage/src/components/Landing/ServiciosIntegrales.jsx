import { ShieldCheck, Stethoscope, Activity, HeartHandshake, Users, BookOpen, HardHat, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const servicios = [
  { icon: ShieldCheck, title: "Seguridad industrial", desc: "Prevención de riesgos laborales y cumplimiento normativo." },
  { icon: Stethoscope, title: "Medicina ocupacional", desc: "Cuidado integral de la salud del trabajador en su entorno." },
  { icon: Activity, title: "Exámenes y diagnóstico", desc: "Evaluaciones médicas pre-empleo, periódicas y de retiro." },
  { icon: HeartHandshake, title: "Riesgos psicosociales", desc: "Evaluación y prevención del estrés y clima laboral." },
  { icon: Users, title: "Trabajo social y talento humano", desc: "Acompañamiento y bienestar para los colaboradores." },
  { icon: BookOpen, title: "Capacitaciones", desc: "Formación práctica y digital en seguridad y salud." },
  { icon: HardHat, title: "Equipos de protección personal", desc: "Provisión de EPP certificado para cada tipo de riesgo." },
  { icon: FileCheck, title: "Gestión documental y auditoría", desc: "Organización y validación de expedientes SST." }
];

const fadeInProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export function ServiciosIntegrales() {
  return (
    <section id="servicios-medicos" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div className="text-center" {...fadeInProps}>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-blue">
            Nuestros Servicios
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 lg:text-4xl">
            Soluciones Integrales en SST
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
            Cubrimos todas las áreas de la seguridad y salud ocupacional para brindar un servicio completo a tu empresa.
          </p>
        </motion.div>
        
        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          {...fadeInProps}
          transition={{ delay: 0.1 }}
        >
          {servicios.map((servicio, idx) => {
            const Icon = servicio.icon;
            return (
              <div key={idx} className="group flex flex-col rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{servicio.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{servicio.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
