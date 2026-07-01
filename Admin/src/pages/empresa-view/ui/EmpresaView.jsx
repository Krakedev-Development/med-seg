import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { anexos1, getAnexosByEmpresa, calcularPorcentajeCumplimiento } from '@shared/api/mock/anexo1Data';
import { getTareasByEmpresa } from '@shared/api/mock/tareasData';

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const EmpresaView = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('informacion');

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const trabajadoresEmpresa = employees.filter(e => e.companyId === parseInt(empresaId));
  const anexosEmpresa = getAnexosByEmpresa(parseInt(empresaId));
  const tareasEmpresa = getTareasByEmpresa(parseInt(empresaId));
  const anexoActual = anexosEmpresa.find(a => a.estado === 'Borrador' || a.estado === 'Publicado') || anexosEmpresa[0];

  const porcentajeCumplimiento = useMemo(() => {
    if (!anexoActual) return 0;
    return calcularPorcentajeCumplimiento(anexoActual.respuestas || {});
  }, [anexoActual]);

  const tareasPendientes = useMemo(() => {
    return tareasEmpresa.filter(t => t.estado === 'Pendiente' || t.estado === 'En revisión').length;
  }, [tareasEmpresa]);

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md">
          <p className="text-gray-500">Empresa no encontrada</p>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'informacion', label: 'Información General', icon: BuildingIcon },
    { id: 'trabajadores', label: `Trabajadores (${trabajadoresEmpresa.length})`, icon: null },
    { id: 'documentos', label: 'Documentos', icon: null }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'trabajadores') {
      navigate(`/empresas/${empresaId}/trabajadores`);
    } else if (tabId === 'documentos') {
      navigate(`/empresas/${empresaId}/documentos`);
    } else {
      navigate(`/empresas/${empresaId}`);
    }
  };

  // Detectar tab activo desde la URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/trabajadores')) {
      setActiveTab('trabajadores');
    } else if (path.includes('/documentos')) {
      setActiveTab('documentos');
    } else {
      setActiveTab('informacion');
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header con información de la empresa */}
      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {empresa.logo ? (
                <img src={empresa.logo} alt="Logo" className="w-16 h-16 object-contain rounded" />
              ) : (
                <div className="w-16 h-16 bg-primary rounded flex items-center justify-center">
                  <BuildingIcon className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{empresa.name}</h1>
              <p className="text-gray-600 mt-1">RUC: {empresa.ruc}</p>
              <p className="text-gray-600">{empresa.address}</p>
              <div className="flex gap-4 mt-3">
                {anexoActual && (
                  <div className="px-3 py-1 bg-primary/10 rounded-lg">
                    <span className="text-sm font-semibold text-primary">
                      Cumplimiento: {porcentajeCumplimiento}%
                    </span>
                  </div>
                )}
                {tareasPendientes > 0 && (
                  <div className="px-3 py-1 bg-red-100 rounded-lg">
                    <span className="text-sm font-semibold text-red-600">
                      {tareasPendientes} Tareas Pendientes
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate('/companies')}
            variant="outline"
            className="flex items-center justify-center p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </Card>

      {/* Tabs de navegación */}
      <Card className="shadow-md p-0 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Contenido según tab activo */}
      <div>
        {activeTab === 'informacion' && (
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Datos de la Empresa</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Razón Social</dt>
                    <dd className="text-gray-900">{empresa.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">RUC</dt>
                    <dd className="text-gray-900">{empresa.ruc}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Dirección</dt>
                    <dd className="text-gray-900">{empresa.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Teléfono</dt>
                    <dd className="text-gray-900">{empresa.phone || 'No registrado'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="text-gray-900">{empresa.email || 'No registrado'}</dd>
                  </div>
                  {empresa.tipoActividad && (
                    <div>
                      <dt className="text-sm text-gray-500">Actividad Económica</dt>
                      <dd className="text-gray-900">{empresa.tipoActividad}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Resumen SST</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Total Trabajadores</dt>
                    <dd className="text-gray-900 font-semibold">{trabajadoresEmpresa.length}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Inspecciones Realizadas</dt>
                    <dd className="text-gray-900 font-semibold">{anexosEmpresa.length}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Cumplimiento Actual</dt>
                    <dd className="text-gray-900 font-semibold">{porcentajeCumplimiento}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Tareas Pendientes</dt>
                    <dd className="text-gray-900 font-semibold">{tareasPendientes}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Card>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default EmpresaView;

