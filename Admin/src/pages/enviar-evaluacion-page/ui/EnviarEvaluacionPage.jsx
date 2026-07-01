import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { evaluaciones, respuestasEvaluaciones } from '@shared/api/mock/evaluacionesData';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const EnviarEvaluacionPage = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { evaluacionId, empresaId } = useParams();
  const navigate = useNavigate();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [fechaLimite, setFechaLimite] = useState('');
  const [usarFechaLimite, setUsarFechaLimite] = useState(false);
  const [enviarPorCorreo, setEnviarPorCorreo] = useState(true);

  const evaluacion = useMemo(() => {
    return evaluaciones.find(e => e.id === parseInt(evaluacionId));
  }, [evaluacionId]);

  // Empleados de la empresa seleccionada
  const empleadosEmpresa = useMemo(() => {
    if (!empresaSeleccionada) return [];
    return employees.filter(emp => emp.companyId === empresaSeleccionada.id);
  }, [empresaSeleccionada, employees]);

  // Empleados filtrados por búsqueda
  const empleadosFiltrados = useMemo(() => {
    if (!empresaSeleccionada) return [];
    if (!busquedaEmpleado.trim()) return empleadosEmpresa;
    
    const busqueda = busquedaEmpleado.toLowerCase().trim();
    return empleadosEmpresa.filter(emp => {
      const nombreCompleto = `${emp.firstName || emp.names || ''} ${emp.lastName || emp.lastNames || ''}`.toLowerCase();
      return nombreCompleto.includes(busqueda) || 
             emp.dni?.includes(busqueda) ||
             emp.cedula?.includes(busqueda) ||
             emp.email?.toLowerCase().includes(busqueda) ||
             emp.position?.toLowerCase().includes(busqueda);
    });
  }, [empresaSeleccionada, busquedaEmpleado, empleadosEmpresa]);

  const handleSeleccionarEmpleado = (empleado) => {
    if (!empleadosSeleccionados.find(e => e.id === empleado.id)) {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleado]);
    }
  };

  const handleDeseleccionarEmpleado = (empleadoId) => {
    setEmpleadosSeleccionados(empleadosSeleccionados.filter(e => e.id !== empleadoId));
  };

  const handleMarcarTodos = () => {
    if (empleadosSeleccionados.length === empleadosFiltrados.length) {
      setEmpleadosSeleccionados([]);
    } else {
      setEmpleadosSeleccionados([...empleadosFiltrados]);
    }
  };

  const handleEnviar = () => {
    if (!empresaSeleccionada) {
      alert('Debe seleccionar una empresa');
      return;
    }
    if (empleadosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un empleado');
      return;
    }
    if (usarFechaLimite && !fechaLimite) {
      alert('Debe ingresar una fecha límite');
      return;
    }

    // Cambiar estado de la evaluación de "Borrador" a "Activa"
    if (evaluacion.estado === 'Borrador') {
      const index = evaluaciones.findIndex(e => e.id === evaluacion.id);
      if (index !== -1) {
        evaluaciones[index].estado = 'Activa';
      }
    }

    // Crear respuestas pendientes para cada empleado
    const nuevasRespuestas = empleadosSeleccionados.map((empleado, index) => ({
      id: Date.now() + index,
      evaluacionId: evaluacion.id,
      trabajadorId: empleado.id,
      empresaId: empresaSeleccionada.id,
      fechaRespuesta: null,
      estado: 'Pendiente',
      respuestas: [],
      calificacion: null,
      porcentaje: null,
      fechaLimite: usarFechaLimite ? fechaLimite : null
    }));

    // Agregar a respuestasEvaluaciones
    respuestasEvaluaciones.push(...nuevasRespuestas);
    
    // Simular envío de correo si está habilitado
    if (enviarPorCorreo) {
      const correosEnviados = empleadosSeleccionados.map(emp => emp.email).filter(Boolean);
      
      if (correosEnviados.length > 0) {
        console.log('Correos enviados a:', correosEnviados);
        alert(`Evaluación enviada a ${empleadosSeleccionados.length} empleado(s) y notificaciones por correo enviadas a ${correosEnviados.length} empleado(s)`);
      } else {
        alert(`Evaluación enviada a ${empleadosSeleccionados.length} empleado(s). No se encontraron correos electrónicos para enviar notificaciones.`);
      }
    } else {
      alert(`Evaluación enviada a ${empleadosSeleccionados.length} empleado(s)`);
    }
    
    navigate(`/anexo1/empresa/${empresaId}/evaluaciones`);
  };

  const getNombreCompleto = (emp) => {
    return `${emp.firstName || emp.names || ''} ${emp.lastName || emp.lastNames || ''}`.trim();
  };

  if (!evaluacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 shadow-md">
          <p className="text-gray-500">Evaluación no encontrada</p>
        </Card>
      </div>
    );
  }

  // No permitir enviar si está finalizada
  if (evaluacion.estado === 'Finalizada') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md shadow-md text-center">
          <svg className="w-16 h-16 text-orange-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Evaluación Finalizada</h2>
          <p className="text-gray-600 mb-4">Esta evaluación ya ha sido finalizada y no se puede enviar a más empleados.</p>
          <Button
            onClick={() => navigate(`/anexo1/empresa/${empresaId}/evaluaciones`)}
            variant="primary"
          >
            Volver a Evaluaciones
          </Button>
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
              variant="ghost"
              onClick={() => navigate(`/anexo1/empresa/${empresaId}/evaluaciones`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors px-0 py-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Evaluaciones
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Enviar Evaluación</h1>
            <p className="text-gray-600 mt-1">{evaluacion.nombre}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo - Configuración */}
        <div className="lg:col-span-1 space-y-6">
          {/* Selección de Empresa */}
          <Card className="p-6 shadow-md">
            <FormField label="Empresa">
              <Select
                value={empresaSeleccionada?.id || ''}
                onChange={(e) => {
                  const empresa = companies.find(c => c.id === parseInt(e.target.value));
                  setEmpresaSeleccionada(empresa || null);
                  setEmpleadosSeleccionados([]);
                  setBusquedaEmpleado('');
                }}
              >
                <option value="">Seleccione una empresa</option>
                {companies.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>{empresa.name}</option>
                ))}
              </Select>
            </FormField>
          </Card>

          {/* Configuración adicional */}
          {empresaSeleccionada && (
            <Card className="p-6 shadow-md space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Configuración</h2>
              
              {/* Fecha Límite */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="usarFechaLimite"
                    checked={usarFechaLimite}
                    onChange={(e) => setUsarFechaLimite(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="usarFechaLimite" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Establecer fecha límite
                  </label>
                </div>
                {usarFechaLimite && (
                  <Input
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}
              </div>

              {/* Envío por correo */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="enviarPorCorreo"
                    checked={enviarPorCorreo}
                    onChange={(e) => setEnviarPorCorreo(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="enviarPorCorreo" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Enviar notificación por correo
                  </label>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Se enviará un correo a los empleados seleccionados
                </p>
              </div>

              {/* Resumen */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total empleados:</span>
                    <span className="font-semibold">{empleadosEmpresa.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seleccionados:</span>
                    <span className="font-semibold text-primary">{empleadosSeleccionados.length}</span>
                  </div>
                  {enviarPorCorreo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Con correo:</span>
                      <span className="font-semibold">
                        {empleadosSeleccionados.filter(e => e.email).length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Panel derecho - Lista de empleados */}
        <div className="lg:col-span-2">
          {empresaSeleccionada ? (
            <Card className="p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Empleados de {empresaSeleccionada.name}
                </h2>
                <Button
                  variant="ghost"
                  onClick={handleMarcarTodos}
                  className="text-sm px-2 py-1"
                >
                  {empleadosSeleccionados.length === empleadosFiltrados.length ? 'Desmarcar todos' : 'Marcar todos'}
                </Button>
              </div>

              {/* Buscador */}
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar empleado por nombre, DNI, correo o cargo..."
                  value={busquedaEmpleado}
                  onChange={(e) => setBusquedaEmpleado(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabla de empleados */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          <input
                            type="checkbox"
                            checked={empleadosFiltrados.length > 0 && empleadosSeleccionados.length === empleadosFiltrados.length}
                            onChange={handleMarcarTodos}
                            className="w-4 h-4 text-primary"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Empleado</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cargo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Correo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">DNI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {empleadosFiltrados.length > 0 ? (
                        empleadosFiltrados.map(empleado => {
                          const estaSeleccionado = empleadosSeleccionados.some(e => e.id === empleado.id);
                          return (
                            <tr
                              key={empleado.id}
                              className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                                estaSeleccionado ? 'bg-primary-light' : ''
                              }`}
                              onClick={() => estaSeleccionado ? handleDeseleccionarEmpleado(empleado.id) : handleSeleccionarEmpleado(empleado)}
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={estaSeleccionado}
                                  onChange={() => {}}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 text-primary"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{getNombreCompleto(empleado)}</div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {empleado.position || 'Sin cargo'}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {empleado.email ? (
                                  <span className="text-gray-900">{empleado.email}</span>
                                ) : (
                                  <span className="text-gray-400 italic">Sin correo</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {empleado.dni || empleado.cedula || '-'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                            {busquedaEmpleado ? 'No se encontraron empleados' : 'No hay empleados en esta empresa'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lista de correos seleccionados */}
              {enviarPorCorreo && empleadosSeleccionados.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Correos que recibirán la notificación ({empleadosSeleccionados.filter(e => e.email).length}):
                  </h3>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {empleadosSeleccionados.map(emp => (
                      <div key={emp.id} className="text-sm text-gray-700 flex items-center gap-2">
                        {emp.email ? (
                          <>
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{emp.email}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            <span className="text-gray-500 italic">{getNombreCompleto(emp)} (sin correo)</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 text-center shadow-md">
              <BuildingIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Seleccione una empresa para ver los empleados</p>
            </Card>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <Card className="p-6 shadow-md">
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => navigate(`/anexo1/empresa/${empresaId}/evaluaciones`)}
            variant="outline"
            className="px-6 py-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEnviar}
            disabled={!empresaSeleccionada || empleadosSeleccionados.length === 0}
            variant="primary"
            className="px-8 py-2"
          >
            {evaluacion.estado === 'Borrador' ? 'Enviar y Activar Evaluación' : 'Enviar Evaluación'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnviarEvaluacionPage;

