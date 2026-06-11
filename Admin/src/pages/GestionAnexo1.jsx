import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { anexos1, getAnexosByEmpresa, calcularPorcentajeCumplimiento } from '../data/anexo1Data';
import { getTareasByEmpresa } from '../data/tareasData';

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const GestionAnexo1 = ({ companies = initialCompanies }) => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  // Calcular estadísticas para cada empresa
  const empresasConEstadisticas = useMemo(() => {
    return companies.map(empresa => {
      const anexosEmpresa = getAnexosByEmpresa(empresa.id);
      const anexoActual = anexosEmpresa.find(a => a.estado === 'Borrador' || a.estado === 'Publicado') || anexosEmpresa[0];
      const porcentajeCumplimiento = anexoActual 
        ? calcularPorcentajeCumplimiento(anexoActual.respuestas || {})
        : 0;
      const ultimaInspeccion = anexosEmpresa.length > 0 
        ? anexosEmpresa[0].fechaInspeccion 
        : null;
      const tareasEmpresa = getTareasByEmpresa(empresa.id);
      const tareasPendientes = tareasEmpresa.filter(t => 
        t.estado === 'Pendiente' || t.estado === 'En revisión'
      ).length;

      return {
        ...empresa,
        porcentajeCumplimiento,
        ultimaInspeccion,
        totalInspecciones: anexosEmpresa.length,
        tareasPendientes
      };
    });
  }, [companies]);

  const empresasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return empresasConEstadisticas;
    
    const busquedaLower = busqueda.toLowerCase();
    return empresasConEstadisticas.filter(empresa =>
      empresa.name.toLowerCase().includes(busquedaLower) ||
      empresa.ruc?.includes(busqueda) ||
      empresa.tipoActividad?.toLowerCase().includes(busquedaLower)
    );
  }, [busqueda, empresasConEstadisticas]);

  const getCumplimientoColor = (porcentaje) => {
    if (porcentaje >= 80) return 'text-green-600 bg-green-100';
    if (porcentaje >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ChartIcon className="w-8 h-8 text-primary" />
          Gestión Integral del Anexo 1 – SST
        </h1>
        <p className="text-gray-600 mt-1">
          Sistema centralizado de gestión de Seguridad y Salud en el Trabajo
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar empresa por nombre, RUC o actividad económica..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabla de empresas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Empresa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">RUC</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actividad</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Cumplimiento</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Última Inspección</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Total Inspecciones</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Tareas Pendientes</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {empresasFiltradas.map((empresa) => (
                <tr key={empresa.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {empresa.logo ? (
                          <img
                            src={empresa.logo}
                            alt="Logo"
                            className="w-10 h-10 object-contain rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                            <BuildingIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{empresa.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{empresa.ruc}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {empresa.tipoActividad || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCumplimientoColor(empresa.porcentajeCumplimiento)}`}>
                      {empresa.porcentajeCumplimiento}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">
                    {empresa.ultimaInspeccion 
                      ? new Date(empresa.ultimaInspeccion).toLocaleDateString('es-ES')
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">
                    {empresa.totalInspecciones}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {empresa.tareasPendientes > 0 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold">
                        {empresa.tareasPendientes}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/anexo1/empresa/${empresa.id}/estado`)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <ChartIcon className="w-4 h-4" />
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensaje cuando no hay empresas */}
      {empresasFiltradas.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BuildingIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            {busqueda ? 'No se encontraron empresas' : 'No hay empresas registradas'}
          </p>
          <p className="text-gray-500 text-sm">
            {busqueda 
              ? 'Intenta con otros términos de búsqueda'
              : 'Registra una empresa para comenzar'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GestionAnexo1;
