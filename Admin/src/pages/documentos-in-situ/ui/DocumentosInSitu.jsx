import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { documentosInSitu, anexos1 } from '@shared/api/mock/anexo1Data';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import Badge from '@shared/ui/atoms/Badge';

const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DocumentosInSitu = ({ companies = initialCompanies }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const anexosEmpresa = anexos1.filter(a => a.empresaId === parseInt(empresaId));
  const documentosEmpresa = documentosInSitu.filter(doc => doc.empresaId === parseInt(empresaId));

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: '',
    observaciones: '',
    estado: 'Borrador',
    anexo1Id: null
  });
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [archivoPreview, setArchivoPreview] = useState(null);

  const categorias = [
    'Inducción',
    'Inspección cocina',
    'Inspección mina',
    'Inspección áreas',
    'Inspección equipos',
    'Ficha médica',
    'Otros'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const esPDF = file.type === 'application/pdf';
    const esImagen = file.type.startsWith('image/');

    if (!esPDF && !esImagen) {
      alert('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
      return;
    }

    setArchivoSeleccionado(file);

    // Crear preview
    if (esImagen) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setArchivoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setArchivoPreview(null);
    }
  };

  const convertirImagenAPDF = async (file) => {
    // En un entorno real, esto se haría en el backend
    // Por ahora, simulamos que la imagen se convierte a PDF
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Simulamos la conversión creando un objeto URL
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivoSeleccionado) {
      alert('Debe seleccionar un archivo');
      return;
    }

    let archivoFinal = archivoSeleccionado;

    // Si es imagen, convertir a PDF (simulado)
    if (archivoSeleccionado.type.startsWith('image/')) {
      const pdfData = await convertirImagenAPDF(archivoSeleccionado);
      // En producción, esto se enviaría al backend para conversión real
      archivoFinal = new File([pdfData], archivoSeleccionado.name.replace(/\.[^/.]+$/, '.pdf'), {
        type: 'application/pdf'
      });
    }

    // Crear URL del archivo (simulado)
    const archivoUrl = URL.createObjectURL(archivoFinal);

    const nuevoDocumento = {
      id: Date.now(),
      anexo1Id: formData.anexo1Id || null,
      empresaId: parseInt(empresaId),
      nombre: formData.nombre,
      fecha: formData.fecha,
      categoria: formData.categoria,
      archivo: archivoUrl,
      observaciones: formData.observaciones,
      estado: formData.estado,
      subidoPor: 'admin',
      fechaSubida: new Date().toISOString().split('T')[0]
    };

    documentosInSitu.push(nuevoDocumento);

    alert('Documento subido exitosamente');
    
    // Reset form
    setFormData({
      nombre: '',
      fecha: new Date().toISOString().split('T')[0],
      categoria: '',
      observaciones: '',
      estado: 'Borrador',
      anexo1Id: null
    });
    setArchivoSeleccionado(null);
    setArchivoPreview(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVerDocumento = (documento) => {
    window.open(documento.archivo, '_blank');
  };

  const handlePublicar = (documentoId) => {
    const documento = documentosInSitu.find(d => d.id === documentoId);
    if (documento) {
      documento.estado = 'Publicado';
      alert('Documento publicado exitosamente');
    }
  };

  const handleEliminar = (documentoId) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      const index = documentosInSitu.findIndex(d => d.id === documentoId);
      if (index !== -1) {
        documentosInSitu.splice(index, 1);
        alert('Documento eliminado');
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Publicado':
        return 'bg-green-100 text-green-800';
      case 'Borrador':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      {/* Header */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/anexo1')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors px-0 py-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Gestión
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FileIcon className="w-8 h-8 text-primary" />
              Documentos In Situ
            </h1>
            <p className="text-gray-600 mt-1">{empresa.name}</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <UploadIcon className="w-5 h-5" />
            {showForm ? 'Cancelar' : 'Subir Documento'}
          </Button>
        </div>
      </Card>

      {/* Formulario de subida */}
      {showForm && (
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Subir Documento In Situ</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre del Documento *">
                <Input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Inspección de cocina - Enero 2025"
                />
              </FormField>

              <FormField label="Fecha *">
                <Input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </FormField>

              <FormField label="Categoría *">
                <Select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Anexo 1 Relacionado (Opcional)">
                <Select
                  value={formData.anexo1Id || ''}
                  onChange={(e) => setFormData({ ...formData, anexo1Id: e.target.value ? parseInt(e.target.value) : null })}
                >
                  <option value="">Ninguno</option>
                  {anexosEmpresa.map(anexo => (
                    <option key={anexo.id} value={anexo.id}>
                      Inspección {new Date(anexo.fechaInspeccion).toLocaleDateString('es-ES')}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Estado">
                <Select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="Borrador">Borrador</option>
                  <option value="Publicado">Publicado</option>
                </Select>
              </FormField>

              <FormField label="Archivo (PDF o Imagen) *">
                <input
                  ref={fileInputRef}
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                {archivoSeleccionado && (
                  <p className="text-sm text-gray-600 mt-1">
                    {archivoSeleccionado.name} ({(archivoSeleccionado.size / 1024).toFixed(2)} KB)
                  </p>
                )}
                {archivoPreview && (
                  <div className="mt-2">
                    <img src={archivoPreview} alt="Preview" className="max-w-xs border border-gray-300 rounded" />
                    <p className="text-xs text-gray-500 mt-1">La imagen se convertirá a PDF al subir</p>
                  </div>
                )}
              </FormField>
            </div>

            <FormField label="Observaciones">
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Documento firmado en sitio..."
              />
            </FormField>

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Subir Documento
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    nombre: '',
                    fecha: new Date().toISOString().split('T')[0],
                    categoria: '',
                    observaciones: '',
                    estado: 'Borrador',
                    anexo1Id: null
                  });
                  setArchivoSeleccionado(null);
                  setArchivoPreview(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de documentos */}
      <Card className="overflow-hidden p-0 shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-surface to-secondary-light/70">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileIcon className="w-6 h-6 text-primary" />
            Documentos Subidos ({documentosEmpresa.length})
          </h2>
        </div>
        <div className="p-6">
          {documentosEmpresa.length > 0 ? (
            <div className="space-y-4">
              {documentosEmpresa.map((documento) => (
                <div
                  key={documento.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-gray-800">{documento.nombre}</h3>
                        <Badge variant={documento.estado === 'Publicado' ? 'green' : documento.estado === 'Borrador' ? 'yellow' : 'gray'}>
                          {documento.estado}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Fecha:</span> {new Date(documento.fecha).toLocaleDateString('es-ES')}
                        </div>
                        <div>
                          <span className="font-medium">Categoría:</span> {documento.categoria}
                        </div>
                        <div>
                          <span className="font-medium">Subido:</span> {new Date(documento.fechaSubida).toLocaleDateString('es-ES')}
                        </div>
                        {documento.observaciones && (
                          <div className="col-span-2 md:col-span-4">
                            <span className="font-medium">Observaciones:</span> {documento.observaciones}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleVerDocumento(documento)}
                        variant="primary"
                        className="text-sm px-4 py-2"
                      >
                        Ver
                      </Button>
                      {documento.estado === 'Borrador' && (
                        <>
                          <Button
                            onClick={() => handlePublicar(documento.id)}
                            className="text-sm px-4 py-2 bg-green-600 text-white hover:bg-green-700 border-green-600"
                          >
                            Publicar
                          </Button>
                          <Button
                            onClick={() => handleEliminar(documento.id)}
                            className="text-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 border-red-600"
                          >
                            Eliminar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay documentos subidos
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Sube documentos escaneados del trabajo in situ
              </p>
              <Button
                onClick={() => setShowForm(true)}
                variant="primary"
                className="inline-flex items-center gap-2 px-6 py-3"
              >
                <UploadIcon className="w-5 h-5" />
                Subir Primer Documento
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentosInSitu;


