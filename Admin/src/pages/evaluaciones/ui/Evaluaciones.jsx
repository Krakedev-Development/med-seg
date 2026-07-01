import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EvaluacionForm from '@shared/ui/EvaluacionForm';
import { evaluaciones as initialEvaluaciones } from '@shared/api/mock/evaluacionesData';
import { capacitaciones } from '@shared/api/mock/capacitacionesData';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { respuestasEvaluaciones } from '@shared/api/mock/evaluacionesData';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Badge from '@shared/ui/atoms/Badge';
import FormField from '@shared/ui/molecules/FormField';
import Select from '@shared/ui/atoms/Select';
import Input from '@shared/ui/atoms/Input';

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

const CopyIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const Evaluaciones = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [filterEmpresa, setFilterEmpresa] = useState('Todas');

  // Verificar si hay parámetro de edición en la URL
  useEffect(() => {
    const editarId = searchParams.get('editar');
    if (editarId) {
      const evaluacion = evaluaciones.find(e => e.id === parseInt(editarId));
      if (evaluacion) {
        setEditingEvaluacion(evaluacion);
        setShowForm(true);
        setSearchParams({}); // Limpiar parámetros
      }
    }
  }, [searchParams, evaluaciones, setSearchParams]);

  const evaluacionesFiltradas = useMemo(() => {
    if (!evaluaciones || !Array.isArray(evaluaciones)) return [];
    return evaluaciones.filter(evaluacion => {
      if (!evaluacion) return false;
      const matchSearch = evaluacion.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEstado = filterEstado === 'Todas' || evaluacion.estado === filterEstado;
      const matchEmpresa = filterEmpresa === 'Todas' || 
                          (evaluacion.empresaId && evaluacion.empresaId === parseInt(filterEmpresa));
      return matchSearch && matchEstado && matchEmpresa;
    });
  }, [evaluaciones, searchTerm, filterEstado, filterEmpresa]);

  const handleAddEvaluacion = (newEvaluacion) => {
    const nuevasEvaluaciones = [...evaluaciones, newEvaluacion];
    setEvaluaciones(nuevasEvaluaciones);
    // Actualizar el array exportado para persistencia
    initialEvaluaciones.push(newEvaluacion);
    setShowForm(false);
  };

  const handleUpdateEvaluacion = (updatedEvaluacion) => {
    const evaluacionesActualizadas = evaluaciones.map(evaluacion =>
      evaluacion.id === updatedEvaluacion.id ? updatedEvaluacion : evaluacion
    );
    setEvaluaciones(evaluacionesActualizadas);
    // Actualizar el array exportado
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
      // Actualizar el array exportado
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
    navigate(`/evaluaciones/enviar/${evaluacion.id}`);
  };

  const handleVerSeguimiento = (evaluacion) => {
    navigate(`/evaluaciones/seguimiento/${evaluacion.id}`);
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

  const getCapacitacionNombre = (capacitacionId) => {
    if (!capacitaciones || !Array.isArray(capacitaciones)) return 'Capacitación no encontrada';
    const cap = capacitaciones.find(c => c && c.id === capacitacionId);
    return cap ? cap.nombre : 'Capacitación no encontrada';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Evaluaciones</h1>
          <p className="text-gray-600 mt-1">Crea y gestiona evaluaciones asociadas a capacitaciones</p>
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
          capacitaciones={capacitaciones}
        />
      )}

      {/* Filtros y búsqueda */}
      <Card className="p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
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
        <FormField label="Empresa">
          <Select
            value={filterEmpresa}
            onChange={(e) => setFilterEmpresa(e.target.value)}
          >
            <option value="Todas">Todas las empresas</option>
            {companies.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </Select>
        </FormField>
      </Card>

      {/* Lista de evaluaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluacionesFiltradas.map(evaluacion => (
          <Card key={evaluacion.id} className="p-6 hover:shadow-lg transition-shadow">
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
                <span className="text-gray-500">Capacitación:</span>
                <span className="font-medium text-gray-700 text-right">
                  {getCapacitacionNombre(evaluacion.capacitacionId)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Preguntas:</span>
                <span className="font-medium text-gray-700">{evaluacion.preguntas?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Estado:</span>
                <Badge variant={
                  evaluacion.estado === 'Activa' ? 'green' :
                  evaluacion.estado === 'Borrador' ? 'yellow' :
                  evaluacion.estado === 'Finalizada' ? 'blue' : 'gray'
                }>
                  {evaluacion.estado}
                </Badge>
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
                    variant="ghost"
                    className="flex items-center justify-center gap-2 bg-primary-light text-primary hover:bg-primary hover:text-white"
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
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Ver Seguimiento
                  </Button>
                </>
              )}
              {evaluacion.estado === 'Finalizada' && (
                <>
                  <Button
                    onClick={() => handleVerSeguimiento(evaluacion)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white hover:bg-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ver Seguimiento (Finalizada)
                  </Button>
                </>
              )}
              <Button
                onClick={() => handleDeleteEvaluacion(evaluacion.id)}
                variant="ghost"
                className="flex items-center justify-center gap-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
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
          <p className="text-gray-500 text-lg">No se encontraron evaluaciones</p>
        </Card>
      )}

    </div>
  );
};

export default Evaluaciones;

