import { useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { getDocumentosByEmpresa, crearDocumentoDinamico } from '../data/documentosDinamicosData';
import { renderToStaticMarkup } from 'react-dom/server';
import InspeccionAreasMulti from '../components/InspeccionAreasMulti';
import InduccionPersonalCocina from '../components/documentos/induccion/InduccionPersonalCocina';
import FichaMedicaEvaluacionRetiro from '../components/documentos/fichaMedica/FichaMedicaEvaluacionRetiro';

const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Generar documentos quemados según la actividad económica
const generarDocumentosPorActividad = (actividad, empresaId) => {
  const baseDocs = [];
  const fecha = new Date().toISOString().split('T')[0];
  
  // Documentos comunes a todas las actividades
  const documentosComunes = [
    {
      id: `doc-${empresaId}-induccion-1`,
      tipo: 'Inducción',
      titulo: 'Inducción General de Seguridad y Salud en el Trabajo',
      fecha: fecha,
      categoria: 'Inducción',
      actividad: actividad,
      datos: {
        tipo: 'induccion',
        area: 'General',
        fecha: fecha
      }
    }
  ];
  
  baseDocs.push(...documentosComunes);
  
  // Documentos específicos por actividad
  if (actividad?.toLowerCase().includes('minería') || actividad?.toLowerCase().includes('minera')) {
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección de Boca Mina',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Boca Mina',
          observaciones: 'Revisión de condiciones de la vía, cunetas y alcantarillas'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Polvorín',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Polvorín',
          observaciones: 'Verificación de almacenamiento de explosivos y productos compatibles'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-3`,
        tipo: 'Inspección',
        titulo: 'Inspección de Maquinaria Minera',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Maquinaria',
          observaciones: 'Revisión de estado de equipos de perforación, carga y transporte'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-4`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Trabajo Subterráneo',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Trabajo Subterráneo',
          observaciones: 'Verificación de ventilación, iluminación y señalización'
        }
      }
    );
  } else if (actividad?.toLowerCase().includes('agrícola') || actividad?.toLowerCase().includes('agricola')) {
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección de Silos de Almacenamiento',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Silos',
          observaciones: 'Revisión de condiciones de almacenamiento y seguridad de silos'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Maquinaria Agrícola',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Maquinaria Agrícola',
          observaciones: 'Verificación de tractores, cosechadoras y equipos de riego'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-3`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Cultivo',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Cultivos',
          observaciones: 'Revisión de condiciones de trabajo en campo y uso de agroquímicos'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-4`,
        tipo: 'Inspección',
        titulo: 'Inspección de Almacenes de Productos Químicos',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Almacén Químicos',
          observaciones: 'Verificación de almacenamiento seguro de fertilizantes y pesticidas'
        }
      }
    );
  } else if (actividad?.toLowerCase().includes('avícola') || actividad?.toLowerCase().includes('avicola')) {
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección de Galpones de Producción',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Galpones',
          observaciones: 'Revisión de condiciones de ventilación, temperatura y bioseguridad'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Procesamiento',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Procesamiento',
          observaciones: 'Verificación de condiciones sanitarias y de seguridad'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-3`,
        tipo: 'Inspección',
        titulo: 'Inspección de Equipos de Refrigeración',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Refrigeración',
          observaciones: 'Revisión de cámaras frigoríficas y sistemas de conservación'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-4`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Limpieza y Desinfección',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Limpieza',
          observaciones: 'Verificación de protocolos de bioseguridad y desinfección'
        }
      }
    );
  } else {
    // Documentos genéricos para otras actividades
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección General de Áreas',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'General',
          observaciones: 'Revisión general de condiciones de seguridad y salud'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Maquinaria y Equipos',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Maquinaria',
          observaciones: 'Verificación de estado y seguridad de equipos'
        }
      }
    );
  }
  
  return baseDocs;
};

