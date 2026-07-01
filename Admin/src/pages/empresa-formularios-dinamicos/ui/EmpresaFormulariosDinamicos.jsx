import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { getDocumentosByEmpresa, crearDocumentoDinamico } from '@entities/document/model/documentsMock';
import InspeccionAreasMulti from '@shared/ui/InspeccionAreasMulti';
import InduccionPersonalCocina from '@entities/document/ui/templates/induccion/InduccionPersonalCocina';
import FichaMedicaEvaluacionRetiro from '@entities/document/ui/templates/fichaMedica/FichaMedicaEvaluacionRetiro';
import Card, { CardContent } from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';

const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EmpresaFormulariosDinamicos = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const documentosEmpresa = getDocumentosByEmpresa(parseInt(empresaId));
  const trabajadoresEmpresa = employees.filter(e => e.companyId === parseInt(empresaId));

  // Plantillas disponibles
  const plantillas = [
    {
      id: 'inspeccion-areas',
      nombre: 'Inspección de Áreas',
      descripcion: 'Formato de inspección de áreas con checklist dinámico',
      tipo: 'inspeccion',
      icono: '🔍'
    },
    {
      id: 'induccion-cocina',
      nombre: 'Inducción Personal de Cocina',
      descripcion: 'Formato de inducción para personal de cocina',
      tipo: 'induccion',
      icono: '👨‍🍳'
    },
    {
      id: 'ficha-medica',
      nombre: 'Ficha Médica Ocupacional',
      descripcion: 'Ficha médica de evaluación y retiro',
      tipo: 'ficha-medica',
      icono: '🏥'
    }
  ];

  // Filtrar empleados por búsqueda
  const empleadosFiltrados = useMemo(() => {
    if (!busquedaEmpleado.trim()) return trabajadoresEmpresa.slice(0, 5);
    const busqueda = busquedaEmpleado.toLowerCase();
    return trabajadoresEmpresa.filter(emp => {
      const nombre = (emp.name || emp.names || '').toLowerCase();
      const cedula = (emp.cedula || emp.dni || '').toLowerCase();
      const puesto = (emp.position || '').toLowerCase();
      return nombre.includes(busqueda) || cedula.includes(busqueda) || puesto.includes(busqueda);
    }).slice(0, 5);
  }, [busquedaEmpleado, trabajadoresEmpresa]);

  const handleCrearDocumento = (plantilla) => {
    setTipoSeleccionado(plantilla.tipo);
    setEmpleadoSeleccionado(null);
    setBusquedaEmpleado('');
  };

  const handleGuardarDocumento = (datos) => {
    const nuevoDocumento = crearDocumentoDinamico(
      tipoSeleccionado,
      parseInt(empresaId),
      {
        ...datos,
        titulo: `${plantillas.find(p => p.tipo === tipoSeleccionado)?.nombre} - ${new Date().toLocaleDateString('es-ES')}`
      },
      empleadoSeleccionado?.id || null
    );
    
    // Navegar al editor del documento
    navigate(`/empresas/${empresaId}/formularios/${nuevoDocumento.id}`);
  };

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md">
          <p className="text-gray-500">Empresa no encontrada</p>
        </Card>
      </div>
    );
  }

  // Si hay un tipo seleccionado, mostrar el formulario correspondiente
  if (tipoSeleccionado) {
    const plantilla = plantillas.find(p => p.tipo === tipoSeleccionado);
    
    if (!plantilla) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-6 shadow-md">
            <p className="text-gray-500">Plantilla no encontrada</p>
            <Button
              onClick={() => setTipoSeleccionado(null)}
              variant="primary"
              className="mt-4"
            >
              Volver
            </Button>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => setTipoSeleccionado(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Plantillas
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{plantilla?.nombre || 'Formulario'}</h1>
              <p className="text-gray-600 mt-1">{empresa?.name || ''}</p>
            </div>
          </div>
        </Card>

        {/* Selector de empleado (si aplica) */}
        {(tipoSeleccionado === 'induccion' || tipoSeleccionado === 'ficha-medica') && (
          <Card className="p-6 shadow-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Empleado {tipoSeleccionado === 'ficha-medica' ? '(Opcional)' : '(Requerido)'}
            </label>
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Buscar por nombre, cédula o puesto..."
                value={busquedaEmpleado}
                onChange={(e) => setBusquedaEmpleado(e.target.value)}
              />
            </div>
            {busquedaEmpleado && empleadosFiltrados.length > 0 && (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {empleadosFiltrados.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => setEmpleadoSeleccionado(emp)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                      empleadoSeleccionado?.id === emp.id ? 'bg-primary/10 border-l-4 border-primary' : ''
                    }`}
                  >
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-gray-500">Cédula: {emp.cedula} • {emp.position}</p>
                  </button>
                ))}
              </div>
            )}
            {empleadoSeleccionado && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Empleado seleccionado:</p>
                <p className="text-sm text-green-700">{empleadoSeleccionado.name} - {empleadoSeleccionado.cedula}</p>
              </div>
            )}
          </Card>
        )}

        {/* Renderizar el componente del formulario */}
        <Card className="p-6 shadow-md">
          {tipoSeleccionado === 'inspeccion' && (
            <InspeccionAreasMulti
              logoEmpresa={empresa.logo}
              nombreEmpresa={empresa.name}
              fechaInspeccion={new Date().toISOString().split('T')[0]}
              nombreEncargado=""
            />
          )}
          {tipoSeleccionado === 'induccion' && empleadoSeleccionado && (
            <InduccionPersonalCocina
              logoEmpresa={empresa.logo}
              nombreEmpresa={empresa.name}
              nombreTrabajador={`${empleadoSeleccionado.name || empleadoSeleccionado.names || ''} ${empleadoSeleccionado.lastNames || ''}`.trim()}
              numeroCedula={empleadoSeleccionado.cedula || empleadoSeleccionado.dni || ''}
              fecha={new Date().toLocaleDateString('es-ES')}
              puestoTrabajo={empleadoSeleccionado.position || '_________________'}
              actividadesPuesto={empleadoSeleccionado.activities || '________________________________________________________________________________________________________________'}
            />
          )}
          {tipoSeleccionado === 'ficha-medica' && (
            <FichaMedicaEvaluacionRetiro
              logoEmpresa={empresa.logo}
              nombreEmpresa={empresa.name}
              institucion={empresa.name}
              ruc={empresa.ruc || ''}
              ciiu={empresa.ciiu || ''}
              primerApellido={empleadoSeleccionado ? (empleadoSeleccionado.lastNames || empleadoSeleccionado.lastName || '').split(' ')[0] : ''}
              segundoApellido={empleadoSeleccionado ? (empleadoSeleccionado.lastNames || empleadoSeleccionado.lastName || '').split(' ')[1] || '' : ''}
              nombres={empleadoSeleccionado ? (empleadoSeleccionado.name || empleadoSeleccionado.names || '') : ''}
              numeroCedula={empleadoSeleccionado ? (empleadoSeleccionado.cedula || empleadoSeleccionado.dni || '') : ''}
            />
          )}
          <div className="mt-6 flex gap-3 justify-end">
            <Button
              onClick={() => setTipoSeleccionado(null)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                const datos = {
                  tipo: tipoSeleccionado,
                  empresaId: empresa.id,
                  empleadoId: empleadoSeleccionado?.id || null
                };
                handleGuardarDocumento(datos);
              }}
              variant="primary"
            >
              Guardar Documento
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileTextIcon className="w-8 h-8 text-primary" />
          Formularios y Registros Dinámicos
        </h1>
        <p className="text-gray-600 mt-1">{empresa.name}</p>
      </Card>

      {/* Plantillas disponibles */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Plantillas Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plantillas.map(plantilla => (
            <div
              key={plantilla.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => handleCrearDocumento(plantilla)}
            >
              <div className="text-4xl mb-3">{plantilla.icono}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{plantilla.nombre}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{plantilla.descripcion}</p>
              <Button className="w-full mt-auto" variant="primary">
                Crear Nuevo
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Documentos creados */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Creados ({documentosEmpresa.length})</h2>
        {documentosEmpresa.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay documentos creados aún</p>
        ) : (
          <div className="space-y-2">
            {documentosEmpresa.map(doc => (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800">{doc.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {doc.tipo} • {doc.fechaCreacion} • {doc.estado}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/empresas/${empresaId}/formularios/${doc.id}`)}
                    variant="primary"
                    className="px-4 py-2 text-sm"
                  >
                    Ver/Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmpresaFormulariosDinamicos;

