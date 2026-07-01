import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDocuments } from '@shared/api/mock/mockDocuments';
import SubirDocumentoFirmado from '@pages/subir-documento-firmado/ui/SubirDocumentoFirmado';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Badge from '@shared/ui/atoms/Badge';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';

// Iconos simples SVG
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

const Repository = ({ documents, setDocuments, companies, employees }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lista'); // 'lista', 'upload', 'guardados'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [filterEmpresa, setFilterEmpresa] = useState('all');
  const [filterTipo, setFilterTipo] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Combinar documentos guardados con mockDocuments
  const todosLosDocumentos = useMemo(() => {
    return [...documents, ...mockDocuments];
  }, [documents]);

  // Filtrar documentos
  const filteredDocuments = useMemo(() => {
    let filtrados = [...todosLosDocumentos];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtrados = filtrados.filter(doc =>
        doc.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.empleado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tecnico?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado (considerar Draft y Borrador como iguales)
    if (filterEstado !== 'all') {
      filtrados = filtrados.filter(doc => {
        const estadoDoc = doc.estado || 'Draft';
        if (filterEstado === 'Draft') {
          return estadoDoc === 'Draft' || estadoDoc === 'Borrador';
        }
        return estadoDoc === filterEstado;
      });
    }

    // Filtrar por empresa
    if (filterEmpresa !== 'all') {
      const empresa = companies.find(c => c.id === parseInt(filterEmpresa));
      if (empresa) {
        filtrados = filtrados.filter(doc => doc.empresa === empresa.name);
      }
    }

    // Filtrar por tipo
    if (filterTipo !== 'all') {
      filtrados = filtrados.filter(doc => doc.tipo === filterTipo);
    }

    return filtrados;
  }, [todosLosDocumentos, searchTerm, filterEstado, filterEmpresa, filterTipo, companies]);

  const getEstadoColor = (estado) => {
    if (estado === 'Publicado') return 'green';
    if (estado === 'Draft' || estado === 'Borrador') return 'yellow';
    return 'gray';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      if (typeof dateString === 'string' && dateString.includes('/')) {
        return dateString;
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const handleSaveDocument = (document) => {
    setDocuments([...documents, document]);
  };

  const handlePublishDocument = (document) => {
    setDocuments([...documents, document]);
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
        empresa: empresaDoc,
        empleado: empleadoDoc,
        tipo: documento.tipo,
        documento: documento
      }
    });
  };

  // Obtener tipos únicos de documentos
  const tiposUnicos = useMemo(() => {
    const tipos = [...new Set(todosLosDocumentos.map(doc => doc.tipo).filter(Boolean))];
    return tipos.sort();
  }, [todosLosDocumentos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Repositorio de Documentos</h1>
        <p className="text-gray-600 mt-1">Consulta, gestiona y sube documentos firmados</p>
      </div>

      {/* Tabs */}
      <Card className="p-1 flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('lista')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            activeTab === 'lista'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <DocumentIcon className="w-5 h-5" />
          Lista de Documentos
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            activeTab === 'upload'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <UploadIcon className="w-5 h-5" />
          Subir Documento Firmado
        </button>
        <button
          onClick={() => setActiveTab('guardados')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            activeTab === 'guardados'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <DocumentIcon className="w-5 h-5" />
          Documentos Guardados ({documents.length})
        </button>
      </Card>

      {/* Contenido según tab activo */}
      {activeTab === 'lista' && (
        <>
          {/* Filtros mejorados */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select
                  value={filterEmpresa}
                  onChange={(e) => setFilterEmpresa(e.target.value)}
                  className="pl-10"
                >
                  <option value="all">Todas las empresas</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </Select>
              </div>
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="pl-10"
                >
                  <option value="all">Todos los tipos</option>
                  {tiposUnicos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </Select>
              </div>
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="pl-10"
                >
                  <option value="all">Todos los estados</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Draft">Borrador</option>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{filteredDocuments.length}</span> de <span className="font-semibold">{todosLosDocumentos.length}</span> documentos
              </p>
            </div>
          </Card>

          {/* Grid de documentos mejorado */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredDocuments.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((documento) => (
                    <Card
                      key={documento.id}
                      className="border-2 border-transparent p-6 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => handleSeleccionarDocumento(documento)}
                    >
                      {/* Header con estado */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg mb-2 line-clamp-2">
                            {documento.nombre || documento.tipo || 'Documento sin título'}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="gray">
                              {documento.tipo || 'Sin tipo'}
                            </Badge>
                            <Badge variant={getEstadoColor(documento.estado)}>
                              {documento.estado || 'Borrador'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Información del documento */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BuildingIcon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="truncate">{documento.empresa || 'Sin empresa'}</span>
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
                          <span>{formatDate(documento.fecha)}</span>
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
              <Card className="p-12 text-center">
                <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">
                  No se encontraron documentos
                </p>
                <p className="text-gray-500 text-sm">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </Card>
            )}
          </div>
        </>
      )}

      {activeTab === 'upload' && (
        <SubirDocumentoFirmado
          companies={companies}
          employees={employees}
          onSave={handleSaveDocument}
          onPublish={handlePublishDocument}
        />
      )}

      {activeTab === 'guardados' && (
        <>
          {/* Filtros para documentos guardados */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar documentos guardados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="pl-10"
                >
                  <option value="all">Todos los estados</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Draft">Borrador</option>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Total de documentos guardados: <span className="font-semibold">{documents.length}</span>
              </p>
            </div>
          </Card>

          {/* Tabla de documentos guardados */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {documents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empresa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Documento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Técnico Responsable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empleado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents
                      .filter(doc => {
                        const matchesSearch = !searchTerm || 
                          doc.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tipo?.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesEstado = filterEstado === 'all' || doc.estado === filterEstado;
                        return matchesSearch && matchesEstado;
                      })
                      .map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{doc.empresa || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doc.tipo || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{doc.tecnico || doc.responsable || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{doc.empleado || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(doc.fecha)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getEstadoColor(doc.estado)}>
                              {doc.estado || 'Draft'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2 items-center">
                              {doc.archivo && (
                                <>
                                  <button
                                    onClick={() => setSelectedDocument(doc)}
                                className="text-primary hover:text-primary-dark transition-colors"
                                    title="Ver documento"
                                  >
                                    <EyeIcon className="w-5 h-5" />
                                  </button>
                                  <a
                                    href={doc.archivo}
                                    download
                                    className="text-green-600 hover:text-green-700 transition-colors"
                                    title="Descargar documento"
                                  >
                                    <DownloadIcon className="w-5 h-5" />
                                  </a>
                                </>
                              )}
                              {(doc.estado === 'Draft' || doc.estado === 'Borrador') && (
                                <>
                                  <button
                                    onClick={() => {
                                      const updatedDoc = { ...doc, estado: 'Publicado' };
                                      setDocuments(documents.map(d => d.id === doc.id ? updatedDoc : d));
                                      alert('Documento publicado exitosamente');
                                    }}
                                    className="text-green-600 hover:text-green-700 transition-colors"
                                    title="Publicar documento"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('¿Está seguro de que desea eliminar este documento?')) {
                                        setDocuments(documents.filter(d => d.id !== doc.id));
                                        alert('Documento eliminado exitosamente');
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700 transition-colors"
                                    title="Eliminar documento"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">
                  No hay documentos guardados
                </p>
                <p className="text-gray-500 text-sm">
                  Sube documentos firmados para que aparezcan aquí
                </p>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Modal de vista previa */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedDocument.tipo || 'Documento'}
              </h2>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Empresa:</strong> {selectedDocument.empresa}
                  </div>
                  <div>
                    <strong>Fecha:</strong> {formatDate(selectedDocument.fecha)}
                  </div>
                  <div>
                    <strong>Técnico Responsable:</strong> {selectedDocument.tecnico || selectedDocument.responsable}
                  </div>
                  <div>
                    <strong>Estado:</strong> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getEstadoColor(selectedDocument.estado)}`}>
                      {selectedDocument.estado}
                    </span>
                  </div>
                  {selectedDocument.empleado && (
                    <div>
                      <strong>Empleado:</strong> {selectedDocument.empleado}
                    </div>
                  )}
                </div>
              </div>
              {selectedDocument.archivo && (
                <iframe
                  src={selectedDocument.archivo}
                  className="w-full h-96 border border-gray-200 rounded"
                  title="Vista previa documento"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repository;
