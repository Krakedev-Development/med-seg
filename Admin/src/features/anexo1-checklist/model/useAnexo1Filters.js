/**
 * Sistema de filtrado dinámico del Anexo 1 según características de la empresa
 * 
 * Este módulo determina qué ítems del Anexo 1 aplican para cada empresa
 * basándose en:
 * - Número de trabajadores
 * - Actividad económica
 * - Presencia de riesgos específicos
 * - Existencia de documentos/equipos
 * - Aplicación de normativas según tamaño
 */

/**
 * Configuración de condiciones para cada ítem del Anexo 1
 * Cada ítem puede tener múltiples condiciones que determinan si aplica o no
 */
export const CONDICIONES_ITEMS = {
  // Gestión Administrativa
  'ga1': {
    // Plan de Prevención (1-10 trabajadores)
    aplicaSi: (empresa) => {
      const numTrabajadores = empresa.numeroTrabajadores || 0;
      return numTrabajadores >= 1 && numTrabajadores <= 10;
    }
  },
  'ga2': {
    // Reglamento de Higiene y Seguridad (>10 trabajadores)
    aplicaSi: (empresa) => {
      const numTrabajadores = empresa.numeroTrabajadores || 0;
      return numTrabajadores > 10;
    }
  },
  'ga3': {
    // Socialización de Política SST - aplica a todas
    aplicaSi: () => true
  },
  'ga4': {
    // Monitor de Seguridad - aplica a todas
    aplicaSi: () => true
  },
  'ga5': {
    // Técnico de Seguridad - aplica a todas
    aplicaSi: () => true
  },
  'ga6': {
    // Servicio Externo - aplica a todas
    aplicaSi: () => true
  },
  'ga7': {
    // Informe de actividades - aplica a todas
    aplicaSi: () => true
  },
  'ga8': {
    // Profesional médico - aplica a todas
    aplicaSi: () => true
  },
  'ga9': {
    // Delegado de Seguridad - aplica a todas
    aplicaSi: () => true
  },
  'ga10': {
    // Comité de Seguridad - aplica a todas
    aplicaSi: () => true
  },
  'ga11': {
    // Informe del Organismo Paritario - aplica a todas
    aplicaSi: () => true
  },
  'ga12': {
    // Procedimientos de colaboración - aplica a todas
    aplicaSi: () => true
  },
  
  // Gestión Técnica
  'gt1': {
    // Identificación de peligros - aplica a todas
    aplicaSi: () => true
  },
  'gt2': {
    // Evaluación de riesgos - aplica a todas
    aplicaSi: () => true
  },
  'gt3': {
    // Medidas de control - aplica a todas
    aplicaSi: () => true
  },
  'gt4': {
    // Señalización - aplica a todas
    aplicaSi: () => true
  },
  'gt5': {
    // Señalización en áreas de riesgo - aplica a todas
    aplicaSi: () => true
  },
  'gt6': {
    // Mapa de riesgos - aplica a todas
    aplicaSi: () => true
  },
  'gt7': {
    // Actualización de mapa de riesgos - aplica a todas
    aplicaSi: () => true
  },
  'gt8': {
    // Mapa de riesgos actualizado - aplica a todas
    aplicaSi: () => true
  },
  'gt9': {
    // EPP - aplica a todas
    aplicaSi: () => true
  },
  'gt10': {
    // Mantenimiento preventivo - solo si tiene maquinaria
    aplicaSi: (empresa) => {
      return empresa.tieneMaquinaria !== false; // Por defecto asume que sí tiene
    }
  },
  'gt11': {
    // Mantenimiento de equipos - solo si tiene equipos
    aplicaSi: (empresa) => {
      return empresa.tieneEquipos !== false;
    }
  },
  'gt12': {
    // Cronograma de mantenimiento - solo si tiene maquinaria
    aplicaSi: (empresa) => {
      return empresa.tieneMaquinaria !== false;
    }
  },
  'gt13': {
    // Agentes químicos - solo si la actividad implica químicos
    aplicaSi: (empresa) => {
      const actividadesConQuimicos = ['Minería', 'Agricultura', 'Construcción', 'Manufactura', 'Química'];
      return actividadesConQuimicos.includes(empresa.tipoActividad || empresa.type);
    }
  },
  'gt14': {
    // Agentes biológicos - solo si la actividad implica biológicos
    aplicaSi: (empresa) => {
      const actividadesConBiologicos = ['Agricultura', 'Avicultura', 'Ganadería', 'Salud', 'Alimentación'];
      return actividadesConBiologicos.includes(empresa.tipoActividad || empresa.type);
    }
  },
  'gt15': {
    // Agentes físicos - aplica a todas
    aplicaSi: () => true
  },
  
  // Vigilancia de la Salud
  'vs1': {
    // Fichas médicas - aplica a todas
    aplicaSi: () => true
  },
  'vs2': {
    // Fichas médicas actualizadas - aplica a todas
    aplicaSi: () => true
  },
  'vs3': {
    // Fichas médicas para todos - aplica a todas
    aplicaSi: () => true
  },
  'vs4': {
    // Exámenes médicos - aplica a todas
    aplicaSi: () => true
  },
  'vs5': {
    // Personal vulnerable - solo si tiene personal vulnerable
    aplicaSi: (empresa) => {
      const numTrabajadores = empresa.numeroTrabajadores || 0;
      // Asumir que si tiene más de 5 trabajadores, puede tener personal vulnerable
      return numTrabajadores > 5;
    }
  },
  'vs6': {
    // Mujeres embarazadas - solo si tiene
    aplicaSi: (empresa) => {
      return empresa.tieneMujeresEmbarazadas === true;
    }
  },
  'vs7': {
    // Adolescentes - solo si tiene
    aplicaSi: (empresa) => {
      return empresa.tieneAdolescentes === true;
    }
  },
  
  // Inspecciones Internas
  'ii1': {
    // Inspecciones programadas - aplica a todas
    aplicaSi: () => true
  },
  'ii2': {
    // Inspecciones realizadas - aplica a todas
    aplicaSi: () => true
  },
  'ii3': {
    // Registro de inspecciones - aplica a todas
    aplicaSi: () => true
  },
  'ii4': {
    // Acciones correctivas - aplica a todas
    aplicaSi: () => true
  }
};

