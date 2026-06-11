// Registro de actividades del sistema (Audit Log)
export let actividadesLog = [
  {
    id: 1,
    usuarioId: 2,
    usuario: 'María González',
    rol: 'coordinador',
    accion: 'Crear Empresa',
    modulo: 'Empresas',
    descripcion: 'Creó la empresa "Constructora Los Pinos S.A."',
    detalles: {
      empresaId: 4,
      empresaNombre: 'Constructora Los Pinos S.A.',
      tipoActividad: 'Construcción'
    },
    fecha: '2025-12-10',
    hora: '09:15:23',
    ipAddress: '192.168.1.45'
  },
  {
    id: 2,
    usuarioId: 3,
    usuario: 'Carlos Ruiz',
    rol: 'gestor_documentos',
    accion: 'Crear Documento',
    modulo: 'Documentos',
    descripcion: 'Creó documento de inspección "Inspección General de Seguridad"',
    detalles: {
      documentoId: 125,
      tipo: 'Inspección',
      empresaId: 1
    },
    fecha: '2025-12-10',
    hora: '10:30:45',
    ipAddress: '192.168.1.52'
  },
  {
    id: 3,
    usuarioId: 4,
    usuario: 'Ana Torres',
    rol: 'capacitador',
    accion: 'Crear Capacitación',
    modulo: 'Capacitaciones',
    descripcion: 'Creó capacitación "Uso Correcto de EPP en Minería"',
    detalles: {
      capacitacionId: 15,
      empresaId: 1,
      fechaProgramada: '2025-12-20',
      estado: 'Programada'
    },
    fecha: '2025-12-11',
    hora: '11:20:10',
    ipAddress: '192.168.1.67'
  },
  {
    id: 4,
    usuarioId: 5,
    usuario: 'Pedro Méndez',
    rol: 'evaluador',
    accion: 'Crear Evaluación',
    modulo: 'Evaluaciones',
    descripcion: 'Creó evaluación "Test de Seguridad Básica en Construcción"',
    detalles: {
      evaluacionId: 8,
      capacitacionId: 3,
      numeroPreguntas: 10,
      estado: 'Borrador'
    },
    fecha: '2025-12-11',
    hora: '14:45:30',
    ipAddress: '192.168.1.89'
  },
  {
    id: 5,
    usuarioId: 2,
    usuario: 'María González',
    rol: 'coordinador',
    accion: 'Actualizar Empresa',
    modulo: 'Empresas',
    descripcion: 'Actualizó información de "Minera Los Andes S.A."',
    detalles: {
      empresaId: 1,
      cambios: ['contactPhone', 'address']
    },
    fecha: '2025-12-12',
    hora: '08:50:15',
    ipAddress: '192.168.1.45'
  },
  {
    id: 6,
    usuarioId: 3,
    usuario: 'Carlos Ruiz',
    rol: 'gestor_documentos',
    accion: 'Publicar Documento',
    modulo: 'Documentos',
    descripcion: 'Publicó documento "Inducción para Personal de Cocina"',
    detalles: {
      documentoId: 128,
      tipo: 'Inducción',
      estadoAnterior: 'Borrador',
      estadoNuevo: 'Publicado'
    },
    fecha: '2025-12-12',
    hora: '10:15:40',
    ipAddress: '192.168.1.52'
  },
  {
    id: 7,
    usuarioId: 4,
    usuario: 'Ana Torres',
    rol: 'capacitador',
    accion: 'Finalizar Capacitación',
    modulo: 'Capacitaciones',
    descripcion: 'Finalizó capacitación "Seguridad en Minería Subterránea"',
    detalles: {
      capacitacionId: 1,
      empresaId: 1,
      estadoAnterior: 'En curso',
      estadoNuevo: 'Finalizada'
    },
    fecha: '2025-12-12',
    hora: '16:30:25',
    ipAddress: '192.168.1.67'
  },
  {
    id: 8,
    usuarioId: 5,
    usuario: 'Pedro Méndez',
    rol: 'evaluador',
    accion: 'Activar Evaluación',
    modulo: 'Evaluaciones',
    descripcion: 'Activó evaluación "Evaluación: Seguridad en Minería Subterránea"',
    detalles: {
      evaluacionId: 1,
      capacitacionId: 1,
      estadoAnterior: 'Borrador',
      estadoNuevo: 'Activa'
    },
    fecha: '2025-12-13',
    hora: '09:05:50',
    ipAddress: '192.168.1.89'
  },
  {
    id: 9,
    usuarioId: 2,
    usuario: 'María González',
    rol: 'coordinador',
    accion: 'Crear Empleado',
    modulo: 'Empleados',
    descripcion: 'Registró nuevo empleado "Luis Fernando Castillo"',
    detalles: {
      empleadoId: 25,
      empresaId: 1,
      cargo: 'Supervisor de Seguridad'
    },
    fecha: '2025-12-13',
    hora: '11:25:35',
    ipAddress: '192.168.1.45'
  },
  {
    id: 10,
    usuarioId: 3,
    usuario: 'Carlos Ruiz',
    rol: 'gestor_documentos',
    accion: 'Eliminar Documento',
    modulo: 'Documentos',
    descripcion: 'Eliminó documento borrador "Informe Preliminar"',
    detalles: {
      documentoId: 130,
      tipo: 'Informe',
      estado: 'Borrador'
    },
    fecha: '2025-12-13',
    hora: '13:40:20',
    ipAddress: '192.168.1.52'
  },
  {
    id: 11,
    usuarioId: 4,
    usuario: 'Ana Torres',
    rol: 'capacitador',
    accion: 'Editar Capacitación',
    modulo: 'Capacitaciones',
    descripcion: 'Actualizó fecha de capacitación "Manejo Seguro de Maquinaria Agrícola"',
    detalles: {
      capacitacionId: 2,
      cambios: ['fechaProgramada'],
      fechaAnterior: '2025-12-15',
      fechaNueva: '2025-12-22'
    },
    fecha: '2025-12-13',
    hora: '15:10:45',
    ipAddress: '192.168.1.67'
  },
  {
    id: 12,
    usuarioId: 5,
    usuario: 'Pedro Méndez',
    rol: 'evaluador',
    accion: 'Guardar Plantilla',
    modulo: 'Evaluaciones',
    descripcion: 'Guardó plantilla de evaluación "Seguridad Industrial Básica"',
    detalles: {
      plantillaId: 4,
      numeroPreguntas: 8,
      categoria: 'Seguridad'
    },
    fecha: '2025-12-14',
    hora: '08:30:15',
    ipAddress: '192.168.1.89'
  },
  {
    id: 13,
    usuarioId: 2,
    usuario: 'María González',
    rol: 'coordinador',
    accion: 'Actualizar Empleado',
    modulo: 'Empleados',
    descripcion: 'Actualizó cargo de "Juan Carlos Pérez García"',
    detalles: {
      empleadoId: 1,
      empresaId: 1,
      cargoAnterior: 'Operador',
      cargoNuevo: 'Jefe de Operaciones'
    },
    fecha: '2025-12-14',
    hora: '10:20:50',
    ipAddress: '192.168.1.45'
  },
  {
    id: 14,
    usuarioId: 3,
    usuario: 'Carlos Ruiz',
    rol: 'gestor_documentos',
    accion: 'Crear Documento Dinámico',
    modulo: 'Formularios Dinámicos',
    descripcion: 'Creó formulario dinámico "Check List de Equipos"',
    detalles: {
      formularioId: 8,
      tipo: 'checklist',
      numeroCampos: 15
    },
    fecha: '2025-12-14',
    hora: '12:15:30',
    ipAddress: '192.168.1.52'
  },
  {
    id: 15,
    usuarioId: 1,
    usuario: 'Super Administrador',
    rol: 'super_admin',
    accion: 'Acceder al Log',
    modulo: 'Registro de Actividades',
    descripcion: 'Consultó el registro de actividades del sistema',
    detalles: {
      filtros: 'últimos 7 días',
      totalRegistros: 15
    },
    fecha: '2025-12-14',
    hora: '14:05:20',
    ipAddress: '192.168.1.10'
  }
];

