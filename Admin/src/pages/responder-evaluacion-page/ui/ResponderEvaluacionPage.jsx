import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evaluaciones } from '@shared/api/mock/evaluacionesData';
import { respuestasEvaluaciones } from '@shared/api/mock/evaluacionesData';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';

const ResponderEvaluacionPage = ({ user }) => {
  const { evaluacionId, respuestaId } = useParams();
  const navigate = useNavigate();
  const [evaluacion, setEvaluacion] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [respuestasTexto, setRespuestasTexto] = useState({});
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const evaluacionEncontrada = evaluaciones?.find(e => e && e.id === parseInt(evaluacionId));
    setEvaluacion(evaluacionEncontrada);
    
    // Inicializar respuestas vacías
    if (evaluacionEncontrada && evaluacionEncontrada.preguntas) {
      const iniciales = {};
      const inicialesTexto = {};
      evaluacionEncontrada.preguntas.forEach(p => {
        if (p.tipo === 'opcion-multiple') {
          iniciales[p.id] = null;
        } else {
          inicialesTexto[p.id] = '';
        }
      });
      setRespuestas(iniciales);
      setRespuestasTexto(inicialesTexto);
    }
  }, [evaluacionId]);

  const handleSeleccionarOpcion = (preguntaId, opcionId) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: opcionId
    });
  };

  const handleCambiarTexto = (preguntaId, texto) => {
    setRespuestasTexto({
      ...respuestasTexto,
      [preguntaId]: texto
    });
  };

  const calcularCalificacion = () => {
    if (!evaluacion || !evaluacion.preguntas) return null;

    let correctas = 0;
    let totalPreguntasCerradas = 0;

    evaluacion.preguntas.forEach(pregunta => {
      if (pregunta.tipo === 'opcion-multiple') {
        totalPreguntasCerradas++;
        const respuestaSeleccionada = respuestas[pregunta.id];
        if (respuestaSeleccionada) {
          const opcionSeleccionada = pregunta.opciones?.find(op => op && op.id === respuestaSeleccionada);
          if (opcionSeleccionada && opcionSeleccionada.correcta) {
            correctas++;
          }
        }
      }
    });

    if (totalPreguntasCerradas === 0) return null;

    const porcentaje = (correctas / totalPreguntasCerradas) * 100;
    const calificacion = (porcentaje / 100) * 10;

    return {
      calificacion: calificacion.toFixed(1),
      porcentaje: porcentaje.toFixed(1),
      correctas,
      total: totalPreguntasCerradas
    };
  };

  const handleEnviar = () => {
    if (!evaluacion) return;

    // Validar que todas las preguntas de opción múltiple tengan respuesta
    const preguntasSinRespuesta = evaluacion.preguntas.filter(p => {
      if (p.tipo === 'opcion-multiple') {
        return !respuestas[p.id];
      }
      return false;
    });

    if (preguntasSinRespuesta.length > 0) {
      alert(`Debe responder todas las preguntas. Faltan ${preguntasSinRespuesta.length} pregunta(s).`);
      return;
    }

    // Preparar respuestas para guardar
    const respuestasParaGuardar = evaluacion.preguntas.map(pregunta => {
      if (pregunta.tipo === 'opcion-multiple') {
        const respuestaSeleccionada = respuestas[pregunta.id];
        const opcionSeleccionada = pregunta.opciones?.find(op => op && op.id === respuestaSeleccionada);
        const esCorrecta = opcionSeleccionada?.correcta || false;
        
        return {
          preguntaId: pregunta.id,
          respuestaSeleccionada: respuestaSeleccionada,
          esCorrecta: esCorrecta
        };
      } else {
        return {
          preguntaId: pregunta.id,
          respuestaTexto: respuestasTexto[pregunta.id] || '',
          revisada: false
        };
      }
    });

    const calificacion = calcularCalificacion();
    const resultadoFinal = {
      calificacion: calificacion ? parseFloat(calificacion.calificacion) : null,
      porcentaje: calificacion ? parseFloat(calificacion.porcentaje) : null,
      correctas: calificacion ? calificacion.correctas : 0,
      total: calificacion ? calificacion.total : 0
    };

    // Actualizar la respuesta en respuestasEvaluaciones
    const respuestaIdNum = parseInt(respuestaId);
    const index = respuestasEvaluaciones.findIndex(r => r && r.id === respuestaIdNum);
    
    if (index !== -1) {
      respuestasEvaluaciones[index] = {
        ...respuestasEvaluaciones[index],
        respuestas: respuestasParaGuardar,
        calificacion: resultadoFinal.calificacion,
        porcentaje: resultadoFinal.porcentaje,
        correctas: resultadoFinal.correctas,
        estado: 'Respondida',
        fechaRespuesta: new Date().toISOString()
      };
    }

    // Mostrar resultado
    setResultado(resultadoFinal);
  };

  if (!evaluacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md text-center">
          <p className="text-gray-500">Cargando evaluación...</p>
        </Card>
      </div>
    );
  }

  // Si hay resultado, mostrar pantalla de resultado
  if (resultado) {
    const esExcelente = resultado.porcentaje >= 90;
    const esBueno = resultado.porcentaje >= 70 && resultado.porcentaje < 90;
    const esRegular = resultado.porcentaje < 70;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                esExcelente ? 'bg-green-100' : esBueno ? 'bg-green-50' : 'bg-yellow-100'
              }`}>
                <svg className={`w-16 h-16 ${
                  esExcelente ? 'text-green-600' : esBueno ? 'text-green-500' : 'text-yellow-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">¡Evaluación Completada!</h2>
              <p className="text-gray-600 text-lg">Tu calificación ha sido registrada</p>
            </div>

            <div className={`rounded-xl p-8 mb-8 ${
              esExcelente ? 'bg-green-50 border-2 border-green-300' : 
              esBueno ? 'bg-green-50 border-2 border-green-200' : 
              'bg-yellow-50 border-2 border-yellow-300'
            }`}>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Tu Calificación</p>
                <p className={`text-6xl font-bold mb-2 ${
                  esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {resultado.calificacion}/10
                </p>
                <p className={`text-3xl font-semibold ${
                  esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {resultado.porcentaje}%
                </p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-5 mb-6 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    esExcelente ? 'bg-green-600' : esBueno ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${resultado.porcentaje}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Respuestas Correctas</p>
                  <p className={`text-3xl font-bold ${
                    esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {resultado.correctas}/{resultado.total}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nivel</p>
                  <p className={`text-2xl font-bold ${
                    esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {esExcelente ? 'Excelente' : esBueno ? 'Bueno' : 'Regular'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/usuario/documentos')}
                variant="primary"
                className="px-8 py-3 text-lg font-semibold"
              >
                Volver a Mis Documentos
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const calificacionPreview = calcularCalificacion();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <Button
              variant="ghost"
              onClick={() => navigate('/usuario/documentos')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors px-0 py-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{evaluacion.nombre}</h1>
            {evaluacion.descripcion && (
              <p className="text-gray-600">{evaluacion.descripcion}</p>
            )}
          </div>

          {/* Preguntas */}
          <div className="space-y-6 mb-8">
            {evaluacion.preguntas && evaluacion.preguntas.map((pregunta, index) => (
              <div key={pregunta.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
                <p className="font-semibold text-gray-800 mb-4 text-lg">
                  {index + 1}. {pregunta.pregunta}
                </p>

                {pregunta.tipo === 'opcion-multiple' ? (
                  <div className="space-y-3">
                    {pregunta.opciones && pregunta.opciones.map(opcion => (
                      <label
                        key={opcion.id}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          respuestas[pregunta.id] === opcion.id
                            ? 'border-primary bg-primary-light'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${pregunta.id}`}
                          value={opcion.id}
                          checked={respuestas[pregunta.id] === opcion.id}
                          onChange={() => handleSeleccionarOpcion(pregunta.id, opcion.id)}
                          className="w-5 h-5 text-primary focus:ring-primary"
                        />
                        <span className="ml-4 text-gray-700">{opcion.texto}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={respuestasTexto[pregunta.id] || ''}
                    onChange={(e) => handleCambiarTexto(pregunta.id, e.target.value)}
                    placeholder="Escriba su respuesta aquí..."
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Vista previa de calificación */}
          {calificacionPreview && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-4">Calificación Preliminar</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nota:</span>
                  <span className="ml-2 font-bold text-lg text-green-700">{calificacionPreview.calificacion}/10</span>
                </div>
                <div>
                  <span className="text-gray-600">Porcentaje:</span>
                  <span className="ml-2 font-bold text-green-700">{calificacionPreview.porcentaje}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Correctas:</span>
                  <span className="ml-2 font-bold text-green-700">{calificacionPreview.correctas}/{calificacionPreview.total}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Las preguntas de respuesta corta requieren revisión manual
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            <Button
              onClick={() => navigate('/usuario/documentos')}
              variant="outline"
              className="px-6 py-3 font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEnviar}
              variant="primary"
              className="px-8 py-3 text-lg font-semibold"
            >
              Enviar Evaluación
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResponderEvaluacionPage;

