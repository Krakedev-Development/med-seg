// Sistema de tareas automáticas generadas desde el Anexo 1
// Cada ítem marcado como NO CUMPLE genera una tarea automática

export let tareas = [
  // Ejemplo de estructura:
  // {
  //   id: 1,
  //   empresaId: 1,
  //   anexo1Id: 1,
  //   itemId: 'ga1', // ID del ítem del Anexo 1
  //   titulo: 'Subir Reglamento de Higiene y Seguridad actualizado',
  //   descripcion: 'Se requiere el Reglamento de Higiene y Seguridad firmado y registrado en el SUT',
  //   tipo: 'documento', // documento, capacitacion, evaluacion, inspeccion, ficha_medica, otro
  //   estado: 'Pendiente', // Pendiente, En revisión, Corregido, Rechazado
  //   prioridad: 'Alta', // Alta, Media, Baja
  //   fechaCreacion: '2025-01-15',
  //   fechaVencimiento: '2025-02-15',
  //   fechaResolucion: null,
  //   asignadoA: 'empresa', // empresa, consultor
  //   evidencias: [], // IDs de documentos subidos
  //   observaciones: '',
  //   creadoPor: 'sistema'
  // }
];

// Mapeo de ítems del Anexo 1 a tareas automáticas
export const mapeoTareas = {
  // Gestión Administrativa
  'ga1': {
    titulo: 'Subir Plan de Prevención de Riesgos Laborales',
    descripcion: 'Se requiere el Plan de Prevención de Riesgos Laborales aprobado y registrado en el SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga2': {
    titulo: 'Subir Reglamento de Higiene y Seguridad',
    descripcion: 'Se requiere el Reglamento de Higiene y Seguridad aprobado y registrado en el SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga3': {
    titulo: 'Socializar Política de SST',
    descripcion: 'Se requiere evidencia de socialización de la Política de seguridad y salud en el trabajo a todos los trabajadores',
    tipo: 'documento',
    prioridad: 'Media'
  },
  'ga4': {
    titulo: 'Registrar Monitor de Seguridad e Higiene',
    descripcion: 'Se requiere el registro del Monitor de Seguridad e Higiene del Trabajo en la Plataforma SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga5': {
    titulo: 'Registrar Técnico de Seguridad e Higiene',
    descripcion: 'Se requiere el registro del Técnico de Seguridad e Higiene del Trabajo en la Plataforma SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga6': {
    titulo: 'Registrar Servicio Externo de SST',
    descripcion: 'Se requiere el registro del Servicio Externo de Seguridad e Higiene del Trabajo en la Plataforma SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga7': {
    titulo: 'Generar Informe de Actividades del Técnico',
    descripcion: 'Se requiere el informe de actividades realizadas por técnico o servicio externo de seguridad e higiene del trabajo',
    tipo: 'documento',
    prioridad: 'Media'
  },
  'ga8': {
    titulo: 'Registrar Profesional Médico',
    descripcion: 'Se requiere el registro del profesional médico en la Plataforma SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga9': {
    titulo: 'Registrar Delegado de Seguridad y Salud',
    descripcion: 'Se requiere el registro del Delegado de Seguridad y Salud en la plataforma SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga10': {
    titulo: 'Registrar Comité de Seguridad y Salud',
    descripcion: 'Se requiere el registro del Comité de Seguridad y Salud en la plataforma SUT',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'ga11': {
    titulo: 'Generar Informe de Gestión del Organismo Paritario',
    descripcion: 'Se requiere el informe de la gestión realizada por los miembros del Organismo Paritario',
    tipo: 'documento',
    prioridad: 'Media'
  },
  'ga12': {
    titulo: 'Documentar Procedimientos de Colaboración',
    descripcion: 'Se requiere documentar por escrito los procedimientos generales de colaboración para actividades simultáneas',
    tipo: 'documento',
    prioridad: 'Media'
  },
  // Gestión Técnica
  'gt1': {
    titulo: 'Crear Diagrama de Flujo de Procesos',
    descripcion: 'Se requiere un diagrama de flujo de todos los procesos productivos y/o de servicios',
    tipo: 'documento',
    prioridad: 'Media'
  },
  'gt2': {
    titulo: 'Elaborar Descriptivo por Puesto de Trabajo',
    descripcion: 'Se requiere un descriptivo por puesto de trabajo con número de trabajadores, actividades, horas y recursos utilizados',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'gt3': {
    titulo: 'Crear Mapa de Riesgos',
    descripcion: 'Se requiere un mapa de riesgos del lugar y/o centro de trabajo con señalización de seguridad, EPP y dispositivos de parada de emergencia',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'gt4': {
    titulo: 'Elaborar Matriz de Identificación de Peligros',
    descripcion: 'Se requiere una matriz de identificación de peligros y evaluación de riesgos laborales por puesto de trabajo',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'gt5': {
    titulo: 'Realizar Medición de Agentes Físicos, Químicos y Biológicos',
    descripcion: 'Se requiere un informe de medición de los agentes físicos, químicos y/o biológicos del puesto de trabajo',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'gt6': {
    titulo: 'Evaluar Riesgos de Seguridad, Ergonómicos y Psicosociales',
    descripcion: 'Se requiere un informe de evaluación de riesgos de seguridad, ergonómicos y psicosociales de los puestos de trabajo',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'gt7': {
    titulo: 'Documentar Medidas de Prevención y Protección',
    descripcion: 'Se requiere un informe de las medidas de prevención y protección implementadas por puesto de trabajo',
    tipo: 'documento',
    prioridad: 'Alta'
  },
  'gt8': {
    titulo: 'Calcular Riesgo Residual',
    descripcion: 'Se requiere el cálculo del riesgo residual en la matriz de identificación de peligros y evaluación de riesgos laborales',
    tipo: 'documento',
    prioridad: 'Media'
  },
  'gt9': {
    titulo: 'Verificar Implementación de Medidas',
    descripcion: 'Se requiere verificar in situ la implementación de medidas de prevención y protección',
    tipo: 'inspeccion',
    prioridad: 'Alta'
  }
};

// Función para crear tarea automática desde un ítem NO CUMPLE
export const crearTareaDesdeItem = (empresaId, anexo1Id, itemId, itemTexto) => {
  const mapeo = mapeoTareas[itemId];
  
  if (!mapeo) {
    // Si no hay mapeo específico, crear tarea genérica
    return {
      id: Date.now(),
      empresaId,
      anexo1Id,
      itemId,
      titulo: `Corregir: ${itemTexto.substring(0, 50)}...`,
      descripcion: itemTexto,
      tipo: 'documento',
      estado: 'Pendiente',
      prioridad: 'Media',
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaVencimiento: null,
      fechaResolucion: null,
      asignadoA: 'empresa',
      evidencias: [],
      observaciones: '',
      creadoPor: 'sistema'
    };
  }

  return {
    id: Date.now(),
    empresaId,
    anexo1Id,
    itemId,
    titulo: mapeo.titulo,
    descripcion: mapeo.descripcion,
    tipo: mapeo.tipo,
    estado: 'Pendiente',
    prioridad: mapeo.prioridad,
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaVencimiento: null,
    fechaResolucion: null,
    asignadoA: 'empresa',
    evidencias: [],
    observaciones: '',
    creadoPor: 'sistema'
  };
};

// Función para obtener tareas por empresa
export const getTareasByEmpresa = (empresaId) => {
  return tareas.filter(t => t.empresaId === empresaId)
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
};

// Función para obtener tareas por ítem del Anexo 1
export const getTareasByItem = (itemId) => {
  return tareas.filter(t => t.itemId === itemId);
};

// Función para resolver tarea (marcar como corregido)
// Si la tarea está asociada a un ítem NO CUMPLE, actualiza el ítem a CUMPLE
export const resolverTarea = (tareaId, evidencias = [], onItemUpdate = null) => {
  const tarea = tareas.find(t => t.id === tareaId);
  if (tarea) {
    tarea.estado = 'Corregido';
    tarea.fechaResolucion = new Date().toISOString().split('T')[0];
    tarea.evidencias = evidencias;
    
    // Si hay callback para actualizar el ítem del Anexo 1
    if (onItemUpdate && tarea.itemId && tarea.anexo1Id) {
      // Actualizar el ítem a CUMPLE si estaba en NO_CUMPLE
      onItemUpdate(tarea.anexo1Id, tarea.itemId, { estado: 'CUMPLE' });
    }
  }
  return tarea;
};

// Función para actualizar estado de tarea
export const actualizarEstadoTarea = (tareaId, nuevoEstado) => {
  const tarea = tareas.find(t => t.id === tareaId);
  if (tarea) {
    tarea.estado = nuevoEstado;
    if (nuevoEstado === 'Corregido') {
      tarea.fechaResolucion = new Date().toISOString().split('T')[0];
    }
  }
  return tarea;
};

