import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Badge from '@shared/ui/atoms/Badge';
import Input from '@shared/ui/atoms/Input';

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ListaDocumentos = ({ mockDocuments, companies, employees }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [busquedaNombre, setBusquedaNombre] = useState('');

  // Obtener filtros de la navegación
  const { empresa, empleado, tipo, tipoActividad } = location.state || {};

  const handleVolver = () => {
    navigate('/documents');
  };

  const handleSeleccionarDocumento = (documento) => {
    // Encontrar la empresa y empleado del documento
    const empresaDoc = companies.find(c => c.name === documento.empresa);
    const empleadoDoc = employees.find(e => {
      const nombreCompleto = `${e.firstName || e.names} ${e.lastName || e.lastNames}`;
      return nombreCompleto === documento.empleado;
    });
    
    navigate('/formularios/crear', {
      state: {
        empresa: empresaDoc || empresa,
        empleado: empleadoDoc || empleado,
        tipo: documento.tipo,
        tipoActividad: documento.tipoActividad || tipoActividad,
        documento: documento
      }
    });
  };

  // Filtrar documentos según criterios
  const documentosFiltrados = useMemo(() => {
    let filtrados = [...mockDocuments];

    // Filtrar por tipo de actividad (excepto para FICHA MÉDICA que aplica a todas)
    if (tipoActividad && tipo !== 'FICHA MÉDICA') {
      filtrados = filtrados.filter(doc => doc.tipoActividad === tipoActividad);
    }

    // Filtrar por empresa
    if (empresa) {
      filtrados = filtrados.filter(doc => doc.empresa === empresa.name);
    }

    // Filtrar por empleado
    if (empleado) {
      filtrados = filtrados.filter(doc => 
        doc.empleado === `${empleado.firstName} ${empleado.lastName}`
      );
    }

    // Filtrar por tipo
    if (tipo) {
      filtrados = filtrados.filter(doc => doc.tipo === tipo);
    }

    // Filtrar por nombre del documento
    if (busquedaNombre) {
      filtrados = filtrados.filter(doc =>
        doc.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
      );
    }

    return filtrados;
  }, [empresa, empleado, tipo, busquedaNombre, mockDocuments]);

  const handleNuevoDocumento = () => {
    navigate('/formularios/crear', {
      state: {
        empresa,
        empleado,
        tipo
      }
    });
  };

  const getEstadoColor = (estado) => {
    return estado === 'Publicado' ? 'green' : 'yellow';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={handleVolver}
          variant="outline"
          className="flex items-center justify-center w-10 h-10 p-0"
          title="Volver"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Documentos</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-600">
              {empresa && `Empresa: ${empresa.name}`}
              {empleado && ` • Empleado: ${empleado.firstName} ${empleado.lastName}`}
              {tipo && ` • Tipo: ${tipo}`}
            </p>
            <Badge variant="primary">
              {documentosFiltrados.length} documento{documentosFiltrados.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
        <Button
          onClick={handleNuevoDocumento}
          variant="primary"
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Documento
        </Button>
      </div>

      {/* Buscador de nombre */}
      <Card className="p-4 shadow-md">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <Input
            type="text"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            placeholder="Buscar por nombre del documento..."
            className="pl-10"
          />
        </div>
      </Card>

      {/* Grid de documentos - Vista mejorada */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {documentosFiltrados.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentosFiltrados.map((documento) => (
                <Card
                  key={documento.id}
                  className="border-2 border-transparent p-6 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleSeleccionarDocumento(documento)}
                >
                  {/* Header con estado */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg mb-2 line-clamp-2">
                        {documento.nombre}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="gray">
                          {documento.tipo}
                        </Badge>
                        <Badge variant={getEstadoColor(documento.estado)}>
                          {documento.estado}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Información del documento */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BuildingIcon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{documento.empresa}</span>
                    </div>
                    {documento.empleado && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <UserIcon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="truncate">{documento.empleado}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{documento.fecha}</span>
                    </div>
                  </div>

                  {/* Footer con botón de acción */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">ID: #{documento.id}</span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeleccionarDocumento(documento);
                      }}
                      variant="primary"
                      className="flex items-center gap-2 px-4 py-2 text-sm shadow-md hover:shadow-lg group-hover:scale-105"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver/Editar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center shadow-md">
            <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              No se encontraron documentos
            </p>
            <p className="text-gray-500 text-sm">
              {tipo && `con el tipo "${tipo}"`}
              {empresa && ` para la empresa ${empresa.name}`}
              {empleado && ` y el empleado "${empleado.firstName} ${empleado.lastName}"`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ListaDocumentos;

