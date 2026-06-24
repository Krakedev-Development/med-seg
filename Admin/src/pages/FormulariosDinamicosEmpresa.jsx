import { useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { getDocumentosByEmpresa, crearDocumentoDinamico } from '../data/documentosDinamicosData';
import { renderToStaticMarkup } from 'react-dom/server';
import InspeccionAreasMulti from '../components/InspeccionAreasMulti';
import InduccionPersonalCocina from '../components/documentos/induccion/InduccionPersonalCocina';
import FichaMedicaEvaluacionRetiro from '../components/documentos/fichaMedica/FichaMedicaEvaluacionRetiro';

const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Generar documentos quemados según la actividad económica
const generarDocumentosPorActividad = (actividad, empresaId) => {
  const baseDocs = [];
  const fecha = new Date().toISOString().split('T')[0];
  
  // Documentos comunes a todas las actividades
  const documentosComunes = [
    {
      id: `doc-${empresaId}-induccion-1`,
      tipo: 'Inducción',
      titulo: 'Inducción General de Seguridad y Salud en el Trabajo',
      fecha: fecha,
      categoria: 'Inducción',
      actividad: actividad,
      datos: {
        tipo: 'induccion',
        area: 'General',
        fecha: fecha
      }
    }
  ];
  
  baseDocs.push(...documentosComunes);
  
  // Documentos específicos por actividad
  if (actividad?.toLowerCase().includes('minería') || actividad?.toLowerCase().includes('minera')) {
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección de Boca Mina',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Boca Mina',
          observaciones: 'Revisión de condiciones de la vía, cunetas y alcantarillas'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Polvorín',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Polvorín',
          observaciones: 'Verificación de almacenamiento de explosivos y productos compatibles'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-3`,
        tipo: 'Inspección',
        titulo: 'Inspección de Maquinaria Minera',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Maquinaria',
          observaciones: 'Revisión de estado de equipos de perforación, carga y transporte'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-4`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Trabajo Subterráneo',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Trabajo Subterráneo',
          observaciones: 'Verificación de ventilación, iluminación y señalización'
        }
      }
    );
  } else if (actividad?.toLowerCase().includes('agrícola') || actividad?.toLowerCase().includes('agricola')) {
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección de Silos de Almacenamiento',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Silos',
          observaciones: 'Revisión de condiciones de almacenamiento y seguridad de silos'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Maquinaria Agrícola',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Maquinaria Agrícola',
          observaciones: 'Verificación de tractores, cosechadoras y equipos de riego'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-3`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Cultivo',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Cultivos',
          observaciones: 'Revisión de condiciones de trabajo en campo y uso de agroquímicos'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-4`,
        tipo: 'Inspección',
        titulo: 'Inspección de Almacenes de Productos Químicos',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Almacén Químicos',
          observaciones: 'Verificación de almacenamiento seguro de fertilizantes y pesticidas'
        }
      }
    );
  } else if (actividad?.toLowerCase().includes('avícola') || actividad?.toLowerCase().includes('avicola')) {
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección de Galpones de Producción',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Galpones',
          observaciones: 'Revisión de condiciones de ventilación, temperatura y bioseguridad'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Procesamiento',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Procesamiento',
          observaciones: 'Verificación de condiciones sanitarias y de seguridad'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-3`,
        tipo: 'Inspección',
        titulo: 'Inspección de Equipos de Refrigeración',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Refrigeración',
          observaciones: 'Revisión de cámaras frigoríficas y sistemas de conservación'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-4`,
        tipo: 'Inspección',
        titulo: 'Inspección de Áreas de Limpieza y Desinfección',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Limpieza',
          observaciones: 'Verificación de protocolos de bioseguridad y desinfección'
        }
      }
    );
  } else {
    // Documentos genéricos para otras actividades
    baseDocs.push(
      {
        id: `doc-${empresaId}-inspeccion-1`,
        tipo: 'Inspección',
        titulo: 'Inspección General de Áreas',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'General',
          observaciones: 'Revisión general de condiciones de seguridad y salud'
        }
      },
      {
        id: `doc-${empresaId}-inspeccion-2`,
        tipo: 'Inspección',
        titulo: 'Inspección de Maquinaria y Equipos',
        fecha: fecha,
        categoria: 'Inspección',
        actividad: actividad,
        datos: {
          tipo: 'inspeccion',
          area: 'Maquinaria',
          observaciones: 'Verificación de estado y seguridad de equipos'
        }
      }
    );
  }
  
  return baseDocs;
};

