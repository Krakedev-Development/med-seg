import { useState, useEffect, useMemo } from 'react';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { anexos1 } from '@shared/api/mock/anexo1Data';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import { filtrarSeccionesPorEmpresa, obtenerConfiguracionEmpresa } from '@features/anexo1-checklist/model/useAnexo1Filters';
import { crearTareaDesdeItem, tareas, getTareasByItem, actualizarEstadoTarea } from '@shared/api/mock/tareasData';
import { 
  getEvidenciasByItem, 
  getEvidenciasEmpresaByItem, 
  getEvidenciasTrabajadoresByItem,
  evidencias 
} from '@shared/api/mock/evidenciasData';
import { updateRespuestaItem } from '@shared/api/mock/anexo1Data';
import { getDocumentosByEmpresa, getDocumentosByItem, vincularDocumentoAItem } from '@entities/document/model/documentsMock';
import { getCapacitacionesByItem } from '@shared/api/mock/capacitacionesData';
import { getEvaluacionesByItem } from '@shared/api/mock/evaluacionesData';
import ModalDocumentosDinamicos from '@shared/ui/ModalDocumentosDinamicos';

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SaveIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const PrinterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const EditorAnexo1 = ({ companies = initialCompanies }) => {
  const { empresaId, anexoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const anexoIdFromQuery = searchParams.get('anexo');
  const finalAnexoId = anexoId || anexoIdFromQuery;
  
  // Detectar si está dentro del layout de EmpresaAnexo1View
  const isInLayout = location.pathname.includes('/anexo1/empresa/') && location.pathname.includes('/editor');
  
  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const anexoExistente = finalAnexoId ? anexos1.find(a => a.id === parseInt(finalAnexoId)) : null;

  const [datosGenerales, setDatosGenerales] = useState(() => {
    if (anexoExistente) return anexoExistente.datosGenerales || {};
    return {
      inspeccion: '',
      fecha_inspeccion: new Date().toISOString().split('T')[0],
      reinspeccion: '',
      fecha_reinspeccion: '',
      fecha_maxima_info: '',
      tipo_empresa: '',
      empleador: empresa?.name || '',
      telefono: '',
      razon_social: empresa?.name || '',
      ruc: empresa?.ruc || '',
      correo: empresa?.email || '',
      actividad_economica: empresa?.tipoActividad || '',
      tipo_centro_trabajo: '',
      direccion_centro: empresa?.address || '',
      numero_total_trabajadores: '',
      consolidado_iess: '',
      trabajadores_centro: '',
      hombres: '',
      mujeres: '',
      teletrabajadores: '',
      extranjeros: '',
      adolescentes: '',
      mujeres_embarazadas: '',
      adultos_mayores: '',
      ninos: '',
      mujeres_lactancia: '',
      numero_centros_abiertos: '',
      horario_trabajo: '',
      entrevistados: ''
    };
  });

  const [respuestas, setRespuestas] = useState(() => {
    if (anexoExistente) return anexoExistente.respuestas || {};
    return {};
  });

  const [estado, setEstado] = useState(anexoExistente?.estado || 'Borrador');
  
  // Configuración de empresa para filtrado dinámico (después de datosGenerales)
  const configEmpresa = useMemo(() => {
    try {
      if (!empresa) return null;
      const numTrabajadores = datosGenerales.numero_total_trabajadores || 
                             initialEmployees.filter(e => e.companyId === parseInt(empresaId)).length;
      return obtenerConfiguracionEmpresa({
        ...empresa,
        employees: initialEmployees.filter(e => e.companyId === parseInt(empresaId)),
        numero_total_trabajadores: numTrabajadores
      });
    } catch (error) {
      console.error('Error al obtener configuración de empresa:', error);
      return null;
    }
  }, [empresa, empresaId, datosGenerales.numero_total_trabajadores]);
  
  // Secciones filtradas según la empresa (solo mostrar ítems aplicables)
  const seccionesFiltradas = useMemo(() => {
    try {
      // Si no hay SECCIONES_SST, retornar array vacío
      if (!SECCIONES_SST || !Array.isArray(SECCIONES_SST)) {
        console.warn('SECCIONES_SST no está definido o no es un array');
        return [];
      }
      
      // Si no hay configEmpresa, usar todas las secciones
      if (!configEmpresa) {
        return SECCIONES_SST;
      }
      
      const filtradas = filtrarSeccionesPorEmpresa(SECCIONES_SST, configEmpresa);
      return filtradas && Array.isArray(filtradas) && filtradas.length > 0 ? filtradas : SECCIONES_SST;
    } catch (error) {
      console.error('Error al filtrar secciones:', error);
      // Fallback seguro: retornar todas las secciones
      return SECCIONES_SST || [];
    }
  }, [configEmpresa]);
  const [filtroEstado, setFiltroEstado] = useState('all');
  const [filtroCategoria, setFiltroCategoria] = useState('all');
  const [busquedaItem, setBusquedaItem] = useState('');
  const [busquedaReferencia, setBusquedaReferencia] = useState('');
  const [seccionesExpandidas, setSeccionesExpandidas] = useState({});
  const [itemAccionesAbierto, setItemAccionesAbierto] = useState(null);
  const [showEvidenciaPanel, setShowEvidenciaPanel] = useState(false);
  const [itemEvidenciaSeleccionado, setItemEvidenciaSeleccionado] = useState(null);
  const [showDocumentosModal, setShowDocumentosModal] = useState(false);
  const [itemDocumentoSeleccionado, setItemDocumentoSeleccionado] = useState(null);
  const [showToast, setShowToast] = useState({ visible: false, message: '', type: 'success' });

  // Inicializar todas las secciones expandidas
  useEffect(() => {
    if (!seccionesFiltradas || seccionesFiltradas.length === 0) return;
    
    const expandidas = {};
    seccionesFiltradas.forEach(seccion => {
      if (seccion && seccion.id) {
        expandidas[seccion.id] = true; // Expandir todas las secciones por defecto (datos y checklist)
      }
    });
    setSeccionesExpandidas(expandidas);
  }, [seccionesFiltradas]);

  const toggleSeccion = (seccionId) => {
    setSeccionesExpandidas(prev => ({
      ...prev,
      [seccionId]: !prev[seccionId]
    }));
  };

  const handleChangeCampo = (campoId, valor) => {
    setDatosGenerales(prev => ({
      ...prev,
      [campoId]: valor
    }));
  };

  const handleChangeRespuesta = (itemId, nuevoValor) => {
    const estadoAnterior = respuestas[itemId]?.estado;
    const nuevoEstado = nuevoValor.estado;

    // Asegurar que observaciones sea un array (migrar de string antiguo si es necesario)
    let valorFinalizado = { ...nuevoValor };
    if (!Array.isArray(valorFinalizado.observaciones)) {
      if (valorFinalizado.observacion && typeof valorFinalizado.observacion === 'string' && valorFinalizado.observacion.trim()) {
        // Migrar observación string a array
        valorFinalizado.observaciones = [{
          id: Date.now(),
          texto: valorFinalizado.observacion.trim(),
          fecha: new Date().toISOString().split('T')[0],
          usuario: 'admin'
        }];
        valorFinalizado.observacion = ''; // Limpiar campo legacy
      } else {
        valorFinalizado.observaciones = [];
      }
    }

    setRespuestas(prev => ({
      ...prev,
      [itemId]: valorFinalizado
    }));

    // Si cambió de NO_CUMPLE a otro estado, no hacer nada
    // Si cambió a NO_CUMPLE, crear tarea automática
    if (nuevoEstado === 'NO_CUMPLE' && estadoAnterior !== 'NO_CUMPLE') {
      // Buscar el ítem para obtener su texto
      let itemTexto = '';
      seccionesFiltradas.forEach(seccion => {
        if (seccion.tipo === 'checklist' && seccion.items) {
          const item = seccion.items.find(i => i.id === itemId);
          if (item) {
            itemTexto = item.texto;
          }
        }
      });

      // Crear tarea automática
      const nuevaTarea = crearTareaDesdeItem(
        parseInt(empresaId),
        anexoId ? parseInt(anexoId) : null,
        itemId,
        itemTexto
      );
      tareas.push(nuevaTarea);
    }
  };

  // Efecto para migrar observaciones antiguas al cargar
  useEffect(() => {
    let necesitaMigracion = false;
    const respuestasMigradas = { ...respuestas };
    
    Object.keys(respuestasMigradas).forEach(itemId => {
      const respuesta = respuestasMigradas[itemId];
      if (respuesta && !Array.isArray(respuesta.observaciones) && respuesta.observacion && typeof respuesta.observacion === 'string' && respuesta.observacion.trim()) {
        respuestasMigradas[itemId] = {
          ...respuesta,
          observaciones: [{
            id: Date.now(),
            texto: respuesta.observacion.trim(),
            fecha: new Date().toISOString().split('T')[0],
            usuario: 'admin'
          }],
          observacion: ''
        };
        necesitaMigracion = true;
      } else if (respuesta && !Array.isArray(respuesta.observaciones)) {
        respuestasMigradas[itemId] = {
          ...respuesta,
          observaciones: []
        };
        necesitaMigracion = true;
      }
    });

    if (necesitaMigracion) {
      setRespuestas(respuestasMigradas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // Filtrar ítems según los filtros (solo ítems aplicables)
  const itemsFiltrados = useMemo(() => {
    if (!seccionesFiltradas || seccionesFiltradas.length === 0) return [];
    
    let items = [];
    
    seccionesFiltradas.forEach(seccion => {
      if (!seccion) return;
      if (seccion.tipo === 'checklist' && seccion.items && Array.isArray(seccion.items)) {
        seccion.items.forEach(item => {
          if (!item || !item.id) return;
          const respuesta = respuestas[item.id];
          const estadoItem = respuesta?.estado;
          
          // Filtrar por estado
          if (filtroEstado !== 'all' && estadoItem !== filtroEstado) {
            return;
          }
          
          // Filtrar por categoría
          if (filtroCategoria !== 'all' && seccion.id !== filtroCategoria) {
            return;
          }
          
          // Filtrar por búsqueda (ítem, texto, referencia legal)
          if (busquedaItem.trim()) {
            const busqueda = busquedaItem.toLowerCase();
            const textoItem = item.texto.toLowerCase();
            const numeroItem = item.numero?.toLowerCase() || '';
            const referenciaLegal = item.referenciaLegal?.toLowerCase() || '';
            if (!textoItem.includes(busqueda) && 
                !numeroItem.includes(busqueda) && 
                !referenciaLegal.includes(busqueda)) {
              return;
            }
          }
          
          items.push({ ...item, seccionId: seccion.id, seccionTitulo: seccion.titulo });
        });
      }
    });
    
    return items;
  }, [filtroEstado, filtroCategoria, busquedaItem, respuestas, seccionesFiltradas]);

  const handleGuardar = (nuevoEstado = null) => {
    const estadoFinal = nuevoEstado || estado;
    const fechaActual = new Date().toISOString().split('T')[0];
    
    const anexoData = {
      id: anexoId ? parseInt(anexoId) : Date.now(),
      empresaId: parseInt(empresaId),
      fechaInspeccion: datosGenerales.fecha_inspeccion || fechaActual,
      fechaReinspeccion: datosGenerales.fecha_reinspeccion || null,
      fechaMaximaInfo: datosGenerales.fecha_maxima_info || null,
      estado: estadoFinal,
      datosGenerales,
      respuestas,
      documentosInSitu: anexoExistente?.documentosInSitu || [],
      creadoPor: 'admin',
      fechaCreacion: anexoExistente?.fechaCreacion || fechaActual,
      fechaActualizacion: fechaActual
    };

    if (anexoId) {
      const index = anexos1.findIndex(a => a.id === parseInt(anexoId));
      if (index !== -1) {
        anexos1[index] = anexoData;
      } else {
        anexos1.push(anexoData);
      }
    } else {
      anexos1.push(anexoData);
    }

    mostrarToast(`Anexo 1 ${estadoFinal === 'Publicado' ? 'publicado' : 'guardado'} exitosamente`, 'success');
    
    if (estadoFinal === 'Publicado') {
      setTimeout(() => {
        navigate(`/anexo1/empresa/${empresaId}/estado`);
      }, 1500);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Empresa no encontrada</p>
          <button 
            onClick={() => navigate('/anexo1')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
          >
            Volver a Gestión Anexo 1
          </button>
        </div>
      </div>
    );
  }
  
  // Validar que seccionesFiltradas esté definido
  if (!seccionesFiltradas || seccionesFiltradas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Error al cargar las secciones del Anexo 1</p>
          <button 
            onClick={() => navigate('/anexo1')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
          >
            Volver a Gestión Anexo 1
          </button>
        </div>
      </div>
    );
  }

  // Función para mostrar toast
  const mostrarToast = (message, type = 'success') => {
    setShowToast({ visible: true, message, type });
    setTimeout(() => setShowToast({ visible: false, message: '', type: 'success' }), 3000);
  };
  
  // Validación final antes de renderizar
  if (!seccionesFiltradas || !Array.isArray(seccionesFiltradas) || seccionesFiltradas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Error al cargar el Anexo 1</h2>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las secciones del Anexo 1. Por favor, intente nuevamente.
          </p>
          <button 
            onClick={() => navigate('/anexo1')}
            className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Volver a Gestión Anexo 1
          </button>
        </div>
      </div>
    );
  }

  // Función para subir evidencia
  const handleSubirEvidencia = (itemId, file, tipoEvidencia = 'general', trabajadorSeleccionado = '', areaTexto = '') => {
    if (!file) return;
    
    const nuevaEvidencia = {
      id: Date.now() + Math.random(),
      empresaId: parseInt(empresaId),
      anexo1Id: anexoId ? parseInt(anexoId) : null,
      itemId: itemId,
      nombre: file.name,
      archivo: URL.createObjectURL(file),
      tipo: file.type.startsWith('image/') ? 'imagen' : 'documento',
      tipoEvidencia: tipoEvidencia, // general, trabajador, area, documento-dinamico
      trabajador: trabajadorSeleccionado || null,
      area: areaTexto || null,
      estado: 'Pendiente',
      subidoPor: 'admin',
      aprobadoPor: null,
      fechaSubida: new Date().toISOString().split('T')[0],
      fechaAprobacion: null,
      observaciones: '',
      tamaño: file.size
    };
    evidencias.push(nuevaEvidencia);
    mostrarToast('Evidencia subida exitosamente', 'success');
    
    // Forzar re-render actualizando el estado
    setRespuestas(prev => ({ ...prev }));
  };

  return (
    <div className="relative">
      {/* Toast de notificación */}
      {showToast.visible && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
          showToast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{showToast.message}</span>
        </div>
      )}

      {/* Panel lateral de evidencias */}
      {showEvidenciaPanel && itemEvidenciaSeleccionado && (
        <PanelEvidencias
          itemId={itemEvidenciaSeleccionado}
          anexoId={anexoId ? parseInt(anexoId) : null}
          empresaId={parseInt(empresaId)}
          onCerrar={() => {
            setShowEvidenciaPanel(false);
            setItemEvidenciaSeleccionado(null);
          }}
          onSubirEvidencia={handleSubirEvidencia}
        />
      )}

      {/* Modal para vincular documentos dinámicos */}
      {showDocumentosModal && itemDocumentoSeleccionado && (
        <ModalDocumentosDinamicos
          itemId={itemDocumentoSeleccionado}
          empresaId={parseInt(empresaId)}
          anexoId={anexoId ? parseInt(anexoId) : null}
          onCerrar={() => {
            setShowDocumentosModal(false);
            setItemDocumentoSeleccionado(null);
          }}
          onVincular={(documentoId) => {
            vincularDocumentoAItem(documentoId, itemDocumentoSeleccionado, anexoId ? parseInt(anexoId) : null);
            setShowToast({ visible: true, message: 'Documento vinculado exitosamente', type: 'success' });
            setTimeout(() => {
              setShowToast({ visible: false, message: '', type: 'success' });
              setShowDocumentosModal(false);
              setItemDocumentoSeleccionado(null);
            }, 2000);
          }}
        />
      )}

      <div className="space-y-6 no-print">
      {/* Header - Solo si no está en el layout */}
      {!isInLayout && (
        <Card className="p-6 shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate(`/anexo1/empresa/${empresaId}/estado`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 p-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Estado General
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">Editor Anexo 1 - SST</h1>
              <p className="text-gray-600 mt-1">{empresa.name}</p>
            </div>
            <div className="flex gap-3">
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="Borrador">Borrador</option>
                <option value="Publicado">Publicado</option>
              </Select>
              <Button
                variant="primary"
                onClick={() => handleGuardar()}
                className="flex items-center gap-2"
              >
                <SaveIcon className="w-5 h-5" />
                Guardar
              </Button>
              <Button
                variant="success"
                onClick={() => handleGuardar('Publicado')}
                className="flex items-center gap-2"
              >
                Publicar
              </Button>
              <Button
                variant="outline"
                onClick={handleImprimir}
                className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-700 hover:text-white"
              >
                <PrinterIcon className="w-5 h-5" />
                Imprimir
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Barra de herramientas compacta si está en el layout */}
      {isInLayout && (
        <Card className="px-4 py-2.5 flex items-center justify-between mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800">Checklist Anexo 1</h2>
          <div className="flex gap-2">
            <Select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="py-1.5 text-sm"
            >
              <option value="Borrador">Borrador</option>
              <option value="Publicado">Publicado</option>
            </Select>
            <Button
              variant="primary"
              onClick={() => handleGuardar()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm"
            >
              <SaveIcon className="w-4 h-4" />
              Guardar
            </Button>
            <Button
              variant="success"
              onClick={() => handleGuardar('Publicado')}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm"
            >
              Publicar
            </Button>
            <Button
              variant="outline"
              onClick={handleImprimir}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gray-600 text-white hover:bg-gray-700 hover:text-white"
            >
              <PrinterIcon className="w-4 h-4" />
              Imprimir
            </Button>
          </div>
        </Card>
      )}

      {/* Filtros y búsqueda mejorado */}
      <Card className="p-4 mb-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            type="text"
            placeholder="Buscar por ítem, texto o referencia legal..."
            value={busquedaItem}
            onChange={(e) => setBusquedaItem(e.target.value)}
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
          />
          <Select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="CUMPLE">Cumple</option>
            <option value="NO_CUMPLE">No Cumple</option>
            <option value="NA">No Aplica</option>
            <option value="sin-estado">Sin estado</option>
          </Select>
          <Select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {seccionesFiltradas.filter(s => s.tipo === 'checklist').map(seccion => (
              <option key={seccion.id} value={seccion.id}>{seccion.titulo}</option>
            ))}
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setFiltroEstado('all');
              setFiltroCategoria('all');
              setBusquedaItem('');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Sección de Datos Generales */}
      {seccionesFiltradas.filter(s => s.tipo === 'datos').map(seccion => (
        <SeccionDatos
          key={seccion.id}
          seccion={seccion}
          datosGenerales={datosGenerales}
          onChange={handleChangeCampo}
          isExpanded={seccionesExpandidas[seccion.id]}
          onToggle={() => toggleSeccion(seccion.id)}
        />
      ))}

      {/* Secciones de Checklist (solo ítems aplicables) */}
      {seccionesFiltradas.filter(s => s.tipo === 'checklist' && s.items && Array.isArray(s.items)).map(seccion => {
        const itemsSeccion = (seccion.items || []).filter(item => {
          if (filtroEstado !== 'all') {
            const respuesta = respuestas[item.id];
            if (respuesta?.estado !== filtroEstado) return false;
          }
          if (filtroCategoria !== 'all' && seccion.id !== filtroCategoria) return false;
          if (busquedaItem.trim()) {
            const busqueda = busquedaItem.toLowerCase();
            const textoItem = item.texto.toLowerCase();
            const numeroItem = item.numero?.toLowerCase() || '';
            if (!textoItem.includes(busqueda) && !numeroItem.includes(busqueda)) return false;
          }
          return true;
        });

        return (
          <SeccionChecklist
            key={seccion.id}
            seccion={seccion}
            items={itemsSeccion}
            respuestas={respuestas}
            onChange={handleChangeRespuesta}
            isExpanded={seccionesExpandidas[seccion.id]}
            onToggle={() => toggleSeccion(seccion.id)}
            empresaId={parseInt(empresaId)}
            anexoId={anexoId || null}
            numeroTrabajadores={datosGenerales?.numero_total_trabajadores || datosGenerales?.trabajadores_centro}
          />
        );
      })}
      </div>
    </div>
  );
};

// Componente Panel de Evidencias
function PanelEvidencias({ itemId, anexoId, empresaId, onCerrar, onSubirEvidencia }) {
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [tipoEvidencia, setTipoEvidencia] = useState('general');
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState('');
  const [areaTexto, setAreaTexto] = useState('');
  const evidenciasItem = getEvidenciasByItem(itemId, anexoId);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setArchivosSeleccionados(prev => [...prev, ...files]);
    }
  };

  const handleSubir = () => {
    if (archivosSeleccionados.length > 0) {
      archivosSeleccionados.forEach(archivo => {
        onSubirEvidencia(itemId, archivo, tipoEvidencia, trabajadorSeleccionado, areaTexto);
      });
      setArchivosSeleccionados([]);
      setTipoEvidencia('general');
      setTrabajadorSeleccionado('');
      setAreaTexto('');
      // Resetear el input
      const input = document.getElementById('file-input-evidencias');
      if (input) input.value = '';
    }
  };

  const handleEliminarArchivo = (index) => {
    setArchivosSeleccionados(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Evidencias del Ítem</h2>
        <button
          onClick={onCerrar}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Formulario de subida */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar archivos (múltiples)
          </label>
          <input
            id="file-input-evidencias"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
          />
          
          {/* Lista de archivos seleccionados */}
          {archivosSeleccionados.length > 0 && (
            <div className="mt-3 space-y-2">
              {archivosSeleccionados.map((archivo, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{archivo.name}</p>
                    <p className="text-xs text-gray-500">{(archivo.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    onClick={() => handleEliminarArchivo(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Clasificación de evidencia */}
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evidencia
            </label>
            <select
              value={tipoEvidencia}
              onChange={(e) => setTipoEvidencia(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="general">General de empresa</option>
              <option value="trabajador">Evidencia para trabajador</option>
              <option value="area">Evidencia para área</option>
              <option value="documento-dinamico">Evidencia de documento dinámico</option>
            </select>

            {tipoEvidencia === 'trabajador' && (
              <input
                type="text"
                placeholder="Nombre o cédula del trabajador"
                value={trabajadorSeleccionado}
                onChange={(e) => setTrabajadorSeleccionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            )}

            {tipoEvidencia === 'area' && (
              <input
                type="text"
                placeholder="Nombre del área"
                value={areaTexto}
                onChange={(e) => setAreaTexto(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            )}
          </div>

          <button
            onClick={handleSubir}
            disabled={archivosSeleccionados.length === 0}
            className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Subir {archivosSeleccionados.length > 0 ? `${archivosSeleccionados.length} ` : ''}Evidencia{archivosSeleccionados.length > 1 ? 's' : ''}
          </button>
        </div>

        {/* Lista de evidencias */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Evidencias subidas ({evidenciasItem.length})
          </h3>
          {evidenciasItem.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No hay evidencias subidas para este ítem
            </p>
          ) : (
            <div className="space-y-2">
              {evidenciasItem.map((evidencia) => (
                <div
                  key={evidencia.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{evidencia.nombre}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {evidencia.fechaSubida} • {(evidencia.tamaño / 1024).toFixed(2)} KB
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        evidencia.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                        evidencia.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {evidencia.estado}
                      </span>
                    </div>
                    <a
                      href={evidencia.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:text-primary-hover"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para sección de datos
function SeccionDatos({ seccion, datosGenerales, onChange, isExpanded, onToggle }) {
  return (
    <Card className="p-0 shadow-md border border-gray-200 overflow-hidden mb-6">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-primary text-white flex items-center justify-between hover:bg-primary-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <h2 className="text-[14px] font-bold uppercase tracking-wide">{seccion.titulo}</h2>
        </div>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {seccion.campos.length} campos
        </span>
      </button>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
            {seccion.campos.map((campo) => (
              <FormField key={campo.id} label={campo.etiqueta}>
                <Input
                  type="text"
                  value={datosGenerales[campo.id] || ""}
                  onChange={(e) => onChange(campo.id, e.target.value)}
                  className="text-sm"
                />
              </FormField>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// Componente para fila del checklist
function FilaChecklist({ item, value, onChange, categoriaGeneral, isFirstRow, totalRows, empresaId, anexoId, numeroTrabajadores }) {
  const navigate = useNavigate();
  const anexoIdNum = anexoId ? parseInt(anexoId) : null;
  const evidenciasItem = getEvidenciasByItem(item.id, anexoIdNum);
  const evidenciasEmpresa = getEvidenciasEmpresaByItem(item.id, anexoIdNum);
  const evidenciasTrabajadores = getEvidenciasTrabajadoresByItem(item.id, anexoIdNum);
  const capacitacionesItem = getCapacitacionesByItem(item.id);
  const evaluacionesItem = getEvaluacionesByItem(item.id);
  const documentosVinculados = getDocumentosByItem(item.id);
  
  // Calcular estado del ítem
  const estadoItem = useMemo(() => {
    if (!value || !value.estado) return 'sin-estado';
    if (value.estado === 'CUMPLE') return 'cumple';
    if (value.estado === 'NO_CUMPLE') return 'no-cumple';
    if (value.estado === 'NA') return 'no-aplica';
    
    // Si está en progreso (tiene evidencias, capacitaciones o evaluaciones pero no cumple)
    if (evidenciasItem.length > 0 || capacitacionesItem.length > 0 || evaluacionesItem.length > 0) {
      return 'en-progreso';
    }
    
    return 'sin-estado';
  }, [value, evidenciasItem.length, capacitacionesItem.length, evaluacionesItem.length]);

  // Detectar si el ítem debe ser NA automáticamente según número de trabajadores
  const debeSerNA = useMemo(() => {
    if (!numeroTrabajadores) return false;
    const numTrab = parseInt(numeroTrabajadores);
    if (isNaN(numTrab)) return false;
    // Ítems que requieren >10 trabajadores
    const itemsMasDe10 = ['ga2']; // Reglamento de Higiene (más de 10 trabajadores)
    if (itemsMasDe10.includes(item.id)) {
      return numTrab <= 10;
    }
    // Ítems que requieren 1-10 trabajadores
    const itemsMenosDe10 = ['ga1']; // Plan de Prevención (1 a 10 trabajadores)
    if (itemsMenosDe10.includes(item.id)) {
      return numTrab > 10;
    }
    return false;
  }, [item.id, numeroTrabajadores]);

  // Estado para el modal de observaciones
  const [showModalObservaciones, setShowModalObservaciones] = useState(false);

  // Normalizar observaciones: convertir string antiguo a array y obtener array de observaciones
  const observacionesArray = useMemo(() => {
    if (!value) return [];
    // Si hay observaciones como array, usarlas
    if (Array.isArray(value.observaciones)) {
      return value.observaciones;
    }
    // Si hay observacion como string (legacy), convertirla a array
    if (value.observacion && typeof value.observacion === 'string' && value.observacion.trim()) {
      return [{
        id: Date.now(),
        texto: value.observacion.trim(),
        fecha: new Date().toISOString().split('T')[0],
        usuario: 'admin'
      }];
    }
    return [];
  }, [value]);

  // Auto-marcar como NA si corresponde (solo una vez al montar o cuando cambia debeSerNA)
  useEffect(() => {
    if (debeSerNA && (!value || value.estado !== 'NA')) {
      const obs = Array.isArray(value?.observaciones) ? value.observaciones : 
                  (value?.observacion ? [{ id: Date.now(), texto: value.observacion, fecha: new Date().toISOString().split('T')[0], usuario: 'admin' }] : []);
      onChange(item.id, { 
        estado: 'NA',
        observaciones: obs,
        observacion: '' // Mantener para compatibilidad pero migrar a array
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debeSerNA, item.id]); // Solo ejecutar cuando cambia debeSerNA o item.id
  
  const handleEstado = (estado) => {
    onChange(item.id, {
      ...value,
      estado,
    });
  };

  // Agregar nueva observación
  const handleAgregarObservacion = (nuevaObservacion) => {
    const observacionesActuales = observacionesArray;
    const nuevaObs = {
      id: Date.now() + Math.random(),
      texto: nuevaObservacion.trim(),
      fecha: new Date().toISOString().split('T')[0],
      usuario: 'admin'
    };
    onChange(item.id, {
      ...value,
      observaciones: [...observacionesActuales, nuevaObs],
      observacion: '' // Limpiar campo legacy
    });
  };

  // Eliminar observación
  const handleEliminarObservacion = (observacionId) => {
    const observacionesActuales = observacionesArray;
    onChange(item.id, {
      ...value,
      observaciones: observacionesActuales.filter(obs => obs.id !== observacionId),
      observacion: ''
    });
  };

  const formatearReferencias = (referencia) => {
    if (!referencia) return null;
    const lineas = referencia.split(/ - |\. /).filter(line => line.trim());
    return lineas.map((linea, idx) => {
      const texto = linea.trim();
      if (idx < lineas.length - 1 && !texto.endsWith('.')) {
        return texto + '.';
      }
      return texto;
    });
  };

  return (
    <tr className="align-top break-inside-avoid hover:bg-gray-50 transition-colors">
      <td className="border border-gray-300 p-2 text-[9px] leading-tight text-left align-top w-[12%] bg-blue-50">
        {item.referenciaLegal && (
          <div className="text-gray-700 italic">
            {formatearReferencias(item.referenciaLegal)?.map((linea, idx) => (
              <div key={idx} className="mb-1">{linea}</div>
            ))}
          </div>
        )}
      </td>
      {isFirstRow && categoriaGeneral && (
        <td
          rowSpan={totalRows}
          className="border border-gray-300 p-3 text-[10px] leading-tight text-center align-middle w-[12%] font-semibold bg-gray-100 text-primary"
          style={{ verticalAlign: 'middle' }}
        >
          <div className="flex items-center justify-center h-full text-center">
            {categoriaGeneral}
          </div>
        </td>
      )}
      <td className="border border-gray-300 p-2 text-center align-middle w-[3%] bg-gray-50">
        <div className="font-bold text-[11px] text-primary">{item.numero || ""}</div>
      </td>
      <td className="border border-gray-300 p-3 text-[10px] leading-relaxed text-left align-top w-[30%] bg-white">
        <div className="font-medium text-gray-800">{item.texto}</div>
        {item.subLista && (
          <ul className="mt-2 ml-5 list-disc text-[9px] space-y-1 text-gray-600">
            {item.subLista.map((subItem, idx) => (
              <li key={idx}>{subItem}</li>
            ))}
          </ul>
        )}
        {/* Badges de estado y acciones */}
        <div className="flex flex-wrap gap-1 mt-2">
          {/* Estado visual del ítem */}
          {estadoItem === 'cumple' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-green-100 text-green-800 rounded-full font-semibold">
              ✓ CUMPLE
            </span>
          )}
          {estadoItem === 'no-cumple' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-red-100 text-red-800 rounded-full font-semibold">
              ✗ NO CUMPLE
            </span>
          )}
          {estadoItem === 'en-progreso' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-yellow-100 text-yellow-800 rounded-full font-semibold">
              ⏳ EN PROGRESO
            </span>
          )}
          
          {/* Evidencias de empresa */}
          {evidenciasEmpresa.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-blue-100 text-blue-800 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Evidencia Empresa: ✔
            </span>
          )}
          
          {/* Evidencias de trabajadores */}
          {evidenciasTrabajadores.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-indigo-100 text-indigo-800 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Evidencias Trabajadores: {evidenciasTrabajadores.length} subidas
            </span>
          )}
          
          {/* Capacitación programada */}
          {capacitacionesItem.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-green-100 text-green-800 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Capacitación programada
            </span>
          )}
          
          {/* Evaluación activa */}
          {evaluacionesItem.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-purple-100 text-purple-800 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Evaluación activa – {evaluacionesItem.filter(e => e.estado === 'Activa').length}/{evaluacionesItem.length} activas
            </span>
          )}
        </div>
      </td>
      <td className="border border-gray-300 p-2 text-center align-middle w-[6%] bg-green-50">
        <input
          type="radio"
          name={item.id}
          checked={value?.estado === "CUMPLE"}
          onChange={() => handleEstado("CUMPLE")}
          className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
        />
      </td>
      <td className="border border-gray-300 p-2 text-center align-middle w-[6%] bg-red-50">
        <input
          type="radio"
          name={item.id}
          checked={value?.estado === "NO_CUMPLE"}
          onChange={() => handleEstado("NO_CUMPLE")}
          className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500 cursor-pointer"
        />
      </td>
      <td className="border border-gray-300 p-2 text-center align-middle w-[6%] bg-yellow-50">
        <input
          type="radio"
          name={item.id}
          checked={value?.estado === "NA"}
          onChange={() => handleEstado("NA")}
          className="w-4 h-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
        />
      </td>
      <td className="border border-gray-300 p-2 align-middle w-[10%] bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">
            <span className="text-[9px] font-semibold text-gray-600">
              {observacionesArray.length} observación{observacionesArray.length !== 1 ? 'es' : ''}
            </span>
          </div>
          <button
            onClick={() => setShowModalObservaciones(true)}
            className="w-full px-2 py-1.5 text-[8px] font-medium bg-primary text-white rounded hover:bg-primary-hover transition-colors flex items-center justify-center gap-1 shadow-sm"
            title="Gestionar Observaciones"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Añadir
          </button>
        </div>
        
        {/* Modal de Observaciones */}
        {showModalObservaciones && (
          <ModalObservaciones
            observaciones={observacionesArray}
            onAgregar={handleAgregarObservacion}
            onEliminar={handleEliminarObservacion}
            onCerrar={() => setShowModalObservaciones(false)}
          />
        )}
      </td>
      <td className="border border-gray-300 p-2 align-middle w-[18%] bg-white">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              const anexoParam = anexoId ? `?anexo=${anexoId}` : '';
              navigate(`/anexo1/empresa/${empresaId}/item/${item.id}/evidencias${anexoParam}`);
            }}
            className="w-full px-2 py-1 text-[9px] bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
            title="Gestionar Evidencias"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Evidencias
          </button>
          <button
            onClick={() => {
              const anexoParam = anexoId ? `?anexo=${anexoId}` : '';
              navigate(`/anexo1/empresa/${empresaId}/item/${item.id}/capacitacion${anexoParam}`);
            }}
            className="w-full px-2 py-1 text-[9px] bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
            title="Crear Capacitación"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Capacitación
          </button>
          <button
            onClick={() => {
              const anexoParam = anexoId ? `?anexo=${anexoId}` : '';
              navigate(`/anexo1/empresa/${empresaId}/item/${item.id}/evaluacion${anexoParam}`);
            }}
            className="w-full px-2 py-1 text-[9px] bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
            title="Crear Evaluación"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Evaluación
          </button>
        </div>
      </td>
    </tr>
  );
}

// Componente Modal de Observaciones
function ModalObservaciones({ observaciones, onAgregar, onEliminar, onCerrar }) {
  const [nuevaObservacion, setNuevaObservacion] = useState('');

  const handleEnviar = () => {
    if (nuevaObservacion.trim()) {
      onAgregar(nuevaObservacion);
      setNuevaObservacion('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleEnviar();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Gestionar Observaciones</h2>
          <button
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de observaciones */}
        <div className="flex-1 overflow-y-auto p-6">
          {observaciones.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay observaciones registradas</p>
          ) : (
            <div className="space-y-3">
              {observaciones.map((observacion) => (
                <div
                  key={observacion.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{observacion.texto}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {observacion.fecha} • {observacion.usuario || 'admin'}
                      </p>
                    </div>
                    <button
                      onClick={() => onEliminar(observacion.id)}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                      title="Eliminar observación"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario para agregar nueva observación */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Nueva Observación
            </label>
            <textarea
              value={nuevaObservacion}
              onChange={(e) => setNuevaObservacion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escriba una nueva observación... (Ctrl+Enter para enviar)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onCerrar}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleEnviar}
                disabled={!nuevaObservacion.trim()}
                className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Enviar Observación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para sección de checklist
function SeccionChecklist({ seccion, items, respuestas, onChange, isExpanded, onToggle, empresaId, anexoId, numeroTrabajadores }) {
  return (
    <Card className="p-0 shadow-md border border-gray-200 overflow-hidden mb-6">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-primary text-white flex items-center justify-between hover:bg-primary-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <h2 className="text-[14px] font-bold uppercase tracking-wide">{seccion.titulo}</h2>
          {seccion.subtituloNorma && (
            <span className="text-[10px] text-white/80 italic ml-2">{seccion.subtituloNorma}</span>
          )}
        </div>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {items.length} ítems
        </span>
      </button>

      {isExpanded && (
        <div className="p-6">
          <table className="w-full border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm text-[11px]">
            <thead>
              <tr className="bg-primary text-white">
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[12%]"></th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[12%]"></th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[3%]">#</th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[30%]">
                  {seccion.titulo}
                </th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[6%] bg-green-600">
                  CUMPLE
                </th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[6%] bg-red-600">
                  NO CUMPLE
                </th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[6%] bg-yellow-600">
                  NO APLICA
                </th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[10%]">
                  OBSERVACIONES
                </th>
                <th className="border border-gray-300 p-2 text-[10px] font-bold w-[18%]">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <FilaChecklist
                  key={item.id}
                  item={item}
                  value={respuestas[item.id]}
                  onChange={onChange}
                  categoriaGeneral={seccion.categoriaGeneral}
                  isFirstRow={index === 0}
                  totalRows={items.length}
                  empresaId={empresaId}
                  anexoId={anexoId ? anexoId.toString() : null}
                  numeroTrabajadores={numeroTrabajadores}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default EditorAnexo1;


