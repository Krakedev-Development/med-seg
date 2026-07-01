import { useState, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { getDocumentosByEmpresaYDiscriminador, crearDocumentoDinamico } from '../data/documentosDinamicosData';
import { medDocsTemplates as templatesMedicos } from '../data/medDocsTemplates';
import FichaMedicaEvaluacionRetiro from '../components/documentos/fichaMedica/FichaMedicaEvaluacionRetiro';

const HeartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const categoriasMedicas = [
  { name: 'Todas', icon: '📁' },
  { name: 'Fichas Médicas', icon: '🩺' },
  { name: 'Certificados Médicos', icon: '📜' },
  { name: 'Capacitaciones', icon: '📖' },
  { name: 'Informe Trimestral', icon: '📊' },
  { name: 'Procedimiento', icon: '📋' },
  { name: 'Promoción de la Salud', icon: '💚' },
  { name: 'Seguimiento Médico', icon: '🏥' }
];

const tipoIconosMedicos = {
  'ficha-medica': '🩺',
  'certificado': '📜',
  'capacitacion': '📖',
  'informe-trimestral': '📊',
  'procedimiento': '📋',
  'promocion-salud': '💚',
  'seguimiento-medico': '🏥',
  'custom': '📄'
};

const EmpresaMediDocs = ({ companies = initialCompanies }) => {
  const { empresaId } = useParams();

  const [busquedaTemplate, setBusquedaTemplate] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [datosDocumento, setDatosDocumento] = useState({});
  const previewRef = useRef(null);

  const [showCustomDocForm, setShowCustomDocForm] = useState(false);
  const [editingCustomDoc, setEditingCustomDoc] = useState(null);
  const [customDocForm, setCustomDocForm] = useState({
    titulo: '',
    codigo: '',
    categoria: 'Fichas Médicas',
    archivo: null,
    archivoNombre: ''
  });

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const documentosMedicos = getDocumentosByEmpresaYDiscriminador(parseInt(empresaId), 'medico');

  const [documentosHabilitadosIds, setDocumentosHabilitadosIds] = useState(() => {
    return templatesMedicos.map(t => t.id);
  });

  const handleHabilitarTemplate = (templateId) => {
    setDocumentosHabilitadosIds(prev => [...prev, templateId]);
  };

  const handleDeshabilitarTemplate = (templateId) => {
    setDocumentosHabilitadosIds(prev => prev.filter(id => id !== templateId));
  };

  const templatesFiltrados = useMemo(() => {
    return templatesMedicos.filter(temp => {
      if (busquedaTemplate) {
        const query = busquedaTemplate.toLowerCase();
        const matchesName = temp.nombre.toLowerCase().includes(query);
        const matchesDesc = temp.descripcion.toLowerCase().includes(query);
        const matchesSub = temp.subcategoria.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSub) return false;
      }
      if (filtroCategoria !== 'Todas') {
        if (temp.categoria !== filtroCategoria) return false;
      }
      return true;
    });
  }, [busquedaTemplate, filtroCategoria]);

  const handleRellenarTemplate = (template) => {
    const tipoDoc = template.datos?.tipo || 'archivo';

    if (tipoDoc === 'ficha-medica') {
      const defaultDatos = {
        ...template.datos,
        nombreEmpresa: empresa?.name || 'Empresa',
        institucion: empresa?.name || 'Institución',
        ruc: empresa?.ruc || '',
        ciiu: empresa?.ciiu || '',
        fechaEvaluacion: new Date().toISOString().split('T')[0]
      };

      const virtualDoc = {
        id: `temp-${template.id}-${Date.now()}`,
        tipo: template.datos.tipo,
        titulo: template.nombre,
        categoria: template.categoria,
        rutaArchivo: template.rutaArchivo,
        fecha: new Date().toISOString().split('T')[0],
        datos: defaultDatos
      };
      setDocumentoSeleccionado(virtualDoc);
      setDatosDocumento(virtualDoc.datos);
    } else {
      const virtualDoc = {
        id: `temp-${template.id}-${Date.now()}`,
        tipo: template.datos.tipo,
        titulo: template.nombre,
        categoria: template.categoria,
        rutaArchivo: template.rutaArchivo,
        formato: template.formato,
        nombreArchivo: template.rutaArchivo ? template.rutaArchivo.split('/').pop() : null,
        fecha: new Date().toISOString().split('T')[0],
        datos: template.datos
      };
      setDocumentoSeleccionado(virtualDoc);
      setDatosDocumento({});
    }
  };

  const handleOpenCustomDocForm = () => {
    setEditingCustomDoc(null);
    setCustomDocForm({
      titulo: '',
      codigo: '',
      categoria: 'Fichas Médicas',
      archivo: null,
      archivoNombre: ''
    });
    setShowCustomDocForm(true);
  };

  const handleEditCustomDoc = (doc) => {
    setEditingCustomDoc(doc);
    setCustomDocForm({
      titulo: doc.titulo || '',
      codigo: doc.datos?.codigo || '',
      categoria: doc.datos?.categoria || 'Ficha Médica',
      archivo: null,
      archivoNombre: doc.datos?.archivo || ''
    });
    setShowCustomDocForm(true);
  };

  const handleSaveCustomDoc = () => {
    if (!customDocForm.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (editingCustomDoc) {
      const idx = documentosMedicos.findIndex(d => d.id === editingCustomDoc.id);
      if (idx !== -1) {
        documentosMedicos[idx] = {
          ...documentosMedicos[idx],
          titulo: customDocForm.titulo.trim(),
          datos: {
            ...documentosMedicos[idx].datos,
            codigo: customDocForm.codigo.trim() || documentosMedicos[idx].datos?.codigo,
            categoria: customDocForm.categoria,
            archivo: customDocForm.archivoNombre || documentosMedicos[idx].datos?.archivo
          }
        };
      }
    } else {
      crearDocumentoDinamico(
        'ficha-medica',
        parseInt(empresaId),
        {
          titulo: customDocForm.titulo.trim(),
          codigo: customDocForm.codigo.trim() || `MED-${Date.now()}`,
          categoria: customDocForm.categoria,
          archivo: customDocForm.archivoNombre,
          tipo: 'ficha-medica'
        },
        null,
        'medico'
      );
    }

    setShowCustomDocForm(false);
    setEditingCustomDoc(null);
  };

  const handleFieldChange = useCallback((field, value) => {
    setDatosDocumento(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const renderDocumento = () => {
    if (!documentoSeleccionado) return null;

    const tipo = documentoSeleccionado.datos?.tipo || documentoSeleccionado.tipo;

    if (tipo === 'ficha-medica') {
      return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg" ref={previewRef}>
          <FichaMedicaEvaluacionRetiro
            logoEmpresa={empresa?.logo}
            nombreEmpresa={datosDocumento.nombreEmpresa || empresa?.name || 'Empresa'}
            institucion={datosDocumento.institucion || empresa?.name || 'Institución'}
            ruc={datosDocumento.ruc || empresa?.ruc || ''}
            ciiu={datosDocumento.ciiu || empresa?.ciiu || ''}
            primerApellido={datosDocumento.primerApellido || ''}
            segundoApellido={datosDocumento.segundoApellido || ''}
            nombres={datosDocumento.nombres || ''}
            numeroCedula={datosDocumento.numeroCedula || ''}
            editable={true}
            onFieldChange={handleFieldChange}
          />
        </div>
      );
    }

    if (tipo === 'archivo') {
      const ruta = documentoSeleccionado.rutaArchivo;
      if (!ruta) {
        return (
          <div className="bg-white p-8 border border-gray-200 rounded-lg text-center">
            <span className="text-6xl">📄</span>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">Sin plantilla base</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Este documento no tiene un archivo de plantilla asociado en el repositorio. Complete los campos manualmente o cargue un archivo desde la opción "Crear Documento".
            </p>
          </div>
        );
      }

      const ext = ruta.split('.').pop().toLowerCase();
      const encodedRuta = ruta.split('/').map(part => encodeURIComponent(part)).join('/');

      if (ext === 'pdf') {
        return (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ minHeight: '80vh' }}>
            <iframe
              src={`/medDocs/${encodedRuta}`}
              className="w-full"
              style={{ height: '80vh', border: 'none' }}
              title={documentoSeleccionado.titulo}
            />
          </div>
        );
      }

      return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg text-center">
          <span className="text-6xl">
            {ext === 'docx' ? '📝' : ext === 'pptx' ? '📊' : '📎'}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Archivo de plantilla</h3>
          <p className="mt-2 text-sm text-gray-600 font-medium">{documentoSeleccionado.nombreArchivo || ruta.split('/').pop()}</p>
          <p className="mt-1 text-xs text-gray-400">Formato .{ext.toUpperCase()} — No se puede previsualizar en el navegador</p>
          <a
            href={`/medDocs/${encodedRuta}`}
            download
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar archivo
          </a>
        </div>
      );
    }

    return null;
  };

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Empresa no encontrada</p>
        </div>
      </div>
    );
  }

  if (documentoSeleccionado) {
    const esFichaMedica = documentoSeleccionado.datos?.tipo === 'ficha-medica' || documentoSeleccionado.tipo === 'ficha-medica';

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => {
                  setDocumentoSeleccionado(null);
                  setDatosDocumento({});
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Medi Docs
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{documentoSeleccionado.titulo}</h1>
              <p className="text-gray-600 mt-1">
                {empresa.name} &bull; {documentoSeleccionado.categoria}
                {documentoSeleccionado.nombreArchivo && (
                  <span className="ml-2 text-xs text-gray-400">({documentoSeleccionado.nombreArchivo})</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          {esFichaMedica && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Modo Edición:</strong> Haz clic en cualquier texto para editarlo directamente en el documento.
              </p>
            </div>
          )}
          {renderDocumento()}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setDocumentoSeleccionado(null);
                setDatosDocumento({});
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Cancelar
            </button>
            {!esFichaMedica && documentoSeleccionado.rutaArchivo && (
              <a
                href={`/medDocs/${documentoSeleccionado.rutaArchivo.split('/').map(part => encodeURIComponent(part)).join('/')}`}
                download
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </a>
            )}
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Imprimir
            </button>
            {esFichaMedica && (
              <button
                onClick={() => {
                  crearDocumentoDinamico(
                    'ficha-medica',
                    parseInt(empresaId),
                    {
                      ...datosDocumento,
                      ...documentoSeleccionado.datos,
                      titulo: documentoSeleccionado.titulo
                    },
                    null,
                    'medico'
                  );
                  alert('Documento médico guardado exitosamente');
                  setDocumentoSeleccionado(null);
                  setDatosDocumento({});
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 transition-colors font-semibold"
              >
                Guardar Documento
              </button>
            )}
            {!esFichaMedica && (
              <button
                onClick={() => {
                  crearDocumentoDinamico(
                    'archivo',
                    parseInt(empresaId),
                    {
                      titulo: documentoSeleccionado.titulo,
                      categoria: documentoSeleccionado.categoria,
                      rutaArchivo: documentoSeleccionado.rutaArchivo,
                      tipo: 'archivo'
                    },
                    null,
                    'medico'
                  );
                  alert('Documento registrado exitosamente');
                  setDocumentoSeleccionado(null);
                  setDatosDocumento({});
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 transition-colors font-semibold"
              >
                Registrar Documento
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modal de Documento Médico Personalizado */}
      {showCustomDocForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCustomDoc ? 'Editar Documento Médico' : 'Crear Documento Médico'}
              </h2>
              <button
                onClick={() => { setShowCustomDocForm(false); setEditingCustomDoc(null); }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={customDocForm.titulo}
                  onChange={(e) => setCustomDocForm(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ej: Ficha Médica de Retiro — Operador Minero"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={customDocForm.codigo}
                  onChange={(e) => setCustomDocForm(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Ej: MED-2025-001 (opcional, se auto-genera)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría *</label>
                <select
                  value={customDocForm.categoria}
                  onChange={(e) => setCustomDocForm(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm bg-white"
                >
                  <option value="Fichas Médicas">🩺 Fichas Médicas</option>
                  <option value="Certificados Médicos">📜 Certificados Médicos</option>
                  <option value="Capacitaciones">📖 Capacitaciones</option>
                  <option value="Informe Trimestral">📊 Informe Trimestral</option>
                  <option value="Procedimiento">📋 Procedimiento</option>
                  <option value="Promoción de la Salud">💚 Promoción de la Salud</option>
                  <option value="Seguimiento Médico">🏥 Seguimiento Médico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Archivo adjunto</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {customDocForm.archivoNombre || 'Seleccionar archivo (PDF, Word, Excel, imagen)'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setCustomDocForm(prev => ({ ...prev, archivo: file, archivoNombre: file.name }));
                      }
                    }}
                  />
                </label>
                {customDocForm.archivoNombre && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {customDocForm.archivoNombre}
                    <button
                      onClick={(e) => { e.stopPropagation(); setCustomDocForm(prev => ({ ...prev, archivo: null, archivoNombre: '' })); }}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => { setShowCustomDocForm(false); setEditingCustomDoc(null); }}
                className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCustomDoc}
                className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/95 transition-colors text-sm font-bold"
              >
                {editingCustomDoc ? 'Guardar Cambios' : 'Guardar Documento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header de la sección */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <HeartIcon className="w-8 h-8 text-red-500" />
          Medi Docs
        </h1>
        <p className="text-gray-600 mt-1">
          Formularios y documentos médicos ocupacionales para <strong>{empresa.name}</strong>
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
            {empresa.tipoActividad || 'Actividad no especificada'}
          </span>
        </div>
      </div>

      {/* Catálogo de Documentos Médicos */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                📂 Documentos Médicos Disponibles
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold border border-gray-200 shadow-sm">
                {templatesFiltrados.length} {templatesFiltrados.length === 1 ? 'plantilla' : 'plantillas'}
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar documento médico por nombre o descripción..."
                value={busquedaTemplate}
                onChange={(e) => setBusquedaTemplate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white text-gray-850 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm text-sm"
              />
              {busquedaTemplate && (
                <button
                  onClick={() => setBusquedaTemplate('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center overflow-x-auto gap-2 pb-1">
              {categoriasMedicas.map((cat) => {
                const isSelected = filtroCategoria === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setFiltroCategoria(cat.name)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isSelected
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-150 hover:text-gray-800 border border-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Malla de Plantillas */}
        {templatesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <span className="text-3xl">🩺</span>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No se encontraron documentos médicos</h3>
            <p className="mt-1 text-xs text-gray-500">Prueba cambiando tu búsqueda o categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              onClick={handleOpenCustomDocForm}
              className="flex flex-col justify-center items-center rounded-2xl bg-gray-50 p-5 border-2 border-dashed border-gray-300 hover:border-red-500/50 hover:bg-red-50/30 transition-all duration-300 cursor-pointer opacity-60 hover:opacity-100 min-h-[280px]"
            >
              <div className="w-14 h-14 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center mb-3 transition-colors">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">Crear Documento</p>
              <p className="text-xs text-gray-400 mt-1 text-center">Documento médico personalizado</p>
            </div>
            {templatesFiltrados.map((temp) => {
              const isHabilitado = documentosHabilitadosIds.includes(temp.id);
              return (
                <div
                  key={temp.id}
                  className={`flex flex-col justify-between rounded-2xl bg-white p-5 border-2 transition-all duration-300 ${
                    isHabilitado
                      ? 'border-red-500/30 shadow-sm shadow-red-500/5 hover:shadow-md'
                      : 'border-dashed border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        temp.formato === 'docx'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : temp.formato === 'pptx'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        .{temp.formato}
                      </span>
                      {isHabilitado ? (
                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-150">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Activo
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-55 text-gray-500 text-[10px] font-medium border border-gray-200">
                          Disponible
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-3xl p-2.5 bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-center shrink-0 shadow-sm">
                        {temp.icono}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
                          {temp.nombre}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <span>📂</span> {temp.subcategoria}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed min-h-[48px]">
                      {temp.descripcion}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    {isHabilitado ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDeshabilitarTemplate(temp.id)}
                          className="flex-1 px-3 py-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-650 transition-colors text-xs font-bold border border-gray-200 hover:border-red-200"
                        >
                          Desactivar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRellenarTemplate(temp)}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Rellenar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleHabilitarTemplate(temp.id)}
                        className="w-full px-3 py-2 border-2 border-dashed border-red-500/40 text-red-500 hover:bg-red-50 hover:border-red-500 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar a la Empresa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Documentos médicos creados anteriormente */}
      {documentosMedicos.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Médicos Creados ({documentosMedicos.length})</h2>
          <div className="space-y-2">
            {documentosMedicos.map(doc => (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-red-50/30 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-red-50 rounded-xl border border-red-150 flex items-center justify-center shrink-0 shadow-sm">
                    {tipoIconosMedicos[doc.tipo] || '📄'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{doc.titulo}</p>
                    <p className="text-sm text-gray-500">
                      {doc.tipo} &bull; {doc.fechaCreacion} &bull; {doc.estado}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCustomDoc(doc)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaMediDocs;
