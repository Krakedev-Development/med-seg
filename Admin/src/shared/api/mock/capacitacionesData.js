// Datos simulados de capacitaciones
export let capacitaciones = [
  {
    id: 1,
    nombre: 'Seguridad en Minería Subterránea',
    descripcion: 'Capacitación sobre protocolos de seguridad en trabajos mineros subterráneos',
    fechaProgramada: '2025-01-15',
    actividadRelacionada: 'Minería',
    estado: 'Finalizada',
    empresasAsignadas: [1],
    fechaCreacion: '2025-01-05',
    anexo1ItemId: null,
    anexo1Id: null,
    empresaId: 1,
    trabajadoresAsignados: [1, 5, 7, 8],
    responsable: 7,
    modalidad: 'presencial',
    hora: '09:00',
    plantillaId: null,
    capacitadores: 'Ing. Roberto Fernández',
  },
  {
    id: 2,
    nombre: 'Uso Correcto de EPP en Zona Minera',
    descripcion: 'Capacitación sobre el uso, cuidado y renovación del equipo de protección personal en áreas de riesgo',
    fechaProgramada: '2025-02-10',
    actividadRelacionada: 'Minería',
    estado: 'En curso',
    empresasAsignadas: [1],
    fechaCreacion: '2025-01-20',
    anexo1ItemId: null,
    anexo1Id: null,
    empresaId: 1,
    trabajadoresAsignados: [7, 8, 9, 10],
    responsable: 8,
    modalidad: 'presencial',
    hora: '10:00',
    plantillaId: null,
    capacitadores: 'Téc. Lucía Morales',
  },
];

export const actividadesDisponibles = [
  'Minería',
  'Agricultura',
  'Avicultura',
  'Pesca',
  'Manufactura',
  'Construcción',
  'Transporte',
  'Salud',
  'Alimentación',
  'Otros',
];

export const estadosCapacitacion = ['Programada', 'En curso', 'Finalizada'];

// Función para obtener capacitaciones por ítem del Anexo 1
export const getCapacitacionesByItem = (itemId) => {
  return capacitaciones.filter(c => c.anexo1ItemId === itemId);
};

// Función para crear una capacitación desde un ítem del Anexo 1
export const crearCapacitacionDesdeItem = (itemId, anexo1Id, empresaId, datos) => {
  const nuevaCapacitacion = {
    id: capacitaciones.length > 0 ? Math.max(...capacitaciones.map(c => c.id)) + 1 : 1,
    nombre: datos.titulo || `Capacitación para ítem ${itemId}`,
    descripcion: datos.descripcion || '',
    fechaProgramada: datos.fecha || new Date().toISOString().split('T')[0],
    hora: datos.hora || null,
    modalidad: datos.modalidad || 'presencial',
    responsable: datos.responsable || null,
    trabajadoresAsignados: datos.trabajadores || [],
    actividadRelacionada: datos.actividad || 'General',
    estado: 'Programada',
    empresasAsignadas: [empresaId],
    anexo1ItemId: itemId,
    anexo1Id: anexo1Id,
    empresaId: empresaId,
    fechaCreacion: new Date().toISOString().split('T')[0],
    plantillaId: datos.plantillaId || null,
    capacitadores: datos.capacitadores || '',
  };
  capacitaciones.push(nuevaCapacitacion);
  return nuevaCapacitacion;
};

