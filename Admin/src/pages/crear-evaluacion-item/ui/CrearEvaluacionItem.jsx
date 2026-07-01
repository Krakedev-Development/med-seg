import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { capacitaciones } from '@shared/api/mock/capacitacionesData';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import { crearEvaluacionDesdeItem } from '@shared/api/mock/evaluacionesData';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import Button from '@shared/ui/atoms/Button';
import Card, { CardContent } from '@shared/ui/organisms/Card';

const CrearEvaluacionItem = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId, itemId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anexoId = searchParams.get('anexo');

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const trabajadoresEmpresa = employees.filter(e => e.companyId === parseInt(empresaId));
  const capacitacionesEmpresa = capacitaciones.filter(c =>
    (c.empresaId && c.empresaId === parseInt(empresaId)) ||
    (c.empresasAsignadas && c.empresasAsignadas.includes(parseInt(empresaId)))
  );
  
  // Obtener el ítem del Anexo 1
  const item = useMemo(() => {
    for (const seccion of SECCIONES_SST) {
      if (seccion.tipo === 'checklist' && seccion.items) {
        const found = seccion.items.find(i => i.id === itemId);
        if (found) return { ...found, seccion: seccion.titulo };
      }
    }
    return null;
  }, [itemId]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaLimite: new Date().toISOString().split('T')[0],
    capacitacionId: '',
    trabajadores: [],
  });

  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    tipo: 'opcion-multiple',
    pregunta: '',
    opciones: [{ id: 1, texto: '', correcta: false }],
    respuestaCorrecta: '',
  });

  const [busquedaTrabajador, setBusquedaTrabajador] = useState('');

  const trabajadoresFiltrados = useMemo(() => {
    if (!busquedaTrabajador.trim()) return trabajadoresEmpresa;
    const busqueda = busquedaTrabajador.toLowerCase();
    return trabajadoresEmpresa.filter(t =>
      (t.name || t.names || '').toLowerCase().includes(busqueda) ||
      (t.lastName || t.lastNames || '').toLowerCase().includes(busqueda) ||
      (t.cedula || t.dni || '').includes(busqueda)
    );
  }, [busquedaTrabajador, trabajadoresEmpresa]);

  const handleAgregarPregunta = () => {
    if (!nuevaPregunta.pregunta.trim()) {
      alert('Debe ingresar el texto de la pregunta');
      return;
    }

    if (nuevaPregunta.tipo === 'opcion-multiple' && nuevaPregunta.opciones.length < 2) {
      alert('Debe agregar al menos 2 opciones');
      return;
    }

    const pregunta = {
      id: preguntas.length + 1,
      tipo: nuevaPregunta.tipo,
      pregunta: nuevaPregunta.pregunta,
      opciones: nuevaPregunta.tipo === 'opcion-multiple' ? nuevaPregunta.opciones : [],
      respuestaCorrecta: nuevaPregunta.tipo === 'respuesta-corta' ? nuevaPregunta.respuestaCorrecta : null,
    };

    setPreguntas([...preguntas, pregunta]);
    setNuevaPregunta({
      tipo: 'opcion-multiple',
      pregunta: '',
      opciones: [{ id: 1, texto: '', correcta: false }],
      respuestaCorrecta: '',
    });
  };

  const handleAgregarOpcion = () => {
    setNuevaPregunta({
      ...nuevaPregunta,
      opciones: [...nuevaPregunta.opciones, { id: nuevaPregunta.opciones.length + 1, texto: '', correcta: false }]
    });
  };

  const handleToggleTrabajador = (trabajadorId) => {
    setFormData(prev => ({
      ...prev,
      trabajadores: prev.trabajadores.includes(trabajadorId)
        ? prev.trabajadores.filter(id => id !== trabajadorId)
        : [...prev.trabajadores, trabajadorId]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      trabajadores: trabajadoresFiltrados.map(t => t.id)
    }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({
      ...prev,
      trabajadores: []
    }));
  };

  const handleEnviar = () => {
    if (!formData.nombre.trim()) {
      alert('Debe ingresar un nombre para la evaluación');
      return;
    }

    if (preguntas.length === 0) {
      alert('Debe agregar al menos una pregunta');
      return;
    }

    if (formData.trabajadores.length === 0) {
      alert('Debe seleccionar al menos un trabajador');
      return;
    }

    const anexoIdNum = anexoId ? parseInt(anexoId) : null;
    crearEvaluacionDesdeItem(
      itemId,
      anexoIdNum,
      parseInt(empresaId),
      {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fechaLimite: formData.fechaLimite || null,
        capacitacionId: formData.capacitacionId ? parseInt(formData.capacitacionId) : null,
        preguntas: preguntas,
        trabajadores: formData.trabajadores,
      }
    );

    alert('Evaluación creada y enviada exitosamente');
    navigate(`/anexo1/empresa/${empresaId}/evaluaciones`);
  };

  if (!empresa || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <p className="text-gray-500">Empresa o ítem no encontrado</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <button
          onClick={() => navigate(`/anexo1/empresa/${empresaId}/evaluaciones`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Evaluaciones
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Crear Evaluación para Ítem #{item.numero} del Anexo 1
        </h1>
        <p className="text-gray-600 mt-1">
          {item.texto} • {empresa.name}
        </p>
      </Card>

      {/* Información básica */}
      <Card>
        <CardContent>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Información de la Evaluación</h2>
        <div className="space-y-4">
          <FormField label="Nombre de la Evaluación" required>
            <Input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Evaluación de Conocimientos en Seguridad"
            />
          </FormField>
          <FormField label="Descripción">
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Descripción de la evaluación..."
            />
          </FormField>
          <FormField label="Fecha Límite (opcional)">
            <Input
              type="date"
              value={formData.fechaLimite}
              onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
            />
          </FormField>
          <FormField label="Capacitación asociada" required>
            <Select
              value={formData.capacitacionId}
              onChange={(e) => setFormData({ ...formData, capacitacionId: e.target.value })}
            >
              <option value="">Seleccione una capacitación</option>
              {[...capacitacionesEmpresa]
                .sort((a, b) => new Date(b.fechaProgramada) - new Date(a.fechaProgramada))
                .map(cap => (
                  <option key={cap.id} value={cap.id}>
                    {cap.nombre} — {new Date(cap.fechaProgramada).toLocaleDateString('es-ES')}
                  </option>
                ))}
            </Select>
            {capacitacionesEmpresa.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No hay capacitaciones creadas para esta empresa. Cree una primero.
              </p>
            )}
          </FormField>
        </div>
        </CardContent>
      </Card>

      {/* Crear preguntas */}
      {/* Crear preguntas */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Preguntas ({preguntas.length})</h2>
        
        {/* Formulario para nueva pregunta */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pregunta
              </label>
              <select
                value={nuevaPregunta.tipo}
                onChange={(e) => {
                  const tipo = e.target.value;
                  setNuevaPregunta({
                    ...nuevaPregunta,
                    tipo,
                    opciones: tipo === 'opcion-multiple' ? [{ id: 1, texto: '', correcta: false }] : [],
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="opcion-multiple">Opción Múltiple</option>
                <option value="verdadero-falso">Verdadero/Falso</option>
                <option value="respuesta-corta">Respuesta Abierta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta *
              </label>
              <textarea
                value={nuevaPregunta.pregunta}
                onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, pregunta: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Escriba la pregunta..."
              />
            </div>

            {nuevaPregunta.tipo === 'opcion-multiple' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opciones
                </label>
                {nuevaPregunta.opciones.map((opcion, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={opcion.texto}
                      onChange={(e) => {
                        const nuevasOpciones = [...nuevaPregunta.opciones];
                        nuevasOpciones[index].texto = e.target.value;
                        setNuevaPregunta({ ...nuevaPregunta, opciones: nuevasOpciones });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={`Opción ${index + 1}`}
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={opcion.correcta}
                        onChange={(e) => {
                          const nuevasOpciones = [...nuevaPregunta.opciones];
                          nuevasOpciones[index].correcta = e.target.checked;
                          setNuevaPregunta({ ...nuevaPregunta, opciones: nuevasOpciones });
                        }}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Correcta</span>
                    </label>
                  </div>
                ))}
                <button
                  onClick={handleAgregarOpcion}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  + Agregar opción
                </button>
              </div>
            )}

            {nuevaPregunta.tipo === 'verdadero-falso' && (
              <div className="text-sm text-gray-600">
                Esta pregunta se mostrará como Verdadero/Falso automáticamente
              </div>
            )}

            {nuevaPregunta.tipo === 'respuesta-corta' && (
              <div className="text-sm text-gray-600">
                Esta pregunta permitirá una respuesta abierta del trabajador
              </div>
            )}

            <Button
              onClick={handleAgregarPregunta}
              variant="primary"
            >
              Agregar Pregunta
            </Button>
          </div>
        </div>

        {/* Lista de preguntas agregadas */}
        {preguntas.length > 0 && (
          <div className="space-y-3">
            {preguntas.map((pregunta, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">
                  {index + 1}. {pregunta.pregunta}
                </p>
                <p className="text-sm text-gray-600">Tipo: {pregunta.tipo}</p>
                {pregunta.opciones.length > 0 && (
                  <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
                    {pregunta.opciones.map((opcion, idx) => (
                      <li key={idx} className={opcion.correcta ? 'text-green-600 font-semibold' : ''}>
                        {opcion.texto} {opcion.correcta && '(Correcta)'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Selección de trabajadores */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Seleccionar Trabajadores</h2>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Buscar trabajador
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Seleccionar todos
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Deseleccionar todos
            </button>
          </div>
        </div>
        <Input
          type="text"
          value={busquedaTrabajador}
          onChange={(e) => setBusquedaTrabajador(e.target.value)}
          placeholder="Buscar trabajador..."
          className="mb-3"
        />
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {trabajadoresFiltrados.map((trabajador) => (
            <div
              key={trabajador.id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                formData.trabajadores.includes(trabajador.id) ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleToggleTrabajador(trabajador.id)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.trabajadores.includes(trabajador.id)}
                  onChange={() => handleToggleTrabajador(trabajador.id)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {trabajador.name || trabajador.names} {trabajador.lastName || trabajador.lastNames}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cédula: {trabajador.cedula || trabajador.dni} • Cargo: {trabajador.position || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {formData.trabajadores.length} trabajador(es) seleccionado(s)
        </p>
      </Card>

      {/* Botones */}
      <div className="flex gap-3">
        <Button onClick={handleEnviar} variant="primary">
          Enviar Evaluación
        </Button>
        <Button
          onClick={() => navigate(`/anexo1/empresa/${empresaId}/checklist${anexoId ? `?anexo=${anexoId}` : ''}`)}
          variant="outline"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default CrearEvaluacionItem;


