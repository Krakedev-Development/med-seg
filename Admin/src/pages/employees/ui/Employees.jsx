import { useState, useEffect, useRef } from 'react';
import EmployeeForm from '@entities/employee/ui/EmployeeForm';
import { historialMigraciones } from '@shared/api/mock/migracionesData';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';

// Iconos simples SVG
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const UserPlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-6-3a3 3 0 11-6 0 3 3 0 016 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);
const Trash2Icon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const EditIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);
const ArrowsLeftRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7m-2-4l-4 4m0 0l4 4m-4-4h14" />
  </svg>
);
const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const Spinner = () => (
  <div className="h-7 w-7 border-2 border-secondary-light border-t-primary rounded-full animate-spin" />
);

const Employees = ({ employees, setEmployees, companies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationTargetCompanyId, setMigrationTargetCompanyId] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [motivoMigracion, setMotivoMigracion] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStep, setMigrationStep] = useState('Selecciona trabajadores para migrar');
  const migrationIntervalRef = useRef(null);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [empleadoHistorial, setEmpleadoHistorial] = useState(null);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      `${employee.names} ${employee.lastNames}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.dni.includes(searchTerm) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = selectedCompany === 'all' || employee.companyId === parseInt(selectedCompany);
    
    return matchesSearch && matchesCompany;
  });

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ));
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('¿Está seguro de eliminar este trabajador?')) {
      setEmployees(employees.filter(employee => employee.id !== id));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const filteredEmployeeIds = filteredEmployees.map((emp) => emp.id);
  const allVisibleSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((emp) => selectedEmployeeIds.includes(emp.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedEmployeeIds((prev) =>
        prev.filter((id) => !filteredEmployeeIds.includes(id))
      );
    } else {
      setSelectedEmployeeIds((prev) =>
        Array.from(new Set([...prev, ...filteredEmployeeIds]))
      );
    }
  };

  const selectedEmployees = employees.filter((emp) =>
    selectedEmployeeIds.includes(emp.id)
  );

  const targetCompany = companies.find(
    (company) => company.id === parseInt(migrationTargetCompanyId, 10)
  );

  const canStartMigration =
    selectedEmployeeIds.length > 0 && migrationTargetCompanyId && fechaSalida && !isMigrating;

  const resetMigrationState = () => {
    if (migrationIntervalRef.current) {
      clearInterval(migrationIntervalRef.current);
      migrationIntervalRef.current = null;
    }
    setShowMigrationModal(false);
    setMigrationTargetCompanyId('');
    setFechaSalida('');
    setMotivoMigracion('');
    setMigrationProgress(0);
    setMigrationStep('Selecciona trabajadores para migrar');
    setIsMigrating(false);
  };

  const handleStartMigration = () => {
    if (!canStartMigration) return;

    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationStep('Preparando información de trabajadores...');

    const steps = [
      { progress: 30, text: 'Validando datos y compatibilidad...' },
      { progress: 60, text: 'Trasladando legajos al nuevo entorno...' },
      { progress: 85, text: 'Reasignando responsables y credenciales...' },
      { progress: 100, text: '¡Migración completada con éxito!' },
    ];

    let currentStep = 0;
    migrationIntervalRef.current = setInterval(() => {
      const step = steps[currentStep];
      setMigrationProgress(step.progress);
      setMigrationStep(step.text);
      currentStep += 1;

      if (currentStep === steps.length) {
        if (migrationIntervalRef.current) {
          clearInterval(migrationIntervalRef.current);
          migrationIntervalRef.current = null;
        }

        setTimeout(() => {
          const fechaMigracion = new Date().toISOString().split('T')[0];
          
          // Guardar historial de migraciones
          selectedEmployees.forEach((emp) => {
            const nuevaMigracion = {
              id: Date.now() + Math.random(),
              empleadoId: emp.id,
              empresaOrigenId: emp.companyId,
              empresaDestinoId: parseInt(migrationTargetCompanyId, 10),
              fechaMigracion: fechaMigracion,
              fechaSalida: fechaSalida || fechaMigracion,
              motivo: motivoMigracion || 'Migración de personal',
              realizadoPor: 'admin', // En producción sería el usuario actual
              notas: `Migrado de ${getCompanyName(emp.companyId)} a ${getCompanyName(parseInt(migrationTargetCompanyId, 10))}`
            };
            historialMigraciones.push(nuevaMigracion);
          });

          // Actualizar empleados
          setEmployees((prev) =>
            prev.map((emp) =>
              selectedEmployeeIds.includes(emp.id)
                ? { 
                    ...emp, 
                    companyId: parseInt(migrationTargetCompanyId, 10),
                    fechaSalida: fechaSalida || emp.fechaSalida
                  }
                : emp
            )
          );
          setIsMigrating(false);
          setMigrationProgress(100);
          setMigrationStep('Migración completada');
          setSelectedEmployeeIds([]);

          setTimeout(() => {
            resetMigrationState();
          }, 1200);
        }, 600);
      }
    }, 1100);
  };

  const handleCloseMigrationModal = () => {
    if (isMigrating) return;
    resetMigrationState();
  };

  const handleRemoveFromSelection = (employeeId) => {
    setSelectedEmployeeIds((prev) => prev.filter((id) => id !== employeeId));
  };

  useEffect(() => {
    return () => {
      if (migrationIntervalRef.current) {
        clearInterval(migrationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setSelectedEmployeeIds((prev) =>
      prev.filter((id) => employees.some((emp) => emp.id === id))
    );
  }, [employees]);

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Desconocida';
  };

  const handleVerHistorial = (employee) => {
    setEmpleadoHistorial(employee);
    setShowHistorialModal(true);
  };

  const getHistorialEmpleado = (empleadoId) => {
    return historialMigraciones
      .filter(m => m.empleadoId === empleadoId)
      .sort((a, b) => new Date(b.fechaMigracion) - new Date(a.fechaMigracion));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Trabajadores
            {selectedEmployeeIds.length > 0 && (
              <span className="text-sm font-semibold bg-secondary-light text-primary-dark px-3 py-1 rounded-full">
                {selectedEmployeeIds.length} seleccionados
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus colaboradores y reasígnalos ágilmente entre empresas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowMigrationModal(true)}
            variant={selectedEmployeeIds.length > 0 ? "primary" : "outline"}
            className={`flex items-center gap-2 ${
              selectedEmployeeIds.length > 0
                ? 'bg-gradient-to-r from-primary via-primary-dark to-secondary text-white hover:from-primary-dark hover:via-primary-dark hover:to-secondary-dark'
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            <ArrowsLeftRightIcon className="w-5 h-5" />
            Migrar Trabajadores
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <UserPlusIcon className="w-5 h-5" />
            {showForm ? 'Ocultar Formulario' : 'Nuevo Trabajador'}
          </Button>
        </div>
      </div>

      {showForm && (
        <EmployeeForm 
          onAddEmployee={handleAddEmployee}
          onUpdateEmployee={handleUpdateEmployee}
          companies={companies}
          employees={employees}
          editingEmployee={editingEmployee}
          onCancel={handleCancelForm} 
        />
      )}

      {/* Filtros y búsqueda */}
      <Card className="p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Buscar por nombre, cédula o cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
          />
          <Select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            icon={<FilterIcon className="w-5 h-5 text-gray-400" />}
          >
            <option value="all">Todas las empresas</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Tabla de trabajadores */}
      <Card className="shadow-md overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAllVisible}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cédula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Historial
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron trabajadores
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEmployeeIds.includes(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.names} {employee.lastNames}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.dni}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.position || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getCompanyName(employee.companyId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditEmployee(employee)}
                          variant="outline"
                          className="p-2 flex items-center justify-center text-primary hover:text-primary-dark transition-colors"
                          title="Editar trabajador"
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          variant="outline"
                          className="p-2 flex items-center justify-center text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar trabajador"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => handleVerHistorial(employee)}
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 p-0"
                        title="Ver historial de migraciones"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Historial
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showMigrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-surface via-secondary-light/60 to-surface">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Migrar trabajadores entre empresas</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Elige la empresa destino y observa la simulación de traslado para los colaboradores seleccionados.
                </p>
              </div>
              <button
                onClick={handleCloseMigrationModal}
                disabled={isMigrating}
                className={`p-2 rounded-full transition-colors ${
                  isMigrating
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                title={isMigrating ? 'Espera a que finalice la migración' : 'Cerrar'}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Trabajadores seleccionados
                    </h3>
                    <span className="text-xs font-semibold text-primary-dark bg-secondary-light px-2 py-1 rounded-full">
                      {selectedEmployeeIds.length} colaboradores
                    </span>
                  </div>
                  {selectedEmployees.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 text-sm bg-white rounded-lg border border-dashed border-gray-300">
                      Selecciona uno o más trabajadores desde la tabla para migrarlos a otra empresa.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {selectedEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {emp.names} {emp.lastNames}
                            </p>
                            <p className="text-xs text-gray-500">
                              Cédula: {emp.dni} • Empresa actual: {getCompanyName(emp.companyId)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveFromSelection(emp.id)}
                            disabled={isMigrating}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Empresa destino
                  </h3>
                  <select
                    value={migrationTargetCompanyId}
                    onChange={(e) => setMigrationTargetCompanyId(e.target.value)}
                    disabled={isMigrating}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    <option value="">Seleccione una empresa</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  {targetCompany && (
                    <div className="bg-white border border-secondary-light rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-800">{targetCompany.name}</p>
                      <p className="text-xs text-gray-500">RUC: {targetCompany.ruc}</p>
                      <p className="text-xs text-gray-500">Dirección: {targetCompany.address}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700">
                      Fecha de Salida *
                    </label>
                    <input
                      type="date"
                      value={fechaSalida}
                      onChange={(e) => setFechaSalida(e.target.value)}
                      disabled={isMigrating}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Motivo de Migración
                    </label>
                    <textarea
                      value={motivoMigracion}
                      onChange={(e) => setMotivoMigracion(e.target.value)}
                      disabled={isMigrating}
                      rows={3}
                      placeholder="Ej: Reasignación por cambio de proyecto, promoción, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white resize-none"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    La reasignación es una simulación visual para validar el proceso antes de aplicar cambios reales.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-dark via-primary to-secondary rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  {isMigrating ? <Spinner /> : <ArrowsLeftRightIcon className="w-6 h-6" />}
                  <div>
                    <p className="text-sm uppercase tracking-wide font-semibold">Estado de la migración</p>
                    <p className="text-base font-medium">{migrationStep}</p>
                  </div>
                </div>
                <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-white/90 rounded-full transition-all duration-500"
                    style={{ width: `${migrationProgress}%` }}
                  />
                </div>
                <div className="mt-2 text-right text-xs font-semibold tracking-wider">
                  {migrationProgress}% completado
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Haz clic en “Iniciar migración” para simular la reubicación de los colaboradores seleccionados.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseMigrationModal}
                  disabled={isMigrating}
                  className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors ${
                    isMigrating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStartMigration}
                  disabled={!canStartMigration}
                  className={`px-5 py-2 rounded-lg font-semibold shadow-md transition-colors ${
                    canStartMigration
                      ? 'bg-gradient-to-r from-primary-dark via-primary to-secondary text-white hover:from-primary-dark hover:via-primary-dark hover:to-secondary-dark'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isMigrating ? 'Migrando...' : 'Iniciar migración'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial de Migraciones */}
      {showHistorialModal && empleadoHistorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary via-primary-dark to-secondary">
              <div>
                <h2 className="text-2xl font-bold text-white">Historial de Migraciones</h2>
                <p className="text-sm text-white/90 mt-1">
                  {empleadoHistorial.names} {empleadoHistorial.lastNames} - {empleadoHistorial.dni}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowHistorialModal(false);
                  setEmpleadoHistorial(null);
                }}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {getHistorialEmpleado(empleadoHistorial.id).length > 0 ? (
                <div className="space-y-4">
                  {getHistorialEmpleado(empleadoHistorial.id).map((migracion, index) => {
                    const empresaOrigen = companies.find(c => c.id === migracion.empresaOrigenId);
                    const empresaDestino = companies.find(c => c.id === migracion.empresaDestinoId);
                    
                    return (
                      <div
                        key={migracion.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                Migración #{index + 1}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(migracion.fechaMigracion).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            Completada
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Empresa Origen</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {empresaOrigen?.name || 'Desconocida'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Fecha de Salida: {new Date(migracion.fechaSalida).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-primary/20">
                            <p className="text-xs text-gray-500 mb-1">Empresa Destino</p>
                            <p className="text-sm font-semibold text-primary">
                              {empresaDestino?.name || 'Desconocida'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Fecha de Migración: {new Date(migracion.fechaMigracion).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>

                        {migracion.motivo && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200 mb-2">
                            <p className="text-xs text-gray-500 mb-1">Motivo</p>
                            <p className="text-sm text-gray-800">{migracion.motivo}</p>
                          </div>
                        )}

                        {migracion.notas && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Notas</p>
                            <p className="text-sm text-gray-700">{migracion.notas}</p>
                          </div>
                        )}

                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Realizado por: {migracion.realizadoPor} • 
                            ID Migración: {migracion.id.toString().slice(-6)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-semibold">No hay historial de migraciones</p>
                  <p className="text-sm mt-1">Este empleado no ha sido migrado aún</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => {
                  setShowHistorialModal(false);
                  setEmpleadoHistorial(null);
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

