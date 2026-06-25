import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { initialProfesionales } from '../data/profesionalesData';
import { SECCIONES_SST } from '../components/documentos/anexo1/anexo1';
import { crearCapacitacionDesdeItem } from '../data/capacitacionesData';
import { filtrarPlantillasPorActividad } from '../data/plantillasCapacitacion';

const CrearCapacitacionItem = ({ 
  companies = initialCompanies, 
  employees = initialEmployees,
  profesionales = initialProfesionales 
}) => {
  const { empresaId, itemId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anexoId = searchParams.get('anexo');

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const trabajadoresEmpresa = employees.filter(e => e.companyId === parseInt(empresaId));
  const plantillasDisponibles = filtrarPlantillasPorActividad();
  
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
    titulo: '',
    capacitadores: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    modalidad: 'presencial',
    responsable: '',
    trabajadores: [],
    plantillaId: '',
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

  const handleSubmit = () => {
    if (!formData.titulo.trim()) {
      alert('Debe ingresar un título para la capacitación');
      return;
    }

    const anexoIdNum = anexoId ? parseInt(anexoId) : null;
    crearCapacitacionDesdeItem(
      itemId,
      anexoIdNum,
      parseInt(empresaId),
      formData
    );

    alert('Capacitación programada exitosamente');
    navigate(`/anexo1/empresa/${empresaId}/capacitaciones`);
  };

  const handleNotificar = () => {
    alert('Notificación por correo enviada (simulado)');
  };

  if (!empresa || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Empresa o ítem no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => navigate(`/anexo1/empresa/${empresaId}/capacitaciones`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Capacitaciones
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Crear Capacitación para Ítem #{item.numero} del Anexo 1
        </h1>
        <p className="text-gray-600 mt-1">
          {item.texto} • {empresa.name}
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Capacitación en Seguridad y Salud en el Trabajo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacitador(es)
              </label>
              <input
                type="text"
                value={formData.capacitadores}
                onChange={(e) => setFormData({ ...formData, capacitadores: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Dr. Carlos Ramírez, Ing. María López"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modalidad *
              </label>
              <select
                value={formData.modalidad}
                onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable (Profesional)
              </label>
              <select
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Seleccione un profesional</option>
                {profesionales.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nombre} {prof.apellido} - {prof.especialidad}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plantilla de documento *
              </label>
              <select
                value={formData.plantillaId}
                onChange={(e) => setFormData({ ...formData, plantillaId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Seleccione una plantilla</option>
                {plantillasDisponibles.map(pl => (
                  <option key={pl.id} value={pl.id}>
                    {pl.icono} {pl.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selección de trabajadores */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Trabajadores
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
            <input
              type="text"
              value={busquedaTrabajador}
              onChange={(e) => setBusquedaTrabajador(e.target.value)}
              placeholder="Buscar trabajador..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-3"
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
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Programar Capacitación
            </button>
            <button
              onClick={handleNotificar}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Notificar por Correo
            </button>
            <button
              onClick={() => navigate(`/anexo1/empresa/${empresaId}/checklist${anexoId ? `?anexo=${anexoId}` : ''}`)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearCapacitacionItem;

