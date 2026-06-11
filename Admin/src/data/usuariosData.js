// Usuarios del sistema con diferentes roles
export const usuarios = [
  {
    id: 1,
    usuario: 'admin',
    password: '123',
    nombre: 'Super Administrador',
    rol: 'super_admin',
    email: 'admin@mediseg.com',
    avatar: null,
    activo: true,
    fechaCreacion: '2024-01-01'
  },
  {
    id: 2,
    usuario: 'maria.gonzalez',
    password: 'maria123',
    nombre: 'María González',
    rol: 'coordinador',
    email: 'maria.gonzalez@mediseg.com',
    avatar: null,
    activo: true,
    fechaCreacion: '2024-06-15'
  },
  {
    id: 3,
    usuario: 'carlos.ruiz',
    password: 'carlos123',
    nombre: 'Carlos Ruiz',
    rol: 'gestor_documentos',
    email: 'carlos.ruiz@mediseg.com',
    avatar: null,
    activo: true,
    fechaCreacion: '2024-08-20'
  },
  {
    id: 4,
    usuario: 'ana.torres',
    password: 'ana123',
    nombre: 'Ana Torres',
    rol: 'capacitador',
    email: 'ana.torres@mediseg.com',
    avatar: null,
    activo: true,
    fechaCreacion: '2024-09-10'
  },
  {
    id: 5,
    usuario: 'pedro.mendez',
    password: 'pedro123',
    nombre: 'Pedro Méndez',
    rol: 'evaluador',
    email: 'pedro.mendez@mediseg.com',
    avatar: null,
    activo: true,
    fechaCreacion: '2024-10-05'
  }
];

// Descripción de roles
export const rolesDescripcion = {
  super_admin: {
    nombre: 'Super Administrador',
    descripcion: 'Acceso total al sistema, puede ver todas las actividades',
    color: 'bg-red-600',
    permisos: ['ver_todo', 'crear', 'editar', 'eliminar', 'configurar', 'ver_actividades']
  },
  coordinador: {
    nombre: 'Coordinador',
    descripcion: 'Gestiona empresas, empleados y coordina actividades',
    color: 'bg-blue-600',
    permisos: ['ver_empresas', 'crear_empresas', 'editar_empresas', 'ver_empleados']
  },
  gestor_documentos: {
    nombre: 'Gestor de Documentos',
    descripcion: 'Crea y gestiona documentos del sistema',
    color: 'bg-green-600',
    permisos: ['ver_documentos', 'crear_documentos', 'editar_documentos', 'eliminar_documentos']
  },
  capacitador: {
    nombre: 'Capacitador',
    descripcion: 'Gestiona capacitaciones y evaluaciones',
    color: 'bg-purple-600',
    permisos: ['ver_capacitaciones', 'crear_capacitaciones', 'editar_capacitaciones']
  },
  evaluador: {
    nombre: 'Evaluador',
    descripcion: 'Crea y gestiona evaluaciones',
    color: 'bg-orange-600',
    permisos: ['ver_evaluaciones', 'crear_evaluaciones', 'editar_evaluaciones']
  }
};

// Credenciales para mostrar al usuario
export const credencialesUsuarios = `
CREDENCIALES DE ACCESO AL SISTEMA:

1. Super Administrador:
   Usuario: admin
   Contraseña: 123
   Rol: Super Administrador (Acceso total)

2. Coordinador:
   Usuario: maria.gonzalez
   Contraseña: maria123
   Rol: Coordinador (Gestión de empresas y empleados)

3. Gestor de Documentos:
   Usuario: carlos.ruiz
   Contraseña: carlos123
   Rol: Gestor de Documentos (Creación y gestión de documentos)

4. Capacitador:
   Usuario: ana.torres
   Contraseña: ana123
   Rol: Capacitador (Gestión de capacitaciones)

5. Evaluador:
   Usuario: pedro.mendez
   Contraseña: pedro123
   Rol: Evaluador (Gestión de evaluaciones)
`;
