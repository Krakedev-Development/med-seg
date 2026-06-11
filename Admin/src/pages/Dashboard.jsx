import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { anexos1, calcularPorcentajeCumplimiento } from '../data/anexo1Data';
import { capacitaciones } from '../data/capacitacionesData';
import { evaluaciones } from '../data/evaluacionesData';
import { respuestasEvaluaciones } from '../data/evaluacionesData';
import { evidencias } from '../data/evidenciasData';

// Iconos SVG
const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClipboardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Dashboard = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const navigate = useNavigate();

  // Datos mock para el dashboard
  const dashboardData = useMemo(() => {
    // Calcular cumplimiento promedio
    let cumplimientoTotal = 0;
    let anexosConRespuestas = 0;
    anexos1.forEach(anexo => {
      if (anexo.respuestas && Object.keys(anexo.respuestas).length > 0) {
        cumplimientoTotal += calcularPorcentajeCumplimiento(anexo.respuestas);
        anexosConRespuestas++;
      }
    });
    const cumplimientoPromedio = anexosConRespuestas > 0 
      ? Math.round(cumplimientoTotal / anexosConRespuestas) 
      : 0;

    // Evidencias esta semana (mock)
    const evidenciasEstaSemana = 12;

    // Evaluaciones respondidas esta semana (mock)
    const evaluacionesRespondidasSemana = 8;

    // Capacitaciones próximas (próximos 30 días)
    const hoy = new Date();
    const proximos30Dias = new Date();
    proximos30Dias.setDate(hoy.getDate() + 30);

    const capacitacionesProximas = capacitaciones
      .filter(cap => {
        const fechaCap = new Date(cap.fechaProgramada);
        return fechaCap >= hoy && fechaCap <= proximos30Dias && cap.estado === 'Programada';
      })
      .sort((a, b) => new Date(a.fechaProgramada) - new Date(b.fechaProgramada))
      .slice(0, 5)
      .map(cap => {
        const fechaCap = new Date(cap.fechaProgramada);
        const diffHoras = (fechaCap - hoy) / (1000 * 60 * 60);
        let estado = 'Próximas este mes';
        if (diffHoras <= 24) estado = 'Próxima en 24 horas';
        else if (diffHoras <= 72) estado = 'Próximas en 72 horas';

        const empresa = companies.find(e => 
          (cap.empresaId && e.id === cap.empresaId) || 
          (cap.empresasAsignadas && cap.empresasAsignadas.includes(e.id))
        );

        return {
          ...cap,
          empresaNombre: empresa?.name || 'N/A',
          estadoTiempo: estado,
          trabajadoresInscritos: cap.trabajadoresAsignados?.length || 0
        };
      });

    // Evaluaciones abiertas
    const evaluacionesAbiertas = evaluaciones
      .filter(evaluacion => evaluacion.estado === 'Activa' && evaluacion.fechaLimite)
      .map(evaluacion => {
        const empresa = companies.find(e => e.id === evaluacion.empresaId);
        const respuestasEval = respuestasEvaluaciones.filter(r => r.evaluacionId === evaluacion.id);
        const respondidas = respuestasEval.filter(r => r.estado === 'Respondida').length;
        const total = evaluacion.trabajadoresAsignados?.length || respuestasEval.length || 0;
        const porcentaje = total > 0 ? Math.round((respondidas / total) * 100) : 0;

        return {
          ...evaluacion,
          empresaNombre: empresa?.name || 'N/A',
          totalTrabajadores: total,
          respondidas,
          porcentajeAvance: porcentaje
        };
      })
      .slice(0, 5);

    // Últimos resultados enviados
    const ultimosResultados = respuestasEvaluaciones
      .filter(r => r.estado === 'Respondida')
      .sort((a, b) => new Date(b.fechaRespuesta || 0) - new Date(a.fechaRespuesta || 0))
      .slice(0, 5)
      .map(resp => {
        const trabajador = employees.find(e => e.id === resp.trabajadorId);
        const empresa = companies.find(e => e.id === resp.empresaId);
        const evaluacion = evaluaciones.find(e => e.id === resp.evaluacionId);

        // Calcular calificación
        let calificacion = null;
        if (evaluacion && evaluacion.preguntas && resp.respuestas) {
          let correctas = 0;
          let total = 0;
          resp.respuestas.forEach(r => {
            const pregunta = evaluacion.preguntas.find(p => p.id === r.preguntaId);
            if (pregunta && pregunta.tipo === 'opcion-multiple') {
              total++;
              if (r.esCorrecta) correctas++;
            }
          });
          if (total > 0) {
            calificacion = Math.round((correctas / total) * 10 * 10) / 10;
          }
        }

        return {
          trabajadorNombre: trabajador ? `${trabajador.names || trabajador.firstName || ''} ${trabajador.lastNames || trabajador.lastName || ''}`.trim() : 'N/A',
          empresaNombre: empresa?.name || 'N/A',
          evaluacionNombre: evaluacion?.nombre || 'N/A',
          calificacion,
          fecha: resp.fechaRespuesta,
          respuestaId: resp.id
        };
      });

    // Actividad reciente (mock)
    const actividadReciente = [
      { tipo: 'capacitacion', texto: 'Capacitación "Seguridad en Minería" creada', empresa: 'Minería del Sur S.A.', fecha: new Date(Date.now() - 2 * 60 * 60 * 1000), icon: '🎓' },
      { tipo: 'evaluacion', texto: 'Evaluación "Manejo de Maquinaria" creada', empresa: 'Agroindustria Norte', fecha: new Date(Date.now() - 5 * 60 * 60 * 1000), icon: '📝' },
      { tipo: 'evidencia', texto: 'Evidencia subida para ítem #5 del Anexo 1', empresa: 'Construcciones XYZ', fecha: new Date(Date.now() - 8 * 60 * 60 * 1000), icon: '📎' },
      { tipo: 'inspeccion', texto: 'Inspección Anexo 1 iniciada', empresa: 'Transportes Rápidos', fecha: new Date(Date.now() - 12 * 60 * 60 * 1000), icon: '🔍' },
      { tipo: 'inspeccion', texto: 'Inspección Anexo 1 publicada', empresa: 'Servicios Integrales', fecha: new Date(Date.now() - 24 * 60 * 60 * 1000), icon: '✅' },
      { tipo: 'documento', texto: 'Documento "Ficha Médica" subido', empresa: 'Salud Ocupacional Plus', fecha: new Date(Date.now() - 36 * 60 * 60 * 1000), icon: '📄' },
      { tipo: 'trabajador', texto: 'Nuevo trabajador registrado', empresa: 'Minería del Sur S.A.', fecha: new Date(Date.now() - 48 * 60 * 60 * 1000), icon: '👤' },
    ];

    // Datos para gráficos (mock)
    const capacitacionesPorMes = [
      { mes: 'Ene', cantidad: 5 },
      { mes: 'Feb', cantidad: 8 },
      { mes: 'Mar', cantidad: 12 },
      { mes: 'Abr', cantidad: 10 },
      { mes: 'May', cantidad: 15 },
      { mes: 'Jun', cantidad: 18 },
    ];

    const cumplimientoPorMes = [
      { mes: 'Ene', porcentaje: 65 },
      { mes: 'Feb', porcentaje: 72 },
      { mes: 'Mar', porcentaje: 78 },
      { mes: 'Abr', porcentaje: 82 },
      { mes: 'May', porcentaje: 85 },
      { mes: 'Jun', porcentaje: 88 },
    ];

    return {
      totalEmpresas: companies.length,
      totalTrabajadores: employees.length,
      totalInspecciones: anexos1.length,
      cumplimientoPromedio,
      evidenciasEstaSemana,
      evaluacionesRespondidasSemana,
      capacitacionesProximas,
      evaluacionesAbiertas,
      ultimosResultados,
      actividadReciente,
      capacitacionesPorMes,
      cumplimientoPorMes
    };
  }, [companies, employees]);

  const stats = [
    {
      title: 'Total de Empresas',
      value: dashboardData.totalEmpresas,
      icon: BuildingIcon,
      color: 'bg-info',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Total Trabajadores',
      value: dashboardData.totalTrabajadores,
      icon: UsersIcon,
      color: 'bg-success',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Total Inspecciones Anexo 1',
      value: dashboardData.totalInspecciones,
      icon: ClipboardIcon,
      color: 'bg-secondary',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Cumplimiento Promedio',
      value: `${dashboardData.cumplimientoPromedio}%`,
      icon: ChartIcon,
      color: dashboardData.cumplimientoPromedio >= 80 ? 'bg-success' : 
             dashboardData.cumplimientoPromedio >= 50 ? 'bg-warning' : 'bg-error',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Evidencias Esta Semana',
      value: dashboardData.evidenciasEstaSemana,
      icon: FileIcon,
      color: 'bg-primary',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Evaluaciones Respondidas',
      value: dashboardData.evaluacionesRespondidasSemana,
      icon: CheckCircleIcon,
      color: 'bg-success',
      bgColor: 'bg-gray-50'
    },
  ];

  const getEstadoBadge = (estado) => {
    const estados = {
      'Próxima en 24 horas': 'bg-error text-white border-error',
      'Próximas en 72 horas': 'bg-warning text-white border-warning',
      'Próximas este mes': 'bg-info text-white border-info'
    };
    return estados[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} días`;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard - Gestión SST</h1>
        <p className="text-gray-600 mt-1">Vista general del sistema de Seguridad y Salud en el Trabajo</p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Principal: 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario de Capacitaciones Próximas */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Capacitaciones Próximas
            </h2>
            <button
              onClick={() => navigate('/anexo1')}
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.capacitacionesProximas.length > 0 ? (
              dashboardData.capacitacionesProximas.map((cap, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{cap.nombre}</h3>
                      <p className="text-sm text-gray-600">{cap.empresaNombre}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getEstadoBadge(cap.estadoTiempo)}`}>
                      {cap.estadoTiempo}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(cap.fechaProgramada).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    {cap.hora && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{cap.hora}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      <span>{cap.trabajadoresInscritos} trabajadores</span>
                    </div>
                    {cap.responsable && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">👤</span>
                        <span className="truncate">Responsable</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay capacitaciones programadas</p>
            )}
          </div>
        </div>

        {/* Evaluaciones Abiertas */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardIcon className="w-6 h-6 text-primary" />
              Evaluaciones Abiertas
            </h2>
            <button
              onClick={() => navigate('/anexo1')}
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.evaluacionesAbiertas.length > 0 ? (
              dashboardData.evaluacionesAbiertas.map((evaluacion, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{evaluacion.nombre}</h3>
                      <p className="text-sm text-gray-600">{evaluacion.empresaNombre}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fecha límite:</span>
                      <span className="font-medium text-gray-800">
                        {new Date(evaluacion.fechaLimite).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progreso:</span>
                      <span className="font-medium text-gray-800">
                        {evaluacion.respondidas} / {evaluacion.totalTrabajadores} ({evaluacion.porcentajeAvance}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${evaluacion.porcentajeAvance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay evaluaciones abiertas</p>
            )}
          </div>
        </div>
      </div>

      {/* Últimos Resultados Enviados */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircleIcon className="w-6 h-6 text-primary" />
          Últimos Resultados Enviados
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trabajador</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Evaluación</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Calificación</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.ultimosResultados.map((resultado, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{resultado.trabajadorNombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{resultado.empresaNombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{resultado.evaluacionNombre}</td>
                  <td className="px-4 py-3 text-center">
                    {resultado.calificacion !== null ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        resultado.calificacion >= 7 ? 'bg-success text-white' :
                        resultado.calificacion >= 5 ? 'bg-warning text-white' :
                        'bg-error text-white'
                      }`}>
                        {resultado.calificacion}/10
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {resultado.fecha ? new Date(resultado.fecha).toLocaleString('es-ES') : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        const empresa = companies.find(e => e.name === resultado.empresaNombre);
                        if (empresa) {
                          navigate(`/anexo1/empresa/${empresa.id}/resultados`);
                        }
                      }}
                      className="text-primary hover:text-primary-hover text-sm font-medium"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid Inferior: Gráficos y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 1: Capacitaciones por Mes */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Capacitaciones Programadas</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {dashboardData.capacitacionesPorMes.map((item, idx) => {
              const maxValue = Math.max(...dashboardData.capacitacionesPorMes.map(i => i.cantidad));
              const height = (item.cantidad / maxValue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                    <div
                      className="w-full bg-primary rounded-t-lg hover:bg-primary-hover transition-colors cursor-pointer"
                      style={{ height: `${height}%`, minHeight: '8px' }}
                      title={`${item.cantidad} capacitaciones`}
                    ></div>
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-600">{item.mes}</span>
                  <span className="text-xs text-gray-500">{item.cantidad}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico 2: Cumplimiento Promedio */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Cumplimiento Promedio Anexo 1</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {dashboardData.cumplimientoPorMes.map((item, idx) => {
              const height = item.porcentaje;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                    <div
                      className={`w-full rounded-t-lg transition-colors cursor-pointer ${
                        height >= 80 ? 'bg-success' :
                        height >= 50 ? 'bg-warning' :
                        'bg-error'
                      }`}
                      style={{ height: `${height}%`, minHeight: '8px' }}
                      title={`${item.porcentaje}%`}
                    ></div>
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-600">{item.mes}</span>
                  <span className="text-xs text-gray-500">{item.porcentaje}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {dashboardData.actividadReciente.map((actividad, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="text-2xl flex-shrink-0">{actividad.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{actividad.texto}</p>
                  <p className="text-xs text-gray-600 mt-1">{actividad.empresa}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(actividad.fecha)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