// Repositorio de plantillas basado en Carpetas Drive.md
const repositorioTemplates = [
  // 1. INDUCCIONES
  {
    id: 'induccion-cocina',
    nombre: 'Inducción para Personal de Cocina',
    categoria: 'Inducciones',
    subcategoria: '1.1 Inducciones por Puesto',
    formato: 'word',
    actividadRecomendada: 'Avícola / Alimentos',
    icono: '🍳',
    descripcion: 'Inducción de riesgos higiénico-sanitarios, manejo de utensilios y prevención de caídas.',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Personal de Cocina',
      actividadesPuesto: 'Preparación de alimentos, limpieza de utensilios, manejo de equipos de cocción.'
    }
  },
  {
    id: 'induccion-mineria',
    nombre: 'Inducción para Personal de Minería Interior y Exterior',
    categoria: 'Inducciones',
    subcategoria: '1.1 Inducciones por Puesto',
    formato: 'word',
    actividadRecomendada: 'Minería',
    icono: '🧗',
    descripcion: 'Riesgos geológicos, ventilación, desprendimiento de rocas y uso de autorrescatador.',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Operador Minero / Ayudante',
      actividadesPuesto: 'Perforación, voladura, fortificación, acarreo y ventilación en interior mina.'
    }
  },
  {
    id: 'induccion-avicola',
    nombre: 'Inducción de Seguridad para Sector Avícola',
    categoria: 'Inducciones',
    subcategoria: '1.3 Todos los Riesgos - Avícolas',
    formato: 'word',
    actividadRecomendada: 'Avícola',
    icono: '🐔',
    descripcion: 'Protocolos de bioseguridad, riesgos biológicos y ergonomía en galpones.',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Operario de Galpón Avícola',
      actividadesPuesto: 'Alimentación de aves, recolección de huevos, desinfección de galpones.'
    }
  },
  {
    id: 'induccion-conductores',
    nombre: 'Inducción para Conductores y Choferes',
    categoria: 'Inducciones',
    subcategoria: '1.1 Inducciones por Puesto',
    formato: 'word',
    actividadRecomendada: 'Transporte',
    icono: '🚚',
    descripcion: 'Seguridad vial, fatiga, check-list de vehículo y conducción defensiva.',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Conductor / Chofer Profesional',
      actividadesPuesto: 'Operación de vehículos de carga/pasajeros, control de rutas, estiba de mercadería.'
    }
  },
  {
    id: 'reinduccion-sso',
    nombre: 'Reinducción General en Seguridad y Salud Ocupacional',
    categoria: 'Inducciones',
    subcategoria: '1.2 Reinducción',
    formato: 'word',
    actividadRecomendada: 'General',
    icono: '🔄',
    descripcion: 'Actualización de políticas de seguridad, plan de emergencia y reporte de incidentes.',
    datos: {
      tipo: 'induccion',
      puestoTrabajo: 'Todo el Personal (Anual)',
      actividadesPuesto: 'Revisión periódica de normas de seguridad, ergonomía de oficina y primeros auxilios.'
    }
  },

  // 2. COMITE PARITARIO
  {
    id: 'comite-acta',
    nombre: 'Acta de Reunión de Comité Paritario',
    categoria: 'Comité Paritario',
    subcategoria: '2. Comité Paritario - Actas',
    formato: 'word',
    actividadRecomendada: 'General',
    icono: '📋',
    descripcion: 'Formato oficial para asentar discusiones, inspecciones y acuerdos del comité.',
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
      ]
    }
  },
  {
    id: 'comite-cert-trabajador',
    nombre: 'Certificado de Designación de Miembro de Comité',
    categoria: 'Comité Paritario',
    subcategoria: '2. Comité Paritario - Certificados',
    formato: 'word',
    actividadRecomendada: 'General',
    icono: '🎖️',
    descripcion: 'Acreditación formal para miembros electos y designados del Comité Paritario.',
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
      ]
    }
  },

  // 5. REGISTRO ASISTENCIA
  {
    id: 'registro-entrada-salida',
    nombre: 'Control Diario de Asistencia del Personal',
    categoria: 'EPP / Firmas',
    subcategoria: '5. Registro de Entrada y Salida',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '⏰',
    descripcion: 'Formato excel de registro diario de entrada, salida, almuerzo y horas extra.',
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
      ]
    }
  },

  // 6. FORMATOS DE MANTENIMIENTO
  {
    id: 'maint-avicola-compresor',
    nombre: 'Mantenimiento de Compresores y Sopladores',
    categoria: 'Mantenimiento',
    subcategoria: '6. Mantenimiento - Avícolas',
    formato: 'excel',
    actividadRecomendada: 'Avícola',
    icono: '⚙️',
    descripcion: 'Control periódico de presiones, fugas de aire y lubricación en galpones.',
    datos: {
      tipo: 'inspeccion',
      secciones: [
        {
          area: 'Compresor / Soplador',
          items: [
            '¿El nivel de aceite de lubricación es correcto?',
            '¿Se verificó la ausencia de fugas de aire y aceite?',
            '¿La tensión y estado de las bandas es óptimo?',
            '¿Los filtros de aire se encuentran limpios?',
            '¿La temperatura de operación está en el rango normal?'
          ]
        }
      ]
    }
  },
  {
    id: 'maint-minas-cargadora',
    nombre: 'Mantenimiento de Cargadora de Bajo Perfil (Scooptram)',
    categoria: 'Mantenimiento',
    subcategoria: '6. Mantenimiento - Minas',
    formato: 'excel',
    actividadRecomendada: 'Minería',
    icono: '🚜',
    descripcion: 'Inspección de motor, sistema hidráulico, frenos y neumáticos en mina subterránea.',
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
      ]
    }
  },
  {
    id: 'maint-minas-polvorin',
    nombre: 'Inspección y Mantenimiento de Polvorín',
    categoria: 'Mantenimiento',
    subcategoria: '6. Mantenimiento - Minas',
    formato: 'excel',
    actividadRecomendada: 'Minería',
    icono: '💣',
    descripcion: 'Control de humedad, temperatura, orden y puesta a tierra en almacén de explosivos.',
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
      ]
    }
  },
  {
    id: 'maint-plantas-falcon',
    nombre: 'Mantenimiento de Concentrador Centrífugo Falcón',
    categoria: 'Mantenimiento',
    subcategoria: '6. Mantenimiento - Plantas',
    formato: 'excel',
    actividadRecomendada: 'Minería',
    icono: '🌀',
    descripcion: 'Control de vibración, presión de agua de fluidización y estado de la malla.',
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
      ]
    }
  },

  // 7. FORMATOS DE TRABAJO DE ALTO RIESGO
  {
    id: 'risk-alturas',
    nombre: 'Permiso de Trabajo en Alturas',
    categoria: 'Alto Riesgo',
    subcategoria: '7. Trabajo de Alto Riesgo',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '🧗',
    descripcion: 'Verificación de arnés de seguridad, línea de vida, puntos de anclaje y andamios.',
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
      ]
    }
  },
  {
    id: 'risk-confinados',
    nombre: 'Permiso de Entrada a Espacios Confinados',
    categoria: 'Alto Riesgo',
    subcategoria: '7. Trabajo de Alto Riesgo',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '🕳️',
    descripcion: 'Monitoreo de atmósfera, ventilación mecánica y presencia de vigía externo.',
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
      ]
    }
  },
  {
    id: 'risk-caliente',
    nombre: 'Permiso de Trabajo en Caliente',
    categoria: 'Alto Riesgo',
    subcategoria: '7. Trabajo de Alto Riesgo',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '🔥',
    descripcion: 'Control de chispas, retiro de combustibles y equipos de extinción listos.',
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
      ]
    }
  },

  // 8. ENTREGA DE EPP
  {
    id: 'epp-entrega',
    nombre: 'Registro de Entrega de Equipos de Protección',
    categoria: 'EPP / Firmas',
    subcategoria: '8. Entrega de EPP',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '🦺',
    descripcion: 'Acta de constancia de entrega de EPP, reposición y capacitación de uso.',
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
      ]
    }
  },
  {
    id: 'firmas-registro',
    nombre: 'Registro de Firmas de Charla de Seguridad',
    categoria: 'EPP / Firmas',
    subcategoria: '11. Registro de Firmas',
    formato: 'word',
    actividadRecomendada: 'General',
    icono: '✍️',
    descripcion: 'Formato estándar para registrar la asistencia y firma del personal.',
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
      ]
    }
  },

  // 9. INSPECCION DE BOTIQUIN
  {
    id: 'insp-botiquin',
    nombre: 'Inspección Periódica de Botiquines',
    categoria: 'Inspecciones / Otros',
    subcategoria: '9. Inspección de Botiquín',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '🩹',
    descripcion: 'Control mensual de insumos médicos mínimos y fechas de caducidad.',
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
      ]
    }
  },
  {
    id: 'insp-extintores',
    nombre: 'Inspección Mensual de Extintores',
    categoria: 'Inspecciones / Otros',
    subcategoria: '10. Inspección de Extintores',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '🧯',
    descripcion: 'Control mensual de presión, mangueras, boquilla, carga y acceso.',
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
      ]
    }
  },

  // 14. CHECKLIST SSO
  {
    id: 'checklist-sso-general',
    nombre: 'Checklist General de Gestión SSO',
    categoria: 'Inspecciones / Otros',
    subcategoria: '14. Checklist SSO',
    formato: 'excel',
    actividadRecomendada: 'General',
    icono: '✅',
    descripcion: 'Evaluación del cumplimiento de regulaciones ministeriales y del IESS.',
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
      ]
    }
  },

  // FICHA MEDICA
  {
    id: 'ficha-medica-general',
    nombre: 'Ficha Médica Ocupacional - Evaluación Inicial',
    categoria: 'Inspecciones / Otros',
    subcategoria: 'Ficha Médica',
    formato: 'pdf',
    actividadRecomendada: 'General',
    icono: '🩺',
    descripcion: 'Formato médico estándar para la evaluación pre-empleo y control periódico.',
    datos: {
      tipo: 'ficha-medica'
    }
  }
];

