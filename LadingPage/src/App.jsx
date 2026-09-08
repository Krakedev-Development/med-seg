import { Navbar } from "@/components/Landing/Navbar";
import { HeroSection } from "@/components/Landing/HeroSection";
import { MisionVisionValores } from "@/components/Landing/MisionVisionValores";
import { SeccionEmpresas } from "@/components/Landing/SeccionEmpresas";
import { SeccionTrabajadores } from "@/components/Landing/SeccionTrabajadores";
import { ServiciosIntegrales } from "@/components/Landing/ServiciosIntegrales";
import { ExamenesOcupacionales } from "@/components/Landing/ExamenesOcupacionales";
import { Capacitaciones } from "@/components/Landing/Capacitaciones";
import { CatalogoEPP } from "@/components/Landing/CatalogoEPP";
import { Experiencia } from "@/components/Landing/Experiencia";
import { Contacto } from "@/components/Landing/Contacto";
import { CierreComercial } from "@/components/Landing/CierreComercial";
import { Footer } from "@/components/Landing/Footer";

function App() {
  return (
    <div className="bg-white">
      <Navbar />
      <main className="flex flex-col pt-24">
        <HeroSection />
        <SeccionEmpresas />
        <SeccionTrabajadores />
        <ServiciosIntegrales />
        <ExamenesOcupacionales />
        <Capacitaciones />
        <CatalogoEPP />
        <MisionVisionValores />
        <Experiencia />
        <Contacto />
        <CierreComercial />
      </main>
      <Footer />
    </div>
  );
}

export default App;
