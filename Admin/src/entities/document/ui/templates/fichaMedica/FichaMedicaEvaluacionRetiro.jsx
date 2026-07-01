import React from "react";

const EditableText = ({
  field,
  value,
  placeholder = '',
  editable = false,
  onFieldChange,
  className = '',
  style = {},
}) => {
  if (!editable) {
    return (
      <span className={className} style={style}>
        {value || placeholder}
      </span>
    );
  }

  return (
    <span
      className={`${className} outline-none border-b border-dashed border-primary/40 focus:border-primary`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const newValue = e.currentTarget.innerText.trim();
        if (onFieldChange) {
          onFieldChange(field, newValue);
        }
      }}
    >
      {value || placeholder}
    </span>
  );
};

export default function FichaMedicaEvaluacionRetiro({
  logoEmpresa,
  nombreEmpresa = "",
  // Sección A - Datos del Establecimiento
  institucion = "",
  ruc = "",
  ciiu = "",
  establecimientoSalud = "",
  numeroHistoriaClinica = "",
  numeroArchivo = "",
  departamentoMedico = "",
  primerApellido = "",
  segundoApellido = "",
  primerNombre = "",
  segundoNombre = "",
  sexo = "",
  fechaInicioLabores = "",
  fechaSalida = "",
  tiempoMeses = "",
  tiempoAnios = "",
  puestoTrabajo = "",
  actividades = "",
  factoresRiesgo = "",
  // Sección B - Antecedentes Personales
  antecedentesClinicosQuirurgicos = "",
  accidentesTrabajoSi = false,
  accidentesTrabajoEspecificar = "",
  accidentesTrabajoNo = false,
  accidentesTrabajoFecha = "",
  accidentesTrabajoObservaciones = "",
  accidentesTrabajoNoReportado = "",
  enfermedadesProfesionalesSi = false,
  enfermedadesProfesionalesEspecificar = "",
  enfermedadesProfesionalesNo = false,
  enfermedadesProfesionalesFecha = "",
  enfermedadesProfesionalesObservaciones = "",
  enfermedadesProfesionalesNoReportada = "",
  // Sección C - Constantes Vitales
  presionArterial = "",
  temperatura = "",
  frecuenciaCardiaca = "",
  saturacionOxigeno = "",
  frecuenciaRespiratoria = "",
  peso = "",
  talla = "",
  indiceMasaCorporal = "",
  perimetroAbdominal = "",
  // Sección D - Examen Físico Regional
  examenFisicoObservaciones = "",
  // Sección E - Resultados de Exámenes
  resultadosExamenes = [],
  resultadosExamenesObservaciones = "",
  // Sección F - Diagnóstico
  diagnosticos = [],
  // Sección G - Evaluación Médica de Retiro
  evaluacionMedicaRetiroSi = false,
  evaluacionMedicaRetiroNo = false,
  evaluacionMedicaRetiroObservaciones = "",
  // Sección H - Recomendaciones y/o Tratamiento
  recomendacionesTratamiento = "",
  // Sección I - Datos del Profesional
  fechaEvaluacion = "",
  horaEvaluacion = "",
  nombresApellidosProfesional = "",
  codigoProfesional = "",
  editable = false,
  onFieldChange,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const formatDateInput = (dateString) => {
    if (!dateString) return { dia: "", mes: "", anio: "" };
    try {
      const date = new Date(dateString);
      return {
        dia: date.getDate().toString().padStart(2, '0'),
        mes: (date.getMonth() + 1).toString().padStart(2, '0'),
        anio: date.getFullYear().toString()
      };
    } catch {
      return { dia: "", mes: "", anio: "" };
    }
  };

  const accidentesFecha = formatDateInput(accidentesTrabajoFecha);
  const enfermedadesFecha = formatDateInput(enfermedadesProfesionalesFecha);

  // Datos del examen físico regional - formato en columnas horizontales como Excel
  const examenesFisicos = [
    { num: "1", nombre: "Piel", items: ["a. Cicatrices", "b. Tatuajes", "c. Piel y faneras"] },
    { num: "2", nombre: "Ojos", items: ["a. Párpados", "b. Conjuntivas", "c. Pupilas", "d. Córnea", "e. Motilidad"] },
    { num: "3", nombre: "Oído", items: ["a. C. auditivo externo", "b. Pabellón", "c. Tímpanos"] },
    { num: "4", nombre: "Oro faringe", items: ["a. Labios", "b. Lengua", "c. Faringe", "d. Amígdalas", "e. Dentadura"] },
    { num: "5", nombre: "Nariz", items: ["a. Tabique", "b. Cornetes", "c. Mucosas", "d. Senos paranasales"] },
    { num: "6", nombre: "Cuello", items: ["a. Tiroides / masas", "b. Movilidad", "c. Ganglios"] },
    { num: "7", nombre: "Tórax", items: ["a. Mamas", "b. Corazón"] },
    { num: "8", nombre: "Tórax", items: ["a. Pulmones", "b. Parrilla costal"] },
    { num: "9", nombre: "Abdomen", items: ["a. Vísceras", "b. Pared abdominal", "c. Flexibilidad"] },
    { num: "10", nombre: "Columna", items: ["a. Desviación", "b. Dolor"] },
    { num: "11", nombre: "Pelvis", items: ["a. Pelvis", "b. Genitales"] },
    { num: "12", nombre: "Extremidades", items: ["a. Vascular", "b. Miembros superiores", "c. Miembros inferiores"] },
    { num: "13", nombre: "Neurológico", items: ["a. Fuerza", "b. Sensibilidad", "c. Marcha", "d. Reflejos"] },
  ];

  return (
    <div
      id="documento-ficha-medica"
      className="bg-white text-sm text-black max-w-6xl mx-auto"
      style={{
        backgroundColor: '#fff',
        color: '#000',
        fontSize: '11px',
        fontFamily: 'Arial, sans-serif',
        padding: '15px'
      }}
    >
      {/* Sección A. DATOS DEL ESTABLECIMIENTO - EMPRESA Y USUARIO */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px',
            textAlign: 'left'
          }}
        >
          A. DATOS DEL ESTABLECIMIENTO - EMPRESA Y USUARIO
        </h3>

        {/* Primera tabla - Datos del Establecimiento */}
        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px',
            marginBottom: '6px',
            tableLayout: 'fixed'
          }}
        >
          <tbody>
            {/* Primera fila: Headers horizontales */}
            <tr style={{ backgroundColor: '#E8F5E9' }}>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '30%' }}>
                INSTITUCIÓN DEL SISTEMA O NOMBRE DE LA EMPRESA
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '11%', textAlign: 'center' }}>
                RUC
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '8%', textAlign: 'center' }}>
                CIIU
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '18%' }}>
                ESTABLECIMIENTO DE SALUD
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '17%' }}>
                NÚMERO DE HISTORIA CLÍNICA
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '16%' }}>
                NÚMERO DE ARCHIVO
              </td>
            </tr>
            {/* Segunda fila: Datos */}
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '30%' }}>
                <EditableText
                  field="institucion"
                  value={institucion || nombreEmpresa || ''}
                  placeholder="Nombre de la empresa"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '11%', textAlign: 'center' }}>
                <EditableText
                  field="ruc"
                  value={ruc || ''}
                  placeholder="RUC"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '8%', textAlign: 'center' }}>
                {ciiu || ''}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '18%' }}>
                {establecimientoSalud || ''}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '17%' }}>
                <EditableText
                  field="numeroHistoriaClinica"
                  value={numeroHistoriaClinica || ''}
                  placeholder="Número de historia clínica"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '16%' }}>
                <EditableText
                  field="numeroArchivo"
                  value={numeroArchivo || ''}
                  placeholder="Número de archivo"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Segunda tabla - Datos Personales */}
        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px',
            marginBottom: '6px',
            tableLayout: 'fixed'
          }}
        >
          <tbody>
            {/* Primera fila: Headers de datos personales */}
            <tr style={{ backgroundColor: '#E8F5E9' }}>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '11%' }}>
                PRIMER APELLIDO
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '11%' }}>
                SEGUNDO APELLIDO
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '11%' }}>
                PRIMER NOMBRE
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '11%' }}>
                SEGUNDO NOMBRE
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '6%', textAlign: 'center' }}>
                SEXO
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '13%' }}>
                FECHA DE INICIO DE LABORES
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '13%' }}>
                FECHA DE SALIDA
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '10%', textAlign: 'center' }}>
                TIEMPO (meses)
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '14%' }}>
                PUESTO DE TRABAJO (CIUO)
              </td>
            </tr>
            {/* Segunda fila: Datos personales */}
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '11%' }}>
                <EditableText
                  field="primerApellido"
                  value={primerApellido || ''}
                  placeholder="Primer apellido"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '11%' }}>
                <EditableText
                  field="segundoApellido"
                  value={segundoApellido || ''}
                  placeholder="Segundo apellido"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '11%' }}>
                <EditableText
                  field="primerNombre"
                  value={primerNombre || ''}
                  placeholder="Primer nombre"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '11%' }}>
                <EditableText
                  field="segundoNombre"
                  value={segundoNombre || ''}
                  placeholder="Segundo nombre"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '6%', textAlign: 'center' }}>
                <EditableText
                  field="sexo"
                  value={sexo || ''}
                  placeholder="Sexo"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '13%' }}>
                {formatDate(fechaInicioLabores) || ''}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '13%' }}>
                {formatDate(fechaSalida) || ''}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '10%', textAlign: 'center' }}>
                <EditableText
                  field="tiempoMeses"
                  value={tiempoMeses || ''}
                  placeholder="0"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '14%' }}>
                <EditableText
                  field="puestoTrabajo"
                  value={puestoTrabajo || ''}
                  placeholder="Puesto de trabajo"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ACTIVIDADES y FACTORES DE RIESGO - Dos columnas en tabla */}
        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px',
            marginTop: '8px'
          }}
        >
          <tbody>
            <tr style={{ backgroundColor: '#E8F5E9' }}>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '50%' }}>
                ACTIVIDADES
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '50%' }}>
                FACTORES DE RIESGO
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '60px', fontSize: '10px', verticalAlign: 'top' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '60px', fontSize: '10px', verticalAlign: 'top' }}>
                
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '40px', fontSize: '10px', verticalAlign: 'top' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '40px', fontSize: '10px', verticalAlign: 'top' }}>
                
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '40px', fontSize: '10px', verticalAlign: 'top' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '40px', fontSize: '10px', verticalAlign: 'top' }}>
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección B. ANTECEDENTES PERSONALES */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          B. ANTECEDENTES PERSONALES
        </h3>

        {/* Antecedentes Clínicos y Quirúrgicos */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ backgroundColor: '#C8E6C9', padding: '3px 6px', fontWeight: 'bold', fontSize: '10px', border: '1px solid #000', borderBottom: 'none' }}>
            ANTECEDENTES CLÍNICOS Y QUIRÚRGICOS
          </div>
          <table
            style={{
              width: '100%',
              border: '1px solid #000',
              borderCollapse: 'collapse',
              fontSize: '10px'
            }}
          >
            <tbody>
              {[1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '20px' }}>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Accidentes de Trabajo */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ backgroundColor: '#C8E6C9', padding: '3px 6px', fontWeight: 'bold', fontSize: '10px', border: '1px solid #000', borderBottom: 'none' }}>
            ACCIDENTES DE TRABAJO ( DESCRIPCIÓN)
          </div>
          <div style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px' }}>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold' }}>FUE CALIFICADO POR EL INSTITUTO DE SEGURIDAD SOCIAL CORRESPONDIENTE:</span>
              <span style={{ marginLeft: '8px', marginRight: '12px' }}>□ SI</span>
              <span style={{ marginRight: '8px' }}>ESPECIFICAR:</span>
              <span style={{ borderBottom: '1px solid #000', padding: '0 20px' }}>
                {accidentesTrabajoEspecificar || '_________________'}
              </span>
              <span style={{ marginLeft: '12px', marginRight: '8px' }}>□ NO</span>
              <span style={{ marginRight: '8px' }}>FECHA:</span>
              <span style={{ border: '1px solid #000', padding: '2px 4px', marginRight: '2px' }}>{accidentesFecha.dia || '__'}</span>
              <span style={{ border: '1px solid #000', padding: '2px 4px', marginRight: '2px' }}>{accidentesFecha.mes || '__'}</span>
              <span style={{ border: '1px solid #000', padding: '2px 4px' }}>{accidentesFecha.anio || '____'}</span>
            </div>
            <div style={{ marginTop: '4px', marginBottom: '4px', fontWeight: 'bold' }}>Observaciones:</div>
            <table
              style={{
                width: '100%',
                border: '1px solid #000',
                borderCollapse: 'collapse',
                fontSize: '10px'
              }}
            >
              <tbody>
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row}>
                    <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '15px' }}>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '4px', fontSize: '9px', fontStyle: 'italic' }}>
              Detallar aquí en caso se presuma de algún accidente de trabajo que no haya sido reportado o calificado:
            </div>
            <table
              style={{
                width: '100%',
                border: '1px solid #000',
                borderCollapse: 'collapse',
                fontSize: '10px'
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '20px' }}>
                    
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Enfermedades Profesionales */}
        <div>
          <div style={{ backgroundColor: '#C8E6C9', padding: '3px 6px', fontWeight: 'bold', fontSize: '10px', border: '1px solid #000', borderBottom: 'none' }}>
            ENFERMEDADES PROFESIONALES
          </div>
          <div style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px' }}>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold' }}>FUE CALIFICADO POR EL INSTITUTO DE SEGURIDAD SOCIAL CORRESPONDIENTE:</span>
              <span style={{ marginLeft: '8px', marginRight: '12px' }}>□ SI</span>
              <span style={{ marginRight: '8px' }}>ESPECIFICAR:</span>
              <span style={{ borderBottom: '1px solid #000', padding: '0 20px' }}>
                {enfermedadesProfesionalesEspecificar || '_________________'}
              </span>
              <span style={{ marginLeft: '12px', marginRight: '8px' }}>□ NO</span>
              <span style={{ marginRight: '8px' }}>FECHA:</span>
              <span style={{ border: '1px solid #000', padding: '2px 4px', marginRight: '2px' }}>{enfermedadesFecha.dia || '__'}</span>
              <span style={{ border: '1px solid #000', padding: '2px 4px', marginRight: '2px' }}>{enfermedadesFecha.mes || '__'}</span>
              <span style={{ border: '1px solid #000', padding: '2px 4px' }}>{enfermedadesFecha.anio || '____'}</span>
            </div>
            <div style={{ marginTop: '4px', marginBottom: '4px', fontWeight: 'bold' }}>Observaciones:</div>
            <table
              style={{
                width: '100%',
                border: '1px solid #000',
                borderCollapse: 'collapse',
                fontSize: '10px'
              }}
            >
              <tbody>
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row}>
                    <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '15px' }}>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '4px', fontSize: '9px', fontStyle: 'italic' }}>
              Detallar aquí en caso de que se presuma de alguna enfermedad relacionada con el trabajo que no haya sido reportada o calificada:
            </div>
            <table
              style={{
                width: '100%',
                border: '1px solid #000',
                borderCollapse: 'collapse',
                fontSize: '10px'
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '20px' }}>
                    
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sección C. CONSTANTES VITALES Y ANTROPOMETRÍA */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          C. CONSTANTES VITALES Y ANTROPOMETRÍA
        </h3>

        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#E8F5E9' }}>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                PRESIÓN ARTERIAL (mmHg)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                TEMPERATURA (°C)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                FRECUENCIA CARDÍACA (lpm)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                SATURACIÓN DE OXÍGENO (%)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                FRECUENCIA RESPIRATORIA (rpm)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                PESO (Kg)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                TALLA (cm)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                ÍNDICE DE MASA CORPORAL (kg/m²)
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                PERÍMETRO ABDOMINAL (cm)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                /
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                #DIV/0!
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección D. EXAMEN FÍSICO REGIONAL */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          D. EXAMEN FÍSICO REGIONAL
        </h3>
        <div style={{ backgroundColor: '#C8E6C9', padding: '3px 6px', fontWeight: 'bold', fontSize: '10px', border: '1px solid #000', borderBottom: 'none' }}>
          REGIONES
        </div>

        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '9px'
          }}
        >
          <tbody>
            {/* Fila principal con 5 columnas */}
            <tr>
              {/* Columna 1: 1. Piel, 2. Ojos */}
              <td style={{ border: '1px solid #000', padding: '3px 4px', verticalAlign: 'top', width: '20%' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    1. {examenesFisicos[0].nombre}
                  </div>
                  {examenesFisicos[0].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', marginTop: '8px', fontSize: '9px', textAlign: 'center' }}>
                    2. {examenesFisicos[1].nombre}
                  </div>
                  {examenesFisicos[1].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </td>
              {/* Columna 2: 3. Oído, 4. Oro faringe */}
              <td style={{ border: '1px solid #000', padding: '3px 4px', verticalAlign: 'top', width: '20%' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    3. {examenesFisicos[2].nombre}
                  </div>
                  {examenesFisicos[2].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', marginTop: '8px', fontSize: '9px', textAlign: 'center' }}>
                    4. {examenesFisicos[3].nombre}
                  </div>
                  {examenesFisicos[3].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </td>
              {/* Columna 3: 5. Nariz, 6. Cuello, 7. Tórax */}
              <td style={{ border: '1px solid #000', padding: '3px 4px', verticalAlign: 'top', width: '20%' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    5. {examenesFisicos[4].nombre}
                  </div>
                  {examenesFisicos[4].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '8px', marginTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    6. {examenesFisicos[5].nombre}
                  </div>
                  {examenesFisicos[5].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', marginTop: '8px', fontSize: '9px', textAlign: 'center' }}>
                    7. {examenesFisicos[6].nombre}
                  </div>
                  {examenesFisicos[6].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </td>
              {/* Columna 4: 8. Tórax, 9. Abdomen, 10. Columna */}
              <td style={{ border: '1px solid #000', padding: '3px 4px', verticalAlign: 'top', width: '20%' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    8. {examenesFisicos[7].nombre}
                  </div>
                  {examenesFisicos[7].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '8px', marginTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    9. {examenesFisicos[8].nombre}
                  </div>
                  {examenesFisicos[8].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', marginTop: '8px', fontSize: '9px', textAlign: 'center' }}>
                    10. {examenesFisicos[9].nombre}
                  </div>
                  {examenesFisicos[9].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </td>
              {/* Columna 5: 11. Pelvis, 12. Extremidades, 13. Neurológico */}
              <td style={{ border: '1px solid #000', padding: '3px 4px', verticalAlign: 'top', width: '20%' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    11. {examenesFisicos[10].nombre}
                  </div>
                  {examenesFisicos[10].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '8px', marginTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9px', textAlign: 'center' }}>
                    12. {examenesFisicos[11].nombre}
                  </div>
                  {examenesFisicos[11].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', marginTop: '8px', fontSize: '9px', textAlign: 'center' }}>
                    13. {examenesFisicos[12].nombre}
                  </div>
                  {examenesFisicos[12].items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', fontSize: '8px' }}>
                      <span style={{ marginRight: '4px', fontSize: '9px' }}>□</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '6px', fontSize: '9px', fontStyle: 'italic', marginBottom: '4px' }}>
          CON EVIDENCIA DE PATOLOGÍA MARCAR CON "X" Y DESCRIBIR EN LA SIGUIENTE SECCIÓN ANOTANDO EL NUMERAL
        </div>
        <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '10px' }}>Observaciones</div>
        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px'
          }}
        >
          <tbody>
            {[1, 2, 3, 4].map((row) => (
              <tr key={row}>
                <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '20px' }}>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección E. RESULTADOS DE EXÁMENES GENERALES Y ESPECÍFICOS */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          E. RESULTADOS DE EXÁMENES GENERALES Y ESPECÍFICOS DE ACUERDO AL RIESGO Y PUESTO DE TRABAJO (IMAGEN, LABORATORIO Y OTROS)
        </h3>

        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px',
            marginBottom: '6px'
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9' }}>
                EXAMEN
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9' }}>
                FECHA aaaa / mm / dd
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9' }}>
                RESULTADO
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((row, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '30px' }}>
                  {idx === 0 && resultadosExamenes?.[0]?.examen || ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>
                  {idx === 0 && resultadosExamenes?.[0]?.fecha || ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>
                  {idx === 0 && resultadosExamenes?.[0]?.resultado || ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '10px' }}>Observaciones:</div>
        <div style={{ border: '1px solid #000', padding: '4px 6px', minHeight: '60px', fontSize: '10px', whiteSpace: 'pre-wrap' }}>
          {resultadosExamenesObservaciones || ''}
        </div>
      </div>

      {/* Sección F. DIAGNÓSTICO */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          F. DIAGNÓSTICO
        </h3>
        <div style={{ fontSize: '10px', marginBottom: '4px' }}>
          PRE= PRESUNTIVO          DEF= DEFINITIVO
        </div>

        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px'
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9', width: '5%' }}>
                #
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9' }}>
                EXAMEN DE SALUD OCUPACIONAL
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9', width: '10%' }}>
                CIE
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9', width: '5%' }}>
                PRE
              </th>
              <th style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', backgroundColor: '#E8F5E9', width: '5%' }}>
                DEF
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}></td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}></td>
              <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
            </tr>
            {[2, 3].map((num) => (
              <tr key={num}>
                <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>{num}</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección G. EVALUACIÓN MÉDICA DE RETIRO */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          G. EVALUACIÓN MÉDICA DE RETIRO
        </h3>

        <div style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontWeight: 'bold' }}>SE REALIZÓ LA EVALUACIÓN</span>
            <span style={{ marginLeft: '8px', marginRight: '12px' }}>□ SI</span>
            <span style={{ marginRight: '12px' }}>□ NO</span>
          </div>
          <div style={{ marginTop: '4px', fontWeight: 'bold' }}>Observaciones:</div>
          <div style={{ minHeight: '60px', fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {evaluacionMedicaRetiroObservaciones || ''}
          </div>
        </div>
      </div>

      {/* Sección H. RECOMENDACIONES Y/O TRATAMIENTO */}
      <div className="mb-3" style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          H. RECOMENDACIONES Y/O TRATAMIENTO
        </h3>

        <div style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px' }}>
          <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
            INDICACIONES GENERALES: HÁBITOS DIETÉTICO E HIGIÉNICOS SALUDABLES, ACTIVIDAD FÍSICA, SALUD PREVENTIVA
          </div>
          <div style={{ minHeight: '60px', fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {recomendacionesTratamiento || ''}
          </div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '10px', fontStyle: 'italic', textAlign: 'center' }}>
          CERTIFICO QUE LO ANTERIORMENTE EXPRESADO EN RELACIÓN A MI ESTADO DE SALUD ES VERDAD. SE ME HA INFORMADO MI ESTADO ACTUAL DE SALUD Y LAS RECOMENDACIONES PERTINENTES.
        </div>
      </div>

      {/* Sección I. DATOS DEL PROFESIONAL y J. FIRMA DEL USUARIO - En la misma fila */}
      <div className="mt-4" style={{ marginTop: '16px', pageBreakInside: 'avoid' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginBottom: '6px'
          }}
        >
          I. DATOS DEL PROFESIONAL
        </h3>

        <table
          style={{
            width: '100%',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '10px'
          }}
        >
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '15%' }}>
                FECHA aaaa-mm-dd
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '12%' }}>
                {fechaEvaluacion || ''}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '8%' }}>
                HORA
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '10%' }}>
                {horaEvaluacion || ''}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '15%' }}>
                NOMBRES Y APELLIDOS
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '20%' }}>
                <EditableText
                  field="nombresApellidosProfesional"
                  value={nombresApellidosProfesional || 'DR. ROLANDO MALDONADO ALVARADO'}
                  placeholder="Nombre del profesional"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '8%' }}>
                CÓDIGO
              </td>
              <td style={{ border: '1px solid #000', padding: '4px 6px', width: '12%' }}>
                <EditableText
                  field="codigoProfesional"
                  value={codigoProfesional || '10093'}
                  placeholder="Código"
                  editable={editable}
                  onFieldChange={onFieldChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="6" style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>
                FIRMA Y SELLO
              </td>
              <td colSpan="2" style={{ border: '1px solid #000', padding: '30px 8px', textAlign: 'center', minHeight: '50px' }}>
                {/* Espacio para firma y sello */}
              </td>
            </tr>
          </tbody>
        </table>

        <h3
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: '#B4D3FF',
            padding: '4px 8px',
            marginTop: '12px',
            marginBottom: '6px'
          }}
        >
          J. FIRMA DEL USUARIO
        </h3>
        <div style={{ border: '1px solid #000', padding: '30px 8px', textAlign: 'center', minHeight: '50px' }}>
          {/* Espacio para firma del usuario */}
        </div>
      </div>
    </div>
  );
}