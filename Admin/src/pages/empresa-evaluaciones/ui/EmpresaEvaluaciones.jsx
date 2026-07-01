import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import EvaluacionForm from '@shared/ui/EvaluacionForm';
import { evaluaciones as initialEvaluaciones, respuestasEvaluaciones } from '@shared/api/mock/evaluacionesData';
import { capacitaciones } from '@shared/api/mock/capacitacionesData';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const EmpresaEvaluaciones = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const empresaIdNum = parseInt(empresaId);
  const empresa = companies.find(c => c.id === empresaIdNum);

  const [evaluaciones, setEvaluaciones] = useState(() => {
    try {
      return initialEvaluaciones || [];
    } catch (error) {
      console.error('Error al inicializar evaluaciones:', error);
      return [];
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [editingEvaluacion, setEditingEvaluacion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todas');

  // Verificar si hay parámetro de edición en la URL
  useEffect(() => {
    const editarId = searchParams.get('editar');
    if (editarId) {
      const evaluacion = evaluaciones.find(e => e.id === parseInt(editarId));
      if (evaluacion && evaluacion.empresaId === empresaIdNum) {
        setEditingEvaluacion(evaluacion);
        setShowForm(true);
        setSearchParams({});
      }
    }
  }, [searchParams, evaluaciones, setSearchParams, empresaIdNum]);

  // Filtrar solo evaluaciones de esta empresa
  const evaluacionesFiltradas = useMemo(() => {
    if (!evaluaciones || !Array.isArray(evaluaciones)) return [];
    const filtered = evaluaciones.filter(evaluacion => {
      if (!evaluacion) return false;
      const perteneceEmpresa = evaluacion.empresaId === empresaIdNum;
      if (!perteneceEmpresa) return false;

      const matchSearch = evaluacion.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEstado = filterEstado === 'Todas' || evaluacion.estado === filterEstado;
      
      return matchSearch && matchEstado;
    });

    const estadoOrden = { 'Activa': 0, 'Borrador': 1, 'Finalizada': 2 };
    return filtered.sort((a, b) => (estadoOrden[a.estado] ?? 3) - (estadoOrden[b.estado] ?? 3));
  }, [evaluaciones, searchTerm, filterEstado, empresaIdNum]);

  const estadisticas = useMemo(() => {
    const respuestasEmpresa = respuestasEvaluaciones.filter(r => r.empresaId === empresaIdNum);
    const total = respuestasEmpresa.length;
    const respondidas = respuestasEmpresa.filter(r => r.estado === 'Respondida').length;
    const pendientes = total - respondidas;
    const porcentajeRespuestas = total > 0 ? ((respondidas / total) * 100).toFixed(1) : 0;
    return { total, respondidas, pendientes, porcentajeRespuestas };
  }, [empresaIdNum]);

  const handleAddEvaluacion = (newEvaluacion) => {
    // Asegurar que la evaluación pertenece a esta empresa
    const evaluacionConEmpresa = {
      ...newEvaluacion,
      empresaId: empresaIdNum
    };
    const nuevasEvaluaciones = [...evaluaciones, evaluacionConEmpresa];
    setEvaluaciones(nuevasEvaluaciones);
    initialEvaluaciones.push(evaluacionConEmpresa);
    setShowForm(false);
  };

  const handleUpdateEvaluacion = (updatedEvaluacion) => {
    const evaluacionesActualizadas = evaluaciones.map(evaluacion =>
      evaluacion.id === updatedEvaluacion.id ? updatedEvaluacion : evaluacion
    );
    setEvaluaciones(evaluacionesActualizadas);
    const index = initialEvaluaciones.findIndex(e => e.id === updatedEvaluacion.id);
    if (index !== -1) {
      initialEvaluaciones[index] = updatedEvaluacion;
    }
    setEditingEvaluacion(null);
    setShowForm(false);
  };

  const handleDeleteEvaluacion = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta evaluación?')) {
      const evaluacionesFiltradas = evaluaciones.filter(evaluacion => evaluacion.id !== id);
      setEvaluaciones(evaluacionesFiltradas);
      const index = initialEvaluaciones.findIndex(e => e.id === id);
      if (index !== -1) {
        initialEvaluaciones.splice(index, 1);
      }
    }
  };

  const handleEdit = (evaluacion) => {
    if (evaluacion.estado === 'Activa') {
      alert('No se pueden editar evaluaciones que ya están activas. Solo se pueden editar evaluaciones en estado "Borrador".');
      return;
    }
    setEditingEvaluacion(evaluacion);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvaluacion(null);
  };

  const handleEnviarEvaluacion = (evaluacion) => {
    navigate(`/anexo1/empresa/${empresaId}/evaluaciones/enviar/${evaluacion.id}`);
  };

  const handleVerSeguimiento = (evaluacion) => {
    navigate(`/anexo1/empresa/${empresaId}/evaluaciones/seguimiento/${evaluacion.id}`);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Borrador':
        return 'bg-yellow-100 text-yellow-800';
      case 'Activa':
        return 'bg-green-100 text-green-800';
      case 'Inactiva':
        return 'bg-gray-100 text-gray-800';
      case 'Finalizada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md">
          <p className="text-gray-500">Empresa no encontrada</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Evaluaciones</h1>
          <p className="text-gray-600 mt-1">{empresa.name}</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingEvaluacion(null);
          }}
          variant="primary"
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Evaluación
        </Button>
      </div>

      {showForm && (
        <EvaluacionForm
          onAddEvaluacion={handleAddEvaluacion}
          onUpdateEvaluacion={handleUpdateEvaluacion}
          editingEvaluacion={editingEvaluacion}
          onCancel={handleCancel}
          capacitaciones={capacitaciones.filter(c =>
            (c.empresaId && c.empresaId === empresaIdNum) ||
            (c.empresasAsignadas && c.empresasAsignadas.includes(empresaIdNum))
          )}
          empresaId={empresaIdNum}
        />
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-md rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total de Respuestas</p>
          <p className="text-3xl font-bold text-gray-800">{estadisticas.total}</p>
        </Card>
        <Card className="p-6 shadow-md rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Respondidas</p>
          <p className="text-3xl font-bold text-green-600">{estadisticas.respondidas}</p>
        </Card>
        <Card className="p-6 shadow-md rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
        </Card>
        <Card className="p-6 shadow-md rounded-lg">
          <p className="text-sm text-gray-600 mb-1">% de Respuestas</p>
          <p className="text-3xl font-bold text-primary">{estadisticas.porcentajeRespuestas}%</p>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
          />
          <Select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="Todas">Todas las evaluaciones</option>
            <option value="Borrador">Borrador</option>
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
            <option value="Finalizada">Finalizada</option>
          </Select>
        </div>
      </Card>

      {/* Lista de evaluaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {evaluacionesFiltradas.map(evaluacion => (
          <Card key={evaluacion.id} className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{evaluacion.nombre}</h3>
                {evaluacion.descripcion && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{evaluacion.descripcion}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Preguntas:</span>
                <span className="font-medium text-gray-700">{evaluacion.preguntas?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(evaluacion.estado)}`}>
                  {evaluacion.estado}
                </span>
              </div>
              {evaluacion.fechaLimite && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Fecha límite:</span>
                  <span className="font-medium text-gray-700">
                    {new Date(evaluacion.fechaLimite).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              {evaluacion.estado === 'Borrador' && (
                <>
                  <Button
                    onClick={() => handleEnviarEvaluacion(evaluacion)}
                    variant="primary"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <SendIcon className="w-4 h-4" />
                    Enviar y Activar
                  </Button>
                  <Button
                    onClick={() => handleEdit(evaluacion)}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    title="Editar evaluación"
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                </>
              )}
              {evaluacion.estado === 'Activa' && (
                <>
                  <Button
                    onClick={() => handleVerSeguimiento(evaluacion)}
                    variant="primary"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Ver Resultados
                  </Button>
                </>
              )}
              {evaluacion.estado === 'Finalizada' && (
                <>
                  <Button
                    onClick={() => handleVerSeguimiento(evaluacion)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ver Resultados (Finalizada)
                  </Button>
                </>
              )}
              <Button
                onClick={() => handleDeleteEvaluacion(evaluacion.id)}
                variant="outline"
                className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-600 hover:text-white"
                title="Eliminar evaluación"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {evaluacionesFiltradas.length === 0 && (
        <Card className="p-12 text-center shadow-md">
          <p className="text-gray-500 text-lg">No se encontraron evaluaciones para esta empresa</p>
        </Card>
      )}
    </div>
  );
};

export default EmpresaEvaluaciones;


