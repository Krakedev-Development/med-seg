# Propuesta de Fases Futuras (Post-Refactorización Atomic Design)

Este documento contiene sugerencias de próximas fases a abordar una vez que el proyecto haya sido migrado a su entorno de desarrollo definitivo. El objetivo de estas fases es elevar la madurez técnica, rendimiento y preparación del sistema para producción, tras haber concluido exitosamente las Fases 1 a 10 de refactorización visual e integración de *Atomic Design*.

---

## Fase 11: Accesibilidad y Responsividad Avanzada (Mobile First)
El objetivo de esta fase es garantizar que el software sea utilizable en múltiples dispositivos y amigable con estándares de accesibilidad (a11y).
- [ ] **Auditoría Móvil:** Revisar que todos los componentes y vistas complejas (como la matriz de empleados, tablas de datos y los layouts del Anexo 1) se adapten perfectamente a pantallas de dispositivos móviles y tablets.
- [ ] **Accesibilidad (a11y):** Asegurar buenas prácticas de accesibilidad, incluyendo el correcto uso de atributos `aria-*`, labels descriptivos para lectores de pantalla y navegación estructurada por teclado (focus management).
- [ ] **Dark Mode / Temas:** (Opcional) Preparar la infraestructura de Tailwind CSS para soportar paletas dinámicas si el negocio lo requiere.

## Fase 12: Optimización de Rendimiento y Código Limpio
El objetivo de esta fase es limpiar deuda técnica y mejorar el desempeño de la aplicación en el navegador.
- [ ] **Memorización (Memoization):** Implementar `React.memo`, `useCallback` y `useMemo` en tablas y formularios de alta interacción para evitar renders innecesarios.
- [ ] **Code Splitting:** Configurar *lazy loading* (`React.lazy`) en las rutas principales del administrador para reducir el tamaño del bundle inicial.
- [ ] **Limpieza del Proyecto:** Identificar y eliminar importaciones no utilizadas, estilos obsoletos y archivos residuales antiguos que ya no se utilizan en el proyecto.
- [ ] **Testing:** Escribir pruebas unitarias iniciales (ej. con Jest/Vitest y React Testing Library) para utilidades críticas y componentes atómicos clave.

## Fase 13: Transición a Estado Global y API Real
El objetivo de esta fase es desacoplar el proyecto de los datos de prueba locales (mocks) y prepararlo para consumo de servicios backend.
- [ ] **Infraestructura de Estado Global:** Configurar una herramienta de manejo de estado (como `Zustand` o `Redux Toolkit`) para gestionar la sesión, configuraciones del usuario y datos transversales.
- [ ] **Manejo de Peticiones (Data Fetching):** Integrar `React Query` (@tanstack/react-query) o `SWR` para el manejo del caché, reintentos y estados asíncronos (cargando, errores).
- [ ] **Migración de Servicios:** Reemplazar progresivamente los archivos en `src/data/` (mocks) por llamadas a una API REST / GraphQL real utilizando una instancia de `Axios` o `fetch` con interceptores de autenticación.
