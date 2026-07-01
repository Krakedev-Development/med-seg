import { useState, useMemo } from 'react';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
// Iconos simples SVG
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const SaveIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SubirDocumentoFirmado = ({ companies, employees, onSave, onPublish, empresaPredefinida, empleadoPredefinido }) => {
  const [empresaBusqueda, setEmpresaBusqueda] = useState(empresaPredefinida?.name || '');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(empresaPredefinida || null);
  const [empleadoBusqueda, setEmpleadoBusqueda] = useState('');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(empleadoPredefinido || null);
  
  const [formData, setFormData] = useState({
    responsable: '',
    tipo: 'Inspección de Áreas',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'Draft',
    archivo: null,
    archivoPreviewUrl: null
  });

  // Filtrar empresas según búsqueda
  const empresasFiltradas = useMemo(() => {
    if (!empresaBusqueda) return [];
    return companies.filter(empresa =>
      empresa.name.toLowerCase().includes(empresaBusqueda.toLowerCase())
    ).slice(0, 5);
  }, [empresaBusqueda, companies]);

  // Filtrar empleados según empresa y búsqueda
  const empleadosFiltrados = useMemo(() => {
    if (!empresaSeleccionada) return [];
    if (!empleadoBusqueda.trim()) return [];
    return employees.filter(empleado => {
      const firstName = empleado.firstName || empleado.names || '';
      const lastName = empleado.lastName || empleado.lastNames || '';
      const nombreCompleto = `${firstName} ${lastName}`.toLowerCase();
      const busqueda = empleadoBusqueda.toLowerCase().trim();
      return empleado.companyId === empresaSeleccionada.id &&
        (nombreCompleto.includes(busqueda) || 
         empleado.cedula?.includes(busqueda) ||
         empleado.dni?.includes(busqueda) ||
         empleado.position?.toLowerCase().includes(busqueda));
    }).slice(0, 5);
  }, [empleadoBusqueda, empresaSeleccionada, employees]);

  const handleSeleccionarEmpresa = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setEmpresaBusqueda(empresa.name);
    setEmpleadoSeleccionado(null);
    setEmpleadoBusqueda('');
  };

  const handleSeleccionarEmpleado = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    const firstName = empleado.firstName || empleado.names || '';
    const lastName = empleado.lastName || empleado.lastNames || '';
    setEmpleadoBusqueda(`${firstName} ${lastName}`);
  };

  const handleChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({
        ...formData,
        archivo: file,
        archivoPreviewUrl: url
      });
    }
  };

  const handleSave = () => {
    if (!empresaSeleccionada || !formData.responsable || !formData.archivo) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const document = {
      id: Date.now(),
      empresa: empresaSeleccionada.name,
      empresaId: empresaSeleccionada.id.toString(),
      empleado: empleadoSeleccionado ? `${empleadoSeleccionado.firstName || empleadoSeleccionado.names} ${empleadoSeleccionado.lastName || empleadoSeleccionado.lastNames}` : '',
      empleadoId: empleadoSeleccionado?.id || null,
      tecnico: formData.responsable,
      responsable: formData.responsable,
      tipo: formData.tipo,
      fecha: formData.fecha,
      estado: 'Draft',
      archivo: formData.archivoPreviewUrl,
      createdAt: new Date().toISOString()
    };

    if (onSave) {
      onSave(document);
      // Reset form
      setFormData({
        responsable: '',
        tipo: 'Inspección de Áreas',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Draft',
        archivo: null,
        archivoPreviewUrl: null
      });
      setEmpresaSeleccionada(null);
      setEmpresaBusqueda('');
      setEmpleadoSeleccionado(null);
      setEmpleadoBusqueda('');
      const fileInput = document.getElementById('pdf-upload-signed');
      if (fileInput) fileInput.value = '';
      alert('Documento guardado como borrador exitosamente');
    }
  };

  const handlePublish = () => {
    if (!empresaSeleccionada || !formData.responsable || !formData.archivo) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const document = {
      id: Date.now(),
      empresa: empresaSeleccionada.name,
      empresaId: empresaSeleccionada.id.toString(),
      empleado: empleadoSeleccionado ? `${empleadoSeleccionado.firstName || empleadoSeleccionado.names} ${empleadoSeleccionado.lastName || empleadoSeleccionado.lastNames}` : '',
      empleadoId: empleadoSeleccionado?.id || null,
      tecnico: formData.responsable,
      responsable: formData.responsable,
      tipo: formData.tipo,
      fecha: formData.fecha,
      estado: 'Publicado',
      archivo: formData.archivoPreviewUrl,
      createdAt: new Date().toISOString()
    };

    if (onPublish) {
      onPublish(document);
      // Reset form
      setFormData({
        responsable: '',
        tipo: 'Inspección de Áreas',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Draft',
        archivo: null,
        archivoPreviewUrl: null
      });
      setEmpresaSeleccionada(null);
      setEmpresaBusqueda('');
      setEmpleadoSeleccionado(null);
      setEmpleadoBusqueda('');
      const fileInput = document.getElementById('pdf-upload-signed');
      if (fileInput) fileInput.value = '';
      alert('Documento publicado exitosamente');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Subir Documento Firmado</h1>
        <p className="text-gray-600 mt-1">Cargar documentos PDF firmados manualmente</p>
      </div>

      <Card className="p-6 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <UploadIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">Información del Documento</h2>
        </div>

        <div className="space-y-4">
          <FormField label="Subir documento escaneado (PDF) *" required>
            <Input
              id="pdf-upload-signed"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
            />
            {formData.archivoPreviewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Vista previa del PDF:</p>
                <iframe
                  src={formData.archivoPreviewUrl}
                  className="w-full h-96 border border-gray-200 rounded"
                  title="Vista previa PDF"
                />
              </div>
            )}
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buscador de Empresa */}
            <FormField label="Empresa *" required>
              <div className="relative">
                <Input
                  type="text"
                  value={empresaBusqueda}
                  onChange={(e) => {
                    setEmpresaBusqueda(e.target.value);
                    setEmpresaSeleccionada(null);
                  }}
                  placeholder="Buscar empresa..."
                  className="pl-10"
                />
                <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                {empresasFiltradas.length > 0 && !empresaSeleccionada && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {empresasFiltradas.map((empresa) => (
                      <button
                        key={empresa.id}
                        onClick={() => handleSeleccionarEmpresa(empresa)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <BuildingIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{empresa.name}</div>
                          <div className="text-xs text-gray-500 truncate">{empresa.ruc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Card de empresa seleccionada */}
              {empresaSeleccionada && (
                <div className="mt-3 p-4 bg-surface border border-primary-light rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {empresaSeleccionada.logo ? (
                        <img src={empresaSeleccionada.logo} alt="Logo" className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
                          <BuildingIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{empresaSeleccionada.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">RUC: {empresaSeleccionada.ruc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEmpresaSeleccionada(null);
                        setEmpresaBusqueda('');
                        setEmpleadoSeleccionado(null);
                        setEmpleadoBusqueda('');
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </FormField>

            {/* Buscador de Empleado */}
            <FormField label="Empleado (Opcional)">
              <div className="relative">
                <Input
                  type="text"
                  value={empleadoBusqueda}
                  onChange={(e) => {
                    setEmpleadoBusqueda(e.target.value);
                    setEmpleadoSeleccionado(null);
                  }}
                  placeholder={empresaSeleccionada ? "Buscar empleado..." : "Primero seleccione una empresa"}
                  disabled={!empresaSeleccionada}
                  className={`pl-10 ${
                    !empresaSeleccionada ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                {empleadosFiltrados.length > 0 && !empleadoSeleccionado && empresaSeleccionada && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {empleadosFiltrados.map((empleado) => (
                      <button
                        key={empleado.id}
                        onClick={() => handleSeleccionarEmpleado(empleado)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <UserIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {empleado.firstName || empleado.names} {empleado.lastName || empleado.lastNames}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{empleado.position}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Card de empleado seleccionado */}
              {empleadoSeleccionado && (
                <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {empleadoSeleccionado.firstName || empleadoSeleccionado.names} {empleadoSeleccionado.lastName || empleadoSeleccionado.lastNames}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Cargo: {empleadoSeleccionado.position}</p>
                      <p className="text-sm text-gray-600">Cédula: {empleadoSeleccionado.cedula || empleadoSeleccionado.dni}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEmpleadoSeleccionado(null);
                        setEmpleadoBusqueda('');
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </FormField>

            <FormField label="Técnico Responsable / Encargado *" required>
              <Input
                type="text"
                value={formData.responsable}
                onChange={(e) => handleChange('responsable', e.target.value)}
                placeholder="Ej: Ing. Roque Maldonado Ramírez"
                required
              />
            </FormField>

            <FormField label="Tipo de Documento">
              <Select
                value={formData.tipo}
                onChange={(e) => handleChange('tipo', e.target.value)}
              >
                <option value="Inspección de Áreas">Inspección de Áreas</option>
                <option value="Inducción">Inducción</option>
                <option value="Informe Psicosocial">Informe Psicosocial</option>
              </Select>
            </FormField>

            <FormField label="Fecha">
              <Input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
              />
            </FormField>

            <FormField label="Estado">
              <Select
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
              >
                <option value="Draft">Draft (Borrador)</option>
                <option value="Publicado">Publicado</option>
              </Select>
            </FormField>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={!empresaSeleccionada || !formData.responsable || !formData.archivo}
              variant="outline"
              className="flex items-center gap-2 px-6 py-2"
            >
              <SaveIcon className="w-5 h-5" />
              Guardar como Borrador
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!empresaSeleccionada || !formData.responsable || !formData.archivo}
              variant="primary"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              <SendIcon className="w-5 h-5" />
              Publicar Documento
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubirDocumentoFirmado;
