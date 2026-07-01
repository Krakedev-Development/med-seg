import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { initialProfesionales } from '@shared/api/mock/profesionalesData';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import { crearCapacitacionDesdeItem } from '@shared/api/mock/capacitacionesData';
import { filtrarPlantillasPorActividad } from '@shared/api/mock/plantillasCapacitacion';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import Button from '@shared/ui/atoms/Button';
import Card, { CardContent } from '@shared/ui/organisms/Card';

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
      </Card>

      <Card>
        <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Título" required>
              <Input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Capacitación en Seguridad y Salud en el Trabajo"
              />
            </FormField>
            <FormField label="Capacitador(es)">
              <Input
                type="text"
                value={formData.capacitadores}
                onChange={(e) => setFormData({ ...formData, capacitadores: e.target.value })}
                placeholder="Ej: Dr. Carlos Ramírez, Ing. María López"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Fecha" required>
              <Input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              />
            </FormField>
            <FormField label="Hora">
              <Input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Modalidad" required>
              <Select
                value={formData.modalidad}
                onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="mixta">Mixta</option>
              </Select>
            </FormField>
            <FormField label="Responsable (Profesional)">
              <Select
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
              >
                <option value="">Seleccione un profesional</option>
                {profesionales.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nombre} {prof.apellido} - {prof.especialidad}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Plantilla de documento" required>
              <Select
                value={formData.plantillaId}
                onChange={(e) => setFormData({ ...formData, plantillaId: e.target.value })}
              >
                <option value="">Seleccione una plantilla</option>
                {plantillasDisponibles.map(pl => (
                  <option key={pl.id} value={pl.id}>
                    {pl.icono} {pl.nombre}
                  </option>
                ))}
              </Select>
            </FormField>
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
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} variant="primary">
              Programar Capacitación
            </Button>
            <Button onClick={handleNotificar} className="bg-green-600 text-white hover:bg-green-700 border-green-600">
              Notificar por Correo
            </Button>
            <Button
              onClick={() => navigate(`/anexo1/empresa/${empresaId}/checklist${anexoId ? `?anexo=${anexoId}` : ''}`)}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearCapacitacionItem;


