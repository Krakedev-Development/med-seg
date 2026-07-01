// Plantillas de documentos disponibles para vincular a capacitaciones
// Subset de los repositorioTemplates de FormulariosDinamicosEmpresa

export const plantillasCapacitacion = [
  // INDUCCIONES
  { id: 'induccion-cocina', nombre: 'Inducción para Personal de Cocina', icono: '🍳', categoria: 'Inducciones', actividadRecomendada: 'Avícola / Alimentos' },
  { id: 'induccion-mineria', nombre: 'Inducción para Personal de Minería Interior y Exterior', icono: '🧗', categoria: 'Inducciones', actividadRecomendada: 'Minería' },
  { id: 'induccion-avicola', nombre: 'Inducción de Seguridad para Sector Avícola', icono: '🐔', categoria: 'Inducciones', actividadRecomendada: 'Avícola' },
  { id: 'induccion-conductores', nombre: 'Inducción para Conductores y Choferes', icono: '🚚', categoria: 'Inducciones', actividadRecomendada: 'Transporte' },
  { id: 'reinduccion-sso', nombre: 'Reinducción General en Seguridad y Salud Ocupacional', icono: '🔄', categoria: 'Inducciones', actividadRecomendada: 'General' },

  // COMITÉ PARITARIO
  { id: 'comite-acta', nombre: 'Acta de Reunión de Comité Paritario', icono: '📋', categoria: 'Comité Paritario', actividadRecomendada: 'General' },
  { id: 'comite-cert-trabajador', nombre: 'Certificado de Designación de Miembro de Comité', icono: '🎖️', categoria: 'Comité Paritario', actividadRecomendada: 'General' },

  // EPP / FIRMAS
  { id: 'registro-entrada-salida', nombre: 'Control Diario de Asistencia del Personal', icono: '⏰', categoria: 'EPP / Firmas', actividadRecomendada: 'General' },
  { id: 'epp-entrega', nombre: 'Registro de Entrega de Equipos de Protección', icono: '🦺', categoria: 'EPP / Firmas', actividadRecomendada: 'General' },
  { id: 'firmas-registro', nombre: 'Registro de Firmas de Charla de Seguridad', icono: '✍️', categoria: 'EPP / Firmas', actividadRecomendada: 'General' },

  // MANTENIMIENTO
  { id: 'maint-avicola-compresor', nombre: 'Mantenimiento de Compresores y Sopladores', icono: '⚙️', categoria: 'Mantenimiento', actividadRecomendada: 'Avícola' },
  { id: 'maint-minas-cargadora', nombre: 'Mantenimiento de Cargadora de Bajo Perfil (Scooptram)', icono: '🚜', categoria: 'Mantenimiento', actividadRecomendada: 'Minería' },
  { id: 'maint-minas-polvorin', nombre: 'Inspección y Mantenimiento de Polvorín', icono: '💣', categoria: 'Mantenimiento', actividadRecomendada: 'Minería' },
  { id: 'maint-plantas-falcon', nombre: 'Mantenimiento de Concentrador Centrífugo Falcón', icono: '🌀', categoria: 'Mantenimiento', actividadRecomendada: 'Minería' },

  // ALTO RIESGO
  { id: 'risk-alturas', nombre: 'Permiso de Trabajo en Alturas', icono: '🧗', categoria: 'Alto Riesgo', actividadRecomendada: 'General' },
  { id: 'risk-confinados', nombre: 'Permiso de Entrada a Espacios Confinados', icono: '🕳️', categoria: 'Alto Riesgo', actividadRecomendada: 'General' },
  { id: 'risk-caliente', nombre: 'Permiso de Trabajo en Caliente', icono: '🔥', categoria: 'Alto Riesgo', actividadRecomendada: 'General' },

  // INSPECCIONES / OTROS
  { id: 'insp-botiquin', nombre: 'Inspección Periódica de Botiquines', icono: '🩹', categoria: 'Inspecciones / Otros', actividadRecomendada: 'General' },
  { id: 'insp-extintores', nombre: 'Inspección Mensual de Extintores', icono: '🧯', categoria: 'Inspecciones / Otros', actividadRecomendada: 'General' },
  { id: 'checklist-sso-general', nombre: 'Checklist General de Gestión SSO', icono: '✅', categoria: 'Inspecciones / Otros', actividadRecomendada: 'General' },
  { id: 'ficha-medica-general', nombre: 'Ficha Médica Ocupacional - Evaluación Inicial', icono: '🩺', categoria: 'Inspecciones / Otros', actividadRecomendada: 'General' },
];

// Mapeo rápido id → objeto completo
export const plantillaMap = Object.fromEntries(
  plantillasCapacitacion.map(p => [p.id, p])
);

// Filtrar plantillas: solo categoría EPP / Firmas (asistencia, entrega EPP, firmas)
export const filtrarPlantillasPorActividad = () => {
  return plantillasCapacitacion.filter(p => p.categoria === 'EPP / Firmas');
};