const categories = [
  { name: 'Todos', icon: '📁' },
  { name: 'Inducciones', icon: '📖' },
  { name: 'Comité Paritario', icon: '👥' },
  { name: 'Mantenimiento', icon: '🛠️' },
  { name: 'Alto Riesgo', icon: '⚠️' },
  { name: 'EPP / Firmas', icon: '🦺' },
  { name: 'Inspecciones / Otros', icon: '🔍' },
];

const tipoIconos = {
  induccion: '📖',
  comite: '📋',
  registro: '⏰',
  mantenimiento: '⚙️',
  permiso: '🧗',
  epp: '🦺',
  firma: '✍️',
  inspeccion: '🔍',
  checklist: '✅',
  'ficha-medica': '🩺',
  custom: '📄'
};

const FormulariosDinamicosEmpresa = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  
  // Estados para búsqueda, filtro y repositorio Notion
  const [busquedaTemplate, setBusquedaTemplate] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [mostrarRecomendados, setMostrarRecomendados] = useState(true);
  
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [datosDocumento, setDatosDocumento] = useState({});
  const previewRef = useRef(null);

  const [showCustomDocForm, setShowCustomDocForm] = useState(false);
  const [editingCustomDoc, setEditingCustomDoc] = useState(null);
  const [customDocForm, setCustomDocForm] = useState({
    titulo: '',
    codigo: '',
    categoria: 'Inducciones',
    archivo: null,
    archivoNombre: ''
  });

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const documentosEmpresa = getDocumentosByEmpresa(parseInt(empresaId)).filter(d => d.discriminador !== 'medico');

  // Inicializar plantillas habilitadas recomendadas para la empresa por defecto
  const [documentosHabilitadosIds, setDocumentosHabilitadosIds] = useState(() => {
    const activeIds = [];
    repositorioTemplates.forEach(temp => {
      const isGeneral = temp.actividadRecomendada === 'General';
      const isMiningEmp = empresa?.tipoActividad?.toLowerCase().includes('minería') || empresa?.tipoActividad?.toLowerCase().includes('minera');
      const isPoultryEmp = empresa?.tipoActividad?.toLowerCase().includes('avícola') || empresa?.tipoActividad?.toLowerCase().includes('avicola');
      const isTransportEmp = empresa?.tipoActividad?.toLowerCase().includes('transporte');
      
      const matchMining = temp.actividadRecomendada === 'Minería' && isMiningEmp;
      const matchPoultry = temp.actividadRecomendada === 'Avícola' && isPoultryEmp;
      const matchTransport = temp.actividadRecomendada === 'Transporte' && isTransportEmp;
      
      if (isGeneral || matchMining || matchPoultry || matchTransport) {
        activeIds.push(temp.id);
      }
    });
    return activeIds;
  });

  // Habilitar y deshabilitar plantillas
  const handleHabilitarTemplate = (templateId) => {
    setDocumentosHabilitadosIds(prev => [...prev, templateId]);
  };

  const handleDeshabilitarTemplate = (templateId) => {
    setDocumentosHabilitadosIds(prev => prev.filter(id => id !== templateId));
  };

  // Filtrar las plantillas del repositorio en base a la barra de búsqueda y filtros
  const templatesFiltrados = useMemo(() => {
    return repositorioTemplates.filter(temp => {
      // 1. Filtro de Texto
      if (busquedaTemplate) {
        const query = busquedaTemplate.toLowerCase();
        const matchesName = temp.nombre.toLowerCase().includes(query);
        const matchesDesc = temp.descripcion.toLowerCase().includes(query);
        const matchesSub = temp.subcategoria.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSub) return false;
      }

      // 2. Filtro de Categoría (Píldoras)
      if (filtroCategoria !== 'Todos') {
        if (temp.categoria !== filtroCategoria) return false;
      }

      // 3. Recomendaciones Inteligentes (basado en industria de empresa)
      if (mostrarRecomendados) {
        const isGeneral = temp.actividadRecomendada === 'General';
        const isMiningEmp = empresa?.tipoActividad?.toLowerCase().includes('minería') || empresa?.tipoActividad?.toLowerCase().includes('minera');
        const isPoultryEmp = empresa?.tipoActividad?.toLowerCase().includes('avícola') || empresa?.tipoActividad?.toLowerCase().includes('avicola');
        const isTransportEmp = empresa?.tipoActividad?.toLowerCase().includes('transporte');
        
        const matchMining = temp.actividadRecomendada === 'Minería' && isMiningEmp;
        const matchPoultry = temp.actividadRecomendada === 'Avícola' && isPoultryEmp;
        const matchTransport = temp.actividadRecomendada === 'Transporte' && isTransportEmp;

        if (!isGeneral && !matchMining && !matchPoultry && !matchTransport) {
          return false;
        }
      }

      return true;
    });
  }, [busquedaTemplate, filtroCategoria, mostrarRecomendados, empresa]);
  
  // Rellenar una plantilla del repositorio
  const handleRellenarTemplate = (template) => {
    let defaultDatos = { ...template.datos };
    
    if (template.categoria === 'Ficha Médica' || template.datos?.tipo === 'ficha-medica') {
      defaultDatos = {
        ...defaultDatos,
        nombreEmpresa: empresa?.name || 'Empresa',
        institucion: empresa?.name || 'Institución',
        ruc: empresa?.ruc || '',
        ciiu: empresa?.ciiu || '',
        fechaEvaluacion: new Date().toISOString().split('T')[0]
      };
    } else if (template.categoria === 'Inducciones' || template.datos?.tipo === 'induccion') {
      defaultDatos = {
        ...defaultDatos,
        nombreEmpresa: empresa?.name || 'Empresa',
        fecha: new Date().toLocaleDateString('es-ES')
      };
    } else {
      // Inspección / Mantenimiento / Alto Riesgo
      defaultDatos = {
        ...defaultDatos,
        nombreEmpresa: empresa?.name || 'Empresa',
        fechaInspeccion: new Date().toISOString().split('T')[0],
        tecnicoResponsable: 'Ing. Administrador de Seguridad',
        nombreEncargado: 'Ing. Administrador de Seguridad'
      };
    }

    const virtualDoc = {
      id: `temp-${template.id}-${Date.now()}`,
      tipo: template.categoria === 'Ficha Médica' ? 'Ficha Médica' : template.categoria === 'Inducciones' ? 'Inducción' : 'Inspección',
      titulo: template.nombre,
      categoria: template.categoria,
      fecha: new Date().toISOString().split('T')[0],
      datos: defaultDatos
    };
    setDocumentoSeleccionado(virtualDoc);
    setDatosDocumento(virtualDoc.datos);
  };

  // Abrir formulario de documento personalizado (nuevo)
  const handleOpenCustomDocForm = () => {
    setEditingCustomDoc(null);
    setCustomDocForm({
      titulo: '',
      codigo: '',
      categoria: 'Inducciones',
      archivo: null,
      archivoNombre: ''
    });
    setShowCustomDocForm(true);
  };

  // Abrir formulario de documento personalizado (editar)
  const handleEditCustomDoc = (doc) => {
    setEditingCustomDoc(doc);
    setCustomDocForm({
      titulo: doc.titulo || '',
      codigo: doc.datos?.codigo || '',
      categoria: doc.datos?.categoria || 'Inducciones',
      archivo: null,
      archivoNombre: doc.datos?.archivo || ''
    });
    setShowCustomDocForm(true);
  };

  // Guardar documento personalizado
  const handleSaveCustomDoc = () => {
    if (!customDocForm.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const tipoMap = {
      'Inducciones': 'induccion',
      'Comité Paritario': 'comite',
      'Mantenimiento': 'mantenimiento',
      'Alto Riesgo': 'permiso',
      'EPP / Firmas': 'epp',
      'Inspecciones / Otros': 'inspeccion'
    };
    const tipo = tipoMap[customDocForm.categoria] || 'custom';

    if (editingCustomDoc) {
      const idx = documentosDinamicos.findIndex(d => d.id === editingCustomDoc.id);
      if (idx !== -1) {
        documentosDinamicos[idx] = {
          ...documentosDinamicos[idx],
          titulo: customDocForm.titulo.trim(),
          tipo,
          datos: {
            ...documentosDinamicos[idx].datos,
            codigo: customDocForm.codigo.trim() || documentosDinamicos[idx].datos?.codigo,
            categoria: customDocForm.categoria,
            archivo: customDocForm.archivoNombre || documentosDinamicos[idx].datos?.archivo
          }
        };
      }
    } else {
      crearDocumentoDinamico(
        tipo,
        parseInt(empresaId),
        {
          titulo: customDocForm.titulo.trim(),
          codigo: customDocForm.codigo.trim() || `DOC-${Date.now()}`,
          categoria: customDocForm.categoria,
          archivo: customDocForm.archivoNombre,
          tipo
        },
        null
      );
    }

    setShowCustomDocForm(false);
    setEditingCustomDoc(null);
  };
  
  // Manejar cambio de campo editable en formulario dinámico
  const handleFieldChange = useCallback((field, value) => {
    setDatosDocumento(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // Renderizar documento según tipo en el editor inline
  const renderDocumento = () => {
    if (!documentoSeleccionado) return null;
    
    const { tipo, datos } = documentoSeleccionado;
    
    if (tipo === 'Inspección' || datos?.tipo === 'inspeccion') {
      return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg" ref={previewRef}>
          <InspeccionAreasMulti
            logoEmpresa={empresa?.logo}
            nombreEmpresa={datosDocumento.nombreEmpresa || empresa?.name || datos?.nombreEmpresa || "ASOPROMIN S.A."}
            fechaInspeccion={datosDocumento.fechaInspeccion || datos?.fecha || new Date().toISOString().split('T')[0]}
            tecnicoResponsable={datosDocumento.tecnicoResponsable || datosDocumento.nombreEncargado || datos?.tecnicoResponsable || datos?.nombreEncargado || "_________________"}
            secciones={datosDocumento.secciones || datos?.secciones || [
              {
                area: datosDocumento.area || datos?.area || "Área de Inspección",
                items: datos?.items || ["¿Condiciones generales de seguridad?"]
              }
            ]}
            editable={true}
            onFieldChange={handleFieldChange}
          />
        </div>
      );
    }
    
    if (tipo === 'Inducción' || datos?.tipo === 'induccion') {
      return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg" ref={previewRef}>
          <InduccionPersonalCocina
            logoEmpresa={empresa?.logo}
            nombreEmpresa={datosDocumento.nombreEmpresa || empresa?.name || "Empresa"}
            nombreTrabajador={datosDocumento.nombreTrabajador || datos?.nombreTrabajador || "_________________"}
            numeroCedula={datosDocumento.numeroCedula || datos?.numeroCedula || "_________________"}
            fecha={datosDocumento.fecha || datos?.fecha || new Date().toLocaleDateString('es-ES')}
            puestoTrabajo={datosDocumento.puestoTrabajo || datos?.puestoTrabajo || "_________________"}
            actividadesPuesto={datosDocumento.actividadesPuesto || datos?.actividadesPuesto || "________________________________________________________________________________________________________________"}
            editable={true}
            onFieldChange={handleFieldChange}
          />
        </div>
      );
    }
    
    if (tipo === 'Ficha Médica' || datos?.tipo === 'ficha-medica') {
      return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg" ref={previewRef}>
          <FichaMedicaEvaluacionRetiro
            logoEmpresa={empresa?.logo}
            nombreEmpresa={datosDocumento.nombreEmpresa || empresa?.name || "Empresa"}
            institucion={datosDocumento.institucion || empresa?.name || "Institución"}
            ruc={datosDocumento.ruc || empresa?.ruc || ""}
            ciiu={datosDocumento.ciiu || empresa?.ciiu || ""}
            primerApellido={datosDocumento.primerApellido || datos?.primerApellido || ""}
            segundoApellido={datosDocumento.segundoApellido || datos?.segundoApellido || ""}
            nombres={datosDocumento.nombres || datos?.nombres || ""}
            numeroCedula={datosDocumento.numeroCedula || datos?.numeroCedula || ""}
            editable={true}
            onFieldChange={handleFieldChange}
          />
        </div>
      );
    }
    
    return (
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <p className="text-gray-500">Tipo de documento no soportado para edición</p>
      </div>
    );
  };

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Empresa no encontrada</p>
        </div>
      </div>
    );
  }

  // Si hay un documento seleccionado, mostrar el editor inline
  if (documentoSeleccionado) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => {
                  setDocumentoSeleccionado(null);
                  setDatosDocumento({});
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al Repositorio
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{documentoSeleccionado.titulo}</h1>
              <p className="text-gray-600 mt-1">
                {empresa.name} • {empresa.tipoActividad} • {documentoSeleccionado.categoria}
              </p>
            </div>
          </div>
        </div>

        {/* Documento editable */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Modo Edición:</strong> Haz clic en cualquier texto para editarlo directamente en el documento.
            </p>
          </div>
          {renderDocumento()}
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setDocumentoSeleccionado(null);
                setDatosDocumento({});
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Imprimir
            </button>
            <button
              onClick={() => {
                const nuevoDocumento = crearDocumentoDinamico(
                  documentoSeleccionado.datos?.tipo || documentoSeleccionado.tipo.toLowerCase(),
                  parseInt(empresaId),
                  {
                    ...datosDocumento,
                    ...documentoSeleccionado.datos,
                    titulo: documentoSeleccionado.titulo
                  },
                  null
                );
                alert('Documento guardado exitosamente');
                setDocumentoSeleccionado(null);
                setDatosDocumento({});
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 transition-colors font-semibold"
            >
              Guardar Documento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modal de Formulario Personalizado */}
      {showCustomDocForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCustomDoc ? 'Editar Formato' : 'Crear Formato Personalizado'}
              </h2>
              <button
                onClick={() => { setShowCustomDocForm(false); setEditingCustomDoc(null); }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Campos del formulario */}
            <div className="p-6 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={customDocForm.titulo}
                  onChange={(e) => setCustomDocForm(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ej: Inducción de Seguridad Minera"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Código */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={customDocForm.codigo}
                  onChange={(e) => setCustomDocForm(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Ej: IND-2025-001 (opcional, se auto-genera)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Tipo / Categoría */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo / Categoría *</label>
                <select
                  value={customDocForm.categoria}
                  onChange={(e) => setCustomDocForm(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm bg-white"
                >
                  <option value="Inducciones">📖 Inducciones</option>
                  <option value="Comité Paritario">👥 Comité Paritario</option>
                  <option value="Mantenimiento">🛠️ Mantenimiento</option>
                  <option value="Alto Riesgo">⚠️ Alto Riesgo</option>
                  <option value="EPP / Firmas">🦺 EPP / Firmas</option>
                  <option value="Inspecciones / Otros">🔍 Inspecciones / Otros</option>
                </select>
              </div>

              {/* Archivo adjunto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Archivo adjunto</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {customDocForm.archivoNombre || 'Seleccionar archivo (PDF, Word, Excel, imagen)'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setCustomDocForm(prev => ({ ...prev, archivo: file, archivoNombre: file.name }));
                      }
                    }}
                  />
                </label>
                {customDocForm.archivoNombre && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {customDocForm.archivoNombre}
                    <button
                      onClick={(e) => { e.stopPropagation(); setCustomDocForm(prev => ({ ...prev, archivo: null, archivoNombre: '' })); }}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vista previa</label>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2.5 bg-white rounded-xl border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                      {tipoIconos[customDocForm.categoria === 'Inducciones' ? 'induccion' : customDocForm.categoria === 'Comité Paritario' ? 'comite' : customDocForm.categoria === 'Mantenimiento' ? 'mantenimiento' : customDocForm.categoria === 'Alto Riesgo' ? 'permiso' : customDocForm.categoria === 'EPP / Firmas' ? 'epp' : 'inspeccion'] || '📄'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {customDocForm.titulo || 'Título del documento'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {customDocForm.categoria} • {customDocForm.codigo || 'Sin código'} • {customDocForm.archivoNombre || 'Sin archivo'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => { setShowCustomDocForm(false); setEditingCustomDoc(null); }}
                className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCustomDoc}
                className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/95 transition-colors text-sm font-bold"
              >
                {editingCustomDoc ? 'Guardar Cambios' : 'Guardar Documento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header de la sección */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileTextIcon className="w-8 h-8 text-primary" />
          Formularios Dinámicos
        </h1>
        <p className="text-gray-600 mt-1">
          Crear y gestionar documentos dinámicos para <strong>{empresa.name}</strong>
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {empresa.tipoActividad || 'Actividad no especificada'}
          </span>
        </div>
      </div>

      {/* Catálogo de Repositorio de Documentos (Notion-Style) */}
      <div className="space-y-6">
        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                📂 Documentos Disponibles
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold border border-gray-200 shadow-sm">
                {templatesFiltrados.length} {templatesFiltrados.length === 1 ? 'plantilla' : 'plantillas'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              {/* Buscador */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar plantilla por nombre, subcarpeta o descripción..."
                  value={busquedaTemplate}
                  onChange={(e) => setBusquedaTemplate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white text-gray-850 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm text-sm"
                />
                {busquedaTemplate && (
                  <button
                    onClick={() => setBusquedaTemplate('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filtro Inteligente */}
              <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-700">Recomendaciones Inteligentes</h3>
                    <p className="text-[10px] text-gray-500">Filtrar para sector {empresa.tipoActividad}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarRecomendados(!mostrarRecomendados)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${mostrarRecomendados ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mostrarRecomendados ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>

            {/* Categorías (Píldoras) */}
            <div className="flex items-center overflow-x-auto gap-2 pb-1 scrollbar-thin scrollbar-thumb-gray-205 scrollbar-track-transparent">
              {categories.map((cat) => {
                const isSelected = filtroCategoria === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setFiltroCategoria(cat.name)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-150 hover:text-gray-800 border border-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Malla de Plantillas */}
        {templatesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <span className="text-3xl">🗂️</span>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No se encontraron plantillas</h3>
            <p className="mt-1 text-xs text-gray-500">Prueba cambiando tu búsqueda o desactivando el Filtro Inteligente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Tarjeta "+" para crear formato personalizado */}
            <div
              onClick={handleOpenCustomDocForm}
              className="flex flex-col justify-center items-center rounded-2xl bg-gray-50 p-5 border-2 border-dashed border-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer opacity-60 hover:opacity-100 min-h-[280px]"
            >
              <div className="w-14 h-14 rounded-full bg-gray-200 hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">Crear Formato</p>
              <p className="text-xs text-gray-400 mt-1 text-center">Documento personalizado</p>
            </div>
            {templatesFiltrados.map((temp) => {
              const isHabilitado = documentosHabilitadosIds.includes(temp.id);
              return (
                <div
                  key={temp.id}
                  className={`flex flex-col justify-between rounded-2xl bg-white p-5 border-2 transition-all duration-300 ${
                    isHabilitado
                      ? 'border-primary/30 shadow-sm shadow-primary/5 hover:shadow-md'
                      : 'border-dashed border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Badge y Formato */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        temp.formato === 'excel'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : temp.formato === 'word'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        .{temp.formato === 'excel' ? 'xlsx' : temp.formato === 'word' ? 'docx' : 'pdf'}
                      </span>
                      {isHabilitado ? (
                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-150">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Activo
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-55 text-gray-500 text-[10px] font-medium border border-gray-200">
                          Disponible
                        </div>
                      )}
                    </div>

                    {/* Información Principal */}
                    <div className="flex items-start gap-3">
                      <span className="text-3xl p-2.5 bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-center shrink-0 shadow-sm">
                        {temp.icono}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
                          {temp.nombre}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <span>📂</span> {temp.subcategoria}
                        </p>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed min-h-[48px]">
                      {temp.descripcion}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    {isHabilitado ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDeshabilitarTemplate(temp.id)}
                          className="flex-1 px-3 py-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-650 transition-colors text-xs font-bold border border-gray-200 hover:border-red-200"
                        >
                          Desactivar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRellenarTemplate(temp)}
                          className="flex-1 px-3 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl transition-colors text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Rellenar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleHabilitarTemplate(temp.id)}
                        className="w-full px-3 py-2 border-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar a la Empresa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Documentos creados anteriormente */}
      {documentosEmpresa.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Creados ({documentosEmpresa.length})</h2>
          <div className="space-y-2">
            {documentosEmpresa.map(doc => (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-center shrink-0 shadow-sm">
                    {tipoIconos[doc.tipo] || '📄'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{doc.titulo}</p>
                    <p className="text-sm text-gray-500">
                      {doc.tipo} • {doc.fechaCreacion} • {doc.estado}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCustomDoc(doc)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulariosDinamicosEmpresa;
