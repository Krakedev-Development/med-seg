import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { anexos1, getAnexosByEmpresa, calcularPorcentajeCumplimiento } from '@shared/api/mock/anexo1Data';
import { getTareasByEmpresa } from '@shared/api/mock/tareasData';
import EmpresaAnexo1Estado from '@pages/empresa-anexo1estado/ui/EmpresaAnexo1Estado';
import EmpresaRepositorio from '@pages/empresa-repositorio/ui/EmpresaRepositorio';
import Card from '@shared/ui/organisms/Card';

const ClipboardList = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const EmpresaAnexo1View = ({ companies = initialCompanies, activeRolePreview }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('estado');

  // Detectar tab activo desde la URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    // Detectar si está en el editor
    if (location.pathname.includes('/editor')) {
      setActiveTab('checklist');
    // Detectar subrutas de evaluaciones
    } else if (location.pathname.includes('/evaluaciones/')) {
      setActiveTab('evaluaciones');
    } else if (lastPart && lastPart !== 'anexo1' && lastPart !== empresaId && !pathParts.includes('editor')) {
      setActiveTab(lastPart);
    } else if (pathParts[pathParts.length - 1] === empresaId || pathParts[pathParts.length - 2] === 'empresa') {
      setActiveTab('estado');
    }
  }, [location.pathname, empresaId]);

  const empresa = companies.find(c => c.id === parseInt(empresaId));
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

  const tabs = [
    { id: 'estado', label: 'Estado General', icon: null },
    { id: 'checklist', label: 'Checklist Anexo 1', icon: null },
    { id: 'formularios-dinamicos', label: 'Formularios Dinámicos', icon: null },
    { id: 'medidocs', label: 'Medi Docs', icon: null },
    { id: 'matriz-empleados', label: 'Matriz de Empleados', icon: null },
    { id: 'capacitaciones', label: 'Capacitaciones', icon: null },
    { id: 'evaluaciones', label: 'Evaluaciones', icon: null },
    { id: 'historial', label: 'Historial de Inspecciones', icon: null },
    { id: 'repositorio', label: 'Repositorio', icon: null }
  ];

  // Filtrar pestañas por rol activo
  const filteredTabs = useMemo(() => {
    return tabs.filter(tab => {
      if (activeRolePreview === 'sst' && tab.id === 'medidocs') return false;
      if (activeRolePreview === 'medico' && tab.id === 'formularios-dinamicos') return false;
      return true;
    });
  }, [activeRolePreview]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'checklist') {
      // Si hay un anexo existente, editar ese, sino crear uno nuevo
      if (anexoActual) {
        navigate(`/anexo1/empresa/${empresaId}/editor/${anexoActual.id}`);
      } else {
        navigate(`/anexo1/empresa/${empresaId}/editor`);
      }
    } else {
      navigate(`/anexo1/empresa/${empresaId}/${tabId}`);
    }
  };

  // Redirección de seguridad ante cambios de rol activo
  useEffect(() => {
    if (activeRolePreview === 'sst' && activeTab === 'medidocs') {
      handleTabChange('estado');
    } else if (activeRolePreview === 'medico' && activeTab === 'formularios-dinamicos') {
      handleTabChange('estado');
    }
  }, [activeRolePreview, activeTab]);

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <p className="text-gray-500">Empresa no encontrada</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header compacto */}
      <Card className="p-0 border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/anexo1`)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Gestión del Anexo 1 - SST
            </h1>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">{empresa.name}</span>
          </div>
        </div>

        {/* Tabs de navegación integrados */}
        <div className="border-t border-gray-200 px-4">
          <nav className="flex -mb-px overflow-x-auto gap-4">
            {filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Contenido según tab activo */}
      <div>
        <Outlet context={{ activeRolePreview }} />
      </div>
    </div>
  );
};

export default EmpresaAnexo1View;

