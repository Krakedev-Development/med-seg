// Templates médicos compartidos — usados por EmpresaMediDocs y MatrizEmpleados
// requiereEmpleado: true  → documentos individuales (fichas médicas, certificados, informes)
// requiereEmpleado: false → documentos organizacionales (capacitaciones, procedimientos, etc.)

export const medDocsTemplates = [
  // =============================================
  // FICHAS MÉDICAS (individuales)
  // =============================================
  {
    id: 'ficha-ingreso',
    nombre: 'Ficha Médica de Ingreso (Preocupacional)',
    categoria: 'Fichas Médicas',
    subcategoria: 'Fichas de Ingreso',
    formato: 'pdf',
    icono: '🩺',
    descripcion: 'Evaluación médica inicial pre-empleo. Signos vitales, antecedentes, examen físico y determinación de aptitud para el puesto.',
    requiereEmpleado: true,
    rutaArchivo: null,
    datos: { tipo: 'ficha-medica' }
  },
  {
    id: 'ficha-periodica',
    nombre: 'Ficha Médica Periódica (Seguimiento)',
    categoria: 'Fichas Médicas',
    subcategoria: 'Fichas Periódicas',
    formato: 'pdf',
    icono: '🔄',
    descripcion: 'Evaluación médica de seguimiento anual o según exposición a factores de riesgo ocupacional.',
    requiereEmpleado: true,
    rutaArchivo: null,
    datos: { tipo: 'ficha-medica' }
  },
  {
    id: 'ficha-salida',
    nombre: 'Ficha Médica de Salida (Retiro)',
    categoria: 'Fichas Médicas',
    subcategoria: 'Fichas de Salida',
    formato: 'pdf',
    icono: '🚪',
    descripcion: 'Evaluación médica al término de la relación laboral. Estado de salud al egreso del trabajador.',
    requiereEmpleado: true,
    rutaArchivo: null,
    datos: { tipo: 'ficha-medica' }
  },
  {
    id: 'ficha-reintegro',
    nombre: 'Ficha Médica de Reintegro',
    categoria: 'Fichas Médicas',
    subcategoria: 'Fichas de Reintegro',
    formato: 'pdf',
    icono: '🔙',
    descripcion: 'Evaluación médica posterior a incapacidad prolongada o ausencia justificada por salud.',
    requiereEmpleado: true,
    rutaArchivo: null,
    datos: { tipo: 'ficha-medica' }
  },
  // =============================================
  // CERTIFICADOS MÉDICOS (individuales)
  // =============================================
  {
    id: 'cert-asistencia-modelo',
    nombre: 'Certificado de Asistencia Modelo',
    categoria: 'Certificados Médicos',
    subcategoria: 'Certificado de Asistencia',
    formato: 'docx',
    icono: '📋',
    descripcion: 'Modelo de certificado de asistencia a consulta, evaluación o procedimiento médico ocupacional.',
    requiereEmpleado: true,
    rutaArchivo: 'CERTIFICADOS MÉDICOS/CERTIFICADO DE ASISTENCIA MODELO/NOMBRE DEL PACIENTE.docx',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'cert-medico-modelo',
    nombre: 'Certificado Médico Modelo',
    categoria: 'Certificados Médicos',
    subcategoria: 'Certificado Médico',
    formato: 'docx',
    icono: '✅',
    descripcion: 'Certificación médica oficial con diagnóstico, recomendaciones y periodo de validez.',
    requiereEmpleado: true,
    rutaArchivo: 'CERTIFICADOS MÉDICOS/CERTIFICADO MEDICO MODELO/1. ENERO/NOMBRE DEL PACIENTE.docx',
    datos: { tipo: 'archivo' }
  },
  // =============================================
  // CAPACITACIONES (organizacionales)
  // =============================================
  {
    id: 'capacitacion-aripe',
    nombre: 'ARIPE — Acta de Reunión de Inducción al Personal',
    categoria: 'Capacitaciones',
    subcategoria: 'ARIPE',
    formato: 'docx',
    icono: '📝',
    descripcion: 'Documento de registro de inducción al personal sobre prevención y normativa de seguridad y salud ocupacional.',
    requiereEmpleado: false,
    rutaArchivo: 'CAPACITACIONES/6. JUNIO/ARIPE/ARIPE 1-2.docx',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'capacitacion-prevencion-atd',
    nombre: 'Prevención de Uso y Consumo de Alcohol, Tabaco y Drogas',
    categoria: 'Capacitaciones',
    subcategoria: 'Capacitación',
    formato: 'docx',
    icono: '🚫',
    descripcion: 'Documento de capacitación sobre prevención del consumo de alcohol, tabaco y drogas en el ámbito laboral.',
    requiereEmpleado: false,
    rutaArchivo: 'CAPACITACIONES/6. JUNIO/CAPACITACION/PREVENCION DE USO Y CONSUMO DE ALCOHOL, TABACO Y DROGAS.docx',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'capacitacion-socializacion-lorct',
    nombre: 'Socialización de la LORCT',
    categoria: 'Capacitaciones',
    subcategoria: 'Capacitación',
    formato: 'docx',
    icono: '📖',
    descripcion: 'Documento de socialización de la Ley Orgánica de Regulación y Control del Trabajo con el personal.',
    requiereEmpleado: false,
    rutaArchivo: 'CAPACITACIONES/6. JUNIO/CAPACITACION/SOCIALIZACIÓN LORCT.docx',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'diapositivas-prevencion-atd',
    nombre: 'Diapositivas — Prevención de Alcohol, Tabaco y Drogas',
    categoria: 'Capacitaciones',
    subcategoria: 'Diapositivas',
    formato: 'pptx',
    icono: '🖥️',
    descripcion: 'Presentación de diapositivas para la capacitación sobre prevención del consumo de alcohol, tabaco y drogas.',
    requiereEmpleado: false,
    rutaArchivo: 'CAPACITACIONES/6. JUNIO/DIAPOSITIVAS/PREVENCION DE USO Y CONSUMO DE ALCOHOL, TABACO Y DROGAS.pptx',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'diapositivas-socializacion-lorct',
    nombre: 'Diapositivas — Socialización de la LORCT',
    categoria: 'Capacitaciones',
    subcategoria: 'Diapositivas',
    formato: 'pptx',
    icono: '🖥️',
    descripcion: 'Presentación de diapositivas para la socialización de la Ley Orgánica de Regulación y Control del Trabajo.',
    requiereEmpleado: false,
    rutaArchivo: 'CAPACITACIONES/6. JUNIO/DIAPOSITIVAS/SOCIALIZACION DE LA LORCT.pptx',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'procedimiento-prevencion-atd',
    nombre: 'Procedimiento — Prevención de Alcohol, Tabaco y Drogas',
    categoria: 'Capacitaciones',
    subcategoria: 'Procedimiento',
    formato: 'docx',
    icono: '📋',
    descripcion: 'Procedimiento documentado para la implementación del programa de prevención de alcohol, tabaco y drogas.',
    requiereEmpleado: false,
    rutaArchivo: 'CAPACITACIONES/6. JUNIO/PROCEDIMIENTO/PROCEDIMIENTO PREVENCION DE USO Y CONSUMO DE ALCOHOL, TABACO Y DROGAS.docx',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'triptico-socializacion-lorct',
    nombre: 'Tríptico — Socialización de la LORCT',
    categoria: 'Capacitaciones',
    subcategoria: 'Tríptico',
    formato: 'pdf',
    icono: '📰',
    descripcion: 'Tríptico informativo para difusión de la Ley Orgánica de Regulación y Control del Trabajo.',
    requiereEmpleado: false,
    rutaArchivo: 'CAPACITACIONES/6. JUNIO/TRIPTICO/TRIPTICO SOCIALIZACION DE LORCT.pdf',
    datos: { tipo: 'archivo' }
  },
  // =============================================
  // INFORME TRIMESTRAL (organizacional)
  // =============================================
  {
    id: 'informe-trimestral-indicadores',
    nombre: 'Informe Trimestral de Indicadores de Salud Ocupacional',
    categoria: 'Informe Trimestral',
    subcategoria: 'Indicadores',
    formato: 'pdf',
    icono: '📊',
    descripcion: 'Informe trimestral de indicadores y estadísticas de salud ocupacional de la empresa.',
    requiereEmpleado: false,
    rutaArchivo: 'INFORME TRIMESTRAL/INFORME TRIMESTRAL DE INDICADORES DE SALUD OCUPACIONAL-signed.pdf',
    datos: { tipo: 'archivo' }
  },
  // =============================================
  // PROCEDIMIENTO (organizacional)
  // =============================================
  {
    id: 'estadio-situacional',
    nombre: 'Estadio Situacional',
    categoria: 'Procedimiento',
    subcategoria: 'Estadio Situacional',
    formato: 'pdf',
    icono: '🏥',
    descripcion: 'Procedimiento completo del estadio situacional de la empresa. Diagnóstico basal y línea base de salud ocupacional.',
    requiereEmpleado: false,
    rutaArchivo: 'PROCEDIMIENTO/ESTADIO SITUACIONAL/ESTADIO SITUACIONAL COMPLETO.pdf',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'anexos-estadio-situacional',
    nombre: 'Anexos del Estadio Situacional (I, II, III)',
    categoria: 'Procedimiento',
    subcategoria: 'Estadio Situacional',
    formato: 'pdf',
    icono: '📎',
    descripcion: 'Anexo I — Marco Legal. Anexo II — Listado. Anexo III — Gráfico y Análisis.',
    requiereEmpleado: false,
    rutaArchivo: 'PROCEDIMIENTO/ESTADIO SITUACIONAL/2. ANEXO I MARCO LEGAL.pdf',
    datos: { tipo: 'archivo' }
  },
  // =============================================
  // PROMOCIÓN DE LA SALUD (organizacional)
  // =============================================
  {
    id: 'espacios-libre-humo',
    nombre: 'Espacios 100% Libre de Humo',
    categoria: 'Promoción de la Salud',
    subcategoria: 'Libre de Humo',
    formato: 'pdf',
    icono: '🚭',
    descripcion: 'Documento de declaración y señalización de espacios 100% libres de humo de tabaco en la empresa.',
    requiereEmpleado: false,
    rutaArchivo: null,
    datos: { tipo: 'archivo' }
  },
  {
    id: 'jornada-vacunacion',
    nombre: 'Jornada de Vacunación',
    categoria: 'Promoción de la Salud',
    subcategoria: 'Vacunación',
    formato: 'pdf',
    icono: '💉',
    descripcion: 'Registro y documentación de jornadas de vacunación para el personal.',
    requiereEmpleado: false,
    rutaArchivo: 'PROMOCION DE LA SALUD/VACUNACION/JORNADA DE VACUNACIÓN CONTRA INFLUENZA PLANTA REINA DEL CISNE II-signed-signed.pdf',
    datos: { tipo: 'archivo' }
  },
  {
    id: 'vigilancia-de-la-salud',
    nombre: 'Vigilancia de la Salud',
    categoria: 'Promoción de la Salud',
    subcategoria: 'Vigilancia de la Salud',
    formato: 'pdf',
    icono: '🔍',
    descripcion: 'Programa y registro de vigilancia de la salud de los trabajadores.',
    requiereEmpleado: false,
    rutaArchivo: 'PROMOCION DE LA SALUD/VIGILANCIA DE LA SALUD/VIGILANCIA DE LA SALUD-signed.pdf',
    datos: { tipo: 'archivo' }
  },
  // =============================================
  // SEGUIMIENTO MÉDICO (individual)
  // =============================================
  {
    id: 'informes-medicos',
    nombre: 'Informes Médicos Individuales',
    categoria: 'Seguimiento Médico',
    subcategoria: 'Informes Médicos',
    formato: 'pdf',
    icono: '📄',
    descripcion: 'Informe médico individual del trabajador. Seguimiento de patologías, evolución y recomendaciones ocupacionales.',
    requiereEmpleado: true,
    rutaArchivo: 'SEGUIMIENTO MEDICO/INFORMES MEDICOS/GONZALEZ ESPINOZA RONY PATRICIO-signed.pdf',
    datos: { tipo: 'archivo' }
  }
];

// Helper: solo templates individuales (requieren empleado)
export const medDocsTemplatesIndividuales = medDocsTemplates.filter(t => t.requiereEmpleado);

// Helper: solo templates organizacionales
export const medDocsTemplatesOrganizacionales = medDocsTemplates.filter(t => !t.requiereEmpleado);

// Helper: buscar template por ID
export const getMedDocsTemplateById = (id) => medDocsTemplates.find(t => t.id === id);
