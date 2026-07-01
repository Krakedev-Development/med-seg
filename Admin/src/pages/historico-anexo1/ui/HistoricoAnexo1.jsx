import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { anexos1, calcularPorcentajeCumplimiento } from '@shared/api/mock/anexo1Data';
import { evidencias, getEvidenciasByEmpresa } from '@shared/api/mock/evidenciasData';
import { capacitaciones } from '@shared/api/mock/capacitacionesData';
import { evaluaciones } from '@shared/api/mock/evaluacionesData';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ClipboardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const HistoricoAnexo1 = ({ companies = initialCompanies }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  
  const empresaIdNum = parseInt(empresaId);
  const empresa = companies.find(c => c.id === empresaIdNum);
  const anexosEmpresa = anexos1
    .filter(a => a.empresaId === empresaIdNum)
    .sort((a, b) => new Date(b.fechaInspeccion) - new Date(a.fechaInspeccion));

  // Obtener información del ítem
  const getItemInfo = (itemId) => {
    if (!itemId) return { numero: 'N/A', texto: 'Sin ítem' };
    for (const seccion of SECCIONES_SST) {
      if (seccion.tipo === 'checklist' && seccion.items) {
        const item = seccion.items.find(i => i.id === itemId);
        if (item) {
          return { ...item, seccion: seccion.titulo };
        }
      }
    }
    return { numero: 'N/A', texto: 'Ítem no encontrado' };
  };

  // Crear línea de tiempo con todos los eventos
  const lineaTiempo = useMemo(() => {
    const eventos = [];

    // Agregar inspecciones
    anexosEmpresa.forEach(anexo => {
      eventos.push({
        tipo: 'inspeccion',
        fecha: anexo.fechaInspeccion,
        titulo: `Inspección Anexo 1`,
        descripcion: `Inspección realizada con ${calcularPorcentajeCumplimiento(anexo.respuestas || {})}% de cumplimiento`,
        estado: anexo.estado,
        anexoId: anexo.id,
        porcentaje: calcularPorcentajeCumplimiento(anexo.respuestas || {})
      });
    });

    // Agregar evidencias agrupadas por fecha e ítem
    const evidenciasEmpresa = getEvidenciasByEmpresa(empresaIdNum);
    const evidenciasPorFecha = {};
    
    evidenciasEmpresa.forEach(evidencia => {
      const fecha = evidencia.fechaSubida || new Date().toISOString().split('T')[0];
      if (!evidenciasPorFecha[fecha]) {
        evidenciasPorFecha[fecha] = {};
      }
      if (!evidenciasPorFecha[fecha][evidencia.itemId || 'sin-item']) {
        evidenciasPorFecha[fecha][evidencia.itemId || 'sin-item'] = [];
      }
      evidenciasPorFecha[fecha][evidencia.itemId || 'sin-item'].push(evidencia);
    });

    Object.entries(evidenciasPorFecha).forEach(([fecha, items]) => {
      Object.entries(items).forEach(([itemId, evidenciasItem]) => {
        const itemInfo = getItemInfo(itemId);
        eventos.push({
          tipo: 'evidencia',
          fecha: fecha,
          titulo: `Carga de archivos - Ítem #${itemInfo.numero}`,
          descripcion: `${evidenciasItem.length} archivo${evidenciasItem.length > 1 ? 's' : ''} subido${evidenciasItem.length > 1 ? 's' : ''} para el ítem "${itemInfo.texto.substring(0, 50)}${itemInfo.texto.length > 50 ? '...' : ''}"`,
          cantidad: evidenciasItem.length,
          itemId: itemId,
          itemInfo: itemInfo
        });
      });
    });

    // Agregar capacitaciones
    capacitaciones
      .filter(cap => {
        const tieneEmpresa = cap.empresasAsignadas?.includes(empresaIdNum) || cap.empresaId === empresaIdNum;
        return tieneEmpresa && (cap.estado === 'Programada' || cap.estado === 'En curso');
      })
      .forEach(cap => {
        eventos.push({
          tipo: 'capacitacion',
          fecha: cap.fechaProgramada,
          titulo: `Capacitación programada`,
          descripcion: `${cap.nombre} - ${cap.estado}`,
          capacitacion: cap
        });
      });

    // Agregar evaluaciones
    evaluaciones
      .filter(evaluacion => {
        const tieneEmpresa = evaluacion.empresasAsignadas?.includes(empresaIdNum) || evaluacion.empresaId === empresaIdNum;
        return tieneEmpresa && evaluacion.estado === 'Activa';
      })
      .forEach(evaluacion => {
        eventos.push({
          tipo: 'evaluacion',
          fecha: evaluacion.fechaCreacion,
          titulo: `Evaluación enviada`,
          descripcion: `${evaluacion.nombre}`,
          evaluacion: evaluacion
        });
      });

    // Ordenar por fecha descendente
    return eventos.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaB - fechaA;
    });
  }, [empresaIdNum, anexosEmpresa]);

  const getEventoIcono = (tipo) => {
    switch (tipo) {
      case 'inspeccion':
        return <HistoryIcon className="w-5 h-5" />;
      case 'evidencia':
        return <FileIcon className="w-5 h-5" />;
      case 'capacitacion':
        return <BookIcon className="w-5 h-5" />;
      case 'evaluacion':
        return <ClipboardIcon className="w-5 h-5" />;
      default:
        return <HistoryIcon className="w-5 h-5" />;
    }
  };

  const getEventoColor = (tipo) => {
    switch (tipo) {
      case 'inspeccion':
        return 'bg-blue-100 text-blue-600 border-blue-300';
      case 'evidencia':
        return 'bg-green-100 text-green-600 border-green-300';
      case 'capacitacion':
        return 'bg-purple-100 text-purple-600 border-purple-300';
      case 'evaluacion':
        return 'bg-orange-100 text-orange-600 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md text-center">
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
            <Button
              onClick={() => navigate(`/anexo1/empresa/${empresaId}/estado`)}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 p-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Estado General
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <HistoryIcon className="w-8 h-8 text-primary" />
              Historial de Inspecciones - Anexo 1
            </h1>
            <p className="text-gray-600 mt-1">{empresa.name}</p>
          </div>
        </div>
      </Card>

      {/* Línea de Tiempo */}
      {lineaTiempo.length > 0 ? (
        <Card className="p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-primary" />
            Línea de Tiempo de Actividades
          </h2>
          
          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              {lineaTiempo.map((evento, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  {/* Punto en la línea */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${getEventoColor(evento.tipo)} border-2 flex items-center justify-center`}>
                    {getEventoIcono(evento.tipo)}
                  </div>
                  
                  {/* Contenido del evento */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventoColor(evento.tipo)}`}>
                            {evento.tipo === 'inspeccion' ? 'Inspección' :
                             evento.tipo === 'evidencia' ? 'Evidencia' :
                             evento.tipo === 'capacitacion' ? 'Capacitación' :
                             'Evaluación'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(evento.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">{evento.titulo}</h3>
                        <p className="text-sm text-gray-600">{evento.descripcion}</p>
                        
                        {/* Información adicional según el tipo */}
                        {evento.tipo === 'inspeccion' && evento.porcentaje !== undefined && (
                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">Cumplimiento:</span>
                              <span className={`text-sm font-bold ${
                                evento.porcentaje >= 80 ? 'text-green-600' :
                                evento.porcentaje >= 50 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {evento.porcentaje}%
                              </span>
                            </div>
                            {evento.anexoId && (
                              <Button
                                onClick={() => navigate(`/anexo1/editor/${empresaId}/${evento.anexoId}`)}
                                variant="outline"
                                className="!py-1 !px-3 text-xs"
                              >
                                Ver detalles →
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {evento.tipo === 'evidencia' && evento.cantidad && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-600">
                              {evento.cantidad} archivo{evento.cantidad > 1 ? 's' : ''} en total
                            </span>
                          </div>
                        )}
                        
                        {evento.tipo === 'capacitacion' && evento.capacitacion && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                            <span>Modalidad: {evento.capacitacion.modalidad || 'N/A'}</span>
                            {evento.capacitacion.hora && (
                              <span>• Hora: {evento.capacitacion.hora}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-12 shadow-md text-center">
          <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            No hay actividades en el historial
          </p>
          <p className="text-gray-500 text-sm">
            Las actividades aparecerán aquí cuando se realicen inspecciones, se suban evidencias, se programen capacitaciones o se envíen evaluaciones
          </p>
        </Card>
      )}
    </div>
  );
};

export default HistoricoAnexo1;
