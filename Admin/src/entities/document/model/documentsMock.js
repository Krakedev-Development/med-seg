// Sistema de documentos dinámicos creados (formularios como inspecciones, inducciones, fichas médicas)

export let documentosDinamicos = [
  // =============================================
  // Empresa 1 — Minera Los Andes S.A. (16 documentos)
  // =============================================

  // 1. Inducción Mineria
  {
    discriminador: 'general',
    id: 'IND-001',
    tipo: 'induccion',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Inducción para Personal de Minería Interior y Exterior',
    fechaCreacion: '2025-01-10',
    estado: 'Publicado',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Operador Minero / Ayudante',
      actividadesPuesto: 'Perforación, voladura, fortificación, acarreo y ventilación en interior mina.',
      area: 'Minería Interior',
      fecha: '2025-01-10'
    },
    creadoPor: 'admin'
  },

  // 2. Reinducción SSO
  {
    discriminador: 'general',
    id: 'IND-002',
    tipo: 'induccion',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Reinducción General en Seguridad y Salud Ocupacional',
    fechaCreacion: '2025-01-12',
    estado: 'Publicado',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Todo el Personal (Anual)',
      actividadesPuesto: 'Revisión periódica de normas de seguridad, ergonomía de oficina y primeros auxilios.',
      area: 'General',
      fecha: '2025-01-12'
    },
    creadoPor: 'admin'
  },

  // 3. Acta Comité Paritario
  {
    discriminador: 'general',
    id: 'COP-001',
    tipo: 'comite',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Acta de Reunión de Comité Paritario',
    fechaCreacion: '2025-01-15',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Puntos Tratados COPASO',
          items: [
            '¿Se revisaron los accidentes/incidentes del mes anterior?',
            '¿Se dio seguimiento a las inspecciones de seguridad programadas?',
            '¿Se discutieron las necesidades de capacitación en SSO?',
            '¿Se registraron las firmas y compromisos de los asistentes?'
          ]
        }
      ],
      fecha: '2025-01-15'
    },
    creadoPor: 'admin'
  },

  // 4. Certificado Comité
  {
    discriminador: 'general',
    id: 'COP-002',
    tipo: 'comite',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Certificado de Designación de Miembro de Comité',
    fechaCreacion: '2025-01-18',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Datos de Registro',
          items: [
            'Nombres y Apellidos del Miembro del Comité',
            'Cargo dentro de la Empresa',
            'Tipo de Representación (Empleador / Trabajador)',
            'Fecha de vigencia del nombamiento'
          ]
        }
      ],
      fecha: '2025-01-18'
    },
    creadoPor: 'admin'
  },

  // 5. Control Asistencia
  {
    discriminador: 'general',
    id: 'REG-001',
    tipo: 'registro',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Control Diario de Asistencia del Personal',
    fechaCreacion: '2025-01-20',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Registro de Horarios',
          items: [
            'Registro exacto de la Hora de Entrada',
            'Firma del trabajador al ingreso',
            'Registro exacto de la Hora de Salida',
            'Observaciones o justificación de novedades'
          ]
        }
      ],
      fecha: '2025-01-20'
    },
    creadoPor: 'admin'
  },

  // 6. Mantenimiento Cargadora
  {
    discriminador: 'general',
    id: 'MAN-001',
    tipo: 'mantenimiento',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Mantenimiento de Cargadora de Bajo Perfil (Scooptram)',
    fechaCreacion: '2025-01-22',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Inspección de Cargadora Minera',
          items: [
            '¿El sistema de dirección y frenos responde correctamente?',
            '¿Nivel de fluidos (aceite de motor, hidráulico, refrigerante)?',
            '¿El estado de los neumáticos / cadenas es óptimo?',
            '¿Funcionamiento correcto de luces de seguridad y alarma de reversa?',
            '¿Ausencia de fugas en mangueras de alta presión?'
          ]
        }
      ],
      fecha: '2025-01-22'
    },
    creadoPor: 'admin'
  },

  // 7. Mantenimiento Polvorín
  {
    discriminador: 'general',
    id: 'MAN-002',
    tipo: 'mantenimiento',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Inspección y Mantenimiento de Polvorín',
    fechaCreacion: '2025-01-25',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Condiciones de Seguridad de Polvorín',
          items: [
            '¿La temperatura y humedad relativa están dentro del límite?',
            '¿El sistema de puesta a tierra está conectado y en buen estado?',
            '¿Existe orden, limpieza y segregación adecuada de explosivos?',
            '¿La señalización de peligro y prohibición de fuego es visible?',
            '¿El extintor exterior está cargado e inspeccionado?'
          ]
        }
      ],
      fecha: '2025-01-25'
    },
    creadoPor: 'admin'
  },

  // 8. Mantenimiento Concentrador
  {
    discriminador: 'general',
    id: 'MAN-003',
    tipo: 'mantenimiento',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Mantenimiento de Concentrador Centrífugo Falcón',
    fechaCreacion: '2025-01-28',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Concentrador Falcón',
          items: [
            '¿La presión de agua de fluidización es la adecuada?',
            '¿La vibración del equipo está dentro de los límites normales?',
            '¿Se verificó el estado de los revestimientos y la malla?',
            '¿El motor eléctrico y transmisión no presentan sobrecalentamiento?',
            '¿Las conexiones y pernos de anclaje están ajustados?'
          ]
        }
      ],
      fecha: '2025-01-28'
    },
    creadoPor: 'admin'
  },

  // 9. Permiso Trabajo en Alturas
  {
    discriminador: 'general',
    id: 'PER-001',
    tipo: 'permiso',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Permiso de Trabajo en Alturas',
    fechaCreacion: '2025-02-01',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Checklist Trabajo en Alturas',
          items: [
            '¿El arnés de cuerpo entero cuenta con inspección vigente?',
            '¿Las líneas de vida están correctamente ancladas a puntos estructurales?',
            '¿Se delimitó y señalizó el área de trabajo en el nivel inferior?',
            '¿Los trabajadores cuentan con certificado médico para alturas?',
            '¿El andamio o plataforma cuenta con tarjeta verde de operativo?'
          ]
        }
      ],
      fecha: '2025-02-01'
    },
    creadoPor: 'admin'
  },

  // 10. Permiso Espacios Confinados
  {
    discriminador: 'general',
    id: 'PER-002',
    tipo: 'permiso',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Permiso de Entrada a Espacios Confinados',
    fechaCreacion: '2025-02-03',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Checklist Espacios Confinados',
          items: [
            '¿El nivel de Oxígeno se encuentra entre 19.5% y 23.5%?',
            '¿Se realizaron mediciones de gases tóxicos y explosivos?',
            '¿Se cuenta con ventilación mecánica o forzada continua?',
            '¿Hay un vigía de seguridad permanentemente en la entrada?',
            '¿Se cuenta con arnés y línea de rescate listos para emergencia?'
          ]
        }
      ],
      fecha: '2025-02-03'
    },
    creadoPor: 'admin'
  },

  // 11. Permiso Trabajo en Caliente
  {
    discriminador: 'general',
    id: 'PER-003',
    tipo: 'permiso',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Permiso de Trabajo en Caliente',
    fechaCreacion: '2025-02-05',
    estado: 'Borrador',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Checklist Trabajo en Caliente',
          items: [
            '¿Se retiraron o cubrieron todos los materiales combustibles en 10m?',
            '¿Se cuenta con mantas ignífugas para contener chispas?',
            '¿El equipo de soldadura / oxicorte está en perfectas condiciones?',
            '¿Hay un extintor PQS cargado al alcance del soldador?',
            '¿Se asignó un vigía contra incendios durante la actividad?'
          ]
        }
      ],
      fecha: '2025-02-05'
    },
    creadoPor: 'admin'
  },

  // 12. Entrega EPP
  {
    discriminador: 'general',
    id: 'EPP-001',
    tipo: 'epp',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Registro de Entrega de Equipos de Protección',
    fechaCreacion: '2025-02-08',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'EPP Entregado',
          items: [
            'Casco de seguridad dieléctrico / de minero',
            'Gafas de seguridad con protección UV',
            'Protectores auditivos de copa / inserción',
            'Calzado de seguridad con punta de acero / composite',
            'Guantes de trabajo (cuero, nitrilo, etc.)'
          ]
        }
      ],
      fecha: '2025-02-08'
    },
    creadoPor: 'admin'
  },

  // 13. Registro Firmas Charla
  {
    discriminador: 'general',
    id: 'FIR-001',
    tipo: 'firma',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Registro de Firmas de Charla de Seguridad',
    fechaCreacion: '2025-02-10',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Detalles de Capacitación',
          items: [
            'Tema de la Charla / Capacitación',
            'Facilitador / Expositor',
            'Fecha y Hora del Evento',
            'Registro de Firmas y Cédulas de Asistentes'
          ]
        }
      ],
      fecha: '2025-02-10'
    },
    creadoPor: 'admin'
  },

  // 14. Inspección Botiquín
  {
    discriminador: 'general',
    id: 'INS-001',
    tipo: 'inspeccion',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Inspección Periódica de Botiquines',
    fechaCreacion: '2025-02-12',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Insumos de Botiquín',
          items: [
            '¿Alcohol antiséptico y agua oxigenada disponibles?',
            '¿Gasas estériles y vendas de diferentes tamaños completas?',
            '¿Termómetro e instrumental básico en buen estado?',
            '¿Los medicamentos e insumos están dentro de la fecha de caducidad?',
            '¿El botiquín está limpio, ordenado y debidamente señalizado?'
          ]
        }
      ],
      fecha: '2025-02-12'
    },
    creadoPor: 'admin'
  },

  // 15. Inspección Extintores
  {
    discriminador: 'general',
    id: 'INS-002',
    tipo: 'inspeccion',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Inspección Mensual de Extintores',
    fechaCreacion: '2025-02-15',
    estado: 'Publicado',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Inspección de Extintores',
          items: [
            '¿El extintor está ubicado en su sitio designado?',
            '¿El acceso al extintor está libre de obstáculos?',
            '¿La aguja del manómetro indica presión adecuada (zona verde)?',
            '¿El precinto de seguridad y pasador están intactos?',
            '¿La manguera y boquilla están libres de grietas u obstrucciones?'
          ]
        }
      ],
      fecha: '2025-02-15'
    },
    creadoPor: 'admin'
  },

  // 16. Checklist SSO
  {
    discriminador: 'general',
    id: 'CHK-001',
    tipo: 'checklist',
    empresaId: 1,
    empleadoId: null,
    titulo: 'Checklist General de Gestión SSO',
    fechaCreacion: '2025-02-18',
    estado: 'Borrador',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Cumplimiento Legal SSO',
          items: [
            '¿Se cuenta con Reglamento de Higiene y Seguridad aprobado?',
            '¿Está conformado y registrado el Comité/Delegado de Seguridad?',
            '¿Se cuenta con planes de emergencia y brigadas conformadas?',
            '¿Se realizan los exámenes médicos ocupacionales periódicos?',
            '¿Se registran los índices de siniestralidad laboral anualmente?'
          ]
        }
      ],
      fecha: '2025-02-18'
    },
    creadoPor: 'admin'
  },

  // =============================================
  // Empresa 2 — Restaurante El Buen Sabor (2 documentos)
  // =============================================

  // 1. Inducción Cocina
  {
    discriminador: 'general',
    id: 'IND-003',
    tipo: 'induccion',
    empresaId: 2,
    empleadoId: null,
    titulo: 'Inducción para Personal de Cocina',
    fechaCreacion: '2025-01-15',
    estado: 'Publicado',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Personal de Cocina',
      actividadesPuesto: 'Preparación de alimentos, limpieza de utensilios, manejo de equipos de cocción.',
      area: 'Cocina',
      fecha: '2025-01-15'
    },
    creadoPor: 'admin'
  },

  // 2. Ficha Médica
  {
    discriminador: 'medico',
    id: 'FME-001',
    tipo: 'ficha-medica',
    empresaId: 2,
    empleadoId: 2,
    titulo: 'Ficha Médica Ocupacional - Evaluación Inicial',
    fechaCreacion: '2025-01-20',
    estado: 'Publicado',
    datos: {
      tipo: 'ficha-medica',
      puestoTrabajo: 'Chef Ejecutivo',
      presionArterial: '118/75',
      temperatura: '36.5°C',
      frecuenciaCardiaca: '70 lpm',
      saturacionOxigeno: '98%',
      peso: '68 kg',
      talla: '170 cm',
      indiceMasaCorporal: '23.5',
      examenFisicoObservaciones: 'Examen físico normal',
      nombresApellidosProfesional: 'Dr. Carlos Ramírez',
      codigoProfesional: '34567',
      fecha: '2025-01-20'
    },
    creadoPor: 'admin'
  },

  // =============================================
  // FICHAS MÉDICAS EMPRESA 1 — Datos clínicos hardcodeados
  // =============================================
  {
    id: 'FME-EMP1-001',
    discriminador: 'medico',
    tipo: 'ficha-medica',
    empresaId: 1,
    empleadoId: 1,
    titulo: 'Ficha Médica Ocupacional — Juan Carlos Pérez García',
    fechaCreacion: '2025-06-15',
    estado: 'Publicado',
    datos: {
      tipo: 'ficha-medica',
      puestoTrabajo: 'Operador de Maquinaria',
      presionArterial: '125/82',
      temperatura: '36.4°C',
      frecuenciaCardiaca: '72 lpm',
      frecuenciaRespiratoria: '16 rpm',
      saturacionOxigeno: '98%',
      peso: '78 kg',
      talla: '172 cm',
      indiceMasaCorporal: '26.4',
      perimetroAbdominal: '92 cm',
      antecedentesClinicosQuirurgicos: 'Apendicectomía (2010). Sin otras patologías relevantes.',
      accidentesTrabajo: false,
      accidentesTrabajoSi: false,
      accidentesTrabajoEspecificar: '',
      enfermedadesProfesionales: false,
      enfermedadesProfesionalesSi: false,
      enfermedadesProfesionalesEspecificar: '',
      examenFisicoObservaciones: 'Examen físico general normal. Sin hallazgos patológicos. Auscultación cardiopulmonar normal.',
      nombresApellidosProfesional: 'Dr. Rolando Maldonado',
      codigoProfesional: '34567'
    },
    creadoPor: 'admin'
  },
  {
    id: 'FME-EMP1-002',
    discriminador: 'medico',
    tipo: 'ficha-medica',
    empresaId: 1,
    empleadoId: 5,
    titulo: 'Ficha Médica Ocupacional — Luis Miguel Vargas Ramírez',
    fechaCreacion: '2025-06-15',
    estado: 'Publicado',
    datos: {
      tipo: 'ficha-medica',
      puestoTrabajo: 'Minero',
      presionArterial: '130/85',
      temperatura: '36.6°C',
      frecuenciaCardiaca: '68 lpm',
      frecuenciaRespiratoria: '14 rpm',
      saturacionOxigeno: '97%',
      peso: '82 kg',
      talla: '168 cm',
      indiceMasaCorporal: '29.0',
      perimetroAbdominal: '96 cm',
      antecedentesClinicosQuirurgicos: 'Asma leve en la infancia. Sin hospitalizaciones.',
      accidentesTrabajo: false,
      accidentesTrabajoSi: false,
      accidentesTrabajoEspecificar: '',
      enfermedadesProfesionales: false,
      enfermedadesProfesionalesSi: false,
      enfermedadesProfesionalesEspecificar: '',
      examenFisicoObservaciones: 'Examen físico normal. Leve sobrepeso. Sin hallazgos patológicos.',
      nombresApellidosProfesional: 'Dr. Rolando Maldonado',
      codigoProfesional: '34567'
    },
    creadoPor: 'admin'
  },
  {
    id: 'FME-EMP1-003',
    discriminador: 'medico',
    tipo: 'ficha-medica',
    empresaId: 1,
    empleadoId: 7,
    titulo: 'Ficha Médica Ocupacional — Roberto Fernández Cáceres',
    fechaCreacion: '2025-06-15',
    estado: 'Publicado',
    datos: {
      tipo: 'ficha-medica',
      puestoTrabajo: 'Ingeniero de Minas',
      presionArterial: '118/75',
      temperatura: '36.5°C',
      frecuenciaCardiaca: '74 lpm',
      frecuenciaRespiratoria: '15 rpm',
      saturacionOxigeno: '99%',
      peso: '70 kg',
      talla: '175 cm',
      indiceMasaCorporal: '22.9',
      perimetroAbdominal: '82 cm',
      antecedentesClinicosQuirurgicos: 'Sin antecedentes patológicos relevantes.',
      accidentesTrabajo: false,
      accidentesTrabajoSi: false,
      accidentesTrabajoEspecificar: '',
      enfermedadesProfesionales: false,
      enfermedadesProfesionalesSi: false,
      enfermedadesProfesionalesEspecificar: '',
      examenFisicoObservaciones: 'Examen físico completo normal. Sin hallazgos. IMC en rango normal.',
      nombresApellidosProfesional: 'Dra. María Fernanda López',
      codigoProfesional: '34568'
    },
    creadoPor: 'admin'
  },
  {
    id: 'FME-EMP1-004',
    discriminador: 'medico',
    tipo: 'ficha-medica',
    empresaId: 1,
    empleadoId: 8,
    titulo: 'Ficha Médica Ocupacional — Patricia González Huamán',
    fechaCreacion: '2025-06-15',
    estado: 'Publicado',
    datos: {
      tipo: 'ficha-medica',
      puestoTrabajo: 'Supervisora de Seguridad',
      presionArterial: '110/70',
      temperatura: '36.3°C',
      frecuenciaCardiaca: '76 lpm',
      frecuenciaRespiratoria: '16 rpm',
      saturacionOxigeno: '99%',
      peso: '62 kg',
      talla: '160 cm',
      indiceMasaCorporal: '24.2',
      perimetroAbdominal: '74 cm',
      antecedentesClinicosQuirurgicos: 'Cesárea (2018). Sin otras cirugías.',
      accidentesTrabajo: false,
      accidentesTrabajoSi: false,
      accidentesTrabajoEspecificar: '',
      enfermedadesProfesionales: false,
      enfermedadesProfesionalesSi: false,
      enfermedadesProfesionalesEspecificar: '',
      examenFisicoObservaciones: 'Examen ginecológico normal. Examen físico general sin hallazgos patológicos.',
      nombresApellidosProfesional: 'Dra. María Fernanda López',
      codigoProfesional: '34568'
    },
    creadoPor: 'admin'
  },
  {
    id: 'FME-EMP1-005',
    discriminador: 'medico',
    tipo: 'ficha-medica',
    empresaId: 1,
    empleadoId: 9,
    titulo: 'Ficha Médica Ocupacional — Carlos Martínez Quispe',
    fechaCreacion: '2025-06-15',
    estado: 'Publicado',
    datos: {
      tipo: 'ficha-medica',
      puestoTrabajo: 'Operador de Cargador Frontal',
      presionArterial: '135/88',
      temperatura: '36.7°C',
      frecuenciaCardiaca: '70 lpm',
      frecuenciaRespiratoria: '15 rpm',
      saturacionOxigeno: '97%',
      peso: '85 kg',
      talla: '170 cm',
      indiceMasaCorporal: '29.4',
      perimetroAbdominal: '98 cm',
      antecedentesClinicosQuirurgicos: 'Hipertensión arterial diagnosticada (2023). En tratamiento con Enalapril 10mg/día.',
      accidentesTrabajo: true,
      accidentesTrabajoSi: true,
      accidentesTrabajoEspecificar: 'Esguince de tobillo derecho (2022) — recuperación completa',
      enfermedadesProfesionales: false,
      enfermedadesProfesionalesSi: false,
      enfermedadesProfesionalesEspecificar: '',
      examenFisicoObservaciones: 'PA elevada. Se recomienda control periódico. Sin otros hallazgos relevantes.',
      nombresApellidosProfesional: 'Dr. Rolando Maldonado',
      codigoProfesional: '34567'
    },
    creadoPor: 'admin'
  },
  {
    id: 'FME-EMP1-006',
    discriminador: 'medico',
    tipo: 'ficha-medica',
    empresaId: 1,
    empleadoId: 10,
    titulo: 'Ficha Médica Ocupacional — Miguel Torres Alvarado',
    fechaCreacion: '2025-06-15',
    estado: 'Publicado',
    datos: {
      tipo: 'ficha-medica',
      puestoTrabajo: 'Soldador',
      presionArterial: '122/78',
      temperatura: '36.4°C',
      frecuenciaCardiaca: '72 lpm',
      frecuenciaRespiratoria: '14 rpm',
      saturacionOxigeno: '98%',
      peso: '75 kg',
      talla: '169 cm',
      indiceMasaCorporal: '26.3',
      perimetroAbdominal: '88 cm',
      antecedentesClinicosQuirurgicos: 'Sin antecedentes quirúrgicos. Miopía leve bilateral.',
      accidentesTrabajo: true,
      accidentesTrabajoSi: true,
      accidentesTrabajoEspecificar: 'Quemadura superficial en antebrazo izquierdo (2023) — curado sin secuelas',
      enfermedadesProfesionales: false,
      enfermedadesProfesionalesSi: false,
      enfermedadesProfesionalesEspecificar: '',
      examenFisicoObservaciones: 'Examen físico normal. Sin hallazgos de importancia. Agudeza visual corregida.',
      nombresApellidosProfesional: 'Dr. Rolando Maldonado',
      codigoProfesional: '34567'
    },
    creadoPor: 'admin'
  }
];

