import { useState, useMemo } from 'react';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { getDocumentosByEmpresa } from '@entities/document/model/documentsMock';
import { evidencias } from '@shared/api/mock/evidenciasData';
import { documentosInSitu } from '@shared/api/mock/anexo1Data';
import { mockDocuments } from '@shared/api/mock/mockDocuments';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';

const FolderOpenIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h12a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
  </svg>
);

const RepositorioGeneral = ({ companies = initialCompanies }) => {
  const [filtroEmpresa, setFiltroEmpresa] = useState('all');
  const [filtroTipo, setFiltroTipo] = useState('all');
  const [filtroFecha, setFiltroFecha] = useState('all');
  const [busqueda, setBusqueda] = useState('');

  // Combinar todos los documentos
  const todosDocumentos = useMemo(() => {
    const docs = [];
    
    // Documentos dinámicos
    companies.forEach(empresa => {
      const docsEmpresa = getDocumentosByEmpresa(empresa.id);
      docsEmpresa.forEach(doc => {
        docs.push({
          ...doc,
          tipo: 'dinamico',
          empresaNombre: empresa.name,
          fecha: doc.fechaCreacion
        });
      });
    });

    // Evidencias del Anexo 1
    evidencias.forEach(evidencia => {
      const empresa = companies.find(c => c.id === evidencia.empresaId);
      docs.push({
        id: `evidencia-${evidencia.id}`,
        tipo: 'evidencia',
        nombre: evidencia.nombre,
        empresaId: evidencia.empresaId,
        empresaNombre: empresa?.name || 'Desconocida',
        fecha: evidencia.fechaSubida,
        estado: evidencia.estado,
        archivo: evidencia.archivo
      });
    });

    // Documentos in situ
    documentosInSitu.forEach(doc => {
      const empresa = companies.find(c => c.id === doc.empresaId);
      docs.push({
        id: `insitu-${doc.id}`,
        tipo: 'insitu',
        nombre: doc.nombre,
        empresaId: doc.empresaId,
        empresaNombre: empresa?.name || 'Desconocida',
        fecha: doc.fechaSubida || doc.fecha,
        estado: doc.estado,
        categoria: doc.categoria
      });
    });

    // Documentos mock (si existen)
    mockDocuments.forEach(doc => {
      const empresa = companies.find(c => c.id === doc.companyId);
      docs.push({
        id: `mock-${doc.id}`,
        tipo: 'mock',
        nombre: doc.nombre || doc.titulo,
        empresaId: doc.companyId,
        empresaNombre: empresa?.name || 'Desconocida',
        fecha: doc.fechaCreacion || doc.fecha,
        categoria: doc.categoria,
        archivo: doc.archivo
      });
    });

    return docs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [companies]);

  const documentosFiltrados = useMemo(() => {
    let filtrados = todosDocumentos;

    if (filtroEmpresa !== 'all') {
      filtrados = filtrados.filter(doc => doc.empresaId === parseInt(filtroEmpresa));
    }

    if (filtroTipo !== 'all') {
      filtrados = filtrados.filter(doc => doc.tipo === filtroTipo);
    }

    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      filtrados = filtrados.filter(doc =>
        doc.nombre?.toLowerCase().includes(busquedaLower) ||
        doc.empresaNombre?.toLowerCase().includes(busquedaLower) ||
        doc.categoria?.toLowerCase().includes(busquedaLower)
      );
    }

    return filtrados;
  }, [todosDocumentos, filtroEmpresa, filtroTipo, busqueda]);

  const getTipoLabel = (tipo) => {
    const labels = {
      'dinamico': 'Documento Dinámico',
      'evidencia': 'Evidencia Anexo 1',
      'insitu': 'Documento In Situ',
      'mock': 'Documento'
    };
    return labels[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const colors = {
      'dinamico': 'bg-blue-100 text-blue-800',
      'evidencia': 'bg-green-100 text-green-800',
      'insitu': 'bg-purple-100 text-purple-800',
      'mock': 'bg-gray-100 text-gray-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpenIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Repositorio General</h1>
              <p className="text-gray-600 mt-1">Gestión centralizada de todos los documentos del sistema</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-md border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Documentos</p>
          <p className="text-3xl font-bold text-blue-600">{todosDocumentos.length}</p>
        </Card>
        <Card className="p-6 shadow-md border-l-4 border-green-500 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Documentos Dinámicos</p>
          <p className="text-3xl font-bold text-green-600">
            {todosDocumentos.filter(d => d.tipo === 'dinamico').length}
          </p>
        </Card>
        <Card className="p-6 shadow-md border-l-4 border-purple-500 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Evidencias Anexo 1</p>
          <p className="text-3xl font-bold text-purple-600">
            {todosDocumentos.filter(d => d.tipo === 'evidencia').length}
          </p>
        </Card>
        <Card className="p-6 shadow-md border-l-4 border-gray-500 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Documentos In Situ</p>
          <p className="text-3xl font-bold text-gray-600">
            {todosDocumentos.filter(d => d.tipo === 'insitu').length}
          </p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Buscar">
            <Input
              type="text"
              placeholder="Buscar por nombre, empresa, categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </FormField>
          <FormField label="Empresa">
            <Select
              value={filtroEmpresa}
              onChange={(e) => setFiltroEmpresa(e.target.value)}
            >
              <option value="all">Todas las empresas</option>
              {companies.map(empresa => (
                <option key={empresa.id} value={empresa.id}>{empresa.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Tipo de Documento">
            <Select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="dinamico">Documentos Dinámicos</option>
              <option value="evidencia">Evidencias Anexo 1</option>
              <option value="insitu">Documentos In Situ</option>
              <option value="mock">Otros Documentos</option>
            </Select>
          </FormField>
          <div className="flex items-end h-[68px]">
            <Button
              onClick={() => {
                setFiltroEmpresa('all');
                setFiltroTipo('all');
                setBusqueda('');
              }}
              variant="outline"
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de documentos */}
      <Card className="shadow-md overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-surface to-secondary-light/70">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FolderOpenIcon className="w-6 h-6 text-primary" />
            Documentos ({documentosFiltrados.length})
          </h2>
        </div>
        <div className="p-6">
          {documentosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay documentos
              </p>
              <p className="text-gray-500 text-sm">
                Los documentos aparecerán aquí cuando se creen desde los módulos correspondientes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentosFiltrados.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">{doc.nombre}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTipoColor(doc.tipo)}`}>
                          {getTipoLabel(doc.tipo)}
                        </span>
                        {doc.estado && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            doc.estado === 'Aprobado' || doc.estado === 'Publicado' ? 'bg-green-100 text-green-800' :
                            doc.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {doc.estado}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {doc.empresaNombre}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {doc.fecha ? new Date(doc.fecha).toLocaleDateString('es-ES') : 'Sin fecha'}
                        </span>
                        {doc.categoria && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {doc.categoria}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {doc.archivo && (
                        <a
                          href={doc.archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                        >
                          Ver
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RepositorioGeneral;









