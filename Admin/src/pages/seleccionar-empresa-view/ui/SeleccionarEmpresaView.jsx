import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplatesByCategory } from '@shared/api/mock/documentoTemplates';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import FormField from '@shared/ui/molecules/FormField';
import Select from '@shared/ui/atoms/Select';
import Input from '@shared/ui/atoms/Input';
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SeleccionarEmpresaView = ({ companies, employees, profesionales, mockDocuments }) => {
  const navigate = useNavigate();
  const [tipoActividad, setTipoActividad] = useState('');
  const [empresaBusqueda, setEmpresaBusqueda] = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empleadoBusqueda, setEmpleadoBusqueda] = useState('');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [profesionalBusqueda, setProfesionalBusqueda] = useState('');
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('');

  const actividadesDisponibles = [
    'Minería',
    'Agricultura',
    'Avicultura',
    'Pesca',
    'Manufactura',
    'Construcción',
    'Transporte',
    'Salud',
    'Alimentación',
    'Otros',
  ];

  // Filtrar empresas según actividad y búsqueda
  const empresasFiltradas = useMemo(() => {
    if (!empresaBusqueda) return [];
    let empresasFiltradas = companies;
    
    // Filtrar por actividad si está seleccionada (excepto para Ficha Médica)
    if (tipoActividad && tipoDocumento !== 'FICHA MÉDICA') {
      empresasFiltradas = empresasFiltradas.filter(empresa =>
        empresa.tipoActividad === tipoActividad
      );
    }
    
    // Filtrar por búsqueda
    return empresasFiltradas.filter(empresa =>
      empresa.name.toLowerCase().includes(empresaBusqueda.toLowerCase())
    ).slice(0, 5);
  }, [empresaBusqueda, tipoActividad, tipoDocumento, companies]);

  // Filtrar empleados según empresa y búsqueda
  const empleadosFiltrados = useMemo(() => {
    if (!empresaSeleccionada) return [];
    if (!empleadoBusqueda.trim()) return [];
    return employees.filter(empleado => {
      // Manejar diferentes formatos de nombres
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

  // Filtrar profesionales según búsqueda
  const profesionalesFiltrados = useMemo(() => {
    // Solo mostrar resultados si hay texto de búsqueda
    if (!profesionalBusqueda.trim()) {
      return [];
    }
    return (profesionales || []).filter(prof => {
      const nombres = `${prof.nombres || ''} ${prof.apellidos || ''}`.toLowerCase();
      const codigo = (prof.codigo || '').toLowerCase();
      const especialidad = (prof.especialidad || '').toLowerCase();
      const tipoProfesional = (prof.tipoProfesional || '').toLowerCase();
      const busqueda = profesionalBusqueda.toLowerCase().trim();
      return nombres.includes(busqueda) || 
             codigo.includes(busqueda) ||
             especialidad.includes(busqueda) ||
             tipoProfesional.includes(busqueda);
    }).slice(0, 5);
  }, [profesionalBusqueda, profesionales]);

  const handleSeleccionarProfesional = (profesional) => {
    setProfesionalSeleccionado(profesional);
    setProfesionalBusqueda(`${profesional.nombres} ${profesional.apellidos}`);
  };

  // Obtener plantillas disponibles para el tipo de documento seleccionado, filtradas por actividad
  const plantillasDisponibles = useMemo(() => {
    if (!tipoDocumento) return [];
    return getTemplatesByCategory(tipoDocumento, tipoActividad);
  }, [tipoDocumento, tipoActividad]);

  const handleSeleccionarPlantilla = (plantilla) => {
    // Validar si requiere empleado
    if (plantilla.requiereEmpleado && !empleadoSeleccionado) {
      alert('Este tipo de documento requiere seleccionar un empleado');
      return;
    }
    
    // Validar si requiere profesional médico (para FICHA MÉDICA)
    if (tipoDocumento === 'FICHA MÉDICA' && !profesionalSeleccionado) {
      alert('Este tipo de documento requiere seleccionar un profesional médico');
      return;
    }
    
    navigate('/formularios/crear', {
      state: {
        empresa: empresaSeleccionada,
        empleado: empleadoSeleccionado,
        profesional: profesionalSeleccionado,
        tipo: tipoDocumento,
        tipoActividad: tipoActividad,
        plantilla: plantilla
      }
    });
  };

  const handleNuevoDocumento = () => {
    navigate('/formularios/crear', {
      state: {
        empresa: empresaSeleccionada,
        empleado: empleadoSeleccionado,
        tipo: tipoDocumento,
        tipoActividad: tipoActividad
      }
    });
  };

  // Determinar si el empleado es requerido según las plantillas disponibles
  const requiereEmpleado = useMemo(() => {
    if (!tipoDocumento || plantillasDisponibles.length === 0) return false;
    // Si todas las plantillas requieren empleado, entonces es obligatorio
    return plantillasDisponibles.every(p => p.requiereEmpleado);
  }, [tipoDocumento, plantillasDisponibles]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-10 h-10 p-0 rounded-lg bg-gray-200 hover:bg-gray-300"
          title="Volver al dashboard"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Formularios y Registros</h1>
          <p className="text-gray-600 mt-1">Seleccione empresa, empleado y tipo de documento para gestionar sus registros</p>
        </div>
      </div>

      {/* Tarjeta de selección */}
      <Card className="p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tipo de Actividad - PRIMERO */}
          <FormField label="Tipo de Actividad *">
            <Select
              value={tipoActividad}
              onChange={(e) => {
                setTipoActividad(e.target.value);
                // Limpiar selecciones cuando cambia la actividad
                setTipoDocumento('');
                setEmpresaSeleccionada(null);
                setEmpresaBusqueda('');
                setEmpleadoSeleccionado(null);
                setEmpleadoBusqueda('');
                setProfesionalSeleccionado(null);
                setProfesionalBusqueda('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccione una actividad</option>
              {actividadesDisponibles.map(actividad => (
                <option key={actividad} value={actividad}>{actividad}</option>
              ))}
            </Select>
          </FormField>

          {/* Tipo de Documento - SEGUNDO */}
          <FormField label={`Tipo de Documento ${tipoActividad ? '*' : ''}`}>
            <Select
              value={tipoDocumento}
              onChange={(e) => {
                setTipoDocumento(e.target.value);
                // Limpiar selecciones cuando cambia el tipo
                setEmpresaSeleccionada(null);
                setEmpresaBusqueda('');
                setEmpleadoSeleccionado(null);
                setEmpleadoBusqueda('');
                setProfesionalSeleccionado(null);
                setProfesionalBusqueda('');
              }}
              disabled={!tipoActividad}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                !tipoActividad ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">{tipoActividad ? 'Seleccione un tipo' : 'Primero seleccione actividad'}</option>
              <option value="INDUCCIÓN">INDUCCIÓN</option>
              <option value="FICHA MÉDICA">FICHA MÉDICA</option>
              <option value="INSPECCIONES">INSPECCIONES</option>
              <option value="OTROS">OTROS</option>
            </Select>
          </FormField>

          {/* Buscador de Empresa - TERCERO */}
          <FormField label={`Empresa ${tipoDocumento ? '*' : ''}`}>
            <div className="relative">
              <Input
                type="text"
                value={empresaBusqueda}
                onChange={(e) => {
                  setEmpresaBusqueda(e.target.value);
                  setEmpresaSeleccionada(null);
                  // Limpiar empleado cuando cambia empresa
                  setEmpleadoSeleccionado(null);
                  setEmpleadoBusqueda('');
                }}
                placeholder={!tipoDocumento ? "Primero seleccione tipo de documento" : "Buscar empresa..."}
                disabled={!tipoDocumento}
                className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  !tipoDocumento ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
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
                    <p className="text-sm text-gray-600">{empresaSeleccionada.address}</p>
                    <p className="text-sm text-gray-600">{empresaSeleccionada.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Tipo: {empresaSeleccionada.type}</p>
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

          {/* Buscador de Empleado - CUARTO */}
          <FormField label={`Empleado ${tipoDocumento && plantillasDisponibles.some(p => p.requiereEmpleado) ? '*' : ''}`}>
            <div className="relative">
              <Input
                type="text"
                value={empleadoBusqueda}
                onChange={(e) => {
                  setEmpleadoBusqueda(e.target.value);
                  setEmpleadoSeleccionado(null);
                }}
                placeholder={!tipoDocumento ? "Primero seleccione tipo de documento" : !empresaSeleccionada ? "Primero seleccione una empresa" : "Buscar empleado..."}
                disabled={!tipoDocumento || !empresaSeleccionada}
                className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  !tipoDocumento || !empresaSeleccionada ? 'bg-gray-100 cursor-not-allowed' : ''
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
                    <p className="text-sm text-gray-600">{empleadoSeleccionado.email}</p>
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

          {/* Buscador de Profesional Médico - Solo para FICHA MÉDICA */}
          {tipoDocumento === 'FICHA MÉDICA' && (
            <div className="md:col-span-3">
              <FormField label="Profesional Médico *">
                <div className="relative">
                  <Input
                  type="text"
                  value={profesionalBusqueda}
                  onChange={(e) => {
                    setProfesionalBusqueda(e.target.value);
                    setProfesionalSeleccionado(null);
                  }}
                  placeholder="Buscar profesional médico por nombre, código o especialidad..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                {profesionalBusqueda.trim() && profesionalesFiltrados.length > 0 && !profesionalSeleccionado && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {profesionalesFiltrados.map((profesional) => (
                      <button
                        key={profesional.id}
                        type="button"
                        onClick={() => handleSeleccionarProfesional(profesional)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <UserIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{profesional.nombres} {profesional.apellidos}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {profesional.codigo} {profesional.tipoProfesional && `- ${profesional.tipoProfesional}`}
                            {profesional.especialidad && ` • ${profesional.especialidad}`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Card de profesional seleccionado */}
              {profesionalSeleccionado && (
                <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {profesionalSeleccionado.nombres} {profesionalSeleccionado.apellidos}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Código: {profesionalSeleccionado.codigo}</p>
                      <p className="text-sm text-gray-600">Tipo: {profesionalSeleccionado.tipoProfesional}</p>
                      {profesionalSeleccionado.especialidad && (
                        <p className="text-sm text-gray-600">Especialidad: {profesionalSeleccionado.especialidad}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setProfesionalSeleccionado(null);
                        setProfesionalBusqueda('');
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              </FormField>
            </div>
          )}

        </div>
      </Card>

      {/* Lista de plantillas disponibles para el tipo seleccionado */}
      {tipoDocumento && plantillasDisponibles.length > 0 && (
        <Card className="overflow-hidden p-0 shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-surface to-secondary-light/70">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <DocumentIcon className="w-6 h-6 text-primary" />
              Plantillas de {tipoDocumento}
              <span className="ml-2 px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">
                {plantillasDisponibles.length}
              </span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Seleccione una plantilla para crear un nuevo documento
              {empresaSeleccionada && ` • Empresa: ${empresaSeleccionada.name}`}
              {empleadoSeleccionado && ` • Empleado: ${empleadoSeleccionado.firstName || empleadoSeleccionado.names} ${empleadoSeleccionado.lastName || empleadoSeleccionado.lastNames}`}
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plantillasDisponibles.map((plantilla) => {
                const puedeCrear = !plantilla.requiereEmpleado || empleadoSeleccionado;
                
                return (
                  <div
                    key={plantilla.id}
                    className={`border-2 rounded-xl p-6 transition-all duration-300 bg-white group ${
                      puedeCrear
                        ? 'border-gray-200 hover:border-primary hover:shadow-xl cursor-pointer'
                        : 'border-gray-100 opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => puedeCrear && handleSeleccionarPlantilla(plantilla)}
                  >
                    {/* Icono y Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{plantilla.icono}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg mb-1">
                            {plantilla.nombre}
                          </h3>
                          <span className="px-2 py-1 bg-secondary-light text-secondary-dark rounded-full text-xs font-semibold">
                            {plantilla.categoria}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {plantilla.descripcion}
                    </p>

                    {/* Requisitos */}
                    <div className="space-y-2 mb-4">
                      {plantilla.requiereEmpleado && (
                        <div className={`flex items-center gap-2 text-xs ${
                          empleadoSeleccionado ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          <UserIcon className="w-4 h-4" />
                          <span>
                            {empleadoSeleccionado ? 'Empleado seleccionado ✓' : 'Requiere seleccionar empleado'}
                          </span>
                        </div>
                      )}
                      {!plantilla.requiereEmpleado && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>No requiere empleado específico</span>
                        </div>
                      )}
                    </div>

                    {/* Footer con botón */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">ID: {plantilla.id}</span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (puedeCrear) handleSeleccionarPlantilla(plantilla);
                        }}
                        disabled={!puedeCrear}
                        variant="primary"
                        className={`flex items-center gap-2 text-sm font-semibold ${
                          puedeCrear ? 'shadow-md hover:shadow-lg group-hover:scale-105' : 'opacity-50'
                        }`}
                      >
                        <PlusIcon className="w-4 h-4" />
                        Crear
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Mensaje cuando no hay plantillas disponibles */}
      {tipoDocumento && plantillasDisponibles.length === 0 && (
        <Card className="p-12 text-center shadow-md">
          <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            No hay plantillas disponibles para "{tipoDocumento}"
            {tipoActividad && ` en la actividad "${tipoActividad}"`}
          </p>
          <p className="text-gray-500 text-sm">
            {tipoActividad 
              ? `No se encontraron plantillas de ${tipoDocumento} específicas para la actividad "${tipoActividad}". Intente seleccionar otra actividad o contacte al administrador.`
              : 'Por favor, contacte al administrador para agregar plantillas de este tipo.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default SeleccionarEmpresaView;

