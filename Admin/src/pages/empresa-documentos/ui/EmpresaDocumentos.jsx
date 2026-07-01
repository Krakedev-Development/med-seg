import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { getDocumentosByEmpresa } from '@entities/document/model/documentsMock';
import { getEvidenciasByEmpresa } from '@shared/api/mock/evidenciasData';
import { getDocumentosByAnexo } from '@shared/api/mock/anexo1Data';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';

const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EmpresaDocumentos = ({ companies = initialCompanies }) => {
  const { empresaId } = useParams();
  const [filtroTipo, setFiltroTipo] = useState('all');
  const [busqueda, setBusqueda] = useState('');

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const documentosDinamicos = getDocumentosByEmpresa(parseInt(empresaId));
  const evidencias = getEvidenciasByEmpresa(parseInt(empresaId));

  // Combinar todos los documentos de la empresa
  const todosDocumentos = useMemo(() => {
    const docs = [];
    
    // Documentos dinámicos
    documentosDinamicos.forEach(doc => {
      docs.push({
        ...doc,
        tipo: 'dinamico',
        fecha: doc.fechaCreacion
      });
    });

    // Evidencias
    evidencias.forEach(evidencia => {
      docs.push({
        id: `evidencia-${evidencia.id}`,
        tipo: 'evidencia',
        nombre: evidencia.nombre,
        fecha: evidencia.fechaSubida,
        estado: evidencia.estado,
        archivo: evidencia.archivo,
        itemId: evidencia.itemId
      });
    });

    return docs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [documentosDinamicos, evidencias]);

  const documentosFiltrados = useMemo(() => {
    let filtrados = todosDocumentos;

    if (filtroTipo !== 'all') {
      filtrados = filtrados.filter(doc => doc.tipo === filtroTipo);
    }

    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      filtrados = filtrados.filter(doc =>
        doc.nombre?.toLowerCase().includes(busquedaLower) ||
        doc.titulo?.toLowerCase().includes(busquedaLower)
      );
    }

    return filtrados;
  }, [todosDocumentos, filtroTipo, busqueda]);

  const getTipoLabel = (tipo) => {
    const labels = {
      'dinamico': 'Documento Dinámico',
      'evidencia': 'Evidencia Anexo 1'
    };
    return labels[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const colors = {
      'dinamico': 'bg-blue-100 text-blue-800',
      'evidencia': 'bg-green-100 text-green-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileTextIcon className="w-8 h-8 text-primary" />
          Documentos de {empresa.name}
        </h1>
        <p className="text-gray-600 mt-1">Documentos y evidencias asociados a esta empresa</p>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 shadow-md border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Documentos Dinámicos</p>
          <p className="text-3xl font-bold text-blue-600">
            {documentosDinamicos.length}
          </p>
        </Card>
        <Card className="p-6 shadow-md border-l-4 border-green-500 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Evidencias Anexo 1</p>
          <p className="text-3xl font-bold text-green-600">
            {evidencias.length}
          </p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Buscar">
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </FormField>
          <FormField label="Tipo de Documento">
            <Select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="dinamico">Documentos Dinámicos</option>
              <option value="evidencia">Evidencias Anexo 1</option>
            </Select>
          </FormField>
          <div className="flex items-end h-[68px]">
            <Button
              onClick={() => {
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
            <FileTextIcon className="w-6 h-6 text-primary" />
            Documentos ({documentosFiltrados.length})
          </h2>
        </div>
        <div className="p-6">
          {documentosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
                        <h3 className="font-semibold text-gray-800">{doc.nombre || doc.titulo}</h3>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {doc.fecha ? new Date(doc.fecha).toLocaleDateString('es-ES') : 'Sin fecha'}
                        </span>
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

export default EmpresaDocumentos;









