import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evaluaciones } from '../data/evaluacionesData';
import { respuestasEvaluaciones } from '../data/evaluacionesData';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';

const SeguimientoEvaluacion = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { evaluacionId, empresaId } = useParams();
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('all');
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');
  const [selectedResultado, setSelectedResultado] = useState(null);

  const evaluacion = useMemo(() => {
    return evaluaciones.find(e => e.id === parseInt(evaluacionId));
  }, [evaluacionId]);

  // Obtener todas las respuestas de esta evaluación
  const respuestas = useMemo(() => {
    if (!evaluacion) return [];
    return respuestasEvaluaciones.filter(r => r.evaluacionId === evaluacion.id);
  }, [evaluacion]);

  // Filtrar respuestas
  const respuestasFiltradas = useMemo(() => {
    let filtradas = respuestas;

    // Filtrar por estado
    if (filtroEstado !== 'all') {
      filtradas = filtradas.filter(r => r.estado === filtroEstado);
    }

    // Filtrar por búsqueda
    if (busquedaEmpleado.trim()) {
      const busqueda = busquedaEmpleado.toLowerCase().trim();
      filtradas = filtradas.filter(r => {
        const empleado = employees.find(e => e.id === r.trabajadorId);
        if (!empleado) return false;
        const nombreCompleto = `${empleado.firstName || empleado.names || ''} ${empleado.lastName || empleado.lastNames || ''}`.toLowerCase();
        return nombreCompleto.includes(busqueda) || 
               empleado.dni?.includes(busqueda) ||
               empleado.cedula?.includes(busqueda);
      });
    }

    return filtradas;
  }, [respuestas, filtroEstado, busquedaEmpleado, employees]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = respuestas.length;
    const pendientes = respuestas.filter(r => r.estado === 'Pendiente').length;
    const respondidas = respuestas.filter(r => r.estado === 'Respondida').length;
    const promedio = respondidas > 0
      ? respuestas
          .filter(r => r.estado === 'Respondida' && r.calificacion !== null)
          .reduce((sum, r) => sum + (r.calificacion || 0), 0) / respondidas
      : 0;

    return { total, pendientes, respondidas, promedio };
  }, [respuestas]);

  const getNombreCompleto = (emp) => {
    if (!emp) return 'Empleado no encontrado';
    return `${emp.firstName || emp.names || ''} ${emp.lastName || emp.lastNames || ''}`.trim();
  };

  const handleFinalizar = () => {
    if (window.confirm('¿Está seguro de finalizar esta evaluación? Una vez finalizada, no se podrá reactivar ni enviar a más empleados. El estado cambiará a "Finalizada".')) {
      const index = evaluaciones.findIndex(e => e.id === evaluacion.id);
      if (index !== -1) {
        evaluaciones[index].estado = 'Finalizada';
        navigate(`/anexo1/empresa/${empresaId}/evaluaciones`);
      }
    }
  };

  const handleEditar = () => {
    if (evaluacion.estado === 'Finalizada') {
      alert('No se pueden editar evaluaciones que ya están finalizadas.');
      return;
    }
    if (evaluacion.estado === 'Activa') {
      alert('No se pueden editar evaluaciones activas. Solo se pueden editar evaluaciones en estado "Borrador".');
      return;
    }
    navigate(`/anexo1/empresa/${empresaId}/evaluaciones?editar=${evaluacion.id}`);
  };

  const generarHTMLResultado = (resultado) => {
    if (!resultado || !evaluacion) return '';
    const empresa = companies?.find(c => c.id === resultado.empresaId);
    const empleado = employees?.find(e => e.id === resultado.trabajadorId);

    const partes = [];
    partes.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resultado de Evaluación</title>');
    partes.push('<style>body{font-family:Arial,sans-serif;padding:20px;max-width:800px;margin:0 auto}h1{color:#004A7C;border-bottom:3px solid #004A7C;padding-bottom:10px}.info{margin:20px 0;background:#f8f9fa;padding:15px;border-radius:8px}.info p{margin:8px 0}.calificacion{background:#e8f5e9;padding:20px;border-radius:8px;margin:20px 0;border-left:5px solid #22c55e}.calificacion h2{margin-top:0;color:#22c55e}.pregunta{margin:20px 0;padding:15px;border-left:4px solid #004A7C;background:#f8f9fa;border-radius:4px}.correcta{color:#22c55e;font-weight:bold}.incorrecta{color:#ef4444;font-weight:bold}@media print{body{padding:10px}}</style>');
    partes.push('</head><body>');
    partes.push('<h1>Resultado de Evaluación</h1>');
    partes.push('<div class="info">');
    partes.push('<p><strong>Trabajador:</strong> ' + getNombreCompleto(empleado) + '</p>');
    partes.push('<p><strong>Empresa:</strong> ' + (empresa?.name || 'N/A') + '</p>');
    partes.push('<p><strong>Evaluación:</strong> ' + evaluacion.nombre + '</p>');
    partes.push('<p><strong>Fecha de Respuesta:</strong> ' + (resultado.fechaRespuesta ? new Date(resultado.fechaRespuesta).toLocaleString('es-ES') : 'Pendiente') + '</p>');
    partes.push('</div>');
    if (resultado.calificacion !== null) {
      partes.push('<div class="calificacion"><h2>Calificación</h2>');
      partes.push('<p><strong>Nota:</strong> ' + resultado.calificacion + ' / 10</p>');
      partes.push('<p><strong>Porcentaje:</strong> ' + resultado.porcentaje + '%</p>');
      partes.push('</div>');
    }
    partes.push('<h2>Respuestas Detalladas</h2>');
    if (resultado.respuestas && resultado.respuestas.length > 0) {
      resultado.respuestas.forEach((resp, idx) => {
        const pregunta = evaluacion?.preguntas?.find(p => p && p.id === resp.preguntaId);
        if (!pregunta) return;
        if (pregunta.tipo === 'opcion-multiple') {
          const opcionSeleccionada = pregunta.opciones?.find(op => op && op.id === resp.respuestaSeleccionada);
          const esCorrecta = resp.esCorrecta;
          const respuestaCorrecta = pregunta.opciones?.find(op => op && op.correcta);
          partes.push('<div class="pregunta">');
          partes.push('<p><strong>Pregunta ' + (idx + 1) + ':</strong> ' + (pregunta.pregunta || 'Sin pregunta') + '</p>');
          partes.push('<p class="' + (esCorrecta ? 'correcta' : 'incorrecta') + '">');
          partes.push('Respuesta: ' + (opcionSeleccionada?.texto || 'No seleccionada') + ' ');
          partes.push(esCorrecta ? '\u2713 Correcta' : '\u2717 Incorrecta');
          partes.push('</p>');
          if (!esCorrecta && respuestaCorrecta) {
            partes.push('<p><strong>Respuesta correcta:</strong> ' + respuestaCorrecta.texto + '</p>');
          }
          partes.push('</div>');
        } else {
          partes.push('<div class="pregunta">');
          partes.push('<p><strong>Pregunta ' + (idx + 1) + ':</strong> ' + (pregunta.pregunta || 'Sin pregunta') + '</p>');
          partes.push('<p><strong>Respuesta:</strong> ' + (resp.respuestaTexto || 'Sin respuesta') + '</p>');
          partes.push('<p><em>(Revisión manual requerida)</em></p>');
          partes.push('</div>');
        }
      });
    } else {
      partes.push('<p>No hay respuestas disponibles</p>');
    }
    partes.push('</body></html>');
    return partes.join('');
  };

  const handleVerDetalle = (resultado) => {
    setSelectedResultado(resultado);
  };

  const handleDescargarPDF = (resultado) => {
    if (!resultado) return;
    const htmlContent = generarHTMLResultado(resultado);
    if (!htmlContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes para descargar el PDF');
      return;
    }
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => printWindow.print(), 250);
    };
  };

  if (!evaluacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Evaluación no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(`/anexo1/empresa/${empresaId}/evaluaciones`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Evaluaciones
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Resultados de Evaluación</h1>
            <p className="text-gray-600 mt-1">{evaluacion.nombre}</p>
          </div>
          <div className="flex gap-3">
            {evaluacion.estado === 'Activa' && (
              <>
                <button
                  onClick={handleEditar}
                  className="px-4 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={handleFinalizar}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Finalizar Evaluación
                </button>
              </>
            )}
            {evaluacion.estado === 'Finalizada' && (
              <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Evaluación Finalizada
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Enviadas</p>
          <p className="text-3xl font-bold text-gray-800">{estadisticas.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-gray-800">{estadisticas.pendientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Respondidas</p>
          <p className="text-3xl font-bold text-gray-800">{estadisticas.respondidas}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Promedio</p>
          <p className="text-3xl font-bold text-gray-800">
            {estadisticas.promedio > 0 ? estadisticas.promedio.toFixed(1) : '-'}/10
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={busquedaEmpleado}
              onChange={(e) => setBusquedaEmpleado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Respondida">Respondidas</option>
          </select>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Empleado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Calificación</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha Respuesta</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {respuestasFiltradas.length > 0 ? (
                respuestasFiltradas.map(respuesta => {
                  const empleado = employees.find(e => e.id === respuesta.trabajadorId);
                  const empresa = companies.find(c => c.id === respuesta.empresaId);
                  
                  return (
                    <tr key={respuesta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{getNombreCompleto(empleado)}</div>
                        <div className="text-sm text-gray-500">{empleado?.dni || empleado?.cedula || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {empresa?.name || 'Empresa no encontrada'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          respuesta.estado === 'Respondida' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {respuesta.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {respuesta.calificacion !== null ? (
                          <div>
                            <span className="font-semibold text-gray-900">{respuesta.calificacion}/10</span>
                            <div className="text-xs text-gray-500">{respuesta.porcentaje}%</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {respuesta.fechaRespuesta 
                          ? new Date(respuesta.fechaRespuesta).toLocaleDateString('es-ES')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4">
                        {respuesta.estado === 'Respondida' && (
                          <button
                            onClick={() => handleVerDetalle(respuesta)}
                            className="text-primary hover:text-primary-dark text-sm font-medium"
                          >
                            Ver Detalle
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle del Resultado */}
      {selectedResultado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800">Detalle de Resultado</h2>
              <button
                onClick={() => setSelectedResultado(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <iframe
                srcDoc={generarHTMLResultado(selectedResultado)}
                className="w-full h-full border border-gray-300 rounded-lg"
                title="Detalle de Resultado"
                style={{ minHeight: '600px' }}
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setSelectedResultado(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={() => handleDescargarPDF(selectedResultado)}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguimientoEvaluacion;

