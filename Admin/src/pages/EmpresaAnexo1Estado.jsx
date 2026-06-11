import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { getDocumentosByEmpresa } from '../data/documentosDinamicosData';
import { getEvidenciasByEmpresa } from '../data/evidenciasData';
import { getDocumentsInSituByEmpresa } from '../data/anexo1Data';
import { capacitaciones } from '../data/capacitacionesData';
import { evaluaciones, respuestasEvaluaciones } from '../data/evaluacionesData';
import { filtrarSeccionesPorEmpresa, obtenerConfiguracionEmpresa } from '../utils/anexo1Filtros';
import { SECCIONES_SST } from '../components/documentos/anexo1/anexo1';

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

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BookOpenIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ClipboardCheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const EmpresaAnexo1Estado = ({ companies = initialCompanies }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();

  const empresaIdNum = parseInt(empresaId);
  const empresa = companies.find(c => c.id === empresaIdNum);
  
  // Configuración de empresa para filtrado dinámico
  const configEmpresa = useMemo(() => {
    if (!empresa) return null;
    return obtenerConfiguracionEmpresa({
      ...empresa,
      employees: initialEmployees.filter(e => e.companyId === empresaIdNum)
    });
  }, [empresa, empresaIdNum]);
  
  // Secciones filtradas según la empresa
  const seccionesFiltradas = useMemo(() => {
    if (!configEmpresa) return [];
    return filtrarSeccionesPorEmpresa(SECCIONES_SST, configEmpresa);
  }, [configEmpresa]);
  
  // Calcular total de ítems aplicables
  const totalItemsAplicables = useMemo(() => {
    return seccionesFiltradas
      .filter(s => s.tipo === 'checklist')
      .reduce((total, seccion) => total + (seccion.items?.length || 0), 0);
  }, [seccionesFiltradas]);
  
  // Datos quemados para la barra de progreso
  const datosProgreso = useMemo(() => {
    // Datos quemados realistas
    return {
      totalItemsAplicables: 52,
      itemsCumple: 31,
      itemsNoCumple: 12,
      itemsConObservaciones: 9,
      itemsNoAplica: 0, // No se cuentan en el total
      porcentajeCumplimiento: 59 // Calculado: (31 / (31 + 12)) * 100 = 72%, pero usamos 59% como dato quemado
    };
  }, []);
  
  // Ítems faltantes (datos quemados)
  const itemsFaltantes = useMemo(() => {
    return [
      { codigo: '1.3', texto: 'Falta socialización de la política de SST' },
      { codigo: '3.2', texto: 'No se encontró el mapa de riesgos actualizado' },
      { codigo: '5.4', texto: 'Sin evidencia de medición de agentes físicos' },
      { codigo: '7.1', texto: 'No hay informe de medidas de prevención implementadas' }
    ];
  }, []);
  
  // Calcular ítems ocultos
  const itemsOcultos = useMemo(() => {
    const totalItemsOriginales = SECCIONES_SST
      .filter(s => s.tipo === 'checklist')
      .reduce((total, seccion) => total + (seccion.items?.length || 0), 0);
    return totalItemsOriginales - totalItemsAplicables;
  }, [totalItemsAplicables]);
  
  // Datos de empleados
  const empleados = useMemo(() => {
    return initialEmployees.filter(e => e.companyId === empresaIdNum);
  }, [empresaIdNum]);

  // Documentos realizados
  const documentosRealizados = useMemo(() => {
    const documentosDinamicos = getDocumentosByEmpresa(empresaIdNum);
    const evidencias = getEvidenciasByEmpresa(empresaIdNum);
    const documentosInSitu = getDocumentsInSituByEmpresa(empresaIdNum);
    return documentosDinamicos.length + evidencias.length + documentosInSitu.length;
  }, [empresaIdNum]);

  // Capacitaciones programadas o en curso
  const capacitacionesEmpresa = useMemo(() => {
    return capacitaciones.filter(cap => {
      // Filtrar por empresa asignada o por empresaId
      const tieneEmpresa = cap.empresasAsignadas?.includes(empresaIdNum) || cap.empresaId === empresaIdNum;
      const estaProgramadaOEnCurso = cap.estado === 'Programada' || cap.estado === 'En curso';
      return tieneEmpresa && estaProgramadaOEnCurso;
    });
  }, [empresaIdNum]);

  // Evaluaciones disponibles y completadas
  const evaluacionesEmpresa = useMemo(() => {
    const evaluacionesDisponibles = evaluaciones.filter(evaluacion => {
      const tieneEmpresa = evaluacion.empresasAsignadas?.includes(empresaIdNum) || evaluacion.empresaId === empresaIdNum;
      return tieneEmpresa && evaluacion.estado === 'Activa';
    });

    // Obtener respuestas de evaluaciones para esta empresa
    const respuestas = respuestasEvaluaciones.filter(resp => {
      const evaluacion = evaluaciones.find(e => e.id === resp.evaluacionId);
      if (!evaluacion) return false;
      const tieneEmpresa = evaluacion.empresasAsignadas?.includes(empresaIdNum) || evaluacion.empresaId === empresaIdNum;
      return tieneEmpresa && resp.completada;
    });

    // Calcular promedio de puntajes
    const puntajes = respuestas.map(r => r.puntaje || 0).filter(p => p > 0);
    const promedioPuntaje = puntajes.length > 0 
      ? Math.round(puntajes.reduce((sum, p) => sum + p, 0) / puntajes.length)
      : 0;

    return {
      disponibles: evaluacionesDisponibles.length,
      completadas: respuestas.length,
      promedioPuntaje
    };
  }, [empresaIdNum]);

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">Empresa no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card Principal: Datos de la Empresa */}
      <div className="bg-primary rounded-lg border border-gray-200 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {empresa.logo && (
                <div className="flex-shrink-0">
                  <img 
                    src={empresa.logo} 
                    alt="Logo" 
                    className="w-20 h-20 object-contain bg-white rounded-lg p-2" 
                  />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold mb-2">{empresa.name}</h2>
                <div className="flex flex-wrap gap-4 text-white text-sm">
                  <div className="flex items-center gap-2">
                    <BuildingIcon className="w-5 h-5" />
                    <span>RUC: {empresa.ruc}</span>
                  </div>
                  {empresa.tipoActividad && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-800 rounded-full">
                        {empresa.tipoActividad}
                      </span>
                    </div>
                  )}
                  {empresa.address && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{empresa.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra de Progreso del Anexo 1 */}
        <div className="mt-6 bg-gray-800 rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1 text-white">Cumplimiento del Anexo 1</h3>
              <p className="text-gray-200 text-sm">
                {datosProgreso.itemsCumple} de {datosProgreso.totalItemsAplicables} ítems cumplidos
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{datosProgreso.porcentajeCumplimiento}%</p>
              <p className="text-gray-200 text-xs">Cumplimiento total</p>
            </div>
          </div>
          
          {/* Barra de progreso visual */}
          <div className="w-full h-8 bg-gray-700 rounded-full overflow-hidden flex mb-4">
            <div 
              className="bg-success h-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(datosProgreso.itemsCumple / datosProgreso.totalItemsAplicables) * 100}%` }}
            >
              {datosProgreso.itemsCumple} Cumple
            </div>
            <div 
              className="bg-warning h-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(datosProgreso.itemsConObservaciones / datosProgreso.totalItemsAplicables) * 100}%` }}
            >
              {datosProgreso.itemsConObservaciones} Observado
            </div>
            <div 
              className="bg-error h-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(datosProgreso.itemsNoCumple / datosProgreso.totalItemsAplicables) * 100}%` }}
            >
              {datosProgreso.itemsNoCumple} No Cumple
            </div>
          </div>
          
          {/* Resumen de ítems */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700 rounded-md p-3">
              <p className="text-2xl font-bold text-white">{datosProgreso.totalItemsAplicables}</p>
              <p className="text-xs text-gray-200">Ítems Aplicables</p>
            </div>
            <div className="bg-success rounded-md p-3">
              <p className="text-2xl font-bold text-white">{datosProgreso.itemsCumple}</p>
              <p className="text-xs text-white">Cumple</p>
            </div>
            <div className="bg-warning rounded-md p-3">
              <p className="text-2xl font-bold text-white">{datosProgreso.itemsConObservaciones}</p>
              <p className="text-xs text-white">Observado</p>
            </div>
            <div className="bg-error rounded-md p-3">
              <p className="text-2xl font-bold text-white">{datosProgreso.itemsNoCumple}</p>
              <p className="text-xs text-white">No Cumple</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bloque: ¿Qué falta por cumplir? */}
      <div className="bg-white rounded-lg p-6 border border-red-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          ¿Qué falta por cumplir?
        </h3>
        <div className="space-y-2">
          {itemsFaltantes.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-error">
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex-shrink-0">
                {item.codigo}
              </span>
              <p className="text-sm text-gray-800 flex-1">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Información de ítems dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ítems Aplicables (Dinámicos)</h3>
          <p className="text-4xl font-bold text-primary mb-2">{totalItemsAplicables}</p>
          <p className="text-sm text-gray-600">
            Total de ítems que aplican para esta empresa según su configuración
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ítems Ocultos por No Aplicar</h3>
          <p className="text-4xl font-bold text-gray-500 mb-2">{itemsOcultos}</p>
          <p className="text-sm text-gray-600">
            Ítems que no aplican para esta empresa y no se muestran en el checklist
          </p>
        </div>
      </div>

      {/* Grid de Cards Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Número de Empleados */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">Número de Empleados</p>
          <p className="text-4xl font-bold text-primary mb-2">{empleados.length}</p>
          <p className="text-xs text-gray-500">Trabajadores activos</p>
        </div>

        {/* Documentos Realizados */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-success transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <DocumentIcon className="w-6 h-6 text-success" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">Documentos Realizados</p>
          <p className="text-4xl font-bold text-success mb-2">{documentosRealizados}</p>
          <p className="text-xs text-gray-500">Total de documentos</p>
        </div>

        {/* Capacitaciones */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-secondary transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-secondary" />
            </div>
            {capacitacionesEmpresa.length > 0 && (
              <span className="px-3 py-1 bg-secondary text-white rounded-md text-xs font-semibold">
                {capacitacionesEmpresa.filter(c => c.estado === 'En curso').length > 0 ? 'En Curso' : 'Programadas'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">Capacitaciones</p>
          <p className="text-4xl font-bold text-secondary mb-2">{capacitacionesEmpresa.length}</p>
          <p className="text-xs text-gray-500">
            {capacitacionesEmpresa.length === 0 
              ? 'Sin capacitaciones activas'
              : capacitacionesEmpresa.filter(c => c.estado === 'En curso').length > 0
                ? `${capacitacionesEmpresa.filter(c => c.estado === 'En curso').length} en curso`
                : `${capacitacionesEmpresa.length} programadas`
            }
          </p>
        </div>

        {/* Evaluaciones */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-warning transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ClipboardCheckIcon className="w-6 h-6 text-warning" />
            </div>
            {evaluacionesEmpresa.disponibles > 0 && (
              <span className="px-3 py-1 bg-warning text-white rounded-md text-xs font-semibold">
                Disponibles
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">Evaluaciones</p>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-warning">
              {evaluacionesEmpresa.disponibles}
            </p>
            {evaluacionesEmpresa.completadas > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">
                  Completadas: <span className="font-semibold text-gray-800">{evaluacionesEmpresa.completadas}</span>
                </p>
                {evaluacionesEmpresa.promedioPuntaje > 0 && (
                  <p className="text-xs text-gray-600">
                    Promedio: <span className="font-semibold text-gray-800">{evaluacionesEmpresa.promedioPuntaje}%</span>
                  </p>
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {evaluacionesEmpresa.disponibles === 0 
              ? 'Sin evaluaciones disponibles'
              : evaluacionesEmpresa.completadas > 0
                ? `${evaluacionesEmpresa.completadas} de ${evaluacionesEmpresa.disponibles} completadas`
                : 'Ninguna completada aún'
            }
          </p>
        </div>
      </div>

      {/* Detalle de Capacitaciones */}
      {capacitacionesEmpresa.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-6 h-6 text-secondary" />
            Capacitaciones Activas
          </h3>
          <div className="space-y-3">
            {capacitacionesEmpresa.map(cap => (
              <div 
                key={cap.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{cap.nombre}</p>
                  <p className="text-sm text-gray-600 mt-1">{cap.descripcion}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Fecha: {new Date(cap.fechaProgramada).toLocaleDateString('es-ES')}</span>
                    {cap.modalidad && <span>Modalidad: {cap.modalidad}</span>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  cap.estado === 'En curso' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {cap.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalle de Evaluaciones */}
      {evaluacionesEmpresa.disponibles > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardCheckIcon className="w-6 h-6 text-warning" />
            Evaluaciones Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-md p-4 border border-warning">
              <p className="text-sm text-gray-600 mb-1">Total Disponibles</p>
              <p className="text-3xl font-bold text-warning">{evaluacionesEmpresa.disponibles}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4 border border-success">
              <p className="text-sm text-gray-600 mb-1">Completadas</p>
              <p className="text-3xl font-bold text-success">{evaluacionesEmpresa.completadas}</p>
            </div>
            {evaluacionesEmpresa.promedioPuntaje > 0 && (
              <div className="bg-gray-50 rounded-md p-4 border border-info">
                <p className="text-sm text-gray-600 mb-1">Promedio de Puntaje</p>
                <p className="text-3xl font-bold text-info">{evaluacionesEmpresa.promedioPuntaje}%</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaAnexo1Estado;
