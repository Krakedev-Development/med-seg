import { Button } from "@/components/ui/button";

const categorias = ["Protección de cabeza", "Protección visual", "Protección auditiva", "Protección respiratoria", "Protección de manos"];

const productos = [
  {
    id: 1,
    foto: "https://images.unsplash.com/photo-1585834898627-7cdbc8c918c5?auto=format&fit=crop&q=80",
    nombre: "Casco de Seguridad Tipo I",
    marca: "SegurMAX",
    caracteristicas: "Suspensión de 4 puntos, ajuste rachet.",
    riesgo: "Impactos superiores",
    normas: "ANSI Z89.1",
    tallas: "Estándar",
    disponibilidad: "En stock"
  },
  {
    id: 2,
    foto: "https://images.unsplash.com/photo-1599427303058-f04cb1a5e165?auto=format&fit=crop&q=80",
    nombre: "Gafas de Protección Anti-empañantes",
    marca: "VisioProtect",
    caracteristicas: "Lente de policarbonato, protección UV.",
    riesgo: "Partículas en suspensión",
    normas: "ANSI Z87.1+",
    tallas: "Única",
    disponibilidad: "En stock"
  },
  {
    id: 3,
    foto: "https://images.unsplash.com/photo-1596409575791-389f41df06d2?auto=format&fit=crop&q=80",
    nombre: "Guantes de Nitrilo Industrial",
    marca: "HandSafe",
    caracteristicas: "Alta resistencia a químicos y abrasión.",
    riesgo: "Químicos y cortes leves",
    normas: "EN 388, EN 374",
    tallas: "S, M, L, XL",
    disponibilidad: "Bajo pedido"
  },
  {
    id: 4,
    foto: "https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&q=80",
    nombre: "Mascarilla N95",
    marca: "RespirAir",
    caracteristicas: "Filtro de alta eficiencia.",
    riesgo: "Polvo y partículas finas",
    normas: "NIOSH N95",
    tallas: "Única",
    disponibilidad: "En stock"
  }
];

export function CatalogoEPP() {
  return (
    <section id="epp" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-blue">
            Catálogo
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Protección adecuada para cada riesgo
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Comercializamos equipos de protección personal certificados. Solicita tu cotización en línea.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categorias.map((cat, idx) => (
            <span key={idx} className="px-4 py-2 rounded-full bg-slate-100 text-sm font-medium text-slate-700 hover:bg-brand-blue hover:text-white cursor-pointer transition">
              {cat}
            </span>
          ))}
          <span className="px-4 py-2 rounded-full bg-slate-100 text-sm font-medium text-slate-700 hover:bg-brand-blue hover:text-white cursor-pointer transition">
            Ver todas
          </span>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((prod) => (
            <div key={prod.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img 
                  src={prod.foto} 
                  alt={prod.nombre} 
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-brand-blue backdrop-blur">
                  {prod.disponibilidad}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-slate-500 mb-1">{prod.marca}</p>
                <h3 className="font-semibold text-slate-900 line-clamp-2">{prod.nombre}</h3>
                
                <div className="mt-4 space-y-2 text-xs text-slate-600 flex-1">
                  <p><strong>Riesgo:</strong> {prod.riesgo}</p>
                  <p><strong>Normas:</strong> {prod.normas}</p>
                  <p><strong>Tallas:</strong> {prod.tallas}</p>
                </div>
                
                <div className="mt-6 flex flex-col gap-2">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => {}}>
                    Solicitar cotización
                  </Button>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white border-none" onClick={() => {}}>
                    Consultar por WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
