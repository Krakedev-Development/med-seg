import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Soluciones para empresas", href: "#empresas" },
  { label: "Servicios médicos", href: "#servicios-medicos" },
  { label: "Exámenes ocupacionales", href: "#examenes" },
  { label: "Seguridad industrial", href: "#seguridad-industrial" },
  { label: "Capacitaciones", href: "#capacitaciones" },
  { label: "Equipos de protección personal", href: "#epp" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 shadow-lg backdrop-blur" : "bg-white"
      )}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-4 lg:px-8 py-3">
        <a
          href="#inicio"
          className="flex items-center gap-3 text-brand-blue transition hover:opacity-90 whitespace-nowrap flex-shrink-0"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-blue/20 bg-white shadow-sm">
            <img
              src="/Imagen/Logo.jpg"
              alt="MEDI&SEG CIA LTDA"
              className="h-8 w-8 object-contain"
            />
          </span>
          <div className="hidden md:block">
            <p className="text-[10px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              MEDI&SEG
            </p>
            <p className="text-sm lg:text-base font-semibold text-brand-blue">
              Medicina y Seguridad Ocupacional
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-x-4 gap-y-2 lg:flex flex-wrap justify-center flex-1 px-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavigate(link.href)}
              className="text-xs xl:text-sm font-medium text-slate-600 transition hover:text-brand-blue whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block flex-shrink-0">
          <Button className="whitespace-nowrap px-6" onClick={() => {}}>Iniciar sesión</Button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-brand-blue hover:text-brand-blue lg:hidden flex-shrink-0 ml-auto"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white shadow-lg lg:hidden"
          >
            <div className="space-y-4 px-6 py-6">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className="block w-full text-left text-base font-medium text-slate-700"
                >
                  {link.label}
                </button>
              ))}
              <Button className="w-full" size="lg" onClick={() => {}}>
                Iniciar sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


