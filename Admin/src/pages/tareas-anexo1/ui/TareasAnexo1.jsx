import { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { tareas, resolverTarea, actualizarEstadoTarea } from '@shared/api/mock/tareasData';
import { anexos1, updateRespuestaItem } from '@shared/api/mock/anexo1Data';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Select from '@shared/ui/atoms/Select';

const TaskIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const TareasAnexo1 = ({ companies = initialCompanies }) => {
  const navigate = useNavigate();
  const { empresaId } = useParams();
  const [searchParams] = useSearchParams();

  const empresa = companies.find(c => c.id === parseInt(empresaId));

  const [filtroEstado, setFiltroEstado] = useState('all');
  const [filtroTipo, setFiltroTipo] = useState('all');
  const [filtroPrioridad, setFiltroPrioridad] = useState('all');

  const tareasFiltradas = useMemo(() => {
    // Solo mostrar tareas de la empresa actual
    let filtradas = empresaId 
      ? tareas.filter(t => t.empresaId === parseInt(empresaId))
      : [];

    if (filtroEstado !== 'all') {
      filtradas = filtradas.filter(t => t.estado === filtroEstado);
    }

    if (filtroTipo !== 'all') {
      filtradas = filtradas.filter(t => t.tipo === filtroTipo);
    }

    if (filtroPrioridad !== 'all') {
      filtradas = filtradas.filter(t => t.prioridad === filtroPrioridad);
    }

    return filtradas.sort((a, b) => {
      // Ordenar por prioridad y luego por fecha
      const prioridadOrder = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
      if (prioridadOrder[a.prioridad] !== prioridadOrder[b.prioridad]) {
        return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
      }
      return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
    });
  }, [empresaId, filtroEstado, filtroTipo, filtroPrioridad]);

  const estadisticas = useMemo(() => {
    const todas = empresaId 
      ? tareas.filter(t => t.empresaId === parseInt(empresaId))
      : [];
    
    return {
      total: todas.length,
      pendientes: todas.filter(t => t.estado === 'Pendiente').length,
      enRevision: todas.filter(t => t.estado === 'En revisión').length,
      corregidas: todas.filter(t => t.estado === 'Corregido').length,
      rechazadas: todas.filter(t => t.estado === 'Rechazado').length
    };
  }, [empresaId]);

  const handleResolverTarea = (tareaId) => {
    const tarea = tareas.find(t => t.id === tareaId);
    if (!tarea) return;
    
    if (window.confirm('¿Está seguro de marcar esta tarea como corregida? Esto actualizará el ítem del Anexo 1 a CUMPLE.')) {
      // Actualizar el ítem del Anexo 1 a CUMPLE si estaba en NO_CUMPLE
      if (tarea.anexo1Id && tarea.itemId) {
        const anexo = anexos1.find(a => a.id === tarea.anexo1Id);
        if (anexo && anexo.respuestas && anexo.respuestas[tarea.itemId]) {
          const respuestaActual = anexo.respuestas[tarea.itemId];
          if (respuestaActual.estado === 'NO_CUMPLE') {
            updateRespuestaItem(tarea.anexo1Id, tarea.itemId, {
              ...respuestaActual,
              estado: 'CUMPLE'
            });
          }
        }
      }
      
      resolverTarea(tareaId, [], null);
      // Forzar re-render
      window.location.reload();
    }
  };

  const handleCambiarEstado = (tareaId, nuevoEstado) => {
    const tarea = tareas.find(t => t.id === tareaId);
    if (!tarea) return;
    
    actualizarEstadoTarea(tareaId, nuevoEstado);
    
    // Si se marca como "Corregido", actualizar el ítem del Anexo 1
    if (nuevoEstado === 'Corregido' && tarea.anexo1Id && tarea.itemId) {
      const anexo = anexos1.find(a => a.id === tarea.anexo1Id);
      if (anexo && anexo.respuestas && anexo.respuestas[tarea.itemId]) {
        const respuestaActual = anexo.respuestas[tarea.itemId];
        if (respuestaActual.estado === 'NO_CUMPLE') {
          updateRespuestaItem(tarea.anexo1Id, tarea.itemId, {
            ...respuestaActual,
            estado: 'CUMPLE'
          });
        }
      }
    }
    
    // Forzar re-render
    window.location.reload();
  };

  const handleIrAItem = (itemId, empresaId, anexoId) => {
    if (anexoId) {
      navigate(`/anexo1/editor/${empresaId}/${anexoId}?item=${itemId}`);
    } else {
      navigate(`/anexo1/editor/${empresaId}?item=${itemId}`);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-red-100 text-red-800';
      case 'En revisión':
        return 'bg-yellow-100 text-yellow-800';
      case 'Corregido':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return 'bg-red-500';
      case 'Media':
        return 'bg-yellow-500';
      case 'Baja':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'documento':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'capacitacion':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'evaluacion':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'inspeccion':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'ficha_medica':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <Button
              onClick={() => navigate('/anexo1')}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 p-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Gestión
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <TaskIcon className="w-8 h-8 text-primary" />
              Tareas y Pendientes - Anexo 1
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de tareas generadas automáticamente desde ítems NO CUMPLE
            </p>
          </div>
        </div>
      </Card>

      {/* Información de la empresa */}
      {empresa && (
        <div className="bg-primary/10 border border-primary rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{empresa.name}</h3>
              <p className="text-sm text-gray-600">RUC: {empresa.ruc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
        </Card>
        <Card className="p-4 shadow-md border-l-4 border-red-500">
          <p className="text-sm text-gray-600 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-red-600">{estadisticas.pendientes}</p>
        </Card>
        <Card className="p-4 shadow-md border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">En Revisión</p>
          <p className="text-2xl font-bold text-yellow-600">{estadisticas.enRevision}</p>
        </Card>
        <Card className="p-4 shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Corregidas</p>
          <p className="text-2xl font-bold text-green-600">{estadisticas.corregidas}</p>
        </Card>
        <Card className="p-4 shadow-md border-l-4 border-gray-500">
          <p className="text-sm text-gray-600 mb-1">Rechazadas</p>
          <p className="text-2xl font-bold text-gray-600">{estadisticas.rechazadas}</p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En revisión">En revisión</option>
            <option value="Corregido">Corregido</option>
            <option value="Rechazado">Rechazado</option>
          </Select>
          <Select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            <option value="documento">Documento</option>
            <option value="capacitacion">Capacitación</option>
            <option value="evaluacion">Evaluación</option>
            <option value="inspeccion">Inspección</option>
            <option value="ficha_medica">Ficha Médica</option>
            <option value="otro">Otro</option>
          </Select>
          <Select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
          >
            <option value="all">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setFiltroEstado('all');
              setFiltroTipo('all');
              setFiltroPrioridad('all');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Lista de tareas */}
      <Card className="shadow-md overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-surface to-secondary-light/70">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TaskIcon className="w-6 h-6 text-primary" />
            Tareas ({tareasFiltradas.length})
          </h2>
        </div>
        <div className="p-6">
          {tareasFiltradas.length > 0 ? (
            <div className="space-y-4">
              {tareasFiltradas.map((tarea) => {
                const empresa = companies.find(c => c.id === tarea.empresaId);
                const anexo = tarea.anexo1Id ? anexos1.find(a => a.id === tarea.anexo1Id) : null;
                
                return (
                  <div
                    key={tarea.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getPrioridadColor(tarea.prioridad)}`} />
                          <div className="text-primary">
                            {getTipoIcon(tarea.tipo)}
                          </div>
                          <h3 className="font-semibold text-gray-800">{tarea.titulo}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(tarea.estado)}`}>
                            {tarea.estado}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                            {tarea.prioridad}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{tarea.descripcion}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {empresa && (
                            <span>
                              <span className="font-medium">Empresa:</span> {empresa.name}
                            </span>
                          )}
                          <span>
                            <span className="font-medium">Creada:</span> {new Date(tarea.fechaCreacion).toLocaleDateString('es-ES')}
                          </span>
                          {tarea.fechaVencimiento && (
                            <span>
                              <span className="font-medium">Vence:</span> {new Date(tarea.fechaVencimiento).toLocaleDateString('es-ES')}
                            </span>
                          )}
                          {tarea.fechaResolucion && (
                            <span className="text-green-600">
                              <span className="font-medium">Resuelta:</span> {new Date(tarea.fechaResolucion).toLocaleDateString('es-ES')}
                            </span>
                          )}
                        </div>
                        {tarea.observaciones && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                            <span className="font-medium">Observaciones:</span> {tarea.observaciones}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {tarea.itemId && (
                          <Button
                            onClick={() => handleIrAItem(tarea.itemId, tarea.empresaId, tarea.anexo1Id)}
                            variant="primary"
                            className="text-sm whitespace-nowrap"
                          >
                            Ir al Ítem
                          </Button>
                        )}
                        <Select
                          value={tarea.estado}
                          onChange={(e) => handleCambiarEstado(tarea.id, e.target.value)}
                          className={`!py-1.5 !px-3 text-sm rounded-lg ${
                            tarea.estado === 'Pendiente' ? 'bg-red-50 border-red-200 text-red-800' :
                            tarea.estado === 'En revisión' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                            tarea.estado === 'Corregido' ? 'bg-green-50 border-green-200 text-green-800' :
                            'bg-gray-50 border-gray-200 text-gray-800'
                          }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En revisión">En revisión</option>
                          <option value="Corregido">Corregido</option>
                          <option value="Rechazado">Rechazado</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <TaskIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay tareas
              </p>
              <p className="text-gray-500 text-sm">
                Las tareas aparecerán cuando se marquen ítems como NO CUMPLE en el Anexo 1
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TareasAnexo1;