// Función para agregar nueva actividad
export const registrarActividad = (actividad) => {
  const nuevaActividad = {
    id: actividadesLog.length + 1,
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('es-ES'),
    ipAddress: '192.168.1.100',
    ...actividad
  };
  actividadesLog.unshift(nuevaActividad); // Agregar al inicio
  return nuevaActividad;
};

// Tipos de acciones
export const tiposAccion = [
  'Crear Empresa',
  'Actualizar Empresa',
  'Eliminar Empresa',
  'Crear Empleado',
  'Actualizar Empleado',
  'Eliminar Empleado',
  'Crear Documento',
  'Editar Documento',
  'Publicar Documento',
  'Eliminar Documento',
  'Crear Capacitación',
  'Editar Capacitación',
  'Finalizar Capacitación',
  'Eliminar Capacitación',
  'Crear Evaluación',
  'Editar Evaluación',
  'Activar Evaluación',
  'Eliminar Evaluación',
  'Guardar Plantilla',
  'Crear Anexo 1',
  'Editar Anexo 1',
  'Acceder al Log',
  'Login',
  'Logout'
];

// Módulos del sistema
export const modulosSistema = [
  'Dashboard',
  'Empresas',
  'Empleados',
  'Documentos',
  'Capacitaciones',
  'Evaluaciones',
  'Anexo 1',
  'Formularios Dinámicos',
  'Repositorio',
  'Registro de Actividades',
  'Configuración'
];
