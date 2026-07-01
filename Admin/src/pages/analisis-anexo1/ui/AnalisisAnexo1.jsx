import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { anexos1, calcularPorcentajeCumplimiento, calcularCumplimientoPorCategoria } from '@shared/api/mock/anexo1Data';
import { SECCIONES_SST } from '@entities/document/ui/templates/anexo1/anexo1';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AnalisisAnexo1 = ({ companies = initialCompanies }) => {
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anexoIdParam = searchParams.get('anexo');
  
  const empresa = companies.find(c => c.id === parseInt(empresaId));
  const anexosEmpresa = anexos1.filter(a => a.empresaId === parseInt(empresaId))
    .sort((a, b) => new Date(b.fechaInspeccion) - new Date(a.fechaInspeccion));
  
  // Si hay anexoId en la URL, usar ese, sino usar el más reciente
  const anexoActual = anexoIdParam 
    ? anexos1.find(a => a.id === parseInt(anexoIdParam))
    : anexosEmpresa[0];
  
  const anexoAnterior = anexoActual 
    ? anexosEmpresa.find(a => a.id !== anexoActual.id)
    : null;

  const [filtro, setFiltro] = useState('all'); // all, incumplidos, observaciones, corregidos

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md text-center">
          <p className="text-gray-500">Empresa no encontrada</p>
        </Card>
      </div>
    );
  }

  if (!anexoActual) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md text-center">
          <p className="text-gray-500 mb-4">No hay inspecciones del Anexo 1 para esta empresa</p>
          <Button
            onClick={() => navigate(`/anexo1/editor/${empresaId}`)}
            variant="primary"
          >
            Crear Primera Inspección
          </Button>
        </Card>
      </div>
    );
  }

  // Calcular porcentaje de cumplimiento general (fórmula real: CUMPLE / (CUMPLE + NO_CUMPLE))
  const porcentajeCumplimiento = useMemo(() => {
    if (!anexoActual || !anexoActual.respuestas) return 0;
    const respuestas = anexoActual.respuestas;
    const items = Object.values(respuestas);
    const cumplidos = items.filter(r => r.estado === 'CUMPLE').length;
    const noCumplidos = items.filter(r => r.estado === 'NO_CUMPLE').length;
    const total = cumplidos + noCumplidos;
    return total > 0 ? Math.round((cumplidos / total) * 100) : 0;
  }, [anexoActual]);
  
  // Calcular cumplimiento por categoría
  const cumplimientoPorCategoria = useMemo(() => {
    const categorias = {};
    SECCIONES_SST.filter(s => s.tipo === 'checklist').forEach(seccion => {
      if (seccion.items) {
        const porcentaje = calcularCumplimientoPorCategoria(
          anexoActual.respuestas || {},
          seccion.items
        );
        categorias[seccion.titulo] = porcentaje;
      }
    });
    return categorias;
  }, [anexoActual.respuestas]);

  // Ítems incumplidos
  const itemsIncumplidos = useMemo(() => {
    const items = [];
    SECCIONES_SST.forEach(seccion => {
      if (seccion.tipo === 'checklist' && seccion.items) {
        seccion.items.forEach(item => {
          const respuesta = anexoActual.respuestas?.[item.id];
          if (respuesta?.estado === 'NO_CUMPLE') {
            items.push({
              ...item,
              seccion: seccion.titulo,
              observacion: respuesta.observacion || ''
            });
          }
        });
      }
    });
    return items;
  }, [anexoActual.respuestas]);

  // Ítems con observaciones
  const itemsConObservaciones = useMemo(() => {
    const items = [];
    SECCIONES_SST.forEach(seccion => {
      if (seccion.tipo === 'checklist' && seccion.items) {
        seccion.items.forEach(item => {
          const respuesta = anexoActual.respuestas?.[item.id];
          if (respuesta?.observacion && respuesta.observacion.trim()) {
            items.push({
              ...item,
              seccion: seccion.titulo,
              observacion: respuesta.observacion,
              estado: respuesta.estado
            });
          }
        });
      }
    });
    return items;
  }, [anexoActual.respuestas]);

  // Comparar con inspección anterior
  const itemsCorregidos = useMemo(() => {
    if (!anexoAnterior) return [];
    const items = [];
    SECCIONES_SST.forEach(seccion => {
      if (seccion.tipo === 'checklist' && seccion.items) {
        seccion.items.forEach(item => {
          const respuestaAnterior = anexoAnterior.respuestas?.[item.id];
          const respuestaActual = anexoActual.respuestas?.[item.id];
          if (respuestaAnterior?.estado === 'NO_CUMPLE' && respuestaActual?.estado === 'CUMPLE') {
            items.push({
              ...item,
              seccion: seccion.titulo
            });
          }
        });
      }
    });
    return items;
  }, [anexoActual.respuestas, anexoAnterior]);

  const itemsNuevosIncumplidos = useMemo(() => {
    if (!anexoAnterior) return [];
    const items = [];
    SECCIONES_SST.forEach(seccion => {
      if (seccion.tipo === 'checklist' && seccion.items) {
        seccion.items.forEach(item => {
          const respuestaAnterior = anexoAnterior.respuestas?.[item.id];
          const respuestaActual = anexoActual.respuestas?.[item.id];
          if (respuestaAnterior?.estado === 'CUMPLE' && respuestaActual?.estado === 'NO_CUMPLE') {
            items.push({
              ...item,
              seccion: seccion.titulo,
              observacion: respuestaActual.observacion || ''
            });
          }
        });
      }
    });
    return items;
  }, [anexoActual.respuestas, anexoAnterior]);

  // Calcular porcentaje de avance
  const porcentajeAvance = useMemo(() => {
    if (!anexoAnterior) return null;
    const anterior = calcularPorcentajeCumplimiento(anexoAnterior.respuestas || {});
    const actual = calcularPorcentajeCumplimiento(anexoActual.respuestas || {});
    return actual - anterior;
  }, [anexoActual.respuestas, anexoAnterior]);

  const itemsFiltrados = useMemo(() => {
    switch (filtro) {
      case 'incumplidos':
        return itemsIncumplidos;
      case 'observaciones':
        return itemsConObservaciones;
      case 'corregidos':
        return itemsCorregidos;
      default:
        return [];
    }
  }, [filtro, itemsIncumplidos, itemsConObservaciones, itemsCorregidos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <Button
              onClick={() => navigate(`/anexo1`)}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 p-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Gestión
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <ChartIcon className="w-8 h-8 text-primary" />
              Análisis de Cumplimiento - Anexo 1
            </h1>
            <p className="text-gray-600 mt-1">{empresa.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              Fecha de inspección: {new Date(anexoActual.fechaInspeccion).toLocaleDateString('es-ES')}
            </p>
          </div>
          <Button
            onClick={() => navigate(`/anexo1/editor/${empresaId}/${anexoActual.id}`)}
            variant="primary"
          >
            Editar Anexo
          </Button>
        </div>
      </Card>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-md border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cumplimiento General</p>
              <p className="text-3xl font-bold text-primary">{porcentajeCumplimiento}%</p>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <ChartIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ítems No Cumplidos</p>
              <p className="text-3xl font-bold text-red-600">{itemsIncumplidos.length}</p>
            </div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ítems Corregidos</p>
              <p className="text-3xl font-bold text-green-600">{itemsCorregidos.length}</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </Card>

        {porcentajeAvance !== null && (
          <Card className={`p-6 shadow-md border-l-4 ${porcentajeAvance >= 0 ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avance vs. Anterior</p>
                <p className={`text-3xl font-bold ${porcentajeAvance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {porcentajeAvance >= 0 ? '+' : ''}{porcentajeAvance}%
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${porcentajeAvance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <svg className={`w-8 h-8 ${porcentajeAvance >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {porcentajeAvance >= 0 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Gráfico de cumplimiento por categoría */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cumplimiento por Categoría</h2>
        <div className="space-y-4">
          {Object.entries(cumplimientoPorCategoria).map(([categoria, porcentaje]) => (
            <div key={categoria}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{categoria}</span>
                <span className="text-sm font-bold text-primary">{porcentaje}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    porcentaje >= 80 ? 'bg-green-500' :
                    porcentaje >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-4 shadow-md">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setFiltro('all')}
            variant={filtro === 'all' ? 'primary' : 'outline'}
          >
            Todos
          </Button>
          <Button
            onClick={() => setFiltro('incumplidos')}
            variant={filtro === 'incumplidos' ? 'danger' : 'outline'}
          >
            No Cumplidos ({itemsIncumplidos.length})
          </Button>
          <Button
            onClick={() => setFiltro('observaciones')}
            variant={filtro === 'observaciones' ? 'warning' : 'outline'}
          >
            Con Observaciones ({itemsConObservaciones.length})
          </Button>
          {anexoAnterior && (
            <Button
              onClick={() => setFiltro('corregidos')}
              variant={filtro === 'corregidos' ? 'success' : 'outline'}
            >
              Corregidos ({itemsCorregidos.length})
            </Button>
          )}
        </div>
      </Card>

      {/* Tabla de ítems filtrados */}
      {filtro !== 'all' && itemsFiltrados.length > 0 && (
        <Card className="shadow-md overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {filtro === 'incumplidos' && 'Cosas a Corregir del Mes'}
              {filtro === 'observaciones' && 'Ítems con Observaciones'}
              {filtro === 'corregidos' && 'Corregido Esta Vez'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ítem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Observación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {itemsFiltrados.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.numero}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.seccion}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.texto}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.observacion || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Comparación con inspección anterior */}
      {anexoAnterior && (
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Comparación con Inspección Anterior</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Ítems Nuevos en Incumplimiento</h3>
              {itemsNuevosIncumplidos.length > 0 ? (
                <ul className="space-y-2">
                  {itemsNuevosIncumplidos.map(item => (
                    <li key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-medium text-sm text-red-800">#{item.numero} - {item.seccion}</div>
                      <div className="text-xs text-red-600 mt-1">{item.texto}</div>
                      {item.observacion && (
                        <div className="text-xs text-red-500 mt-1 italic">{item.observacion}</div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No hay nuevos ítems en incumplimiento</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Ítems Corregidos</h3>
              {itemsCorregidos.length > 0 ? (
                <ul className="space-y-2">
                  {itemsCorregidos.map(item => (
                    <li key={item.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-sm text-green-800">#{item.numero} - {item.seccion}</div>
                      <div className="text-xs text-green-600 mt-1">{item.texto}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No hay ítems corregidos</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalisisAnexo1;