const FormulariosDinamicosEmpresa = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const [tipoDocumentoSeleccionado, setTipoDocumentoSeleccionado] = useState('all');
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [datosDocumento, setDatosDocumento] = useState({});
  const previewRef = useRef(null);

  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const documentosEmpresa = getDocumentosByEmpresa(parseInt(empresaId));
  
  // Generar documentos quemados según la actividad
  const documentosQuemados = useMemo(() => {
    if (!empresa) return [];
    return generarDocumentosPorActividad(empresa.tipoActividad, parseInt(empresaId));
  }, [empresa, empresaId]);
  
  // Filtrar documentos por tipo
  const documentosFiltrados = useMemo(() => {
    if (tipoDocumentoSeleccionado === 'all') return documentosQuemados;
    return documentosQuemados.filter(doc => doc.tipo === tipoDocumentoSeleccionado);
  }, [documentosQuemados, tipoDocumentoSeleccionado]);
  
  // Tipos de documento disponibles
  const tiposDocumento = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'Inspección', label: 'Inspecciones' },
    { value: 'Inducción', label: 'Inducciones' },
    { value: 'Otros', label: 'Otros' }
  ];
  
  // Manejar cambio de campo editable
  const handleFieldChange = useCallback((field, value) => {
    setDatosDocumento(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // Renderizar documento según tipo
  const renderDocumento = () => {
    if (!documentoSeleccionado) return null;
    
    const { tipo, datos } = documentoSeleccionado;
    
    if (tipo === 'Inspección' || datos?.tipo === 'inspeccion') {
      return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg" ref={previewRef}>
          <InspeccionAreasMulti
            logoEmpresa={empresa?.logo}
            nombreEmpresa={datosDocumento.nombreEmpresa || empresa?.name || datos?.nombreEmpresa || "ASOPROMIN S.A."}
            fechaInspeccion={datosDocumento.fechaInspeccion || datos?.fecha || new Date().toISOString().split('T')[0]}
            nombreEncargado={datosDocumento.nombreEncargado || datos?.nombreEncargado || "_________________"}
            secciones={datos?.secciones || [
              {
                area: datosDocumento.area || datos?.area || "Área de Inspección",
                items: datos?.items || ["¿Condiciones generales de seguridad?"]
              }
            ]}
            editable={true}
            onFieldChange={handleFieldChange}
          />
        </div>
      );
    }
    
    if (tipo === 'Inducción' || datos?.tipo === 'induccion') {
      return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg" ref={previewRef}>
          <InduccionPersonalCocina
            logoEmpresa={empresa?.logo}
            nombreEmpresa={datosDocumento.nombreEmpresa || empresa?.name || "Empresa"}
            nombreTrabajador={datosDocumento.nombreTrabajador || datos?.nombreTrabajador || "_________________"}
            numeroCedula={datosDocumento.numeroCedula || datos?.numeroCedula || "_________________"}
            fecha={datosDocumento.fecha || datos?.fecha || new Date().toLocaleDateString('es-ES')}
            puestoTrabajo={datosDocumento.puestoTrabajo || datos?.puestoTrabajo || "_________________"}
            actividadesPuesto={datosDocumento.actividadesPuesto || datos?.actividadesPuesto || "________________________________________________________________________________________________________________"}
            editable={true}
            onFieldChange={handleFieldChange}
          />
        </div>
      );
    }
    
    if (tipo === 'Ficha Médica' || datos?.tipo === 'ficha-medica') {
      return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg" ref={previewRef}>
          <FichaMedicaEvaluacionRetiro
            logoEmpresa={empresa?.logo}
            nombreEmpresa={datosDocumento.nombreEmpresa || empresa?.name || "Empresa"}
            institucion={datosDocumento.institucion || empresa?.name || "Institución"}
            ruc={datosDocumento.ruc || empresa?.ruc || ""}
            ciiu={datosDocumento.ciiu || empresa?.ciiu || ""}
            primerApellido={datosDocumento.primerApellido || datos?.primerApellido || ""}
            segundoApellido={datosDocumento.segundoApellido || datos?.segundoApellido || ""}
            nombres={datosDocumento.nombres || datos?.nombres || ""}
            numeroCedula={datosDocumento.numeroCedula || datos?.numeroCedula || ""}
            editable={true}
            onFieldChange={handleFieldChange}
          />
        </div>
      );
    }
    
    return (
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <p className="text-gray-500">Tipo de documento no soportado para edición</p>
      </div>
    );
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

  // Si hay un documento seleccionado, mostrar el editor
  if (documentoSeleccionado) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => {
                  setDocumentoSeleccionado(null);
                  setDatosDocumento({});
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Documentos
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{documentoSeleccionado.titulo}</h1>
              <p className="text-gray-600 mt-1">
                {empresa.name} • {empresa.tipoActividad} • {documentoSeleccionado.categoria}
              </p>
            </div>
          </div>
        </div>

        {/* Documento editable */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Modo Edición:</strong> Haz clic en cualquier texto para editarlo directamente en el documento.
            </p>
          </div>
          {renderDocumento()}
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setDocumentoSeleccionado(null);
                setDatosDocumento({});
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Imprimir
            </button>
            <button
              onClick={() => {
                const nuevoDocumento = crearDocumentoDinamico(
                  documentoSeleccionado.datos?.tipo || documentoSeleccionado.tipo.toLowerCase(),
                  parseInt(empresaId),
                  {
                    ...datosDocumento,
                    ...documentoSeleccionado.datos,
                    titulo: documentoSeleccionado.titulo
                  },
                  null
                );
                alert('Documento guardado exitosamente');
                setDocumentoSeleccionado(null);
                setDatosDocumento({});
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Guardar Documento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileTextIcon className="w-8 h-8 text-primary" />
          Formularios Dinámicos
        </h1>
        <p className="text-gray-600 mt-1">
          Crear y gestionar documentos dinámicos para <strong>{empresa.name}</strong>
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {empresa.tipoActividad || 'Actividad no especificada'}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento
            </label>
            <select
              value={tipoDocumentoSeleccionado}
              onChange={(e) => setTipoDocumentoSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {tiposDocumento.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Documentos Disponibles ({documentosFiltrados.length})
        </h2>
        {documentosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay documentos disponibles para esta actividad</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentosFiltrados.map(doc => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
                onClick={() => {
                  setDocumentoSeleccionado(doc);
                  setDatosDocumento(doc.datos || {});
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{doc.titulo}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {doc.tipo}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {doc.fecha}
                      </span>
                    </div>
                    {doc.datos?.observaciones && (
                      <p className="text-sm text-gray-600 line-clamp-2">{doc.datos.observaciones}</p>
                    )}
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
                  Editar Documento
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documentos creados anteriormente */}
      {documentosEmpresa.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Creados ({documentosEmpresa.length})</h2>
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
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
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

export default FormulariosDinamicosEmpresa;
