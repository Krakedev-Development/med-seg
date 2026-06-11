import { useState, useMemo } from 'react';
import { actividadesLog, modulosSistema, tiposAccion } from '../data/actividadesData';
import { rolesDescripcion } from '../data/usuariosData';

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FolderIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const RegistroActividades = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModulo, setFilterModulo] = useState('Todos');
  const [filterUsuario, setFilterUsuario] = useState('Todos');
  const [filterAccion, setFilterAccion] = useState('Todas');
  const [filterFecha, setFilterFecha] = useState('');
  const [selectedActividad, setSelectedActividad] = useState(null);

  // Obtener usuarios únicos
  const usuariosUnicos = useMemo(() => {
    const usuarios = [...new Set(actividadesLog.map(a => a.usuario))];
    return usuarios.sort();
  }, []);

  // Filtrar actividades
  const actividadesFiltradas = useMemo(() => {
    return actividadesLog.filter(actividad => {
      const matchSearch = 
        actividad.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.modulo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchModulo = filterModulo === 'Todos' || actividad.modulo === filterModulo;
      const matchUsuario = filterUsuario === 'Todos' || actividad.usuario === filterUsuario;
      const matchAccion = filterAccion === 'Todas' || actividad.accion === filterAccion;
      const matchFecha = !filterFecha || actividad.fecha === filterFecha;

      return matchSearch && matchModulo && matchUsuario && matchAccion && matchFecha;
    });
  }, [actividadesLog, searchTerm, filterModulo, filterUsuario, filterAccion, filterFecha]);

  const getAccionColor = (accion) => {
    if (accion.includes('Crear')) return 'bg-green-100 text-green-800';
    if (accion.includes('Eliminar')) return 'bg-red-100 text-red-800';
    if (accion.includes('Actualizar') || accion.includes('Editar')) return 'bg-blue-100 text-blue-800';
    if (accion.includes('Activar') || accion.includes('Publicar')) return 'bg-purple-100 text-purple-800';
    if (accion.includes('Finalizar')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRolColor = (rol) => {
    return rolesDescripcion[rol]?.color || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Registro de Actividades</h1>
        <p className="text-gray-600 mt-1">
          Historial completo de todas las acciones realizadas en el sistema
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Actividades</p>
              <p className="text-2xl font-bold text-gray-800">{actividadesLog.length}</p>
            </div>
            <ActivityIcon className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-800">{usuariosUnicos.length}</p>
            </div>
            <UserIcon className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Módulos Activos</p>
              <p className="text-2xl font-bold text-gray-800">{[...new Set(actividadesLog.map(a => a.modulo))].length}</p>
            </div>
            <FolderIcon className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoy</p>
              <p className="text-2xl font-bold text-gray-800">
                {actividadesLog.filter(a => a.fecha === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <ClockIcon className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <select
            value={filterModulo}
            onChange={(e) => setFilterModulo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Todos">Todos los módulos</option>
            {modulosSistema.map(modulo => (
              <option key={modulo} value={modulo}>{modulo}</option>
            ))}
          </select>

          <select
            value={filterUsuario}
            onChange={(e) => setFilterUsuario(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Todos">Todos los usuarios</option>
            {usuariosUnicos.map(usuario => (
              <option key={usuario} value={usuario}>{usuario}</option>
            ))}
          </select>

          <select
            value={filterAccion}
            onChange={(e) => setFilterAccion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Todas">Todas las acciones</option>
            {tiposAccion.map(accion => (
              <option key={accion} value={accion}>{accion}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {(searchTerm || filterModulo !== 'Todos' || filterUsuario !== 'Todos' || filterAccion !== 'Todas' || filterFecha) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {actividadesFiltradas.length} de {actividadesLog.length} actividades
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterModulo('Todos');
                setFilterUsuario('Todos');
                setFilterAccion('Todas');
                setFilterFecha('');
              }}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de actividades */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Módulo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {actividadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ActivityIcon className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No se encontraron actividades</p>
                      <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                actividadesFiltradas.map((actividad) => (
                  <tr key={actividad.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{actividad.fecha}</div>
                      <div className="text-xs text-gray-500">{actividad.hora}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{actividad.usuario}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getRolColor(actividad.rol)}`}>
                        {rolesDescripcion[actividad.rol]?.nombre || actividad.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FolderIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{actividad.modulo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getAccionColor(actividad.accion)}`}>
                        {actividad.accion}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {actividad.descripcion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelectedActividad(actividad)}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedActividad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Detalles de la Actividad</h3>
                <button
                  onClick={() => setSelectedActividad(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">ID</label>
                  <p className="text-gray-900 mt-1">#{selectedActividad.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Usuario</label>
                  <p className="text-gray-900 mt-1">{selectedActividad.usuario}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rol</label>
                  <p className="text-gray-900 mt-1">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${getRolColor(selectedActividad.rol)}`}>
                      {rolesDescripcion[selectedActividad.rol]?.nombre || selectedActividad.rol}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha y Hora</label>
                  <p className="text-gray-900 mt-1">{selectedActividad.fecha} a las {selectedActividad.hora}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Módulo</label>
                  <p className="text-gray-900 mt-1">{selectedActividad.modulo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Acción</label>
                  <p className="text-gray-900 mt-1">
                    <span className={`px-3 py-1 text-sm font-semibold rounded ${getAccionColor(selectedActividad.accion)}`}>
                      {selectedActividad.accion}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Descripción</label>
                  <p className="text-gray-900 mt-1">{selectedActividad.descripcion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">IP Address</label>
                  <p className="text-gray-900 mt-1">{selectedActividad.ipAddress}</p>
                </div>
                {selectedActividad.detalles && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Detalles Adicionales</label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                        {JSON.stringify(selectedActividad.detalles, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroActividades;
