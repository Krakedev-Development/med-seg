import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  const handleScrollToServices = () => {
    const servicesSection = document.querySelector("#servicios");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-slate-900"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-square h-full w-full max-h-[90vh] max-w-[90vh] md:aspect-auto md:h-full md:w-full md:max-h-none md:max-w-none">
          <img
            className="h-full w-full object-contain md:object-cover"
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
            alt="Intervención médica o inspección"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-brand-blue/65 to-brand-teal/40" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
      >
        <motion.p
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-sm font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          MEDI&SEG CIA LTDA
        </motion.p>
        <motion.h1
          className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        >
          Seguridad, salud y cumplimiento conectados en un solo lugar.
        </motion.h1>
        <motion.p
          className="mt-6 text-lg text-slate-100 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
        >
          MEDI&SEG integra asesoría SST, medicina ocupacional, exámenes, capacitación presencial, seguimiento digital y equipos de protección personal para cuidar a los trabajadores y facilitar la gestión de las empresas.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
        >
          <Button size="lg" onClick={() => {}}>
            Solicitar diagnóstico empresarial
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-900" onClick={() => {}}>
            Conocer nuestros servicios
          </Button>
          <Button size="lg" variant="secondary" onClick={() => {}}>
            Ingresar a mi portal
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-900" onClick={() => {}}>
            Cotizar equipos de protección personal
          </Button>
          <Button size="lg" variant="secondary" className="bg-green-600 hover:bg-green-700 text-white border-none" onClick={() => {}}>
            Contactar por WhatsApp
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}


