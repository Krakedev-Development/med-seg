import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Badge from '@shared/ui/atoms/Badge';
// Iconos SVG
const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AlertIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PortalEmpresa = ({ user, companies = initialCompanies, employees = initialEmployees }) => {
  const navigate = useNavigate();
  const empresaId = user?.empresaId || user?.empresa?.id;
  const empresa = companies.find(c => c.id === empresaId);

  // Datos quemados realistas
  const datosQuemados = {
    cumplimientoTotal: 42,
    itemsNoCumple: 5,
    itemsConObservaciones: 3,
    evidenciasFaltantes: 4,
    capacitacionesProgramadas: 2,
    evaluacionesPendientes: 1,
    evaluacionesCompletadas: 5,
    documentosPublicados: 12,
    representanteSST: 'Ing. Carlos Mendoza - Jefe de Seguridad'
  };

  // Ítems NO CUMPLIDOS (datos quemados)
  const itemsNoCumplidos = [
    {
      id: 'ga3',
      codigo: '1.3',
      categoria: 'Gestión Administrativa',
      pregunta: '¿Se ha socializado a todos los trabajadores la Política de Seguridad y Salud en el Trabajo?',
      estado: 'NO_CUMPLE',
      observacion: 'No existe evidencia de socialización en el último año.',
      fecha: '2025-10-10'
    },
    {
      id: 'ga7',
      codigo: '1.7',
      categoria: 'Gestión Administrativa',
      pregunta: '¿Cuenta con informe de actividades realizadas por técnico o servicio externo de seguridad e higiene del trabajo?',
      estado: 'NO_CUMPLE',
      observacion: 'El informe presentado no contiene registro fotográfico ni firmas de responsabilidad.',
      fecha: '2025-10-08'
    },
    {
      id: 'gt5',
      codigo: '2.5',
      categoria: 'Gestión Técnica',
      pregunta: '¿Cuenta con señalización de seguridad y salud en el trabajo en todas las áreas de riesgo?',
      estado: 'NO_CUMPLE',
      observacion: 'Falta evidencia fotográfica de la señalización en zona de evacuación.',
      fecha: '2025-10-05'
    },
    {
      id: 'gt8',
      codigo: '2.8',
      categoria: 'Gestión Técnica',
      pregunta: '¿Cuenta con mapa de riesgos actualizado?',
      estado: 'NO_CUMPLE',
      observacion: 'El mapa de riesgos no incluye agentes biológicos en el área de laboratorio.',
      fecha: '2025-10-03'
    },
    {
      id: 'gt12',
      codigo: '2.12',
      categoria: 'Gestión Técnica',
      pregunta: '¿Cuenta con cronograma de mantenimiento preventivo de maquinaria y equipos?',
      estado: 'NO_CUMPLE',
      observacion: 'No se ha actualizado el cronograma de mantenimiento preventivo en los últimos 6 meses.',
      fecha: '2025-09-28'
    }
  ];

  // Observaciones Críticas (datos quemados)
  const observacionesCriticas = [
    {
      id: 'ga5',
      codigo: '1.5',
      categoria: 'Gestión Administrativa',
      pregunta: '¿Cuenta con el registro del Técnico de Seguridad e Higiene del Trabajo en la Plataforma SUT?',
      estado: 'CUMPLE',
      observacion: 'El registro está vigente pero requiere actualización de datos de contacto.',
      fecha: '2025-10-12',
      prioridad: 'media'
    },
    {
      id: 'vs3',
      codigo: '3.3',
      categoria: 'Vigilancia de la Salud',
      pregunta: '¿Cuenta con fichas médicas ocupacionales actualizadas para todos los trabajadores?',
      estado: 'CUMPLE',
      observacion: 'Faltan 3 fichas médicas de trabajadores que ingresaron en el último mes.',
      fecha: '2025-10-15',
      prioridad: 'alta'
    }
  ];

  // Capacitaciones Próximas (datos quemados)
  const capacitacionesProximas = [
    {
      id: 1,
      nombre: 'Uso adecuado de Equipos de Protección Personal',
      fecha: '2025-11-20',
      hora: '09:00',
      responsable: 'Ing. Pérez',
      modalidad: 'Presencial',
      trabajadoresAsignados: 15
    },
    {
      id: 2,
      nombre: 'Riesgos Psicosociales – Taller introductorio',
      fecha: '2025-11-28',
      hora: '14:00',
      responsable: 'Psic. Martínez',
      modalidad: 'Virtual',
      trabajadoresAsignados: 20
    }
  ];

  // Capacitaciones Historial (datos quemados)
  const capacitacionesHistorial = [
    {
      id: 3,
      nombre: 'Inducción general SST – Octubre 2025',
      fecha: '2025-10-15',
      estado: 'Finalizada',
      participantes: 25
    },
    {
      id: 4,
      nombre: 'Manipulación segura de sustancias químicas',
      fecha: '2025-09-20',
      estado: 'Finalizada',
      participantes: 12
    }
  ];

  // Evaluaciones Pendientes (datos quemados)
  const evaluacionesPendientes = [
    {
      id: 1,
      nombre: 'Seguridad en Minería Subterránea',
      preguntas: 10,
      fechaLimite: '2025-02-19',
      respondidas: 1,
      total: 5,
      porcentaje: 20
    }
  ];

  // Evaluaciones Completadas (datos quemados)
  const evaluacionesCompletadas = [
    {
      id: 2,
      nombre: 'Prevención de Riesgos Psicosociales',
      promedio: 87,
      totalRespuestas: 18
    },
    {
      id: 3,
      nombre: 'Uso de EPP',
      promedio: 100,
      totalRespuestas: 22
    },
    {
      id: 4,
      nombre: 'Primeros Auxilios',
      promedio: 92,
      totalRespuestas: 15
    }
  ];

  // Documentos Publicados (datos quemados)
  const documentosPublicados = [
    {
      id: 1,
      nombre: 'Acta de Inspección - Octubre 2025',
      categoria: 'Inspecciones',
      fecha: '2025-10-15',
      estado: 'Publicado',
      archivo: null
    },
    {
      id: 2,
      nombre: 'Ficha Médica del Personal - Septiembre 2025',
      categoria: 'Fichas Médicas',
      fecha: '2025-09-30',
      estado: 'Publicado',
      archivo: null
    },
    {
      id: 3,
      nombre: 'Inducción Octubre 2025',
      categoria: 'Inducciones',
      fecha: '2025-10-15',
      estado: 'Publicado',
      archivo: null
    },
    {
      id: 4,
      nombre: 'Informe Psicosocial - Tercer Trimestre',
      categoria: 'Informes',
      fecha: '2025-10-01',
      estado: 'Publicado',
      archivo: null
    },
    {
      id: 5,
      nombre: 'Acta de Correctivos - Área de Producción',
      categoria: 'Actas',
      fecha: '2025-10-10',
      estado: 'Pendiente',
      archivo: null
    },
    {
      id: 6,
      nombre: 'Reglamento Interno de Seguridad',
      categoria: 'Documentos Generales',
      fecha: '2025-09-15',
      estado: 'Publicado',
      archivo: null
    },
    {
      id: 7,
      nombre: 'Plan de Emergencia y Evacuación',
      categoria: 'Planes',
      fecha: '2025-08-20',
      estado: 'Publicado',
      archivo: null
    },
    {
      id: 8,
      nombre: 'Mapa de Riesgos Actualizado',
      categoria: 'Gestión Técnica',
      fecha: '2025-10-05',
      estado: 'Publicado',
      archivo: null
    }
  ];

  const handleVerDetalleItem = (itemId) => {
    alert(`Ver detalle del ítem ${itemId}. En producción, esto abriría una vista detallada.`);
  };

  const handleSubirEvidencia = (itemId) => {
    alert(`Subir evidencia para el ítem ${itemId}. En producción, esto abriría el formulario de carga.`);
  };

  const handleVerRecomendacion = (itemId) => {
    alert(`Ver recomendación para el ítem ${itemId}. En producción, esto mostraría recomendaciones del técnico.`);
  };

  const handleVerAnexo1Completo = () => {
    alert('Vista de Anexo 1 completo en modo solo lectura. En producción, esto abriría el Anexo 1 con colores: Verde (Cumple), Amarillo (Observación), Rojo (No cumple).');
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
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado del Portal de Empresa */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{empresa.name}</h1>
              <div className="flex items-center gap-6 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <BuildingIcon className="w-4 h-4 text-gray-400" />
                  <span>RUC: {empresa.ruc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📋</span>
                  <span>Actividad: {empresa.tipoActividad || empresa.type || 'N/A'}</span>
                </div>
                {datosQuemados.representanteSST && (
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>{datosQuemados.representanteSST}</span>
                  </div>
                )}
              </div>
            </div>
            {empresa.logo && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-white p-2 border border-gray-200">
                <img src={empresa.logo} alt={empresa.name} className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Panel de Indicadores Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cumplimiento Anexo 1</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.cumplimientoTotal}%</p>
              </div>
              <ChartIcon className="w-10 h-10 text-primary" />
            </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ítems NO CUMPLE</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.itemsNoCumple}</p>
              </div>
              <XCircleIcon className="w-10 h-10 text-red-500" />
            </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Con Observaciones</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.itemsConObservaciones}</p>
              </div>
              <AlertIcon className="w-10 h-10 text-yellow-500" />
            </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Evidencias Faltantes</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.evidenciasFaltantes}</p>
              </div>
              <FileIcon className="w-10 h-10 text-orange-500" />
            </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Capacitaciones Programadas</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.capacitacionesProgramadas}</p>
              </div>
              <CalendarIcon className="w-10 h-10 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Evaluaciones Pendientes</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.evaluacionesPendientes}</p>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-purple-500" />
            </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Evaluaciones Completadas</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.evaluacionesCompletadas}</p>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Documentos Publicados</p>
                <p className="text-3xl font-bold text-gray-800">{datosQuemados.documentosPublicados}</p>
              </div>
              <FileIcon className="w-10 h-10 text-indigo-500" />
            </div>
          </Card>
        </div>

        {/* Bloque: Ítems NO CUMPLIDOS */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <XCircleIcon className="w-6 h-6 text-red-500" />
              Ítems que NO Cumplen
            </h2>
            <Button
              variant="ghost"
              onClick={handleVerAnexo1Completo}
              className="text-sm text-primary hover:text-primary-dark font-medium p-0"
            >
              Ver Anexo 1 con Observaciones y Avances
            </Button>
          </div>
          <div className="space-y-3">
            {itemsNoCumplidos.map((item) => (
              <div key={item.id} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4 hover:bg-red-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">Código: {item.codigo}</span>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">{item.categoria}</span>
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">❌ No Cumple</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-2">{item.pregunta}</p>
                    <p className="text-sm text-gray-700 italic bg-white p-2 rounded">"{item.observacion}"</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-red-200">
                  <span className="text-xs text-gray-600">Fecha: {new Date(item.fecha).toLocaleDateString('es-ES')}</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerDetalleItem(item.id)}
                      className="text-xs px-3 py-1 bg-gray-600 text-white hover:bg-gray-700"
                    >
                      Ver detalle
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleSubirEvidencia(item.id)}
                      className="text-xs px-3 py-1"
                    >
                      Subir evidencia
                    </Button>
                    <Button
                      onClick={() => handleVerRecomendacion(item.id)}
                      className="text-xs px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Ver recomendación
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bloque: Observaciones Críticas */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertIcon className="w-6 h-6 text-yellow-500" />
            Observaciones Críticas
          </h2>
          <div className="space-y-3">
            {observacionesCriticas.map((obs) => (
              <div key={obs.id} className={`border-l-4 ${obs.prioridad === 'alta' ? 'border-orange-500 bg-orange-50' : 'border-yellow-500 bg-yellow-50'} rounded-lg p-4 hover:bg-opacity-80 transition-colors`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-bold rounded">Código: {obs.codigo}</span>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">{obs.categoria}</span>
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">✓ Cumple</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-2">{obs.pregunta}</p>
                    <p className="text-sm text-gray-700 italic bg-white p-2 rounded">"{obs.observacion}"</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-yellow-200">
                  <span className="text-xs text-gray-600">Fecha: {new Date(obs.fecha).toLocaleDateString('es-ES')}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleSubirEvidencia(obs.id)}
                      className="text-xs px-3 py-1"
                    >
                      Subir evidencia
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Capacitaciones */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Capacitaciones</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximas Capacitaciones */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Próximas Capacitaciones
              </h3>
              {capacitacionesProximas.length > 0 ? (
                <div className="space-y-3">
                  {capacitacionesProximas.map((cap) => (
                    <div key={cap.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-800 mb-2">{cap.nombre}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(cap.fecha).toLocaleDateString('es-ES')} • {cap.hora}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          <span>Responsable: {cap.responsable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📋</span>
                          <span>Modalidad: {cap.modalidad}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{cap.trabajadoresAsignados} trabajador(es) asignado(s)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay capacitaciones programadas</p>
              )}
            </div>

            {/* Historial de Capacitaciones */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                Historial de Capacitaciones
              </h3>
              {capacitacionesHistorial.length > 0 ? (
                <div className="space-y-3">
                  {capacitacionesHistorial.map((cap) => (
                    <div key={cap.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-800 mb-2">{cap.nombre}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Realizada: {new Date(cap.fecha).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">{cap.estado}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{cap.participantes} participante(s)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay capacitaciones finalizadas</p>
              )}
            </div>
          </div>
        </Card>

        {/* Evaluaciones */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Evaluaciones</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evaluaciones Pendientes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <AlertIcon className="w-5 h-5 text-orange-500" />
                Evaluaciones Pendientes
              </h3>
              {evaluacionesPendientes.length > 0 ? (
                <div className="space-y-3">
                  {evaluacionesPendientes.map((evaluacion) => (
                    <div key={evaluacion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-800 mb-2">{evaluacion.nombre}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span>📝</span>
                          <span>Preguntas: {evaluacion.preguntas}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Fecha límite: {new Date(evaluacion.fechaLimite).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Progreso:</span>
                          <span className="font-medium">{evaluacion.respondidas} de {evaluacion.total} trabajadores ha respondido ({evaluacion.porcentaje}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${evaluacion.porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay evaluaciones pendientes</p>
              )}
            </div>

            {/* Evaluaciones Completadas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                Evaluaciones Completadas
              </h3>
              {evaluacionesCompletadas.length > 0 ? (
                <div className="space-y-3">
                  {evaluacionesCompletadas.map((evaluacion) => (
                    <div key={evaluacion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-800 mb-2">{evaluacion.nombre}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Total respuestas:</span>
                          <span className="font-medium">{evaluacion.totalRespuestas}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Promedio:</span>
                          <span className={`font-bold text-lg ${
                            evaluacion.promedio >= 90 ? 'text-green-600' :
                            evaluacion.promedio >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {evaluacion.promedio}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay evaluaciones completadas</p>
              )}
            </div>
          </div>
        </Card>

        {/* Documentos Publicados */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileIcon className="w-6 h-6 text-primary" />
            Documentos Publicados
          </h2>
          {documentosPublicados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Documento</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Categoría</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documentosPublicados.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800">{doc.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.categoria}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(doc.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={doc.estado === 'Publicado' ? 'green' : 'yellow'}>
                          {doc.estado}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              if (doc.archivo) {
                                window.open(doc.archivo, '_blank');
                              } else {
                                alert('Vista previa del documento');
                              }
                            }}
                            className="p-2 text-primary hover:bg-primary-light"
                            title="Ver"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              if (doc.archivo) {
                                const link = document.createElement('a');
                                link.href = doc.archivo;
                                link.download = doc.nombre;
                                link.click();
                              } else {
                                alert('Descarga del documento');
                              }
                            }}
                            className="p-2 text-primary hover:bg-primary-light"
                            title="Descargar"
                          >
                            <DownloadIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay documentos publicados disponibles</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PortalEmpresa;
