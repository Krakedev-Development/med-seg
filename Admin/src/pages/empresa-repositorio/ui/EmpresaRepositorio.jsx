import { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { evidencias, getEvidenciasByEmpresa, publicarEvidencia, eliminarEvidencia } from '@shared/api/mock/evidenciasData';
import { getDocumentosByEmpresa, publicarDocumentoDinamico, eliminarDocumentoDinamico } from '@entities/document/model/documentsMock';
import { getDocumentsInSituByEmpresa, publicarDocumentoInSitu, eliminarDocumentoInSitu } from '@shared/api/mock/anexo1Data';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Badge from '@shared/ui/atoms/Badge';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';

const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const EmpresaRepositorio = ({ companies = initialCompanies }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const evidenciasEmpresa = getEvidenciasByEmpresa(parseInt(empresaId));
  const documentosDinamicos = getDocumentosByEmpresa(parseInt(empresaId));
  const documentosInSitu = getDocumentsInSituByEmpresa(parseInt(empresaId));
  const trabajadores = initialEmployees.filter(e => e.companyId === parseInt(empresaId));

  const [busqueda, setBusqueda] = useState('');
  const [filtroItem, setFiltroItem] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({});

  // Combinar todos los documentos
  const todosLosDocumentos = useMemo(() => {
    const docs = [];
    
    // Evidencias
    evidenciasEmpresa.forEach(ev => {
      docs.push({
        ...ev,
        tipoDocumento: 'evidencia',
        origen: ev.tipoEvidencia === 'general' ? 'general' : 'trabajador',
        trabajadorId: ev.trabajador || null,
      });
    });

    // Documentos dinámicos
    documentosDinamicos.forEach(doc => {
      docs.push({
        ...doc,
        tipoDocumento: 'dinamico',
        origen: doc.empleadoId ? 'trabajador' : 'general',
        trabajadorId: doc.empleadoId || null,
        itemId: doc.vinculadoAItem || doc.itemId || null,
        nombre: doc.titulo || doc.nombre,
        estado: doc.estado || 'Borrador',
        disponibleParaUsuario: doc.disponibleParaUsuario || false,
      });
    });

    // Documentos in situ
    documentosInSitu.forEach(doc => {
      docs.push({
        ...doc,
        tipoDocumento: 'insitu',
        origen: 'general',
        trabajadorId: null,
        itemId: doc.itemId || null,
        estado: doc.estado || 'Borrador',
        disponibleParaUsuario: doc.disponibleParaUsuario || false,
      });
    });

    return docs;
  }, [evidenciasEmpresa, documentosDinamicos, documentosInSitu, refreshKey]);

  // Agrupar documentos por ítem
  const documentosPorItem = useMemo(() => {
    const agrupados = {};
    
    todosLosDocumentos.forEach(doc => {
      const itemId = doc.itemId || 'sin-item';
      if (!agrupados[itemId]) {
        agrupados[itemId] = [];
      }
      agrupados[itemId].push(doc);
    });

    return agrupados;
  }, [todosLosDocumentos]);

  // Obtener información del ítem
  const getItemInfo = (itemId) => {
    if (itemId === 'sin-item') return { numero: 'N/A', texto: 'Sin ítem asociado', seccion: 'General' };
    
    for (const seccion of SECCIONES_SST) {
      if (seccion.tipo === 'checklist' && seccion.items) {
        const item = seccion.items.find(i => i.id === itemId);
        if (item) {
          return { ...item, seccion: seccion.titulo };
        }
      }
    }
    return { numero: 'N/A', texto: 'Ítem no encontrado', seccion: 'General' };
  };

  // Obtener nombre del trabajador
  const getNombreTrabajador = (trabajadorId) => {
    if (!trabajadorId) return null;
    const trabajador = trabajadores.find(t => t.id === trabajadorId);
    return trabajador ? `${trabajador.names} ${trabajador.lastNames}` : null;
  };

  // Filtrar documentos
  const documentosFiltrados = useMemo(() => {
    let filtrados = Object.entries(documentosPorItem);

    if (filtroItem !== 'all') {
      filtrados = filtrados.filter(([itemId]) => itemId === filtroItem);
    }

    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      filtrados = filtrados.map(([itemId, docs]) => [
        itemId,
        docs.filter(doc => 
          doc.nombre?.toLowerCase().includes(busquedaLower) ||
          doc.titulo?.toLowerCase().includes(busquedaLower) ||
          getItemInfo(itemId).texto.toLowerCase().includes(busquedaLower)
        )
      ]).filter(([, docs]) => docs.length > 0);
    }

    return filtrados;
  }, [documentosPorItem, filtroItem, busqueda]);

  // Abrir automáticamente acordeones cuando hay documentos nuevos
  useEffect(() => {
    if (!documentosFiltrados || !Array.isArray(documentosFiltrados)) return;
    
    const itemIds = documentosFiltrados.map(([itemId]) => itemId).filter(Boolean);
    if (itemIds.length === 0) return;
    
    setAcordeonesAbiertos(prev => {
      const nuevosAcordeones = {};
      let hayCambios = false;
      
      itemIds.forEach(itemId => {
        if (!(itemId in prev)) {
          nuevosAcordeones[itemId] = true; // Abrir por defecto
          hayCambios = true;
        }
      });
      
      return hayCambios ? { ...prev, ...nuevosAcordeones } : prev;
    });
  }, [documentosFiltrados.length]);

  // Obtener todos los ítems para el filtro
  const itemsDisponibles = useMemo(() => {
    const items = [{ id: 'sin-item', texto: 'Sin ítem asociado' }];
    SECCIONES_SST.forEach(seccion => {
      if (seccion.tipo === 'checklist' && seccion.items) {
        seccion.items.forEach(item => {
          if (documentosPorItem[item.id] && documentosPorItem[item.id].length > 0) {
            items.push({
              id: item.id,
              texto: `#${item.numero} - ${item.texto.substring(0, 50)}...`
            });
          }
        });
      }
    });
    return items;
  }, [documentosPorItem]);

  const handlePublicar = (docId, tipoDocumento) => {
    if (window.confirm('¿Publicar este documento? Estará disponible para los usuarios.')) {
      if (tipoDocumento === 'evidencia') {
        publicarEvidencia(docId);
      } else if (tipoDocumento === 'dinamico') {
        publicarDocumentoDinamico(docId);
      } else if (tipoDocumento === 'insitu') {
        publicarDocumentoInSitu(docId);
      }
      setRefreshKey(prev => prev + 1);
      alert('Documento publicado exitosamente');
    }
  };

  const handleEliminar = (docId, itemId, tipoDocumento) => {
    if (window.confirm('¿Está seguro de eliminar este documento? Esta acción no se puede deshacer.')) {
      let eliminado = false;
      if (tipoDocumento === 'evidencia') {
        eliminado = eliminarEvidencia(docId);
      } else if (tipoDocumento === 'dinamico') {
        eliminado = eliminarDocumentoDinamico(docId);
      } else if (tipoDocumento === 'insitu') {
        eliminado = eliminarDocumentoInSitu(docId);
      }
      
      if (eliminado) {
        // Si el documento estaba asociado a un ítem, también se elimina de ahí
        setRefreshKey(prev => prev + 1);
        alert('Documento eliminado exitosamente');
      } else {
        alert('Error al eliminar el documento');
      }
    }
  };

  const toggleAcordeon = (itemId) => {
    setAcordeonesAbiertos(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handlePublicarTodo = (documentos, itemId) => {
    const documentosBorrador = documentos.filter(doc => doc.estado !== 'Publicado');
    if (documentosBorrador.length === 0) {
      alert('Todos los documentos de este ítem ya están publicados');
      return;
    }
    
    if (window.confirm(`¿Publicar todos los documentos de este ítem? (${documentosBorrador.length} documento${documentosBorrador.length > 1 ? 's' : ''})`)) {
      documentosBorrador.forEach(doc => {
        if (doc.tipoDocumento === 'evidencia') {
          publicarEvidencia(doc.id);
        } else if (doc.tipoDocumento === 'dinamico') {
          publicarDocumentoDinamico(doc.id);
        } else if (doc.tipoDocumento === 'insitu') {
          publicarDocumentoInSitu(doc.id);
        }
      });
      setRefreshKey(prev => prev + 1);
      alert(`${documentosBorrador.length} documento${documentosBorrador.length > 1 ? 's' : ''} publicado${documentosBorrador.length > 1 ? 's' : ''} exitosamente`);
    }
  };

  const totalDocumentos = todosLosDocumentos.length;

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md">
          <p className="text-gray-500">Empresa no encontrada</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(`/anexo1/empresa/${empresaId}/estado`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Estado General
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <UploadIcon className="w-8 h-8 text-primary" />
                Repositorio de Documentos
              </h1>
              <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm text-gray-600 font-medium">Total Documentos:</span>
                <span className="ml-2 text-xl font-bold text-primary">{totalDocumentos}</span>
              </div>
            </div>
            <p className="text-gray-600 mt-1">{empresa.name}</p>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <Select
            value={filtroItem}
            onChange={(e) => setFiltroItem(e.target.value)}
          >
            <option value="all">Todos los ítems</option>
            {itemsDisponibles && Array.isArray(itemsDisponibles) && itemsDisponibles.map(item => (
              <option key={item.id} value={item.id}>{item.texto}</option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Lista de documentos agrupados por ítem */}
      <div className="space-y-4">
        {documentosFiltrados && Array.isArray(documentosFiltrados) && documentosFiltrados.length > 0 ? (
          documentosFiltrados.map(([itemId, documentos]) => {
            if (!itemId || !documentos || !Array.isArray(documentos)) return null;
            
            const itemInfo = getItemInfo(itemId);
            const estaAbierto = acordeonesAbiertos[itemId] || false;
            const documentosBorrador = documentos.filter(doc => doc && doc.estado !== 'Publicado');
            
            return (
              <Card key={itemId} className="overflow-hidden">
                <button
                  onClick={() => toggleAcordeon(itemId)}
                  className="w-full px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <svg 
                        className={`w-5 h-5 text-primary transition-transform ${estaAbierto ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Ítem #{itemInfo.numero} - {itemInfo.seccion}
                          <span className="ml-2 text-sm font-normal text-gray-600">
                            ({documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'})
                          </span>
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">{itemInfo.texto}</p>
                      </div>
                    </div>
                    {documentosBorrador.length > 0 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublicarTodo(documentos, itemId);
                        }}
                        className="ml-4 flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Publicar Todo ({documentosBorrador.length})
                      </Button>
                    )}
                  </div>
                </button>
                {estaAbierto && (
                  <div className="p-6">
                  <div className="space-y-4">
                    {documentos.map((doc) => {
                      const nombreTrabajador = getNombreTrabajador(doc.trabajadorId);
                      const esGeneral = doc.origen === 'general';
                      
                      return (
                        <div
                          key={doc.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="font-semibold text-gray-800">{doc.nombre || doc.titulo}</h3>
                                <Badge variant={
                                  doc.estado === 'Publicado' ? 'green' : 'yellow'
                                }>
                                  {doc.estado || 'Borrador'}
                                </Badge>
                                {doc.disponibleParaUsuario && (
                                  <Badge variant="blue">
                                    Disponible para usuarios
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
                                <div>
                                  <span className="font-medium">Tipo:</span>{' '}
                                  {esGeneral ? (
                                    <span className="text-gray-800">Documento General</span>
                                  ) : (
                                    <span className="text-gray-800">
                                      Documento de Empleado: <span className="font-semibold">{nombreTrabajador || 'N/A'}</span>
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium">Fecha:</span>{' '}
                                  {new Date(doc.fechaSubida || doc.fechaCreacion || doc.fecha).toLocaleDateString('es-ES')}
                                </div>
                                {doc.tamaño && (
                                  <div>
                                    <span className="font-medium">Tamaño:</span> {(doc.tamaño / 1024).toFixed(2)} KB
                                  </div>
                                )}
                              </div>
                              {doc.observaciones && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                  <span className="font-medium">Observaciones:</span> {doc.observaciones}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              {(doc.archivo || doc.url) && (
                                <Button
                                  onClick={() => {
                                    const url = doc.archivo || doc.url;
                                    if (url) {
                                      window.open(url, '_blank');
                                    } else {
                                      alert('No hay archivo disponible para este documento');
                                    }
                                  }}
                                  className="bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                >
                                  Ver
                                </Button>
                              )}
                              {doc.estado !== 'Publicado' && (
                                <Button
                                  onClick={() => handlePublicar(doc.id, doc.tipoDocumento)}
                                  className="bg-green-600 text-white hover:bg-green-700 text-sm"
                                >
                                  Publicar
                                </Button>
                              )}
                              <Button
                                onClick={() => handleEliminar(doc.id, doc.itemId, doc.tipoDocumento)}
                                className="bg-red-600 text-white hover:bg-red-700 text-sm"
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center shadow-md">
            <UploadIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              No hay documentos
            </p>
            <p className="text-gray-500 text-sm">
              Los documentos aparecerán aquí cuando se suban evidencias desde el Anexo 1
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmpresaRepositorio;
