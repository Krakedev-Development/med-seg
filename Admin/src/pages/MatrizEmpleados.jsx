import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { getDocumentosByEmpresa } from '../data/documentosDinamicosData';

const MatrizEmpleados = ({ companies = initialCompanies, employees = initialEmployees }) => {
  const { empresaId } = useParams();
  const [busqueda, setBusqueda] = useState('');

  const empresaIdNum = parseInt(empresaId);
  const empresa = companies.find(c => c.id === empresaIdNum);
  
  // Obtener empleados de la empresa
  const empleadosEmpresa = useMemo(() => {
    return employees.filter(e => e.companyId === empresaIdNum);
  }, [empresaIdNum, employees]);

  // Obtener documentos dinámicos de fichas médicas
  const documentosFichasMedicas = useMemo(() => {
    const todosDocumentos = getDocumentosByEmpresa(empresaIdNum);
    return todosDocumentos.filter(doc => 
      doc.tipo === 'ficha-medica' || 
      doc.tipo === 'Ficha Médica' ||
      (doc.datos && doc.datos.tipo === 'ficha-medica')
    );
  }, [empresaIdNum]);

  // Filtrar empleados por búsqueda
  const empleadosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return empleadosEmpresa;
    
    const busquedaLower = busqueda.toLowerCase().trim();
    return empleadosEmpresa.filter(emp => {
      const nombres = `${emp.firstName || emp.names || ''} ${emp.lastName || emp.lastNames || ''}`.toLowerCase();
      const cedula = (emp.cedula || emp.dni || '').toLowerCase();
      return nombres.includes(busquedaLower) || cedula.includes(busquedaLower);
    });
  }, [empleadosEmpresa, busqueda]);

  // Función para obtener la última ficha médica de un empleado
  const obtenerUltimaFichaMedica = (empleadoId) => {
    const fichasEmpleado = documentosFichasMedicas
      .filter(doc => doc.empleadoId === empleadoId)
      .sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0));
    
    return fichasEmpleado.length > 0 ? fichasEmpleado[0] : null;
  };

  // Obtener datos de la ficha médica para la matriz
  const obtenerDatosFichaMedica = (ficha) => {
    if (!ficha || !ficha.datos) return {};
    return ficha.datos;
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

  // Definir columnas de la matriz (basadas en el formulario de fichas médicas)
  const columnas = [
    // Información básica del empleado
    { id: 'nro', label: '#', width: '60px', sticky: true },
    { id: 'cedula', label: 'Cédula', width: '120px', sticky: true },
    { id: 'nombre', label: 'Nombre Completo', width: '200px', sticky: true },
    { id: 'puesto', label: 'Puesto de Trabajo', width: '180px' },
    { id: 'sexo', label: 'Sexo', width: '80px' },
    { id: 'edad', label: 'Edad', width: '80px' },
    
    // Datos de la ficha médica - Sección A
    { id: 'numeroHistoriaClinica', label: 'N° Historia Clínica', width: '150px' },
    { id: 'numeroArchivo', label: 'N° Archivo', width: '120px' },
    { id: 'fechaInicioLabores', label: 'Fecha Inicio Labores', width: '140px' },
    { id: 'fechaSalida', label: 'Fecha Salida', width: '120px' },
    { id: 'tiempoMeses', label: 'Tiempo (Meses)', width: '130px' },
    
    // Constantes Vitales - Sección C
    { id: 'presionArterial', label: 'Presión Arterial', width: '130px' },
    { id: 'temperatura', label: 'Temperatura', width: '110px' },
    { id: 'frecuenciaCardiaca', label: 'Frecuencia Cardiaca', width: '150px' },
    { id: 'saturacionOxigeno', label: 'Saturación O₂', width: '130px' },
    { id: 'frecuenciaRespiratoria', label: 'Frecuencia Respiratoria', width: '170px' },
    { id: 'peso', label: 'Peso (kg)', width: '100px' },
    { id: 'talla', label: 'Talla (cm)', width: '110px' },
    { id: 'indiceMasaCorporal', label: 'IMC', width: '90px' },
    { id: 'perimetroAbdominal', label: 'Perímetro Abdominal', width: '160px' },
    
    // Antecedentes - Sección B
    { id: 'antecedentesClinicos', label: 'Antecedentes Clínicos', width: '200px' },
    { id: 'accidentesTrabajo', label: 'Accidentes Trabajo', width: '140px' },
    { id: 'enfermedadesProfesionales', label: 'Enfermedades Profesionales', width: '190px' },
    
    // Examen Físico - Sección D
    { id: 'examenFisicoObservaciones', label: 'Examen Físico', width: '200px' },
    
    // Datos del Profesional - Sección I
    { id: 'profesionalNombre', label: 'Profesional', width: '180px' },
    { id: 'codigoProfesional', label: 'Código Profesional', width: '150px' },
    
    // Metadatos
    { id: 'fechaFicha', label: 'Fecha Ficha', width: '120px' },
    { id: 'estadoFicha', label: 'Estado', width: '100px' },
  ];

  return (
    <div className="space-y-3">
      {/* Buscador sticky al inicio */}
      <div className="bg-white border border-gray-200 sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            <span className="font-semibold text-gray-800">{empleadosFiltrados.length}</span> empleado(s)
          </div>
        </div>
      </div>

      {/* Tabla tipo Excel con scroll horizontal */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <table className="min-w-full border-collapse bg-white">
            {/* Header fijo */}
            <thead>
              <tr>
                {columnas.map((col, colIndex) => {
                  let leftPosition = 0;
                  if (col.sticky) {
                    for (let i = 0; i < colIndex; i++) {
                      if (columnas[i].sticky) {
                        leftPosition += parseInt(columnas[i].width);
                      }
                    }
                  }
                  return (
                    <th
                      key={col.id}
                      className={`
                        border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800 uppercase bg-gray-200
                        ${col.sticky ? 'sticky z-20 border-r-2 border-gray-300' : ''}
                      `}
                      style={{ 
                        minWidth: col.width,
                        width: col.width,
                        position: col.sticky ? 'sticky' : 'relative',
                        left: col.sticky ? `${leftPosition}px` : 'auto',
                        top: col.sticky ? '0' : 'auto'
                      }}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body con datos */}
            <tbody className="bg-white divide-y divide-gray-200">
              {empleadosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnas.length}
                    className="border border-gray-400 px-6 py-12 text-center text-gray-500 bg-gray-50"
                  >
                    No se encontraron empleados
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map((empleado, index) => {
                  const fichaMedica = obtenerUltimaFichaMedica(empleado.id);
                  const datosFicha = obtenerDatosFichaMedica(fichaMedica);
                  
                  // Calcular edad (si está disponible)
                  const calcularEdad = () => {
                    if (empleado.fechaNacimiento) {
                      const hoy = new Date();
                      const nacimiento = new Date(empleado.fechaNacimiento);
                      let edad = hoy.getFullYear() - nacimiento.getFullYear();
                      const mes = hoy.getMonth() - nacimiento.getMonth();
                      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                        edad--;
                      }
                      return edad;
                    }
                    return datosFicha.edad || '';
                  };

                  // Calcular posiciones left para columnas sticky
                  let leftNro = 0;
                  let leftCedula = parseInt(columnas[0].width); // 60px
                  let leftNombre = leftCedula + parseInt(columnas[1].width); // 60 + 120 = 180px

                  return (
                    <tr
                      key={empleado.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Número */}
                      <td 
                        className="border border-gray-400 px-3 py-2 text-sm text-gray-800 bg-gray-50 sticky z-10 font-medium text-center border-r-2 border-gray-300"
                        style={{ left: `${leftNro}px` }}
                      >
                        {index + 1}
                      </td>

                      {/* Cédula */}
                      <td 
                        className="border border-gray-400 px-3 py-2 text-sm text-gray-800 bg-gray-50 sticky z-10 font-medium border-r-2 border-gray-300"
                        style={{ left: `${leftCedula}px` }}
                      >
                        {empleado.cedula || empleado.dni || '-'}
                      </td>

                      {/* Nombre Completo */}
                      <td 
                        className="border border-gray-400 px-3 py-2 text-sm text-gray-800 bg-gray-50 sticky z-10 font-medium border-r-2 border-gray-300"
                        style={{ left: `${leftNombre}px` }}
                      >
                        {`${empleado.firstName || empleado.names || ''} ${empleado.lastName || empleado.lastNames || ''}`.trim() || '-'}
                      </td>

                      {/* Puesto de Trabajo */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {empleado.position || datosFicha.puestoTrabajo || '-'}
                      </td>

                      {/* Sexo */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700 text-center">
                        {empleado.sexo || datosFicha.sexo || '-'}
                      </td>

                      {/* Edad */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700 text-center">
                        {calcularEdad()}
                      </td>

                      {/* N° Historia Clínica */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.numeroHistoriaClinica || '-'}
                      </td>

                      {/* N° Archivo */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.numeroArchivo || '-'}
                      </td>

                      {/* Fecha Inicio Labores */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.fechaInicioLabores ? 
                          new Date(datosFicha.fechaInicioLabores).toLocaleDateString('es-ES') : 
                          empleado.fechaInicioLabores ? 
                          new Date(empleado.fechaInicioLabores).toLocaleDateString('es-ES') : 
                          '-'
                        }
                      </td>

                      {/* Fecha Salida */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.fechaSalida ? 
                          new Date(datosFicha.fechaSalida).toLocaleDateString('es-ES') : '-'}
                      </td>

                      {/* Tiempo (Meses) */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700 text-center">
                        {datosFicha.tiempoMeses || '-'}
                      </td>

                      {/* Presión Arterial */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.presionArterial || '-'}
                      </td>

                      {/* Temperatura */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.temperatura || '-'}
                      </td>

                      {/* Frecuencia Cardiaca */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.frecuenciaCardiaca || '-'}
                      </td>

                      {/* Saturación O₂ */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.saturacionOxigeno || '-'}
                      </td>

                      {/* Frecuencia Respiratoria */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.frecuenciaRespiratoria || '-'}
                      </td>

                      {/* Peso */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.peso || '-'}
                      </td>

                      {/* Talla */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.talla || '-'}
                      </td>

                      {/* IMC */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.indiceMasaCorporal || '-'}
                      </td>

                      {/* Perímetro Abdominal */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.perimetroAbdominal || '-'}
                      </td>

                      {/* Antecedentes Clínicos */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.antecedentesClinicosQuirurgicos || '-'}
                      </td>

                      {/* Accidentes Trabajo */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.accidentesTrabajoSi ? 
                          (datosFicha.accidentesTrabajoEspecificar || 'Sí') : 
                          datosFicha.accidentesTrabajoNo ? 'No' : '-'}
                      </td>

                      {/* Enfermedades Profesionales */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.enfermedadesProfesionalesSi ? 
                          (datosFicha.enfermedadesProfesionalesEspecificar || 'Sí') : 
                          datosFicha.enfermedadesProfesionalesNo ? 'No' : '-'}
                      </td>

                      {/* Examen Físico */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.examenFisicoObservaciones || '-'}
                      </td>

                      {/* Profesional */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.nombresApellidosProfesional || '-'}
                      </td>

                      {/* Código Profesional */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {datosFicha.codigoProfesional || '-'}
                      </td>

                      {/* Fecha Ficha */}
                      <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                        {fichaMedica?.fechaCreacion ? 
                          new Date(fichaMedica.fechaCreacion).toLocaleDateString('es-ES') : '-'}
                      </td>

                      {/* Estado */}
                      <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                        {fichaMedica?.estado ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            fichaMedica.estado === 'Publicado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {fichaMedica.estado}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información adicional minimalista */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
        <p className="text-xs text-gray-600">
          Muestra la última ficha médica por empleado. Usa el scroll horizontal para ver todas las columnas.
        </p>
      </div>
    </div>
  );
};

export default MatrizEmpleados;

