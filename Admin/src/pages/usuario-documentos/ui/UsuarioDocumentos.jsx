import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDocuments } from '@shared/api/mock/mockDocuments';
import { respuestasEvaluaciones } from '@shared/api/mock/evaluacionesData';
import { evaluaciones } from '@shared/api/mock/evaluacionesData';
import { capacitaciones } from '@shared/api/mock/capacitacionesData';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import InduccionPersonalCocina from '@entities/document/ui/templates/induccion/InduccionPersonalCocina';
import FichaMedicaEvaluacionRetiro from '@entities/document/ui/templates/fichaMedica/FichaMedicaEvaluacionRetiro';
import InspeccionAreasMulti from '@shared/ui/InspeccionAreasMulti';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Badge from '@shared/ui/atoms/Badge';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';

// Iconos simples SVG
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ClipboardCheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsuarioDocumentos = ({ user, documents, mockDocuments }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterEstado, setFilterEstado] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Combinar documentos guardados con mockDocuments
  const todosLosDocumentos = useMemo(() => {
    return [...documents, ...mockDocuments];
  }, [documents, mockDocuments]);

  // Filtrar documentos - mostrar todos los documentos publicados (quemados y del usuario)
  const documentosUsuario = useMemo(() => {
    // Mostrar todos los documentos publicados, no solo los del usuario
    let filtrados = todosLosDocumentos.filter(doc => {
      return doc.estado === 'Publicado';
    });

    // Filtrar por búsqueda
    if (searchTerm) {
      filtrados = filtrados.filter(doc =>
        doc.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.empleado?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado (aunque solo deberían ser publicados)
    if (filterEstado !== 'all') {
      filtrados = filtrados.filter(doc => doc.estado === filterEstado);
    }

    return filtrados;
  }, [todosLosDocumentos, searchTerm, filterEstado]);

  // Agrupar documentos por categoría (excluir OTROS)
  const documentosPorCategoria = useMemo(() => {
    const categorias = {};
    documentosUsuario.forEach(doc => {
      const categoria = doc.tipo || '';
      // Excluir categoría OTROS
      if (categoria && categoria !== 'OTROS' && categoria !== 'otros') {
        if (!categorias[categoria]) {
          categorias[categoria] = [];
        }
        categorias[categoria].push(doc);
      }
    });
    return categorias;
  }, [documentosUsuario]);

  const toggleCategory = (categoria) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  // Obtener evaluaciones del usuario (asignadas)
  const evaluacionesUsuario = useMemo(() => {
    if (!user) return [];
    // Obtener el ID del empleado desde el user
    const empleadoId = user.empleado?.id || user.id;
    if (!empleadoId) return [];
    
    return respuestasEvaluaciones.filter(resp => {
      return resp.trabajadorId === empleadoId;
    });
  }, [user]);

  // Obtener evaluaciones disponibles para el usuario (todas las activas)
  const evaluacionesDisponibles = useMemo(() => {
    if (!user) return [];
    const empleadoId = user.empleado?.id || user.id;
    if (!empleadoId) return [];
    
    const empleado = initialEmployees.find(emp => emp.id === empleadoId);
    if (!empleado || !empleado.companyId) return [];

    // Obtener IDs de evaluaciones ya respondidas o pendientes
    const evaluacionesYaAsignadas = evaluacionesUsuario.map(e => e.evaluacionId);

    // Filtrar evaluaciones activas que no estén ya asignadas (excluir Borrador)
    return evaluaciones.filter(evaluacion => {
      return evaluacion.estado === 'Activa' && !evaluacionesYaAsignadas.includes(evaluacion.id);
    });
  }, [user, evaluacionesUsuario]);

  const evaluacionesPendientes = useMemo(() => {
    return evaluacionesUsuario.filter(respuesta => respuesta.estado === 'Pendiente');
  }, [evaluacionesUsuario]);

  const evaluacionesCompletadas = useMemo(() => {
    return evaluacionesUsuario.filter(respuesta => respuesta.estado === 'Respondida');
  }, [evaluacionesUsuario]);

  // Obtener capacitaciones del usuario
  const capacitacionesUsuario = useMemo(() => {
    if (!user) return [];
    const empleadoId = user.empleado?.id || user.id;
    if (!empleadoId) return [];
    
    const empleado = initialEmployees.find(emp => emp.id === empleadoId);
    if (!empleado || !empleado.companyId) return [];
    
    return capacitaciones.filter(cap => {
      return cap.empresasAsignadas?.includes(empleado.companyId);
    });
  }, [user]);

  const handleResponderEvaluacion = (respuesta) => {
    navigate(`/usuario/evaluacion/${respuesta.evaluacionId}/${respuesta.id}`);
  };

  const handleIniciarEvaluacion = (evaluacion) => {
    if (!user) return;
    const empleadoId = user.empleado?.id || user.id;
    if (!empleadoId) return;
    
    const empleado = initialEmployees.find(emp => emp.id === empleadoId);
    if (!empleado || !empleado.companyId) return;

    // Crear una nueva respuesta pendiente
    const nuevaRespuesta = {
      id: respuestasEvaluaciones.length > 0 
        ? Math.max(...respuestasEvaluaciones.map(r => r.id)) + 1 
        : 1,
      evaluacionId: evaluacion.id,
      trabajadorId: empleadoId,
      empresaId: empleado.companyId,
      fechaRespuesta: null,
      estado: 'Pendiente',
      respuestas: [],
      calificacion: null,
      porcentaje: null,
      correctas: null,
      fechaLimite: evaluacion.fechaLimite || null
    };

    // Agregar a respuestasEvaluaciones
    respuestasEvaluaciones.push(nuevaRespuesta);

    // Navegar a la página de evaluación
    navigate(`/usuario/evaluacion/${evaluacion.id}/${nuevaRespuesta.id}`);
  };

  const getDocumentComponent = (documento) => {
    // Determinar el tipo de componente según el tipo de documento
    const tipo = documento.tipo || '';
    
    if (tipo.includes('INDUCCIÓN') || tipo.includes('Inducción')) {
      return (
        <InduccionPersonalCocina
          logoEmpresa={documento.logoEmpresa || ''}
          nombreEmpresa={documento.empresa || ''}
          nombreTrabajador={documento.nombreTrabajador || documento.empleado || ''}
          numeroCedula={documento.numeroCedula || documento.cedula || ''}
          fecha={documento.fecha || ''}
          puestoTrabajo={documento.puestoTrabajo || ''}
          actividadesPuesto={documento.actividadesPuesto || ''}
        />
      );
    }
    
    if (tipo.includes('FICHA MÉDICA') || tipo.includes('Ficha Médica')) {
      return (
        <FichaMedicaEvaluacionRetiro
          logoEmpresa={documento.logoEmpresa || ''}
          nombreEmpresa={documento.institucion || documento.empresa || ''}
          ruc={documento.ruc || ''}
          primerNombre={documento.primerNombre || ''}
          segundoNombre={documento.segundoNombre || ''}
          primerApellido={documento.primerApellido || ''}
          segundoApellido={documento.segundoApellido || ''}
          sexo={documento.sexo || ''}
          fechaInicioLabores={documento.fechaInicioLabores || ''}
          fechaSalida={documento.fechaSalida || ''}
          tiempoMeses={documento.tiempoMeses || ''}
          tiempoAnios={documento.tiempoAnios || ''}
          puestoTrabajo={documento.puestoTrabajo || ''}
        />
      );
    }
    
    if (tipo.includes('INSPECCIONES') || tipo.includes('Inspección')) {
      return (
        <InspeccionAreasMulti
          logoEmpresa={documento.logoEmpresa || ''}
          nombreEmpresa={documento.empresa || ''}
          fechaInspeccion={documento.fechaInspeccion || documento.fecha || ''}
          tecnicoResponsable={documento.responsable || documento.tecnico || ''}
          coordinacion={documento.coordinacion || ''}
        />
      );
    }
    
    return null;
  };

  const handleDownloadPDF = () => {
    if (!selectedDocument) return;
    
    const tipo = selectedDocument.tipo || '';
    
    // Para documentos con componente, generar PDF usando html2pdf o window.print
    if (tipo.includes('FICHA MÉDICA') || tipo.includes('Ficha Médica') || 
        tipo.includes('INDUCCIÓN') || tipo.includes('Inducción') ||
        tipo.includes('INSPECCIONES') || tipo.includes('Inspección')) {
      
      // Usar window.print para imprimir/guardar como PDF
      window.print();
      return;
    }
    
    // Si tiene archivo PDF, descargarlo directamente
    if (selectedDocument.archivo) {
      const link = document.createElement('a');
      link.href = selectedDocument.archivo;
      link.download = `${selectedDocument.nombre || 'documento'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      if (typeof dateString === 'string' && dateString.includes('/')) {
        return dateString;
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con información del usuario */}
      <Card className="bg-gradient-to-r from-primary to-primary-dark shadow-lg p-6 mb-6 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.nombre || 'Usuario'}</h1>
            <p className="text-primary-light text-sm">
              Cédula: {user?.cedula || user?.empleado?.dni || user?.empleado?.cedula}
            </p>
          </div>
          <div className="text-right bg-white/20 rounded-lg px-6 py-4 backdrop-blur-sm">
            <p className="text-sm text-primary-light">Total de documentos</p>
            <p className="text-4xl font-bold">{documentosUsuario.length}</p>
          </div>
        </div>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Documentos</p>
              <p className="text-3xl font-bold text-gray-800">{documentosUsuario.length}</p>
            </div>
            <div className="bg-primary-light rounded-full p-3">
              <DocumentIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Capacitaciones</p>
              <p className="text-3xl font-bold text-gray-800">{capacitacionesUsuario.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Evaluaciones Pendientes</p>
              <p className="text-3xl font-bold text-gray-800">{evaluacionesPendientes.length}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <ClipboardCheckIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Evaluaciones Completadas</p>
              <p className="text-3xl font-bold text-gray-800">{evaluacionesCompletadas.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <ClipboardCheckIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* ========== SECCIÓN 1: CAPACITACIONES ========== */}
      {capacitacionesUsuario.length > 0 && (
        <div className="mb-10">
          <Card className="p-6 border-t-4 border-t-blue-500 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500 rounded-lg p-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Capacitaciones</h2>
                <p className="text-sm text-gray-600">Capacitaciones asignadas a tu empresa</p>
              </div>
            </div>
            <div className="space-y-3">
              {capacitacionesUsuario.map(cap => {
                const empresa = initialCompanies.find(c => cap.empresasAsignadas?.includes(c.id));
                const fecha = new Date(cap.fechaProgramada);
                const hoy = new Date();
                const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={cap.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{cap.nombre}</h3>
                        <p className="text-sm text-gray-600 mb-2">{cap.descripcion}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {fecha.toLocaleDateString('es-ES')}
                          </span>
                          {diasRestantes >= 0 && (
                            <span className="text-blue-600 font-medium">
                              Quedan {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={
                        cap.estado === 'Finalizada' ? 'green' :
                        cap.estado === 'En curso' ? 'blue' :
                        'yellow'
                      }>
                        {cap.estado}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Separador visual */}
      {(capacitacionesUsuario.length > 0 && (evaluacionesDisponibles.length > 0 || evaluacionesPendientes.length > 0 || evaluacionesCompletadas.length > 0)) && (
        <div className="my-10 border-t-2 border-gray-300"></div>
      )}

      {/* ========== SECCIÓN 2: EVALUACIONES ========== */}
      {(evaluacionesPendientes.length > 0 || evaluacionesCompletadas.length > 0 || evaluacionesDisponibles.length > 0) && (
        <div className="mb-10">
          <Card className="p-6 border-t-4 border-t-yellow-500 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-500 rounded-lg p-3">
                <ClipboardCheckIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Evaluaciones</h2>
                <p className="text-sm text-gray-600">Realiza evaluaciones disponibles y gestiona tus resultados</p>
              </div>
            </div>

            {/* Evaluaciones Disponibles */}
            {evaluacionesDisponibles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Evaluaciones Disponibles ({evaluacionesDisponibles.length})
                </h3>
                <p className="text-sm text-gray-600 mb-4">Puedes realizar estas evaluaciones cuando lo desees</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluacionesDisponibles.map(evaluacion => {
                    return (
                      <Card key={evaluacion.id} className="border-2 border-blue-300 p-5 bg-blue-50 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">
                              {evaluacion.nombre || 'Evaluación sin nombre'}
                            </h3>
                            {evaluacion.descripcion && (
                              <p className="text-sm text-gray-600 mb-2">{evaluacion.descripcion}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <span>{evaluacion.preguntas?.length || 0} pregunta{evaluacion.preguntas?.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleIniciarEvaluacion(evaluacion)}
                          className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                        >
                          <ClipboardCheckIcon className="w-5 h-5" />
                          Realizar Evaluación
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Separador entre disponibles y pendientes */}
            {evaluacionesDisponibles.length > 0 && evaluacionesPendientes.length > 0 && (
              <div className="my-6 border-t border-gray-200"></div>
            )}

            {/* Evaluaciones Pendientes */}
            {evaluacionesPendientes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Pendientes ({evaluacionesPendientes.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluacionesPendientes.map(respuesta => {
                    const evaluacion = evaluaciones.find(e => e && e.id === respuesta.evaluacionId);
                    const empresa = initialCompanies.find(c => c && c.id === respuesta.empresaId);
                    const diasRestantes = respuesta.fechaLimite 
                      ? Math.ceil((new Date(respuesta.fechaLimite) - new Date()) / (1000 * 60 * 60 * 24))
                      : null;
                    
                    return (
                      <Card key={respuesta.id} className="border-2 border-yellow-300 p-5 bg-yellow-50 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">
                              {evaluacion?.nombre || 'Evaluación sin nombre'}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BuildingIcon className="w-4 h-4" />
                                <span>{empresa?.name || 'Empresa no encontrada'}</span>
                              </div>
                              {respuesta.fechaLimite && diasRestantes !== null && (
                                <div className={`flex items-center gap-2 text-sm font-semibold ${
                                  diasRestantes < 0 ? 'text-red-600' : 
                                  diasRestantes < 3 ? 'text-orange-600' : 
                                  'text-gray-700'
                                }`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>
                                    {diasRestantes < 0 
                                      ? 'Vencida' 
                                      : `Quedan ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleResponderEvaluacion(respuesta)}
                          variant="primary"
                          className="w-full mt-4 flex items-center justify-center gap-2 font-semibold"
                        >
                          <ClipboardCheckIcon className="w-5 h-5" />
                          Responder Ahora
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Separador entre pendientes y completadas */}
            {evaluacionesPendientes.length > 0 && evaluacionesCompletadas.length > 0 && (
              <div className="my-6 border-t border-gray-200"></div>
            )}

            {/* Evaluaciones Completadas */}
            {evaluacionesCompletadas.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Completadas ({evaluacionesCompletadas.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluacionesCompletadas.map(respuesta => {
                    const evaluacion = evaluaciones.find(e => e && e.id === respuesta.evaluacionId);
                    const empresa = initialCompanies.find(c => c && c.id === respuesta.empresaId);
                    const porcentaje = respuesta.porcentaje || 0;
                    const esExcelente = porcentaje >= 90;
                    const esBueno = porcentaje >= 70 && porcentaje < 90;
                    const esRegular = porcentaje < 70;
                    
                    return (
                      <Card key={respuesta.id} className="border-2 border-green-300 p-5 bg-green-50 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">
                              {evaluacion?.nombre || 'Evaluación sin nombre'}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BuildingIcon className="w-4 h-4" />
                                <span>{empresa?.name || 'Empresa no encontrada'}</span>
                              </div>
                              {respuesta.calificacion !== null && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700">Calificación</span>
                                    <span className={`text-2xl font-bold ${
                                      esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                      {respuesta.calificacion}/10
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        esExcelente ? 'bg-green-600' : esBueno ? 'bg-green-500' : 'bg-yellow-500'
                                      }`}
                                      style={{ width: `${respuesta.porcentaje}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 text-right">
                                    {respuesta.porcentaje}% - {respuesta.correctas || 0} correctas
                                  </p>
                                </div>
                              )}
                              {respuesta.fechaRespuesta && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>Completada: {new Date(respuesta.fechaRespuesta).toLocaleDateString('es-ES')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant={
                            esExcelente ? 'green' : esBueno ? 'green' : 'yellow'
                          }>
                            ✓
                          </Badge>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Separador visual */}
      {((capacitacionesUsuario.length > 0 || evaluacionesDisponibles.length > 0 || evaluacionesPendientes.length > 0 || evaluacionesCompletadas.length > 0) && documentosUsuario.length > 0) && (
        <div className="my-10 border-t-2 border-gray-300"></div>
      )}

      {/* ========== SECCIÓN 3: MIS DOCUMENTOS ========== */}
      <div className="mb-8">
        <Card className="p-6 border-t-4 border-t-primary shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary rounded-lg p-3">
              <DocumentIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Mis Documentos</h2>
              <p className="text-sm text-gray-600">Accede a todos tus documentos publicados</p>
            </div>
          </div>

          {/* Filtros mejorados */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <div className="relative">
                <Select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="bg-white"
                >
                  <option value="all">Todos los estados</option>
                  <option value="Publicado">Publicado</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Documentos por categoría - Diseño tipo pestañas */}
          {Object.keys(documentosPorCategoria).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(documentosPorCategoria).map(([categoria, docs]) => (
                <div key={categoria} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div 
                    onClick={() => toggleCategory(categoria)}
                    className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                          <DocumentIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{categoria}</h3>
                          <p className="text-sm text-primary-light">{docs.length} documento{docs.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <ChevronDownIcon 
                        className={`w-6 h-6 text-white transition-transform ${
                          expandedCategories[categoria] ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                  {expandedCategories[categoria] && (
                    <div className="p-6 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {docs.map((documento) => (
                          <Card
                            key={documento.id}
                            className="bg-white border-2 border-gray-200 p-6 hover:border-primary hover:shadow-xl transition-all duration-300 group"
                          >
                            {/* Header con estado */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg mb-2 line-clamp-2 min-h-[3rem]">
                                  {documento.nombre || documento.tipo || 'Documento sin título'}
                               </h3>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <Badge variant="gray">
                                    {documento.tipo || 'Sin tipo'}
                                  </Badge>
                                  <Badge variant="green">
                                    {documento.estado || 'Publicado'}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Información del documento */}
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BuildingIcon className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="truncate">{documento.empresa || 'Sin empresa'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(documento.fecha)}</span>
                              </div>
                            </div>

                            {/* Footer con botones de acción */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <span className="text-xs text-gray-400">ID: #{documento.id}</span>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => setSelectedDocument(documento)}
                                  variant="primary"
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm shadow-md hover:shadow-lg"
                                  title="Ver documento"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                  Ver
                                </Button>
                                {documento.archivo && (
                                  <a
                                    href={documento.archivo}
                                    download
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                                    title="Descargar documento"
                                  >
                                    <DownloadIcon className="w-4 h-4" />
                                    Descargar
                                  </a>
                                )}
                                {documento.tipo === 'FICHA MÉDICA' && !documento.archivo && (
                                  <Button
                                    onClick={() => setSelectedDocument(documento)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 text-sm shadow-md hover:shadow-lg"
                                    title="Ver y descargar documento"
                                  >
                                    <DownloadIcon className="w-4 h-4" />
                                    Ver/Descargar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <DocumentIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                No tienes documentos publicados
              </p>
              <p className="text-gray-500 text-sm">
                Los documentos que se publiquen asociados a tu cuenta aparecerán aquí
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de vista previa */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedDocument.tipo || 'Documento'}
              </h2>
              <div className="flex items-center gap-3">
                {(selectedDocument.tipo === 'FICHA MÉDICA' || selectedDocument.tipo === 'Ficha Médica') && (
                  <Button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-sm shadow-md hover:shadow-lg"
                    title="Descargar/Imprimir documento"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Descargar PDF
                  </Button>
                )}
                {selectedDocument.archivo && (
                  <a
                    href={selectedDocument.archivo}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                    title="Descargar documento"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Descargar
                  </a>
                )}
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Empresa:</strong> {selectedDocument.empresa}
                  </div>
                  <div>
                    <strong>Fecha:</strong> {formatDate(selectedDocument.fecha)}
                  </div>
                  <div>
                    <strong>Tipo:</strong> {selectedDocument.tipo}
                  </div>
                  <div>
                    <strong>Estado:</strong> 
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {selectedDocument.estado}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded overflow-hidden">
                {getDocumentComponent(selectedDocument) || (
                  selectedDocument.archivo ? (
                    <iframe
                      src={selectedDocument.archivo}
                      className="w-full h-96"
                      title="Vista previa documento"
                    />
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>No hay vista previa disponible para este documento</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsuarioDocumentos;

