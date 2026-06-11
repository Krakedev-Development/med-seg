import { useState, useEffect } from 'react';
import { plantillasEvaluacion } from '../data/plantillasEvaluacionData';

const EvaluacionForm = ({ 
  onAddEvaluacion, 
  onUpdateEvaluacion, 
  editingEvaluacion, 
  onCancel, 
  capacitaciones 
}) => {
  const [formData, setFormData] = useState({
    capacitacionId: editingEvaluacion?.capacitacionId || '',
    nombre: editingEvaluacion?.nombre || '',
    descripcion: editingEvaluacion?.descripcion || '',
    fechaLimite: editingEvaluacion?.fechaLimite || '',
    estado: editingEvaluacion?.estado || 'Borrador',
    preguntas: editingEvaluacion?.preguntas || [],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [guardarComoPlantilla, setGuardarComoPlantilla] = useState(false);
  const [showModalPlantillas, setShowModalPlantillas] = useState(false);
  const [searchPlantilla, setSearchPlantilla] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddPregunta = (tipo) => {
    const nuevaPregunta = {
      id: Date.now(),
      tipo: tipo,
      pregunta: '',
      opciones: tipo === 'opcion-multiple' ? [
        { id: 1, texto: '', correcta: false },
        { id: 2, texto: '', correcta: false },
      ] : [],
      respuestaCorrecta: tipo === 'respuesta-corta' ? '' : '',
    };
    setFormData({
      ...formData,
      preguntas: [...formData.preguntas, nuevaPregunta]
    });
  };

  const handleUpdatePregunta = (preguntaId, field, value) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p =>
        p.id === preguntaId ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleUpdateOpcion = (preguntaId, opcionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => {
        if (p.id === preguntaId) {
          return {
            ...p,
            opciones: p.opciones.map(op =>
              op.id === opcionId ? { ...op, [field]: value } : op
            )
          };
        }
        return p;
      })
    }));
  };

  const handleAddOpcion = (preguntaId) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => {
        if (p.id === preguntaId && p.opciones.length < 5) {
          const nuevoId = Math.max(...p.opciones.map(o => o.id), 0) + 1;
          return {
            ...p,
            opciones: [...p.opciones, { id: nuevoId, texto: '', correcta: false }]
          };
        }
        return p;
      })
    }));
  };

  const handleRemoveOpcion = (preguntaId, opcionId) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => {
        if (p.id === preguntaId && p.opciones.length > 2) {
          return {
            ...p,
            opciones: p.opciones.filter(op => op.id !== opcionId)
          };
        }
        return p;
      })
    }));
  };

  const handleSetCorrecta = (preguntaId, opcionId) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => {
        if (p.id === preguntaId) {
          return {
            ...p,
            opciones: p.opciones.map(op => ({
              ...op,
              correcta: op.id === opcionId
            }))
          };
        }
        return p;
      })
    }));
  };

  const handleRemovePregunta = (preguntaId) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.filter(p => p.id !== preguntaId)
    }));
  };

  const generateLinkUnico = () => {
    const prefix = formData.capacitacionId ? 'EVAL-' : 'EVAL-';
    const date = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${date}-${random}`;
  };

  const generateCodigoAcceso = () => {
    const capacitacion = capacitaciones?.find(c => c.id === parseInt(formData.capacitacionId));
    if (capacitacion) {
      const actividad = capacitacion.actividadRelacionada.substring(0, 3).toUpperCase();
      const year = new Date().getFullYear();
      return `${actividad}${year}`;
    }
    return `EVAL${new Date().getFullYear()}`;
  };

  const cargarPlantilla = (plantilla) => {
    const preguntasConNuevosIds = plantilla.preguntas.map(p => ({
      ...p,
      id: Date.now() + Math.random()
    }));
    setFormData({
      ...formData,
      preguntas: preguntasConNuevosIds
    });
    setShowModalPlantillas(false);
  };

  const guardarPlantilla = () => {
    if (formData.preguntas.length === 0) {
      alert('No hay preguntas para guardar como plantilla');
      return;
    }
    const nombrePlantilla = prompt('Ingrese un nombre para la plantilla:');
    if (!nombrePlantilla) return;
    
    const descripcionPlantilla = prompt('Ingrese una descripción breve:');
    
    const nuevaPlantilla = {
      id: Date.now(),
      nombre: nombrePlantilla,
      descripcion: descripcionPlantilla || 'Sin descripción',
      numeroPreguntas: formData.preguntas.length,
      fechaCreacion: new Date().toISOString().split('T')[0],
      preguntas: formData.preguntas
    };
    
    plantillasEvaluacion.push(nuevaPlantilla);
    alert('Plantilla guardada exitosamente');
  };

  const plantillasFiltradas = plantillasEvaluacion.filter(plantilla =>
    plantilla.nombre.toLowerCase().includes(searchPlantilla.toLowerCase()) ||
    plantilla.descripcion.toLowerCase().includes(searchPlantilla.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que todas las preguntas estén completas
    const preguntasValidas = formData.preguntas.every(p => {
      if (!p.pregunta.trim()) return false;
      if (p.tipo === 'opcion-multiple') {
        if (p.opciones.length < 2) return false;
        if (!p.opciones.every(op => op.texto.trim())) return false;
        if (!p.opciones.some(op => op.correcta)) return false;
      }
      return true;
    });

    if (!preguntasValidas) {
      alert('Por favor complete todas las preguntas correctamente');
      return;
    }

    if (formData.nombre && formData.capacitacionId && formData.preguntas.length > 0) {
      const linkUnico = editingEvaluacion?.linkUnico || generateLinkUnico();
      const codigoAcceso = editingEvaluacion?.codigoAcceso || generateCodigoAcceso();

      if (editingEvaluacion) {
        onUpdateEvaluacion({
          ...editingEvaluacion,
          ...formData,
          linkUnico,
          codigoAcceso,
          fechaCreacion: editingEvaluacion.fechaCreacion
        });
      } else {
        const newEvaluacion = {
          id: Date.now(),
          ...formData,
          linkUnico,
          codigoAcceso,
          fechaCreacion: new Date().toISOString().split('T')[0]
        };
        
        // Guardar como plantilla si está marcado
        if (guardarComoPlantilla) {
          guardarPlantilla();
        }
        
        onAddEvaluacion(newEvaluacion);
        setFormData({
          capacitacionId: '',
          nombre: '',
          descripcion: '',
          fechaLimite: '',
          estado: 'Borrador',
          preguntas: [],
        });
        setGuardarComoPlantilla(false);
      }
    }
  };

  const capacitacionSeleccionada = capacitaciones && Array.isArray(capacitaciones) 
    ? capacitaciones.find(c => c && c.id === parseInt(formData.capacitacionId))
    : null;

  return (
    <>
      {/* Modal de Plantillas */}
      {showModalPlantillas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Plantillas Guardadas</h3>
                <button
                  onClick={() => setShowModalPlantillas(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar plantilla por nombre o descripción..."
                  value={searchPlantilla}
                  onChange={(e) => setSearchPlantilla(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {plantillasFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No se encontraron plantillas</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plantillasFiltradas.map(plantilla => (
                    <div key={plantilla.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{plantilla.nombre}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{plantilla.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {plantilla.numeroPreguntas} pregunta{plantilla.numeroPreguntas !== 1 ? 's' : ''}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(plantilla.fechaCreacion).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => cargarPlantilla(plantilla)}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Usar Plantilla
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingEvaluacion ? 'Editar Evaluación' : 'Nueva Evaluación'}
        </h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-secondary text-gray-800 rounded-lg hover:bg-secondary-dark transition-colors"
        >
          {showPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacitación Asociada *
            </label>
            <select
              name="capacitacionId"
              value={formData.capacitacionId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccione una capacitación</option>
              {capacitaciones && Array.isArray(capacitaciones) && capacitaciones.map(cap => (
                <option key={cap?.id} value={cap?.id}>{cap?.nombre || 'Sin nombre'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Evaluación *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Evaluación: Seguridad en Minería"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Límite
            </label>
            <input
              type="date"
              name="fechaLimite"
              value={formData.fechaLimite}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={editingEvaluacion && editingEvaluacion.estado === 'Activa'}
            >
              <option value="Borrador">Borrador</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
              <option value="Finalizada">Finalizada</option>
            </select>
            {editingEvaluacion && editingEvaluacion.estado === 'Activa' && (
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                ⚠️ Esta evaluación está activa. Solo se pueden editar evaluaciones en estado "Borrador".
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Descripción de la evaluación..."
          />
        </div>

        {/* Preguntas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Preguntas *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowModalPlantillas(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Ver Plantillas Guardadas
              </button>
              <button
                type="button"
                onClick={() => handleAddPregunta('opcion-multiple')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                + Opción Múltiple
              </button>
              <button
                type="button"
                onClick={() => handleAddPregunta('respuesta-corta')}
                className="px-4 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
              >
                + Respuesta Corta
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {formData.preguntas.map((pregunta, idx) => (
              <div key={pregunta.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Pregunta {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePregunta(pregunta.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={pregunta.pregunta}
                    onChange={(e) => handleUpdatePregunta(pregunta.id, 'pregunta', e.target.value)}
                    placeholder="Escriba la pregunta..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {pregunta.tipo === 'opcion-multiple' && (
                  <div className="space-y-2">
                    {pregunta.opciones.map((opcion, opIdx) => (
                      <div key={opcion.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correcta-${pregunta.id}`}
                          checked={opcion.correcta}
                          onChange={() => handleSetCorrecta(pregunta.id, opcion.id)}
                          className="w-4 h-4 text-primary"
                        />
                        <input
                          type="text"
                          value={opcion.texto}
                          onChange={(e) => handleUpdateOpcion(pregunta.id, opcion.id, 'texto', e.target.value)}
                          placeholder={`Opción ${opIdx + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {pregunta.opciones.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOpcion(pregunta.id, opcion.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {pregunta.opciones.length < 5 && (
                      <button
                        type="button"
                        onClick={() => handleAddOpcion(pregunta.id)}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        + Agregar opción
                      </button>
                    )}
                    {!pregunta.opciones.some(op => op.correcta) && (
                      <p className="text-xs text-red-600 mt-1">Seleccione la respuesta correcta</p>
                    )}
                  </div>
                )}

                {pregunta.tipo === 'respuesta-corta' && (
                  <div>
                    <textarea
                      value={pregunta.respuestaCorrecta || ''}
                      onChange={(e) => handleUpdatePregunta(pregunta.id, 'respuestaCorrecta', e.target.value)}
                      placeholder="Respuesta de referencia (opcional, para revisión manual)"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Esta pregunta será revisada manualmente</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {formData.preguntas.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No hay preguntas. Agregue al menos una pregunta.</p>
            </div>
          )}
        </div>

        {/* Guardar como Plantilla */}
        {!editingEvaluacion && formData.preguntas.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={guardarComoPlantilla}
                onChange={(e) => setGuardarComoPlantilla(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Guardar como Plantilla</span>
                <p className="text-xs text-gray-500 mt-1">
                  Las preguntas de esta evaluación se guardarán para reutilizarlas en futuras evaluaciones
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Vista Previa */}
        {showPreview && formData.preguntas.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa de la Evaluación</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{formData.nombre || 'Nombre de la evaluación'}</h4>
                {formData.descripcion && (
                  <p className="text-sm text-gray-600">{formData.descripcion}</p>
                )}
                {capacitacionSeleccionada && (
                  <p className="text-xs text-gray-500 mt-2">
                    Capacitación: {capacitacionSeleccionada.nombre}
                  </p>
                )}
              </div>
              {formData.preguntas.map((pregunta, idx) => (
                <div key={pregunta.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="font-medium text-gray-800 mb-3">
                    {idx + 1}. {pregunta.pregunta || 'Pregunta sin texto'}
                  </p>
                  {pregunta.tipo === 'opcion-multiple' && (
                    <div className="space-y-2">
                      {pregunta.opciones.map((opcion) => (
                        <label key={opcion.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`preview-${pregunta.id}`}
                            disabled
                            className="w-4 h-4"
                          />
                          <span className={opcion.correcta ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                            {opcion.texto || 'Opción sin texto'}
                            {opcion.correcta && ' ✓'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {pregunta.tipo === 'respuesta-corta' && (
                    <textarea
                      disabled
                      placeholder="El trabajador escribirá su respuesta aquí..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {editingEvaluacion ? 'Actualizar Evaluación' : 'Crear Evaluación'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
    </>
  );
};

export default EvaluacionForm;