/**
 * Determina si un ítem del Anexo 1 aplica para una empresa específica
 */
export const itemAplicaParaEmpresa = (itemId, empresa) => {
  const condicion = CONDICIONES_ITEMS[itemId];
  
  // Si no hay condición definida, asumir que aplica
  if (!condicion) {
    return true;
  }
  
  // Ejecutar la función de condición
  return condicion.aplicaSi(empresa);
};

/**
 * Filtra los ítems de una sección del Anexo 1 según las características de la empresa
 */
export const filtrarItemsPorEmpresa = (seccion, empresa) => {
  if (!seccion) return seccion;
  
  if (seccion.tipo !== 'checklist' || !seccion.items) {
    return seccion; // Las secciones de datos no se filtran
  }
  
  if (!empresa) {
    return seccion; // Si no hay empresa, retornar sección sin filtrar
  }
  
  try {
    const itemsAplicables = seccion.items.filter(item => {
      if (!item || !item.id) return false;
      return itemAplicaParaEmpresa(item.id, empresa);
    });
    
    return {
      ...seccion,
      items: itemsAplicables
    };
  } catch (error) {
    console.error('Error al filtrar items por empresa:', error);
    return seccion; // Retornar sección sin filtrar si hay error
  }
};

/**
 * Filtra todas las secciones del Anexo 1 para una empresa
 */
export const filtrarSeccionesPorEmpresa = (secciones, empresa) => {
  if (!secciones || !Array.isArray(secciones)) {
    return [];
  }
  
  if (!empresa) {
    return secciones; // Si no hay empresa, retornar todas las secciones
  }
  
  try {
    return secciones.map(seccion => filtrarItemsPorEmpresa(seccion, empresa));
  } catch (error) {
    console.error('Error al filtrar secciones por empresa:', error);
    return secciones; // Retornar todas las secciones si hay error
  }
};

/**
 * Obtiene la configuración de empresa con valores por defecto
 */
export const obtenerConfiguracionEmpresa = (empresa) => {
  if (!empresa) return null;
  
  try {
    // Obtener número de trabajadores desde datos generales o empresa
    const numeroTrabajadores = empresa.numeroTrabajadores || 
                              empresa.numero_total_trabajadores || 
                              (empresa.employees ? empresa.employees.length : 0) ||
                              0;
    
    return {
      ...empresa,
      numeroTrabajadores: parseInt(numeroTrabajadores) || 0,
      tieneMaquinaria: empresa.tieneMaquinaria !== false, // Por defecto true
      tieneEquipos: empresa.tieneEquipos !== false,
      tieneMujeresEmbarazadas: empresa.tieneMujeresEmbarazadas || false,
      tieneAdolescentes: empresa.tieneAdolescentes || false,
      tipoActividad: empresa.tipoActividad || empresa.type || 'Otros'
    };
  } catch (error) {
    console.error('Error al obtener configuración de empresa:', error);
    // Retornar configuración por defecto segura
    return {
      ...empresa,
      numeroTrabajadores: 0,
      tieneMaquinaria: true,
      tieneEquipos: true,
      tieneMujeresEmbarazadas: false,
      tieneAdolescentes: false,
      tipoActividad: empresa?.tipoActividad || empresa?.type || 'Otros'
    };
  }
};

