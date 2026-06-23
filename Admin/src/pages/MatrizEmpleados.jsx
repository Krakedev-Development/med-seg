import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { initialCompanies } from '../data/companiesData';
import { initialEmployees } from '../data/employeesData';
import { getDocumentosByEmpresa } from '../data/documentosDinamicosData';

const MatrizEmpleados = ({ companies = initialCompanies, employees = initialEmployees, setEmployees }) => {
  const { empresaId } = useParams();
  const [busqueda, setBusqueda] = useState('');
  
  // Modals visibility
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalIess, setMostrarModalIess] = useState(false);

  // New Employee state
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    cedula: '',
    names: '',
    lastNames: '',
    position: '',
    sexo: 'M',
    edad: '',
    numeroHistoriaClinica: '',
    numeroArchivo: '',
    fechaInicioLabores: '',
    fechaSalida: '',
    tiempoMeses: ''
  });

  // IESS Matrix state
  const [archivoCsv, setArchivoCsv] = useState(null);
  const [reporteComparacion, setReporteComparacion] = useState(null); // { nuevos: [], salidas: [], sinCambios: [] }
  const [procesandoCsv, setProcesandoCsv] = useState(false);

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

  // Helper para calcular meses
  const calcularTiempoMeses = (inicioStr, finStr) => {
    if (!inicioStr) return '';
    const inicio = new Date(inicioStr);
    const fin = finStr ? new Date(finStr) : new Date();
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return '';
    const diffYears = fin.getFullYear() - inicio.getFullYear();
    const diffMonths = fin.getMonth() - inicio.getMonth();
    const totalMonths = diffYears * 12 + diffMonths;
    return totalMonths >= 0 ? totalMonths : 0;
  };

  const handleFechaInicioChange = (val) => {
    const calculatedMonths = calcularTiempoMeses(val, nuevoEmpleado.fechaSalida);
    setNuevoEmpleado(prev => ({
      ...prev,
      fechaInicioLabores: val,
      tiempoMeses: calculatedMonths
    }));
  };

  const handleFechaSalidaChange = (val) => {
    const calculatedMonths = calcularTiempoMeses(nuevoEmpleado.fechaInicioLabores, val);
    setNuevoEmpleado(prev => ({
      ...prev,
      fechaSalida: val,
      tiempoMeses: calculatedMonths
    }));
  };

  // Guardar empleado manual
  const handleGuardarEmpleado = (e) => {
    e.preventDefault();
    if (!nuevoEmpleado.cedula || !nuevoEmpleado.names || !nuevoEmpleado.lastNames || !nuevoEmpleado.position || !nuevoEmpleado.edad || !nuevoEmpleado.fechaInicioLabores) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    
    const createdEmployee = {
      id: Date.now(),
      names: nuevoEmpleado.names,
      lastNames: nuevoEmpleado.lastNames,
      dni: nuevoEmpleado.cedula,
      cedula: nuevoEmpleado.cedula,
      position: nuevoEmpleado.position,
      companyId: empresaIdNum,
      sexo: nuevoEmpleado.sexo,
      edad: parseInt(nuevoEmpleado.edad) || '',
      numeroHistoriaClinica: nuevoEmpleado.numeroHistoriaClinica || '',
      numeroArchivo: nuevoEmpleado.numeroArchivo || '',
      fechaInicioLabores: nuevoEmpleado.fechaInicioLabores,
      fechaSalida: nuevoEmpleado.fechaSalida || '',
      tiempoMeses: nuevoEmpleado.tiempoMeses ? parseInt(nuevoEmpleado.tiempoMeses) : '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    if (setEmployees) {
      setEmployees(prev => [createdEmployee, ...prev]);
    }
    
    setNuevoEmpleado({
      cedula: '',
      names: '',
      lastNames: '',
      position: '',
      sexo: 'M',
      edad: '',
      numeroHistoriaClinica: '',
      numeroArchivo: '',
      fechaInicioLabores: '',
      fechaSalida: '',
      tiempoMeses: ''
    });
    setMostrarModalAgregar(false);
  };

  // Parser de CSV
  const parseCSV = (text) => {
    const lines = text.split('\n');
    if (lines.length < 2) return [];
    
    const headerLine = lines[0];
    const separator = headerLine.includes(';') ? ';' : ',';
    const headers = headerLine.split(separator).map(h => h.trim().toLowerCase());
    
    const results = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle values with commas if enclosed in quotes (simple handling)
      let values = [];
      if (line.includes('"')) {
        let currentField = '';
        let insideQuotes = false;
        for (let char of line) {
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === separator && !insideQuotes) {
            values.push(currentField.trim());
            currentField = '';
          } else {
            currentField += char;
          }
        }
        values.push(currentField.trim());
      } else {
        values = line.split(separator).map(v => v.trim());
      }

      const row = {};
      headers.forEach((header, index) => {
        let normalizedHeader = header;
        if (header.includes('cedula') || header.includes('dni') || header.includes('identificacion')) {
          normalizedHeader = 'cedula';
        } else if (header.includes('nombres') || header.includes('nombre') || header.includes('names')) {
          normalizedHeader = 'nombres';
        } else if (header.includes('apellidos') || header.includes('apellido') || header.includes('lastnames')) {
          normalizedHeader = 'apellidos';
        } else if (header.includes('puesto') || header.includes('cargo') || header.includes('position')) {
          normalizedHeader = 'puesto';
        } else if (header.includes('sexo') || header.includes('genero')) {
          normalizedHeader = 'sexo';
        } else if (header.includes('edad')) {
          normalizedHeader = 'edad';
        } else if (header.includes('historia') || header.includes('clinic')) {
          normalizedHeader = 'historia';
        } else if (header.includes('archivo')) {
          normalizedHeader = 'archivo';
        } else if (header.includes('inicio') || header.includes('labores')) {
          normalizedHeader = 'inicio';
        } else if (header.includes('salida')) {
          normalizedHeader = 'salida';
        } else if (header.includes('tiempo') || header.includes('meses')) {
          normalizedHeader = 'tiempo';
        }
        
        row[normalizedHeader] = values[index] || '';
      });
      results.push(row);
    }
    return results;
  };

  // Realizar comparación
  const realizarComparacion = (rowsFromCsv) => {
    const nuevos = [];
    const salidas = [];
    const sinCambios = [];
    
    rowsFromCsv.forEach(row => {
      const cedulaCsv = (row.cedula || '').trim();
      if (!cedulaCsv) return;
      
      const existeEnSistema = empleadosEmpresa.some(emp => 
        (emp.cedula || emp.dni || '').trim() === cedulaCsv
      );
      
      if (!existeEnSistema) {
        nuevos.push({
          cedula: cedulaCsv,
          names: row.nombres || '',
          lastNames: row.apellidos || '',
          position: row.puesto || 'Puesto no definido',
          sexo: row.sexo || 'M',
          edad: parseInt(row.edad) || 30,
          numeroHistoriaClinica: row.historia || `HC-${new Date().getFullYear()}-${cedulaCsv.slice(-3)}`,
          numeroArchivo: row.archivo || `ARCH-${new Date().getFullYear()}-${cedulaCsv.slice(-3)}`,
          fechaInicioLabores: row.inicio || new Date().toISOString().split('T')[0],
          fechaSalida: row.salida || '',
          tiempoMeses: row.tiempo || '1'
        });
      }
    });
    
    empleadosEmpresa.forEach(emp => {
      const cedulaSistema = (emp.cedula || emp.dni || '').trim();
      if (!cedulaSistema) return;
      
      const existeEnCsv = rowsFromCsv.some(row => 
        (row.cedula || '').trim() === cedulaSistema
      );
      
      if (!existeEnCsv && !emp.fechaSalida) {
        salidas.push(emp);
      } else {
        sinCambios.push(emp);
      }
    });
    
    setReporteComparacion({ nuevos, salidas, sinCambios });
  };

  // Subida de archivo real
  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setProcesandoCsv(true);
    setArchivoCsv(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsedRows = parseCSV(text);
      if (parsedRows.length === 0) {
        alert('El archivo CSV está vacío o tiene un formato incorrecto.');
        setProcesandoCsv(false);
        return;
      }
      realizarComparacion(parsedRows);
      setProcesandoCsv(false);
    };
    reader.onerror = () => {
      alert('Error al leer el archivo.');
      setProcesandoCsv(false);
    };
    reader.readAsText(file);
  };

  // Simulación del IESS
  const handleSimularIess = () => {
    setProcesandoCsv(true);
    
    setTimeout(() => {
      const mockCsvString = `cedula,nombres,apellidos,puesto,sexo,edad,historia,archivo,inicio,salida,tiempo
12345678,Juan Carlos,Pérez García,Operador de Maquinaria,M,41,HC-2025-01-10-001,ARCH-2025-01-10-001,2020-01-15,,60
56789012,Luis Miguel,Vargas Ramírez,Minero,M,37,HC-2025-01-12-005,ARCH-2025-01-12-005,2019-03-10,,70
11223344,Roberto,Fernández Cáceres,Ingeniero de Minas,M,43,HC-2025-01-15-007,ARCH-2025-01-15-007,2018-06-01,,79
22334455,Patricia,González Huamán,Supervisora de Seguridad,F,36,HC-2025-01-18-008,ARCH-2025-01-18-008,2021-02-13,,47
55667788,Rosa,Díaz Mendoza,Enfermera Ocupacional,F,34,HC-2025-01-25-011,ARCH-2025-01-25-011,2022-01-10,,36
66778899,Jorge,Salas Rojas,Mecánico de Mantenimiento,M,42,HC-2025-01-28-012,ARCH-2025-01-28-012,2018-08-15,,70
77889900,Ana,Ramos Silva,Asistente Administrativa,F,35,HC-2025-01-30-013,ARCH-2025-01-30-013,2021-07-05,,47
88990011,Pedro,Castro Vásquez,Jefe de Planta,M,46,HC-2025-02-01-014,ARCH-2025-02-01-014,2017-01-20,,97
99001122,María,López Cruz,Geóloga,F,36,HC-2025-02-05-015,ARCH-2025-02-05-015,2020-09-12,,56
00112233,José,Rivera Chávez,Operador de Excavadora,M,41,HC-2025-02-10-016,ARCH-2025-02-10-016,2019-04-18,,73
10203040,Lucía,Morales Paredes,Técnica en Seguridad,F,32,HC-2025-02-15-017,ARCH-2025-02-15-017,2022-03-22,,38
20304050,Fernando,Ortega Villanueva,Electricista Industrial,M,40,HC-2025-02-20-018,ARCH-2025-02-20-018,2020-11-30,,54
30405060,Carmen,Espinoza Núñez,Contadora,F,37,HC-2025-02-25-019,ARCH-2025-02-25-019,2021-05-15,,48
40506070,Ricardo,Campos Herrera,Operador de Perforadora,M,38,HC-2025-03-01-020,ARCH-2025-03-01-020,2019-12-10,,65
17123456,Santiago Alejandro,Merino Castro,Técnico de Campo,M,29,HC-2026-06-01-002,ARCH-2026-06-01-002,2025-05-10,,13
17234567,Diana Carolina,Espín Pazmiño,Asistente de Oficina,F,27,HC-2026-06-01-003,ARCH-2026-06-01-003,2026-01-15,,5`;
      
      const parsedRows = parseCSV(mockCsvString);
      realizarComparacion(parsedRows);
      setProcesandoCsv(false);
    }, 600);
  };

  // Registrar nuevo empleado desde el reporte del IESS
  const registrarDesdeReporte = (nuevoEmp) => {
    const createdEmployee = {
      id: Date.now() + Math.random(),
      names: nuevoEmp.names,
      lastNames: nuevoEmp.lastNames,
      dni: nuevoEmp.cedula,
      cedula: nuevoEmp.cedula,
      position: nuevoEmp.position,
      companyId: empresaIdNum,
      sexo: nuevoEmp.sexo,
      edad: nuevoEmp.edad,
      numeroHistoriaClinica: nuevoEmp.numeroHistoriaClinica,
      numeroArchivo: nuevoEmp.numeroArchivo,
      fechaInicioLabores: nuevoEmp.fechaInicioLabores,
      fechaSalida: nuevoEmp.fechaSalida,
      tiempoMeses: nuevoEmp.tiempoMeses ? parseInt(nuevoEmp.tiempoMeses) : '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    if (setEmployees) {
      setEmployees(prev => [createdEmployee, ...prev]);
    }
    
    setReporteComparacion(prev => ({
      ...prev,
      nuevos: prev.nuevos.filter(e => e.cedula !== nuevoEmp.cedula)
    }));
  };

  // Registrar salida (baja) de empleado desde el reporte del IESS
  const registrarSalidaDesdeReporte = (retEmpId) => {
    const hoyStr = new Date().toISOString().split('T')[0];
    
    if (setEmployees) {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === retEmpId) {
          const calculatedMonths = calcularTiempoMeses(emp.fechaInicioLabores || (emp.datos && emp.datos.fechaInicioLabores), hoyStr);
          return {
            ...emp,
            fechaSalida: hoyStr,
            tiempoMeses: calculatedMonths
          };
        }
        return emp;
      }));
    }
    
    setReporteComparacion(prev => ({
      ...prev,
      salidas: prev.salidas.filter(e => e.id !== retEmpId)
    }));
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    try {
      if (typeof fecha === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) return fecha;
      const dateObj = new Date(fecha);
      if (isNaN(dateObj.getTime())) return fecha;
      return dateObj.toLocaleDateString('es-ES', { timeZone: 'UTC' });
    } catch (e) {
      return fecha;
    }
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

  // Definir columnas de la matriz acortada (de Cédula a Tiempo en Meses)
  const columnas = [
    { id: 'nro', label: '#', width: '60px', sticky: true },
    { id: 'cedula', label: 'Cédula', width: '120px', sticky: true },
    { id: 'nombre', label: 'Nombre Completo', width: '220px', sticky: true },
    { id: 'puesto', label: 'Puesto de Trabajo', width: '180px' },
    { id: 'sexo', label: 'Sexo', width: '80px' },
    { id: 'edad', label: 'Edad', width: '80px' },
    { id: 'numeroHistoriaClinica', label: 'N° Historia Clínica', width: '150px' },
    { id: 'numeroArchivo', label: 'N° Archivo', width: '120px' },
    { id: 'fechaInicioLabores', label: 'Fecha Inicio Labores', width: '150px' },
    { id: 'fechaSalida', label: 'Fecha Salida', width: '130px' },
    { id: 'tiempoMeses', label: 'Tiempo (Meses)', width: '130px' },
  ];

  return (
    <div className="space-y-4">
      {/* Buscador y botones de acción sticky al inicio */}
      <div className="bg-white border border-gray-200 sticky top-0 z-30 px-4 py-3 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
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
            
            {/* Botones de acción solicitados */}
            <button
              onClick={() => setMostrarModalAgregar(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-all transform hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Empleado
            </button>
            
            <button
              onClick={() => {
                setMostrarModalIess(true);
                setReporteComparacion(null);
                setArchivoCsv(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg shadow-sm transition-all transform hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Subir Matriz IESS
            </button>
          </div>
          
          <div className="text-sm text-gray-600 whitespace-nowrap self-end md:self-auto">
            <span className="font-semibold text-gray-800">{empleadosFiltrados.length}</span> empleado(s)
          </div>
        </div>
      </div>

      {/* Tabla tipo Excel con scroll horizontal acortada */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <table className="min-w-full border-collapse bg-white">
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
                        border border-gray-300 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase bg-gray-100
                        ${col.sticky ? 'sticky z-20 border-r border-gray-300' : ''}
                      `}
                      style={{ 
                        minWidth: col.width,
                        width: col.width,
                        position: col.sticky ? 'sticky' : 'relative',
                        left: col.sticky ? `${leftPosition}px` : 'auto',
                        top: '0'
                      }}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {empleadosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnas.length}
                    className="border border-gray-300 px-6 py-12 text-center text-gray-500 bg-gray-50"
                  >
                    No se encontraron empleados en esta empresa
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map((empleado, index) => {
                  const fichaMedica = obtenerUltimaFichaMedica(empleado.id);
                  const datosFicha = obtenerDatosFichaMedica(fichaMedica);
                  
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
                    return empleado.edad || datosFicha.edad || '-';
                  };

                  let leftNro = 0;
                  let leftCedula = parseInt(columnas[0].width); // 60px
                  let leftNombre = leftCedula + parseInt(columnas[1].width); // 60 + 120 = 180px

                  return (
                    <tr
                      key={empleado.id}
                      className={`hover:bg-gray-50 transition-colors ${empleado.fechaSalida ? 'bg-red-50/50' : ''}`}
                    >
                      {/* Número */}
                      <td 
                        className="border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-gray-50 sticky z-10 font-medium text-center border-r border-gray-300"
                        style={{ left: `${leftNro}px` }}
                      >
                        {index + 1}
                      </td>

                      {/* Cédula */}
                      <td 
                        className="border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 sticky z-10 font-medium border-r border-gray-300"
                        style={{ left: `${leftCedula}px` }}
                      >
                        {empleado.cedula || empleado.dni || '-'}
                      </td>

                      {/* Nombre Completo */}
                      <td 
                        className="border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 sticky z-10 font-semibold border-r border-gray-300 truncate"
                        style={{ left: `${leftNombre}px` }}
                      >
                        {`${empleado.firstName || empleado.names || ''} ${empleado.lastName || empleado.lastNames || ''}`.trim() || '-'}
                        {empleado.fechaSalida && (
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold text-red-700 bg-red-100 rounded">
                            Baja
                          </span>
                        )}
                      </td>

                      {/* Puesto de Trabajo */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                        {empleado.position || datosFicha.puestoTrabajo || '-'}
                      </td>

                      {/* Sexo */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600 text-center">
                        {empleado.sexo || datosFicha.sexo || '-'}
                      </td>

                      {/* Edad */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600 text-center">
                        {calcularEdad()}
                      </td>

                      {/* N° Historia Clínica */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                        {datosFicha.numeroHistoriaClinica || empleado.numeroHistoriaClinica || '-'}
                      </td>

                      {/* N° Archivo */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                        {datosFicha.numeroArchivo || empleado.numeroArchivo || '-'}
                      </td>

                      {/* Fecha Inicio Labores */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                        {formatFecha(datosFicha.fechaInicioLabores || empleado.fechaInicioLabores)}
                      </td>

                      {/* Fecha Salida */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                        {formatFecha(datosFicha.fechaSalida || empleado.fechaSalida)}
                      </td>

                      {/* Tiempo (Meses) */}
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600 text-center">
                        {datosFicha.tiempoMeses || empleado.tiempoMeses || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
        <p className="text-xs text-gray-500">
          Nota: Esta matriz se ha recortado para mostrar información básica y contractual del empleado de forma más compacta. Los datos clínicos y antecedentes siguen vinculados internamente en las fichas médicas correspondientes.
        </p>
      </div>

      {/* ================= MODAL AGREGAR EMPLEADO ================= */}
      {mostrarModalAgregar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Agregar Nuevo Empleado</h3>
              <button 
                onClick={() => setMostrarModalAgregar(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleGuardarEmpleado} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cédula / DNI *</label>
                  <input
                    type="text"
                    required
                    value={nuevoEmpleado.cedula}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, cedula: e.target.value})}
                    placeholder="Ej. 1712345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Edad *</label>
                  <input
                    type="number"
                    required
                    value={nuevoEmpleado.edad}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, edad: e.target.value})}
                    placeholder="Ej. 30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={nuevoEmpleado.names}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, names: e.target.value})}
                    placeholder="Ej. Juan Carlos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={nuevoEmpleado.lastNames}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, lastNames: e.target.value})}
                    placeholder="Ej. Pérez García"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Puesto de Trabajo *</label>
                  <input
                    type="text"
                    required
                    value={nuevoEmpleado.position}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, position: e.target.value})}
                    placeholder="Ej. Operador de Maquinaria"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sexo *</label>
                  <select
                    value={nuevoEmpleado.sexo}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, sexo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="M">Masculino (M)</option>
                    <option value="F">Femenino (F)</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">N° Historia Clínica</label>
                  <input
                    type="text"
                    value={nuevoEmpleado.numeroHistoriaClinica}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, numeroHistoriaClinica: e.target.value})}
                    placeholder="Ej. HC-2026-06-01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">N° Archivo</label>
                  <input
                    type="text"
                    value={nuevoEmpleado.numeroArchivo}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, numeroArchivo: e.target.value})}
                    placeholder="Ej. ARCH-2026-06-01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Inicio Labores *</label>
                  <input
                    type="date"
                    required
                    value={nuevoEmpleado.fechaInicioLabores}
                    onChange={(e) => handleFechaInicioChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Salida</label>
                  <input
                    type="date"
                    value={nuevoEmpleado.fechaSalida}
                    onChange={(e) => handleFechaSalidaChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tiempo (Meses)</label>
                  <input
                    type="number"
                    value={nuevoEmpleado.tiempoMeses}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, tiempoMeses: e.target.value})}
                    placeholder="Cálculo automático o digite el valor"
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalAgregar(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-colors"
                >
                  Guardar Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL SUBIR MATRIZ IESS ================= */}
      {mostrarModalIess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-800">Subir Matriz IESS (CSV)</h3>
              </div>
              <button 
                onClick={() => setMostrarModalIess(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {!reporteComparacion ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700">Arrastre su archivo Matriz IESS (.csv) aquí</p>
                    <p className="text-xs text-gray-400 mt-1">o haga clic para buscar en su equipo</p>
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleUploadFile}
                      className="hidden" 
                      id="input-file-csv"
                    />
                    <label 
                      htmlFor="input-file-csv"
                      className="mt-4 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm cursor-pointer transition-colors"
                    >
                      Seleccionar Archivo
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">💡</span>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Prototipo Maquetado</p>
                        <p className="text-[11px] text-gray-600">Simule la subida directamente sin necesidad de crear un archivo local real.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSimularIess}
                      disabled={procesandoCsv}
                      className="px-4 py-2 text-xs font-bold text-white bg-secondary hover:bg-secondary-hover rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      {procesandoCsv ? 'Procesando...' : 'Cargar Simulación de Prueba'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Archivo Procesado:</p>
                      <p className="text-xs text-gray-500">{archivoCsv ? archivoCsv.name : 'Simulacion_Matriz_IESS.csv'}</p>
                    </div>
                    <button
                      onClick={() => setReporteComparacion(null)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Subir otro archivo
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-1 border-b border-gray-100">
                    Resultados de la Comparación
                  </h4>
                  
                  {/* SECCION NUEVOS EMPLEADOS */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-green-700 flex items-center gap-1.5 uppercase">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
                      Nuevos Empleados en IESS (No Registrados en Sistema) ({reporteComparacion.nuevos.length})
                    </h5>
                    
                    {reporteComparacion.nuevos.length === 0 ? (
                      <p className="text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded-lg">No se detectaron nuevos empleados.</p>
                    ) : (
                      <div className="border border-green-200 rounded-lg overflow-hidden divide-y divide-green-100 max-h-40 overflow-y-auto">
                        {reporteComparacion.nuevos.map((nuevo, index) => (
                          <div key={index} className="px-3 py-2 bg-green-50/50 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-gray-800">{nuevo.names} {nuevo.lastNames}</p>
                              <p className="text-[10px] text-gray-500">Cédula: {nuevo.cedula} | Puesto: {nuevo.position}</p>
                            </div>
                            <button
                              onClick={() => registrarDesdeReporte(nuevo)}
                              className="px-2 py-1 text-[10px] font-bold text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                            >
                              Registrar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECCION EMPLEADOS RETIRADOS */}
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-bold text-red-700 flex items-center gap-1.5 uppercase">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                      Empleados en Sistema que no constan en IESS (Salieron de la Empresa) ({reporteComparacion.salidas.length})
                    </h5>
                    
                    {reporteComparacion.salidas.length === 0 ? (
                      <p className="text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded-lg">No se detectaron salidas de empleados.</p>
                    ) : (
                      <div className="border border-red-200 rounded-lg overflow-hidden divide-y divide-red-100 max-h-40 overflow-y-auto">
                        {reporteComparacion.salidas.map((salida, index) => {
                          const fullName = `${salida.firstName || salida.names || ''} ${salida.lastName || salida.lastNames || ''}`.trim();
                          return (
                            <div key={index} className="px-3 py-2 bg-red-50/50 flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-gray-800">{fullName}</p>
                                <p className="text-[10px] text-gray-500">Cédula: {salida.cedula || salida.dni} | Puesto: {salida.position}</p>
                              </div>
                              <button
                                onClick={() => registrarSalidaDesdeReporte(salida.id)}
                                className="px-2 py-1 text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                              >
                                Registrar Salida
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* SECCION COINCIDENCIAS */}
                  <div className="pt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 block"></span>
                      Empleados Activos Coincidentes: {reporteComparacion.sinCambios.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setMostrarModalIess(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
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

export default MatrizEmpleados;