// Función para obtener documentos por empresa
export const getDocumentosByEmpresa = (empresaId) => {
  return documentosDinamicos.filter(doc => doc.empresaId === empresaId)
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
};

// Función para obtener documentos vinculados a un ítem del Anexo 1
export const getDocumentosByItem = (itemId) => {
  return documentosDinamicos.filter(doc => doc.vinculadoAItem === itemId);
};

// Función para obtener documentos por empresa y discriminador
export const getDocumentosByEmpresaYDiscriminador = (empresaId, discriminador) => {
  return documentosDinamicos.filter(doc => doc.empresaId === empresaId && doc.discriminador === discriminador)
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
};

// Función para crear un nuevo documento dinámico
export const crearDocumentoDinamico = (tipo, empresaId, datos, empleadoId = null, discriminador = 'general') => {
  const nuevoId = `DOC-${String(documentosDinamicos.length + 1).padStart(3, '0')}`;
  const nuevoDocumento = {
    id: nuevoId,
    discriminador,
    tipo,
    empresaId,
    empleadoId,
    titulo: datos.titulo || `${tipo} - ${nuevoId}`,
    fechaCreacion: new Date().toISOString().split('T')[0],
    datos,
    estado: 'Borrador',
    vinculadoAItem: null,
    creadoPor: 'admin'
  };
  documentosDinamicos.push(nuevoDocumento);
  return nuevoDocumento;
};

// Función para vincular documento a ítem del Anexo 1
export const vincularDocumentoAItem = (documentoId, itemId) => {
  const documento = documentosDinamicos.find(doc => doc.id === documentoId);
  if (documento) {
    documento.vinculadoAItem = itemId;
  }
};

// Función para actualizar documento
export const actualizarDocumentoDinamico = (documentoId, datos) => {
  const documento = documentosDinamicos.find(doc => doc.id === documentoId);
  if (documento) {
    Object.assign(documento, datos);
    documento.fechaActualizacion = new Date().toISOString().split('T')[0];
  }
};

// Función para publicar documento dinámico
export const publicarDocumentoDinamico = (documentoId) => {
  const documento = documentosDinamicos.find(doc => doc.id === documentoId);
  if (documento) {
    documento.estado = 'Publicado';
    documento.disponibleParaUsuario = true;
  }
};

// Función para eliminar documento dinámico
export const eliminarDocumentoDinamico = (documentoId) => {
  const index = documentosDinamicos.findIndex(doc => doc.id === documentoId);
  if (index !== -1) {
    documentosDinamicos.splice(index, 1);
    return true;
  }
  return false;
};

