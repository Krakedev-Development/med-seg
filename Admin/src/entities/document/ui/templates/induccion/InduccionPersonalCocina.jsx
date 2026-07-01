import React from "react";

const EditableText = ({
  field,
  value,
  placeholder = '',
  editable = false,
  onFieldChange,
  className = '',
}) => {
  if (!editable) {
    return <span className={className}>{value || placeholder}</span>;
  }

  return (
    <span
      className={`${className} outline-none border-b border-dashed border-primary/40 focus:border-primary`}
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

export default function InduccionPersonalCocina({
  logoEmpresa,
  nombreEmpresa = "Nombre de la Empresa",
  nombreTrabajador = "_________________",
  numeroCedula = "_________________",
  fecha = "____/____/______",
  puestoTrabajo = "_________________",
  actividadesPuesto = "________________________________________________________________________________________________________________",
  tecnicoSeguridad = "Ing. Mikaela Granda Romero",
  ciTecnico = "0703753681",
  registroTecnico = "7240200519",
  editable = false,
  onFieldChange,
}) {
  // Datos de factores de riesgo según el PDF
  const factoresRiesgo = [
    {
      factor: "Heridas por cortes y pinchazos",
      consecuencias: "Laceraciones profundas, amputaciones, hemorragias, infecciones, incapacidad temporal o permanente.",
      metodo: "Utilizar siempre cuchillos y utensilios afilados con precaución. Mantener las hojas limpias y bien afiladas. Usar tablas de corte estables. Guardar cuchillos en lugar seguro. Nunca cortar hacia el cuerpo. Usar guantes de protección cuando sea necesario.",
    },
    {
      factor: "Accidentes por caídas y resbalones",
      consecuencias: "Fracturas, contusiones, esguinces, lesiones en cabeza y columna vertebral.",
      metodo: "Mantener pisos secos y limpios. Usar calzado antideslizante. Colocar señalización de piso mojado. Limpiar derrames inmediatamente. Organizar cables y obstáculos. Usar escaleras adecuadas para alcanzar objetos altos.",
    },
    {
      factor: "Golpes y caída de objetos",
      consecuencias: "Contusiones, fracturas, laceraciones, traumatismos craneoencefálicos.",
      metodo: "Organizar utensilios y equipo de forma segura. No sobrecargar estantes. Colocar objetos pesados en estantes bajos. Usar guantes de protección. Mantener pasillos libres de obstáculos.",
    },
    {
      factor: "Contacto térmico y quemaduras",
      consecuencias: "Quemaduras de primer, segundo y tercer grado, dolor intenso, cicatrices permanentes.",
      metodo: "Usar guantes termorresistentes al manipular objetos calientes. Mantener asas de ollas hacia adentro. Usar protectores faciales cuando sea necesario. Verificar temperatura antes de tocar. Mantener extintores accesibles.",
    },
    {
      factor: "Contaminación acústica",
      consecuencias: "Pérdida auditiva temporal o permanente, estrés, fatiga, dificultad para comunicarse.",
      metodo: "Usar protección auditiva en áreas ruidosas. Mantener equipo en buen estado. Implementar controles de ingeniería para reducir ruido. Limitar tiempo de exposición. Realizar mantenimiento preventivo.",
    },
    {
      factor: "Estrés térmico",
      consecuencias: "Golpe de calor, agotamiento por calor, deshidratación, fatiga, mareos.",
      metodo: "Mantener ventilación adecuada en cocina. Usar ropa ligera y transpirable. Beber agua frecuentemente. Tomar descansos en áreas frescas. Controlar temperatura ambiente. Evitar exposición prolongada al calor.",
    },
    {
      factor: "Instalaciones eléctricas",
      consecuencias: "Electrocución, quemaduras, paro cardíaco, incendios.",
      metodo: "Mantener equipo eléctrico en buen estado. No manipular con manos mojadas. Usar conexiones seguras. Realizar mantenimiento periódico. Reportar fallas eléctricas inmediatamente. Desconectar antes de limpiar.",
    },
    {
      factor: "Riesgos ergonómicos",
      consecuencias: "Lesiones musculoesqueléticas, dolor de espalda, lesiones en muñecas y cuello, fatiga.",
      metodo: "Mantener postura correcta al trabajar. Usar superficie de trabajo a altura adecuada. Realizar pausas activas. Usar equipo ergonómico cuando sea posible. Evitar movimientos repetitivos. Mantener objetos cerca del cuerpo.",
    },
    {
      factor: "Riesgos biológicos",
      consecuencias: "Infecciones gastrointestinales, intoxicaciones alimentarias, enfermedades transmitidas por alimentos.",
      metodo: "Lavarse las manos frecuentemente. Mantener higiene personal adecuada. Manipular alimentos con cuidado. Almacenar alimentos a temperaturas correctas. Evitar contaminación cruzada. Usar guantes cuando sea necesario.",
    },
    {
      factor: "Limpieza de cocinas",
      consecuencias: "Irritación de piel y ojos, intoxicación por productos químicos, quemaduras químicas.",
      metodo: "Usar guantes al manipular productos de limpieza. Leer etiquetas de productos. Mezclar productos solo según instrucciones. Mantener áreas bien ventiladas. Almacenar productos químicos de forma segura. Usar protección personal adecuada.",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return fecha;
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

  return (
    <div
      id="documento-induccion"
      className="bg-white text-sm text-black max-w-4xl mx-auto print:text-black print:bg-white"
      style={{
        backgroundColor: '#fff',
        color: '#000',
        visibility: 'visible',
        opacity: 1,
        display: 'block',
        fontSize: '11px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* PÁGINA 1 */}
      <div style={{ pageBreakAfter: 'always', padding: '20px' }}>
        {/* Encabezado Institucional - Tabla como en imagen 1 */}
        <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
          <table
            className="w-full border border-black"
            style={{
              width: '100%',
              border: '1px solid #000',
              borderCollapse: 'collapse',
              marginBottom: '24px'
            }}
          >
            <tbody>
              <tr>
                {/* Columna izquierda: Logo */}
                <td
                  rowSpan="3"
                  className="border border-black"
                  style={{
                    border: '1px solid #000',
                    width: '33%',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                    padding: '16px'
                  }}
                >
                  {logoEmpresa ? (
                    <img
                      src={logoEmpresa}
                      alt="Logo Empresa"
                      className="mx-auto object-contain"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '120px',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div
                      className="mx-auto flex items-center justify-center"
                      style={{
                        width: '120px',
                        height: '120px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f3f4f6'
                      }}
                    >
                      <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        LOGO
                      </span>
                    </div>
                  )}
                </td>
                {/* Columna derecha - Fila 1: Nombre de la Empresa */}
                <td
                  className="border border-black text-center"
                  style={{
                    border: '1px solid #000',
                    width: '67%',
                    padding: '12px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ color: '#dc2626', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    <EditableText
                      field="nombreEmpresa"
                      value={nombreEmpresa}
                      placeholder="NOMBRE DE LA EMPRESA"
                      editable={editable}
                      onFieldChange={onFieldChange}
                    />
                  </span>
                </td>
              </tr>
              <tr>
                {/* Columna derecha - Fila 2: Sistema de Gestión */}
                <td
                  className="border border-black text-center"
                  style={{
                    border: '1px solid #000',
                    padding: '12px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD OCUPACIONAL
                  </span>
                </td>
              </tr>
              <tr>
                {/* Columna derecha - Fila 3: Inducción */}
                <td
                  className="border border-black text-center"
                  style={{
                    border: '1px solid #000',
                    padding: '12px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    INDUCCIÓN DE SEGURIDAD Y SALUD OCUPACIONAL
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Introducción Legal - VA PRIMERO */}
        <div className="mb-6 text-justify" style={{ textAlign: 'justify', fontSize: '11px', lineHeight: '1.5', marginBottom: '24px' }}>
          <p className="mb-2">
            En conformidad con lo dispuesto en el <strong>ACUERDO MINISTERIAL Nro. MDT-2024-196</strong>, en el que se acuerda "EXPEDIR LAS
            NORMAS GENERALES PARA EL CUMPLIMIENTO Y CONTROL DE LAS OBLIGACIONES LABORALES DE LOS
            EMPLEADORES PÚBLICOS Y PRIVADOS EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO" en el
            CAPÍTULO II DE LOS TRABAJADORES, Artículo 16.- De los trabajadores. - Los trabajadores tendrán los siguientes
            derechos, en materia de seguridad y salud: Recibir de forma gratuita, inducción, educación y capacitación en
            materia de seguridad y salud en el trabajo con énfasis en los riesgos laborales vinculados a las actividades que
            realiza y las posibles consecuencias para su salud.
          </p>
          <p className="mb-2">
            La <strong>Decisión 584</strong> del Consejo Andino de Ministerios de Relaciones Exteriores que contiene el "Instrumento Andino de
            Seguridad y Salud en el Trabajo" y su Reglamento expedido mediante Resolución 957, establecen los lineamientos
            generales para los países que integran la Comunidad Andina; la política de prevención de riesgo del trabajo; obligaciones
            de los empleadores; obligaciones de los trabajadores, y sanciones por incumplimientos.
          </p>
          <p className="mb-2">
            El <strong>Código de Trabajo</strong> en su artículo 410. Prevé que: "Los empleadores están obligados a asegurar a sus trabajadores
            condiciones de trabajo que no presenten peligro para su salud o vida. Los trabajadores están obligados a acatar las
            medidas de prevención, seguridad e higiene determinadas en los reglamentos y facilitadas por el empleador. Su omisión
            constituye justa causa para la terminación del contrato de trabajo".
          </p>
          <p className="mb-2">
            <strong>
              <EditableText
                field="nombreEmpresa"
                value={nombreEmpresa}
                placeholder="NOMBRE DE LA EMPRESA"
                editable={editable}
                onFieldChange={onFieldChange}
              />
            </strong>, en conocimiento de la Resolución C.D. 513 Reglamento del Seguro General de Riesgos del
            Trabajo, sobre "Accidentes del Trabajo y Enfermedades Profesionales", ha informado en forma oportuna a sus
            trabajadores sobre los riesgos asociados a la actividad específica a ejecutar y los procedimientos correspondientes de
            trabajo seguro, con el objetivo de dar cumplimiento a la normativa legal vigente y generar conciencia sobre las actitudes
            proactivas en cada integrante de esta empresa.
          </p>
        </div>

        {/* Datos del Trabajador - Tabla como en imagen 2 - VA DESPUÉS */}
        <div className="mb-6" style={{ marginBottom: '24px' }}>
          <table
            className="w-full border border-black"
            style={{
              width: '100%',
              border: '1px solid #000',
              borderCollapse: 'collapse',
              fontSize: '11px'
            }}
          >
            <tbody>
              {/* Header: Nombre del trabajador */}
              <tr>
                <td
                  colSpan="4"
                  className="border border-black"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    fontWeight: 'bold',
                    textAlign: 'left'
                  }}
                >
                  <EditableText
                    field="nombreTrabajador"
                    value={nombreTrabajador}
                    placeholder="Nombre del trabajador"
                    editable={editable}
                    onFieldChange={onFieldChange}
                  />
                </td>
              </tr>
              {/* Fila de etiquetas: Fecha, Nº de Cédula, Firma, Huella */}
              <tr>
                <td
                  className="border border-black text-center font-bold"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    width: '25%'
                  }}
                >
                  Fecha
                </td>
                <td
                  className="border border-black text-center font-bold"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    width: '25%'
                  }}
                >
                  Nº de Cédula
                </td>
                <td
                  className="border border-black text-center font-bold"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    width: '25%'
                  }}
                >
                  Firma
                </td>
                <td
                  className="border border-black text-center font-bold"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    width: '25%'
                  }}
                >
                  Huella
                </td>
              </tr>
              {/* Fila de valores: Fecha, Nº de Cédula, Firma, Huella */}
              <tr>
                <td
                  className="border border-black text-center"
                  style={{
                    border: '1px solid #000',
                    padding: '16px 8px',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}
                >
                  <EditableText
                    field="fecha"
                    value={formatDate(fecha)}
                    placeholder="____/____/______"
                    editable={editable}
                    onFieldChange={onFieldChange}
                  />
                </td>
                <td
                  className="border border-black text-center"
                  style={{
                    border: '1px solid #000',
                    padding: '16px 8px',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}
                >
                  <EditableText
                    field="numeroCedula"
                    value={numeroCedula}
                    placeholder="_________________"
                    editable={editable}
                    onFieldChange={onFieldChange}
                  />
                </td>
                <td
                  className="border border-black"
                  style={{
                    border: '1px solid #000',
                    padding: '24px 8px',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    minHeight: '60px'
                  }}
                >
                  {/* Espacio para firma */}
                </td>
                <td
                  className="border border-black"
                  style={{
                    border: '1px solid #000',
                    padding: '24px 8px',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    minHeight: '60px'
                  }}
                >
                  {/* Espacio para huella */}
                </td>
              </tr>
              {/* Fila: Puesto de trabajo */}
              <tr>
                <td
                  className="border border-black font-bold"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    width: '25%'
                  }}
                >
                  Puesto de trabajo
                </td>
                <td
                  colSpan="3"
                  className="border border-black"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'left'
                  }}
                >
                  <EditableText
                    field="puestoTrabajo"
                    value={puestoTrabajo}
                    placeholder="_________________"
                    editable={editable}
                    onFieldChange={onFieldChange}
                  />
                </td>
              </tr>
              {/* Fila: Actividades del puesto */}
              <tr>
                <td
                  className="border border-black font-bold align-top"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    verticalAlign: 'top',
                    width: '25%'
                  }}
                >
                  Actividades del puesto
                </td>
                <td
                  colSpan="3"
                  className="border border-black"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'left',
                    verticalAlign: 'top',
                    minHeight: '60px',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <EditableText
                    field="actividadesPuesto"
                    value={actividadesPuesto}
                    placeholder="Describe las actividades del puesto..."
                    editable={editable}
                    onFieldChange={onFieldChange}
                    className="block"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* PÁGINA 2 y 3 - Tabla de Factores de Riesgo */}
      <div style={{ pageBreakBefore: 'always', padding: '20px' }}>
        <div className="mb-4">
          <h3 className="font-bold text-center mb-4" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
            FACTORES DE RIESGO, CONSECUENCIAS Y MÉTODO CORRECTO DE TRABAJO
          </h3>

          <table
            className="w-full border border-black"
            style={{
              border: '1px solid #000',
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: '10px',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            <thead>
              <tr className="bg-gray-200" style={{ backgroundColor: '#e5e7eb' }}>
                <th
                  className="border border-black p-2 text-left"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'left',
                    width: '25%',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}
                >
                  FACTORES DE RIESGO
                </th>
                <th
                  className="border border-black p-2 text-left"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'left',
                    width: '30%',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}
                >
                  CONSECUENCIAS
                </th>
                <th
                  className="border border-black p-2 text-left"
                  style={{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'left',
                    width: '45%',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}
                >
                  MÉTODO CORRECTO DE TRABAJO
                </th>
              </tr>
            </thead>
            <tbody>
              {factoresRiesgo.map((item, index) => (
                <tr key={index} style={{ pageBreakInside: 'avoid' }}>
                  <td
                    className="border border-black p-2 align-top"
                    style={{
                      border: '1px solid #000',
                      padding: '8px',
                      verticalAlign: 'top',
                      fontSize: '10px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}
                  >
                    {item.factor}
                  </td>
                  <td
                    className="border border-black p-2 align-top"
                    style={{
                      border: '1px solid #000',
                      padding: '8px',
                      verticalAlign: 'top',
                      fontSize: '10px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}
                  >
                    {item.consecuencias}
                  </td>
                  <td
                    className="border border-black p-2 align-top"
                    style={{
                      border: '1px solid #000',
                      padding: '8px',
                      verticalAlign: 'top',
                      fontSize: '10px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}
                  >
                    {item.metodo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie de Documento */}
        <div className="mt-8 border-t border-black pt-4" style={{ marginTop: '32px', borderTop: '1px solid #000', paddingTop: '16px', fontSize: '11px' }}>
          <div className="space-y-1">
            <p>
              <strong>TÉCNICO DE SEGURIDAD:</strong>{' '}
              <EditableText
                field="responsable"
                value={tecnicoSeguridad}
                placeholder="Nombre del técnico de seguridad"
                editable={editable}
                onFieldChange={onFieldChange}
              />
            </p>
            <p>
              <strong>C.I.</strong>{' '}
              <EditableText
                field="ciTecnico"
                value={ciTecnico}
                placeholder="Cédula del técnico"
                editable={editable}
                onFieldChange={onFieldChange}
              />
            </p>
            <p><strong>MASTER EN PREVENCIÓN DE RIESGOS LABORALES</strong></p>
            <p>
              <strong>Reg. N°</strong>{' '}
              <EditableText
                field="registroTecnico"
                value={registroTecnico}
                placeholder="Registro técnico"
                editable={editable}
                onFieldChange={onFieldChange}
              />
            </p>
            <div className="mt-4">
              <p><strong>FIRMA</strong> _________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

