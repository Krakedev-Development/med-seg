import { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import { 
  getEvidenciasByItem, 
  getEvidenciasEmpresaByItem, 
  getEvidenciasTrabajadoresByItem,
  addEvidencia,
  evidencias 
} from '@shared/api/mock/evidenciasData';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import FormField from '@shared/ui/molecules/FormField';

const GestionEvidenciasItem = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId, itemId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anexoId = searchParams.get('anexo');
  const fileInputRef = useRef(null);
  const fileInputTrabajadorRef = useRef(null);

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const trabajadoresEmpresa = employees.filter(e => e.companyId === parseInt(empresaId));
  
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

  // Estados para evidencias de empresa
  const [formEmpresa, setFormEmpresa] = useState({
    nombre: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: '',
  });
  const [archivosEmpresa, setArchivosEmpresa] = useState([]);

  // Estados para evidencias de trabajadores
  const [busquedaTrabajador, setBusquedaTrabajador] = useState('');
  const [trabajadorSubiendoArchivo, setTrabajadorSubiendoArchivo] = useState(null);
  const [archivosPorTrabajador, setArchivosPorTrabajador] = useState({});
  const [mostrarDocumentosTrabajador, setMostrarDocumentosTrabajador] = useState(null);
  const [acordeonA, setAcordeonA] = useState(true);
  const [acordeonB, setAcordeonB] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);
  
  const anexoIdNum = anexoId ? parseInt(anexoId) : null;
  const evidenciasEmpresa = useMemo(() => getEvidenciasEmpresaByItem(itemId, anexoIdNum), [itemId, anexoIdNum, refreshKey]);
  const evidenciasTrabajadores = useMemo(() => getEvidenciasTrabajadoresByItem(itemId, anexoIdNum), [itemId, anexoIdNum, refreshKey]);

  const trabajadoresFiltrados = useMemo(() => {
    if (!busquedaTrabajador.trim()) return trabajadoresEmpresa;
    const busqueda = busquedaTrabajador.toLowerCase();
    return trabajadoresEmpresa.filter(t =>
      (t.name || t.names || '').toLowerCase().includes(busqueda) ||
      (t.lastName || t.lastNames || '').toLowerCase().includes(busqueda) ||
      (t.cedula || t.dni || '').includes(busqueda) ||
      (t.position || '').toLowerCase().includes(busqueda)
    );
  }, [busquedaTrabajador, trabajadoresEmpresa]);

  const handleFileChangeEmpresa = (e) => {
    const files = Array.from(e.target.files);
    setArchivosEmpresa(prev => [...prev, ...files]);
  };

  const handleFileChangeTrabajador = (trabajadorId, e) => {
    const files = Array.from(e.target.files);
    setArchivosPorTrabajador(prev => ({
      ...prev,
      [trabajadorId]: [...(prev[trabajadorId] || []), ...files]
    }));
  };

  const handleSubirEvidenciasEmpresa = () => {
    if (archivosEmpresa.length === 0) {
      alert('Debe seleccionar al menos un archivo');
      return;
    }

    archivosEmpresa.forEach(archivo => {
      addEvidencia({
        empresaId: parseInt(empresaId),
        anexo1Id: anexoIdNum,
        itemId: itemId,
        nombre: formEmpresa.nombre || archivo.name,
        archivo: URL.createObjectURL(archivo),
        tipo: archivo.type.startsWith('image/') ? 'imagen' : 'documento',
        tipoEvidencia: 'general',
        trabajador: null,
        area: null,
        estado: 'Pendiente',
        subidoPor: 'admin',
        descripcion: formEmpresa.descripcion,
        categoria: formEmpresa.categoria,
        fecha: formEmpresa.fecha,
        tamaño: archivo.size,
      });
    });

    alert('Evidencias de empresa subidas exitosamente');
    setFormEmpresa({ nombre: '', descripcion: '', fecha: new Date().toISOString().split('T')[0], categoria: '' });
    setArchivosEmpresa([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setRefreshKey(prev => prev + 1);
  };

  const handleSubirEvidenciasTrabajador = (trabajadorId) => {
    const archivos = archivosPorTrabajador[trabajadorId] || [];
    if (archivos.length === 0) {
      alert('Debe seleccionar al menos un archivo');
      return;
    }

    archivos.forEach(archivo => {
      addEvidencia({
        empresaId: parseInt(empresaId),
        anexo1Id: anexoIdNum,
        itemId: itemId,
        nombre: archivo.name,
        archivo: URL.createObjectURL(archivo),
        tipo: archivo.type.startsWith('image/') ? 'imagen' : 'documento',
        tipoEvidencia: 'trabajador',
        trabajador: trabajadorId,
        area: null,
        estado: 'Pendiente',
        subidoPor: 'admin',
        tamaño: archivo.size,
      });
    });

    alert('Evidencias subidas exitosamente');
    setArchivosPorTrabajador(prev => {
      const nuevo = { ...prev };
      delete nuevo[trabajadorId];
      return nuevo;
    });
    setTrabajadorSubiendoArchivo(null);
    // Limpiar el input de archivo
    const input = document.getElementById(`file-input-${trabajadorId}`);
    if (input) input.value = '';
    setRefreshKey(prev => prev + 1);
  };

  const handleEliminarEvidencia = (evidenciaId) => {
    if (window.confirm('¿Está seguro de eliminar esta evidencia?')) {
      const index = evidencias.findIndex(e => e.id === evidenciaId);
      if (index !== -1) {
        evidencias.splice(index, 1);
        setRefreshKey(prev => prev + 1);
      }
    }
  };

  const handleEliminarArchivoEmpresa = (index) => {
    setArchivosEmpresa(prev => prev.filter((_, i) => i !== index));
  };

  const handleEliminarArchivoTrabajador = (trabajadorId, index) => {
    setArchivosPorTrabajador(prev => ({
      ...prev,
      [trabajadorId]: (prev[trabajadorId] || []).filter((_, i) => i !== index)
    }));
  };

  if (!empresa || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md">
          <p className="text-gray-500">Empresa o ítem no encontrado</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <Card className="p-6 shadow-md">
        <Button
          variant="ghost"
          onClick={() => navigate(`/anexo1/empresa/${empresaId}/checklist${anexoId ? `?anexo=${anexoId}` : ''}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors px-0 py-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Checklist
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Evidencias para Ítem #{item.numero} del Anexo 1
        </h1>
        <p className="text-gray-600 mt-1">
          {item.texto} • {empresa.name}
        </p>
      </Card>

      {/* Sección A: Evidencias de Empresa */}
      {/* Sección A: Evidencias de Empresa */}
      <Card className="overflow-hidden p-0 shadow-md">
        <button
          onClick={() => setAcordeonA(!acordeonA)}
          className="w-full px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-100/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg 
                className={`w-5 h-5 text-blue-600 transition-transform ${acordeonA ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">A</span>
                Evidencias de Empresa (Generales)
              </h2>
            </div>
          </div>
        </button>
        {acordeonA && (
          <div className="p-6">
            <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del documento *">
              <Input
                type="text"
                value={formEmpresa.nombre}
                onChange={(e) => setFormEmpresa({ ...formEmpresa, nombre: e.target.value })}
                placeholder="Ej: Reglamento de Higiene y Seguridad"
              />
            </FormField>
            <FormField label="Fecha *">
              <Input
                type="date"
                value={formEmpresa.fecha}
                onChange={(e) => setFormEmpresa({ ...formEmpresa, fecha: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Descripción">
            <textarea
              value={formEmpresa.descripcion}
              onChange={(e) => setFormEmpresa({ ...formEmpresa, descripcion: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Descripción del documento..."
            />
          </FormField>

          <FormField label="Categoría (opcional)">
            <Input
              type="text"
              value={formEmpresa.categoria}
              onChange={(e) => setFormEmpresa({ ...formEmpresa, categoria: e.target.value })}
              placeholder="Ej: Documento Legal, Certificado, Informe"
            />
          </FormField>

          <FormField label="Subir archivo(s) *">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChangeEmpresa}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            {archivosEmpresa.length > 0 && (
              <div className="mt-2 space-y-2">
                {archivosEmpresa.map((archivo, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{archivo.name}</span>
                    <button
                      onClick={() => handleEliminarArchivoEmpresa(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormField>

          <Button
            onClick={handleSubirEvidenciasEmpresa}
            variant="primary"
            className="px-6 py-2"
          >
            Subir Evidencias
          </Button>
        </div>

        {/* Lista de evidencias de empresa */}
        {evidenciasEmpresa.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Evidencias subidas ({evidenciasEmpresa.length})
            </h3>
            <div className="space-y-2">
              {evidenciasEmpresa.map((evidencia) => (
                <div key={evidencia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{evidencia.nombre}</p>
                    <p className="text-sm text-gray-600">{evidencia.fechaSubida}</p>
                  </div>
                  <a
                    href={evidencia.archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark"
                  >
                    Ver
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ✓ Evidencia Empresa: ✔
              </span>
            </div>
          </div>
        )}
          </div>
        )}
      </Card>

      {/* Sección B: Evidencias por Trabajadores */}
      {/* Sección B: Evidencias por Trabajadores */}
      <Card className="overflow-hidden p-0 shadow-md">
        <button
          onClick={() => setAcordeonB(!acordeonB)}
          className="w-full px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-100/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg 
                className={`w-5 h-5 text-green-600 transition-transform ${acordeonB ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">B</span>
                Evidencias por Trabajadores
              </h2>
            </div>
          </div>
        </button>
        {acordeonB && (
          <div className="p-6">
            {/* Buscador de trabajadores */}
        <div className="mb-6">
          <FormField label="Buscar trabajador">
            <Input
              type="text"
              value={busquedaTrabajador}
              onChange={(e) => setBusquedaTrabajador(e.target.value)}
              placeholder="Buscar por nombre, cédula o cargo..."
            />
          </FormField>
        </div>

        {/* Tabla de trabajadores con acciones */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gradient-to-r from-primary to-primary-dark text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Trabajador</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Cédula</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Cargo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Documentos</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trabajadoresFiltrados.map((trabajador) => {
                const evidenciasTrabajador = evidenciasTrabajadores.filter(e => e.trabajador === trabajador.id);
                const tieneEvidencias = evidenciasTrabajador.length > 0;
                const archivosPendientes = archivosPorTrabajador[trabajador.id] || [];
                
                return (
                  <tr key={trabajador.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {trabajador.name || trabajador.names} {trabajador.lastName || trabajador.lastNames}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {trabajador.cedula || trabajador.dni}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {trabajador.position || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tieneEvidencias ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Subido ({evidenciasTrabajador.length})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Sin documentos
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700 font-medium">
                        {evidenciasTrabajador.length} documento(s)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Botón Subir Documento */}
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              handleFileChangeTrabajador(trabajador.id, e);
                              setTrabajadorSubiendoArchivo(trabajador.id);
                            }}
                            className="hidden"
                            id={`file-input-${trabajador.id}`}
                          />
                          <label
                            htmlFor={`file-input-${trabajador.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-xs font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Subir
                          </label>
                        </div>
                        
                        {/* Botón Ver Documentos */}
                        {tieneEvidencias && (
                          <button
                            onClick={() => setMostrarDocumentosTrabajador(
                              mostrarDocumentosTrabajador === trabajador.id ? null : trabajador.id
                            )}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver ({evidenciasTrabajador.length})
                          </button>
                        )}
                      </div>
                      
                      {/* Mostrar archivos pendientes y botón de subir */}
                      {trabajadorSubiendoArchivo === trabajador.id && archivosPendientes.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-medium text-gray-700 mb-2">Archivos seleccionados:</p>
                          <div className="space-y-1 mb-3">
                            {archivosPendientes.map((archivo, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white rounded text-xs">
                                <span className="text-gray-700 truncate flex-1">{archivo.name}</span>
                                <button
                                  onClick={() => handleEliminarArchivoTrabajador(trabajador.id, index)}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSubirEvidenciasTrabajador(trabajador.id)}
                              variant="primary"
                              className="flex-1 text-xs px-3 py-1.5"
                            >
                              Confirmar Subida
                            </Button>
                            <Button
                              onClick={() => {
                                setArchivosPorTrabajador(prev => {
                                  const nuevo = { ...prev };
                                  delete nuevo[trabajador.id];
                                  return nuevo;
                                });
                                setTrabajadorSubiendoArchivo(null);
                                // Limpiar el input de archivo
                                const input = document.getElementById(`file-input-${trabajador.id}`);
                                if (input) input.value = '';
                              }}
                              variant="outline"
                              className="text-xs px-3 py-1.5"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Mostrar documentos del trabajador */}
                      {mostrarDocumentosTrabajador === trabajador.id && evidenciasTrabajador.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Documentos subidos:</p>
                          <div className="space-y-2">
                            {evidenciasTrabajador.map((evidencia) => (
                              <div key={evidencia.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-800">{evidencia.nombre}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                      evidencia.estado === 'Aprobado' ? 'bg-green-100 text-green-700' :
                                      evidencia.estado === 'Rechazado' ? 'bg-red-100 text-red-700' :
                                      'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {evidencia.estado}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {evidencia.fechaSubida}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={evidencia.archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Ver documento"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </a>
                                  <button
                                    onClick={() => handleEliminarEvidencia(evidencia.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar documento"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={() => setMostrarDocumentosTrabajador(null)}
                            variant="outline"
                            className="mt-2 w-full text-xs px-3 py-1.5"
                          >
                            Cerrar
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {trabajadoresFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No se encontraron trabajadores</p>
          </div>
        )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default GestionEvidenciasItem;

