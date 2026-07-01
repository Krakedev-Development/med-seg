import { useState, useEffect } from 'react';
import { evaluaciones } from '@shared/api/mock/evaluacionesData';
import Button from '@shared/ui/atoms/Button';
import Card, { CardContent } from '@shared/ui/organisms/Card';

const ResponderEvaluacion = ({ evaluacionId, respuestaId, onGuardar, onCancel }) => {
  const [evaluacion, setEvaluacion] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [respuestasTexto, setRespuestasTexto] = useState({});
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const evaluacionEncontrada = evaluaciones?.find(e => e && e.id === evaluacionId);
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

  const handleGuardar = () => {
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

    // Mostrar resultado
    setResultado(resultadoFinal);

    // Guardar en el sistema
    onGuardar({
      respuestaId,
      evaluacionId,
      respuestas: respuestasParaGuardar,
      calificacion: resultadoFinal.calificacion,
      porcentaje: resultadoFinal.porcentaje,
      correctas: resultadoFinal.correctas,
      estado: 'Respondida',
      fechaRespuesta: new Date().toISOString()
    });
  };

  if (!evaluacion) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-500">Cargando evaluación...</p>
        </CardContent>
      </Card>
    );
  }

  // Si hay resultado, mostrar pantalla de resultado
  if (resultado) {
    const esExcelente = resultado.porcentaje >= 90;
    const esBueno = resultado.porcentaje >= 70 && resultado.porcentaje < 90;
    const esRegular = resultado.porcentaje < 70;

    return (
      <Card>
        <CardContent>
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            esExcelente ? 'bg-green-100' : esBueno ? 'bg-green-50' : 'bg-yellow-100'
          }`}>
            <svg className={`w-12 h-12 ${
              esExcelente ? 'text-green-600' : esBueno ? 'text-green-500' : 'text-yellow-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Evaluación Completada!</h2>
          <p className="text-gray-600">Tu calificación ha sido registrada</p>
        </div>

        <div className={`rounded-xl p-6 mb-6 ${
          esExcelente ? 'bg-green-50 border-2 border-green-300' : 
          esBueno ? 'bg-green-50 border-2 border-green-200' : 
          'bg-yellow-50 border-2 border-yellow-300'
        }`}>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Tu Calificación</p>
            <p className={`text-5xl font-bold mb-2 ${
              esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {resultado.calificacion}/10
            </p>
            <p className={`text-2xl font-semibold ${
              esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {resultado.porcentaje}%
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                esExcelente ? 'bg-green-600' : esBueno ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${resultado.porcentaje}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Respuestas Correctas</p>
              <p className={`text-2xl font-bold ${
                esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {resultado.correctas}/{resultado.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nivel</p>
              <p className={`text-xl font-bold ${
                esExcelente ? 'text-green-700' : esBueno ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {esExcelente ? 'Excelente' : esBueno ? 'Bueno' : 'Regular'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => {
              onCancel();
            }}
            variant="primary"
          >
            Cerrar
          </Button>
        </div>
        </CardContent>
      </Card>
    );
  }

  const calificacionPreview = calcularCalificacion();

  return (
    <Card>
      <CardContent>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{evaluacion.nombre}</h2>
        {evaluacion.descripcion && (
          <p className="text-gray-600">{evaluacion.descripcion}</p>
        )}
      </div>

      <div className="space-y-6">
        {evaluacion.preguntas && evaluacion.preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-3">
              {index + 1}. {pregunta.pregunta}
            </p>

            {pregunta.tipo === 'opcion-multiple' ? (
              <div className="space-y-2">
                {pregunta.opciones && pregunta.opciones.map(opcion => (
                  <label
                    key={opcion.id}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
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
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="ml-3 text-gray-700">{opcion.texto}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={respuestasTexto[pregunta.id] || ''}
                onChange={(e) => handleCambiarTexto(pregunta.id, e.target.value)}
                placeholder="Escriba su respuesta aquí..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            )}
          </div>
        ))}
      </div>

      {/* Vista previa de calificación */}
      {calificacionPreview && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Calificación Preliminar</h3>
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
          <p className="text-xs text-gray-500 mt-2">
            * Las preguntas de respuesta corta requieren revisión manual
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Finalizar Evaluación
        </Button>
      </div>
      </CardContent>
    </Card>
  );
};

export default ResponderEvaluacion;

