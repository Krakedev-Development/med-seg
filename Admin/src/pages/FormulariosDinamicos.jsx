import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { getDocumentosByEmpresa, crearDocumentoDinamico, documentosDinamicos } from '../data/documentosDinamicosData';
import InspeccionAreasMulti from '../components/InspeccionAreasMulti';
import InduccionPersonalCocina from '../components/documentos/induccion/InduccionPersonalCocina';

const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FormulariosDinamicos = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const navigate = useNavigate();
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');
  const [busquedaEmpresa, setBusquedaEmpresa] = useState('');

  // Filtrar empresas
  const empresasFiltradas = useMemo(() => {
    if (!busquedaEmpresa.trim()) return companies;
    const busqueda = busquedaEmpresa.toLowerCase();
    return companies.filter(emp => 
      emp.name.toLowerCase().includes(busqueda) ||
      emp.ruc.toLowerCase().includes(busqueda)
    );
  }, [busquedaEmpresa, companies]);

  // Filtrar empleados por búsqueda y empresa
  const empleadosFiltrados = useMemo(() => {
    if (!empresaSeleccionada) return [];
    const trabajadoresEmpresa = employees.filter(e => e.companyId === empresaSeleccionada.id);
    if (!busquedaEmpleado.trim()) return trabajadoresEmpresa.slice(0, 5);
    const busqueda = busquedaEmpleado.toLowerCase();
    return trabajadoresEmpresa.filter(emp => {
      const nombre = (emp.name || emp.names || '').toLowerCase();
      const cedula = (emp.cedula || emp.dni || '').toLowerCase();
      const puesto = (emp.position || '').toLowerCase();
      return nombre.includes(busqueda) || cedula.includes(busqueda) || puesto.includes(busqueda);
    }).slice(0, 5);
  }, [busquedaEmpleado, empresaSeleccionada, employees]);

  // Plantillas disponibles
  const plantillas = [
    {
      id: 'inspeccion-areas',
      nombre: 'Inspección de Áreas',
      descripcion: 'Formato de inspección de áreas con checklist dinámico',
      tipo: 'inspeccion',
      icono: '🔍',
      requiereEmpleado: false
    },
    {
      id: 'induccion-cocina',
      nombre: 'Inducción Personal de Cocina',
      descripcion: 'Formato de inducción para personal de cocina',
      tipo: 'induccion',
      icono: '👨‍🍳',
      requiereEmpleado: true
    }
  ];

  // Todos los documentos dinámicos
  const todosDocumentos = useMemo(() => {
    const docs = [];
    companies.forEach(empresa => {
      const docsEmpresa = getDocumentosByEmpresa(empresa.id).filter(d => d.discriminador !== 'medico');
      docsEmpresa.forEach(doc => {
        docs.push({
          ...doc,
          empresaNombre: empresa.name
        });
      });
    });
    return docs.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
  }, [companies]);

  const handleCrearDocumento = (plantilla) => {
    setTipoSeleccionado(plantilla.tipo);
    setEmpresaSeleccionada(null);
    setEmpleadoSeleccionado(null);
    setBusquedaEmpleado('');
    setBusquedaEmpresa('');
  };

  const handleGuardarDocumento = (datos) => {
    if (!empresaSeleccionada) {
      alert('Por favor seleccione una empresa');
      return;
    }

    const nuevoDocumento = crearDocumentoDinamico(
      tipoSeleccionado,
      empresaSeleccionada.id,
      {
        ...datos,
        titulo: `${plantillas.find(p => p.tipo === tipoSeleccionado)?.nombre} - ${new Date().toLocaleDateString('es-ES')}`
      },
      empleadoSeleccionado?.id || null
    );
    
    // Resetear y volver a la lista
    setTipoSeleccionado(null);
    setEmpresaSeleccionada(null);
    setEmpleadoSeleccionado(null);
    setBusquedaEmpleado('');
    setBusquedaEmpresa('');
  };

  // Si hay un tipo seleccionado, mostrar el formulario
  if (tipoSeleccionado) {
    const plantilla = plantillas.find(p => p.tipo === tipoSeleccionado);
    
    if (!plantilla) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500">Plantilla no encontrada</p>
            <button
              onClick={() => setTipoSeleccionado(null)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => {
                  setTipoSeleccionado(null);
                  setEmpresaSeleccionada(null);
                  setEmpleadoSeleccionado(null);
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Plantillas
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{plantilla?.nombre || 'Formulario'}</h1>
            </div>
          </div>
        </div>

        {/* Selector de empresa */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Empresa (Requerido)
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar empresa por nombre o RUC..."
              value={busquedaEmpresa}
              onChange={(e) => {
                setBusquedaEmpresa(e.target.value);
                setEmpresaSeleccionada(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {busquedaEmpresa && empresasFiltradas.length > 0 && !empresaSeleccionada && (
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg mb-4">
              {empresasFiltradas.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setEmpresaSeleccionada(emp);
                    setBusquedaEmpresa(emp.name);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-sm text-gray-500">RUC: {emp.ruc}</p>
                </button>
              ))}
            </div>
          )}
          {empresaSeleccionada && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">Empresa seleccionada:</p>
              <p className="text-sm text-green-700">{empresaSeleccionada.name} - RUC: {empresaSeleccionada.ruc}</p>
            </div>
          )}
        </div>

        {/* Selector de empleado (si aplica) */}
        {plantilla.requiereEmpleado && empresaSeleccionada && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Empleado (Requerido)
            </label>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o puesto..."
                value={busquedaEmpleado}
                onChange={(e) => {
                  setBusquedaEmpleado(e.target.value);
                  setEmpleadoSeleccionado(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {busquedaEmpleado && empleadosFiltrados.length > 0 && (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                {empleadosFiltrados.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setEmpleadoSeleccionado(emp);
                      setBusquedaEmpleado(`${emp.name || emp.names} ${emp.lastNames || ''}`.trim());
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {emp.name || emp.names} {emp.lastNames || ''}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Cédula: {emp.cedula || emp.dni} • {emp.position}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {empleadoSeleccionado && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Empleado seleccionado:</p>
                <p className="text-sm text-green-700">
                  {empleadoSeleccionado.name || empleadoSeleccionado.names} {empleadoSeleccionado.lastNames || ''} - {empleadoSeleccionado.cedula || empleadoSeleccionado.dni}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Renderizar el componente del formulario */}
        {empresaSeleccionada && (!plantilla.requiereEmpleado || empleadoSeleccionado) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {tipoSeleccionado === 'inspeccion' && (
              <InspeccionAreasMulti
                logoEmpresa={empresaSeleccionada.logo}
                nombreEmpresa={empresaSeleccionada.name}
                fechaInspeccion={new Date().toISOString().split('T')[0]}
                nombreEncargado=""
              />
            )}
            {tipoSeleccionado === 'induccion' && empleadoSeleccionado && (
              <InduccionPersonalCocina
                logoEmpresa={empresaSeleccionada.logo}
                nombreEmpresa={empresaSeleccionada.name}
                nombreTrabajador={`${empleadoSeleccionado.name || empleadoSeleccionado.names || ''} ${empleadoSeleccionado.lastNames || ''}`.trim()}
                numeroCedula={empleadoSeleccionado.cedula || empleadoSeleccionado.dni || ''}
                fecha={new Date().toLocaleDateString('es-ES')}
                puestoTrabajo={empleadoSeleccionado.position || '_________________'}
                actividadesPuesto={empleadoSeleccionado.activities || '________________________________________________________________________________________________________________'}
              />
            )}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setTipoSeleccionado(null);
                  setEmpresaSeleccionada(null);
                  setEmpleadoSeleccionado(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const datos = {
                    tipo: tipoSeleccionado,
                    empresaId: empresaSeleccionada.id,
                    empleadoId: empleadoSeleccionado?.id || null
                  };
                  handleGuardarDocumento(datos);
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Guardar Documento
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileTextIcon className="w-8 h-8 text-primary" />
          Formularios y Registros Dinámicos
        </h1>
        <p className="text-gray-600 mt-1">Crear y gestionar documentos dinámicos del sistema</p>
      </div>

      {/* Plantillas disponibles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Plantillas Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plantillas.map(plantilla => (
            <div
              key={plantilla.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCrearDocumento(plantilla)}
            >
              <div className="text-4xl mb-3">{plantilla.icono}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{plantilla.nombre}</h3>
              <p className="text-sm text-gray-600 mb-4">{plantilla.descripcion}</p>
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                Crear Nuevo
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Documentos creados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Creados ({todosDocumentos.length})</h2>
        {todosDocumentos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay documentos creados aún</p>
        ) : (
          <div className="space-y-2">
            {todosDocumentos.map(doc => (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800">{doc.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {doc.tipo} • {doc.empresaNombre} • {doc.fechaCreacion} • {doc.estado}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/formularios/${doc.id}`)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    Ver/Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulariosDinamicos;









