export const documentTemplates = {
  induccion: {
    type: 'Inducción',
    fields: [
      { name: 'tipoEmpresa', label: 'Tipo de Empresa', type: 'select', options: ['Minería', 'Alimentos', 'Servicios', 'Educación', 'Otros'] },
      { name: 'area', label: 'Área', type: 'text' },
      { name: 'nombreTrabajador', label: 'Nombre del Trabajador', type: 'select', dynamic: 'employees' },
      { name: 'fecha', label: 'Fecha', type: 'date' },
      { name: 'riesgosPrincipales', label: 'Riesgos Principales', type: 'textarea' }
    ],
    pdfTemplate: '/pdf-templates/INFUCCION_PERSONAL_COCINA.pdf'
  },
  inspeccion: {
    type: 'Inspección',
    fields: [
      { name: 'areaRevisada', label: 'Área Revisada', type: 'select', options: ['Cocina', 'Almacén', 'Oficina', 'Taller', 'Área de Producción', 'Otros'] },
      { name: 'accionesRealizadas', label: 'Acciones Realizadas', type: 'multiselect', options: ['Limpieza', 'Reparación', 'Reemplazo', 'Inspección de Equipos', 'Revisión de Seguridad', 'Capacitación'] },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea' }
    ],
    pdfTemplate: '/pdf-templates/FORMATO_INSPECCION_AREAS.pdf'
  },
  psicosocial: {
    type: 'Informe Psicosocial',
    fields: [
      { name: 'tema', label: 'Tema', type: 'text' },
      { name: 'fecha', label: 'Fecha', type: 'date' },
      { name: 'participantes', label: 'Participantes', type: 'text' },
      { name: 'conclusiones', label: 'Conclusiones', type: 'textarea' },
      { name: 'recomendaciones', label: 'Recomendaciones', type: 'textarea' }
    ],
    pdfTemplate: '/pdf-templates/INFORME_PSICOSOCIAL.pdf'
  }
};

