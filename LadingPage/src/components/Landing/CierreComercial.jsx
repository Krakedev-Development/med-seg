import { Button } from "@/components/ui/button";

export function CierreComercial() {
  return (
    <section className="py-24 bg-brand-blue text-white text-center">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
          Transforme la seguridad y salud de su empresa con el respaldo profesional y tecnológico de MEDI&SEG
        </h2>
        <p className="text-xl text-blue-100 mb-10 leading-relaxed">
          MEDI&SEG combina profesionales especializados, atención presencial y tecnología para convertir la seguridad y salud en una gestión visible, medible y cercana al trabajador.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-brand-blue hover:bg-slate-100" onClick={() => {}}>
            Solicitar demostración
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => {}}>
            Cotizar servicios
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => {}}>
            Cotizar EPP
          </Button>
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white border-none" onClick={() => {}}>
            Escribir por WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
