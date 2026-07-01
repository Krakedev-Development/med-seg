import React, { useState } from "react";

/**
 * SECCIONES_SST:
 * - "datos" => campos de texto (DATOS GENERALES)
 * - "checklist" => tabla con CUMPLE / NO CUMPLE / NO APLICA + Observaciones
 *
 * Ya te dejo armadas:
 * - DATOS GENERALES
 * - GESTIÓN ADMINISTRATIVA (varios ítems)
 * - GESTIÓN TÉCNICA (varios ítems)
 *
 * El resto de secciones / ítems los puedes seguir agregando
 * siguiendo exactamente el mismo formato.
 */

const SECCIONES_SST = [
  {
    id: "datos-generales",
    titulo: "DATOS GENERALES DE LA EMPRESA",
    tipo: "datos",
    campos: [
      { id: "inspeccion", etiqueta: "Inspección" },
      { id: "fecha_inspeccion", etiqueta: "Fecha inspección" },
      { id: "reinspeccion", etiqueta: "Re inspección" },
      { id: "fecha_reinspeccion", etiqueta: "Fecha re inspección" },
      {
        id: "fecha_maxima_info",
        etiqueta: "Fecha máxima para remitir información",
      },
      { id: "tipo_empresa", etiqueta: "Tipo de empresa (pública / privada)" },
      { id: "empleador", etiqueta: "Empleador" },
      { id: "telefono", etiqueta: "Número de teléfono" },
      { id: "razon_social", etiqueta: "Razón social" },
      { id: "ruc", etiqueta: "RUC" },
      { id: "correo", etiqueta: "Correo electrónico" },
      { id: "actividad_economica", etiqueta: "Actividad económica" },
      {
        id: "tipo_centro_trabajo",
        etiqueta: "Tipo de centro de trabajo (Matriz / Sucursal)",
      },
      {
        id: "direccion_centro",
        etiqueta: "Dirección del centro de trabajo de la empresa inspeccionada",
      },
      {
        id: "numero_total_trabajadores",
        etiqueta: "Número total de trabajadores / servidores",
      },
      {
        id: "consolidado_iess",
        etiqueta: "Consolidado de planilla del IESS (SI/NO)",
      },
      {
        id: "trabajadores_centro",
        etiqueta: "Número de trabajadores / servidores del centro de trabajo",
      },
      { id: "hombres", etiqueta: "Hombres" },
      { id: "mujeres", etiqueta: "Mujeres" },
      { id: "teletrabajadores", etiqueta: "Teletrabajadores" },
      { id: "extranjeros", etiqueta: "Extranjeros" },
      { id: "adolescentes", etiqueta: "Adolescentes" },
      { id: "mujeres_embarazadas", etiqueta: "Mujeres embarazadas" },
      { id: "adultos_mayores", etiqueta: "Adultos mayores" },
      { id: "ninos", etiqueta: "Niños" },
      { id: "mujeres_lactancia", etiqueta: "Mujeres en lactancia" },
      {
        id: "numero_centros_abiertos",
        etiqueta: "Número de centros de trabajo abiertos",
      },
      { id: "horario_trabajo", etiqueta: "Horario de trabajo" },
      {
        id: "entrevistados",
        etiqueta: "Nombre de los entrevistados en la inspección o re inspección",
      },
    ],
  },

  // ===================== GESTIÓN ADMINISTRATIVA =====================
  {
    id: "gestion-administrativa",
    titulo: "GESTIÓN ADMINISTRATIVA",
    subtituloNorma:
      "Acuerdo Ministerial 196 (2024) Art. 4 y Art.18. - Decisión 584 (2004) Art. 11.",
    tipo: "checklist",
    categoriaGeneral: "Organización de seguridad y salud en el trabajo",
    items: [
      {
        id: "ga1",
        numero: "1",
        texto:
          "¿Cuenta con un Plan de Prevención de Riesgos Laborales (1 a 10 trabajadores) aprobado y registrado en el SUT?",
        referenciaLegal:
          "Acuerdo Ministerial 196 (2024) Art. 4 y Art.18.Decisión 584 (2004) Art. 11",
      },
      {
        id: "ga2",
        numero: "2",
        texto:
          "¿Cuenta con un Reglamento de Higiene y seguridad (más de 10 trabajadores) aprobado y registrado en el SUT?",
        referenciaLegal: "Código del Trabajo (2005) Art. 434. Acuerdo Ministerial 196 (2024) Art. 4, 19,"
      },
      {
        id: "ga3",
        numero: "3",
        texto:
          "¿Se ha socializado a todos los trabajadores la Política de seguridad y salud en el trabajo?",
        referenciaLegal:
          "Decisión 584 (2004) Art. 11",
      },
      {
        id: "ga4",
        numero: "4",
        texto:
          "¿Cuenta con el registro del Monitor de Seguridad e Higiene del Trabajo en la Plataforma SUT?",
        referenciaLegal:
          "Decreto Ejecutivo 255 (2024) Art. 20. - Acuerdo Ministerial 196 (2024) Art. 18 y 19.",
      },
      {
        id: "ga5",
        numero: "5",
        texto:
          "¿Cuenta con el registro del Técnico de Seguridad e Higiene del Trabajo en la Plataforma SUT?",
        referenciaLegal:
          "Decreto Ejecutivo 255 (2024) Art. 25. - Acuerdo Ministerial 196 (2024) Art. 14.",
      },
      {
        id: "ga6",
        numero: "6",
        texto:
          "¿Cuenta con el registro del Servicio Externo de Seguridad e Higiene del Trabajo en la Plataforma SUT?",
        referenciaLegal: "Acuerdo Ministerial 196 (2024) Art. 13.",
      },
      {
        id: "ga7",
        numero: "7",
        texto:
          "¿Cuenta con el informe de actividades realizadas por técnico o servicio externo de seguridad e higiene del trabajo?",
        referenciaLegal: "Decreto Ejecutivo 255 (2024) Art. 21.",
        subLista: [
          "El informe debe contener como mínimo:",
          "Objetivo",
          "Estadísticas básicas (accidentes de trabajo, incidentes y/o presunción de enfermedades profesionales registradas)",
          "Principales actividades ejecutadas con detalle de las horas de gestión asignadas a cada actividad.",
          "Conclusiones",
          "Registro fotográfico",
          "Firmas de Responsabilidad"
        ]
      },
      {
        id: "ga8",
        numero: "8",
        texto:
          "¿Cuenta con el registro del profesional médico en la Plataforma SUT?",
        referenciaLegal:
          "Decreto Ejecutivo 255 (2024) Art. 33. - Acuerdo Ministerial 196 (2024) Art. 18 y 19.",
      },
      {
        id: "ga9",
        numero: "9",
        texto:
          "¿Cuenta con el registro del Delegado de Seguridad y Salud en la plataforma SUT?",
        referenciaLegal:
          "Decreto Ejecutivo 255 (2024) Art. 32. - Acuerdo Ministerial 196 (2024) Art. 18 y 19.",
      },
      {
        id: "ga10",
        numero: "10",
        texto:
          "¿Cuenta con el registro del Comité de Seguridad y Salud en la plataforma SUT?",
        referenciaLegal:
          "Resolución 957 (2008) Art. 10, 13, 14. - Decreto Ejecutivo 255 (2024) Art. 36, 38.",
      },
      {
        id: "ga11",
        numero: "11",
        texto:
          "¿Cuenta con informe de la gestión realizada por los miembros del Organismo Paritario? El informe debe contener como mínimo: Objetivo, cronograma de actividades conforme Art. 39 del Decreto Ejecutivo Nro. 255, conclusiones, registro fotográfico y firmas de responsabilidad.",
        referenciaLegal: "Acuerdo Ministerial 196 (2024) Art. 4.",
      },
      {
        id: "ga12",
        numero: "12",
        texto:
          "¿Se evidencia por escrito los procedimientos generales que establecen el deber de colaboración en la implementación de las medidas de seguridad y salud en el trabajo para empleadores que realizan actividades simultáneas en un mismo lugar y/o centro de trabajo? (contratistas, subcontratistas, etc.).",
        referenciaLegal: "",
      },
    ],
  },

  // ===================== GESTIÓN TÉCNICA =====================
  {
    id: "gestion-tecnica",
    titulo: "GESTIÓN TÉCNICA",
    subtituloNorma:
      "Decisión 584 (2004) Art. 11. - Código del Trabajo Art. 42. - Decreto Ejecutivo 255 (2024) Art. 28.",
    tipo: "checklist",
    categoriaGeneral: "Identificación y evaluación de peligros y riesgos",
    items: [
      {
        id: "gt1",
        numero: "1",
        texto:
          "¿Cuenta con un diagrama de flujo de todos los procesos productivos y/o de servicios?",
        referenciaLegal: "Decisión 584 (2004) Art. 11.",
      },
      {
        id: "gt2",
        numero: "2",
        texto:
          "¿Se dispone de un descriptivo por puesto de trabajo? Debe incluir número de trabajadores, actividades realizadas, horas diarias por actividad y recursos utilizados (máquinas, equipos, herramientas, agentes químicos, biológicos, etc.).",
        referenciaLegal: "Decisión 584 (2004) Art. 11.",
      },
      {
        id: "gt3",
        numero: "3",
        texto:
          "¿Cuenta con un mapa de riesgos del lugar y/o centro de trabajo, con señalización de seguridad, EPP y dispositivos de parada de emergencia?",
        referenciaLegal:
          "Decisión 584 (2004) Art. 11. - Resolución 957 (2008) Art. 1. - Decreto Ejecutivo 255 (2024) Art. 27, 28, 47.",
      },
      {
        id: "gt4",
        numero: "4",
        texto:
          "¿Cuenta con una matriz de identificación de peligros y evaluación de riesgos laborales por puesto de trabajo en la que se ha aplicado una metodología reconocida y validada?",
        referenciaLegal:
          "Decisión 584 (2004) Art. 11, 12, 18. - Resolución 957 (2008) Art. 1. - Decreto Ejecutivo 255 (2024) Art. 48.",
      },
      {
        id: "gt5",
        numero: "5",
        texto:
          "¿Cuenta con un informe de medición de los agentes físicos, químicos y/o biológicos del puesto de trabajo? Debe incluir fecha, puesto, número de expuestos, metodología, resultados, comparación con norma técnica, certificados de calibración, registro fotográfico y firmas de responsabilidad.",
        referenciaLegal:
          "Decisión 584 (2004) Art. 11, 12, 18. - Resolución 957 (2008) Art. 1. - Decreto Ejecutivo 255 (2024) Art. 44, 45 y 46.",
      },
      {
        id: "gt6",
        numero: "6",
        texto:
          "¿Cuenta con un informe de evaluación de riesgos de seguridad, ergonómicos y psicosociales de los puestos de trabajo, con metodología reconocida, resultados y comparación con estándares técnicos?",
        referenciaLegal:
          "Decisión 584 (2004) Art. 11. - Resolución 957 (2008) Art. 1. - Código del Trabajo Art. 412. - Decreto Ejecutivo 255 (2024) Art. 49.",
      },
      {
        id: "gt7",
        numero: "7",
        texto:
          "¿Cuenta con un informe de las medidas de prevención y protección implementadas por puesto de trabajo, con fechas, cronograma, jerarquía de controles, resultados y seguimiento?",
        referenciaLegal: "Resolución 957 (2008) Art. 1.",
      },
      {
        id: "gt8",
        numero: "8",
        texto:
          "¿Cuenta con el cálculo del riesgo residual en la matriz de identificación de peligros y evaluación de riesgos laborales?",
        referenciaLegal: "Decisión 584 (2004) Art. 11.",
      },
      {
        id: "gt9",
        numero: "9",
        texto:
          "¿Se ha verificado in situ la implementación de medidas de prevención y protección conforme el informe de medidas implementadas por puesto de trabajo?",
        referenciaLegal: "Acuerdo Ministerial 196 (2024) Anexo 3.",
      },
      // 👉 A partir de aquí puedes seguir agregando TODOS los demás ítems
      // (Condiciones de Trabajo, Señalización, Gestión del talento humano, etc.)
      // usando el mismo formato: { id, numero, texto, referenciaLegal }
    ],
  },
];

/* ==== COMPONENTES DE APOYO ==== */

function CampoTexto({ campoId, etiqueta, value, onChange }) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <label
        htmlFor={campoId}
        className="text-[11px] font-semibold uppercase tracking-wide"
      >
        {etiqueta}
      </label>
      <input
        id={campoId}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(campoId, e.target.value)}
        className="border border-gray-400 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-[1px] focus:ring-blue-600"
      />
    </div>
  );
}

function FilaChecklist({ item, value, onChange, isFirstRow, totalRows, categoriaGeneral }) {
  const handleEstado = (estado) => {
    onChange(item.id, {
      ...value,
      estado,
    });
  };

  // Formatear referencias legales en múltiples líneas
  const formatearReferencias = (referencia) => {
    if (!referencia) return null;
    // Separar por " - " o ". " para crear líneas
    const lineas = referencia.split(/ - |\. /).filter(line => line.trim());
    return lineas.map((linea, idx) => {
      const texto = linea.trim();
      // Agregar punto si no termina con uno y no es la última línea
      if (idx < lineas.length - 1 && !texto.endsWith('.')) {
        return texto + '.';
      }
      return texto;
    });
  };

  return (
    <tr className="align-top break-inside-avoid">
      {/* Columna 1: Referencia Legal (izquierda) */}
      <td className="border border-black p-1 text-[9px] leading-tight text-left align-top w-[15%]">
        {item.referenciaLegal && (
          <div className="text-gray-700 italic">
            {formatearReferencias(item.referenciaLegal)?.map((linea, idx) => (
              <div key={idx} className="mb-0.5">
                {linea}
              </div>
            ))}
          </div>
        )}
      </td>
      {/* Columna 2: Categoría General (combinada con rowspan) */}
      {isFirstRow && categoriaGeneral && (
        <td
          rowSpan={totalRows}
          className="border border-black p-1 text-[10px] leading-tight text-center align-middle w-[15%] font-semibold"
          style={{ verticalAlign: 'middle' }}
        >
          <div className="flex items-center justify-center h-full text-center">
            {categoriaGeneral}
          </div>
        </td>
      )}
      {/* Columna 3: Número */}
      <td className="border border-black p-1 text-center align-middle w-[5%]">
        <div className="font-semibold text-[11px]">
          {item.numero || ""}
        </div>
      </td>
      {/* Columna 4: Pregunta/Ítem */}
      <td className="border border-black p-1 text-[10px] leading-tight text-left align-top w-[35%]">
        <div>{item.texto}</div>
        {item.subLista && (
          <ul className="mt-1 ml-4 list-disc text-[9px] space-y-0.5">
            {item.subLista.map((subItem, idx) => (
              <li key={idx}>{subItem}</li>
            ))}
          </ul>
        )}
      </td>
      {/* Columna 5: CUMPLE */}
      <td className="border border-black p-1 text-center align-middle w-[10%]">
        <input
          type="radio"
          name={item.id}
          checked={value?.estado === "CUMPLE"}
          onChange={() => handleEstado("CUMPLE")}
          className="w-4 h-4"
        />
      </td>
      {/* Columna 6: NO CUMPLE */}
      <td className="border border-black p-1 text-center align-middle w-[10%]">
        <input
          type="radio"
          name={item.id}
          checked={value?.estado === "NO_CUMPLE"}
          onChange={() => handleEstado("NO_CUMPLE")}
          className="w-4 h-4"
        />
      </td>
      {/* Columna 7: NO APLICA */}
      <td className="border border-black p-1 text-center align-middle w-[10%]">
        <input
          type="radio"
          name={item.id}
          checked={value?.estado === "NA"}
          onChange={() => handleEstado("NA")}
          className="w-4 h-4"
        />
      </td>
    </tr>
  );
}

function SeccionSST({
  seccion,
  datosGenerales,
  setDatosGenerales,
  respuestas,
  setRespuestas,
}) {
  const isDatos = seccion.tipo === "datos";

  const handleChangeCampo = (campoId, val) => {
    setDatosGenerales((prev) => ({
      ...prev,
      [campoId]: val,
    }));
  };

  const handleChangeItem = (itemId, nuevoValor) => {
    setRespuestas((prev) => ({
      ...prev,
      [itemId]: nuevoValor,
    }));
  };

  return (
    <section
      className="mb-6 pb-4 break-inside-avoid"
      style={{ pageBreakInside: "avoid" }}
    >
      <h2 className="text-[12px] font-bold uppercase text-center mb-2 underline">
        {seccion.titulo}
      </h2>
      {seccion.subtituloNorma && (
        <p className="text-[10px] text-center mb-2 italic">
          {seccion.subtituloNorma}
        </p>
      )}

      {isDatos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          {seccion.campos.map((campo) => (
            <CampoTexto
              key={campo.id}
              campoId={campo.id}
              etiqueta={campo.etiqueta}
              value={datosGenerales[campo.id]}
              onChange={handleChangeCampo}
            />
          ))}
        </div>
      ) : (
        <table className="w-full border border-black border-collapse text-[11px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-1 text-[10px] font-semibold w-[15%]"></th>
              <th className="border border-black p-1 text-[10px] font-semibold w-[15%]"></th>
              <th className="border border-black p-1 text-[10px] font-semibold w-[5%]"></th>
              <th className="border border-black p-1 text-[10px] font-semibold w-[35%]">
                {seccion.titulo}
              </th>
              <th className="border border-black p-1 text-[10px] font-semibold w-[10%]">
                CUMPLE
              </th>
              <th className="border border-black p-1 text-[10px] font-semibold w-[10%]">
                NO CUMPLE
              </th>
              <th className="border border-black p-1 text-[10px] font-semibold w-[10%]">
                NO APLICA
              </th>
            </tr>
          </thead>
          <tbody>
            {seccion.items.map((item, index) => (
              <FilaChecklist
                key={item.id}
                item={item}
                value={respuestas[item.id]}
                onChange={handleChangeItem}
                isFirstRow={index === 0}
                totalRows={seccion.items.length}
                categoriaGeneral={seccion.categoriaGeneral}
              />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

/**
 * Componente principal del documento
 */
export default function ListaVerificacionSST() {
  const [datosGenerales, setDatosGenerales] = useState({});
  const [respuestas, setRespuestas] = useState({});

  return (
    <div className="max-w-5xl mx-auto bg-white text-black p-6 text-[11px] leading-tight">
      {/* Encabezado */}
      <header className="mb-4 pb-2 border-b border-black">
        <h1 className="text-[14px] font-bold text-center uppercase">
          ANEXO 1 - LISTA DE VERIFICACIÓN DE CUMPLIMIENTO DE OBLIGACIONES DE
          SEGURIDAD Y SALUD EN EL TRABAJO
        </h1>
        <p className="text-[10px] text-center mt-1">
          MDT-(SIGLAS DE LA DIRECCIÓN REGIONAL)-(INICIALES)-(AÑO)-(NÚMERO DE
          INSPECCIÓN)
        </p>
      </header>

      {/* Secciones */}
      {SECCIONES_SST.map((seccion) => (
        <SeccionSST
          key={seccion.id}
          seccion={seccion}
          datosGenerales={datosGenerales}
          setDatosGenerales={setDatosGenerales}
          respuestas={respuestas}
          setRespuestas={setRespuestas}
        />
      ))}

      {/* Observaciones finales y firmas */}
      <section
        className="mt-6 pt-4 border-t border-black break-inside-avoid"
        style={{ pageBreakInside: "avoid" }}
      >
        <h3 className="text-[12px] font-bold mb-2">
          OBSERVACIONES DE LA INSPECCIÓN:
        </h3>
        <textarea
          className="w-full h-24 border border-black text-[11px] p-2 resize-none"
          placeholder="Escriba aquí las observaciones generales de la inspección..."
        />

        <div className="grid grid-cols-2 gap-6 mt-8 text-[11px]">
          <div className="text-center">
            <div className="font-bold mb-1">MINISTERIO DEL TRABAJO</div>
            <div className="border-t border-black w-3/4 mx-auto mt-8 mb-1" />
            <div>NOMBRE Y FIRMA</div>
          </div>
          <div className="text-center">
            <div className="font-bold mb-1">EMPRESA / INSTITUCIÓN</div>
            <div className="border-t border-black w-3/4 mx-auto mt-8 mb-1" />
            <div>NOMBRE Y FIRMA DE QUIÉN RECIBE EL ACTA</div>
          </div>
        </div>

        <div className="mt-8 text-[9px] leading-snug">
          <p className="font-bold mb-1">CÓDIGO DE TRABAJO:</p>
          <p>
            Art. 42.- Obligaciones del empleador.- Numeral 17. Facilitar la inspección y vigilancia que las autoridades practiquen en los locales de trabajo, para cerciorarse del cumplimiento de las disposiciones de este
            Código y darles los informes que para ese efecto sean indispensables. Numeral 32. Las empresas empleadoras registradas en el Instituto Ecuatoriano de Seguridad Social están obligadas a exhibir, en lugar
            visible y al alcance de todos sus trabajadores/servidores, las planillas mensuales de remisión de aportes individuales y patronales y de descuentos, y las correspondientes al pago de fondo de reserva,
            debidamente selladas por el respectivo Departamento del Instituto Ecuatoriano de Seguridad Social.
            Art. 412.- El Departamento de Seguridad e Higiene del Trabajo y los Inspectores del Trabajo exigirán a los propietarios de talleres o fábricas y de los demás medios de trabajo, el cumplimiento de las
            obligaciones en materia de prevención de riesgos;
            Art. 542.- Atribuciones de las Direcciones Regionales del trabajo.- Además de lo expresado en los Artículos anteriores, a las Direcciones Regionales del Trabajo, les corresponde. Numeral 5. Visitar fábricas,
            talleres, establecimientos, construcciones de locales destinados al trabajo y a viviendas de trabajadores/servidores, siempre que lo estimaren conveniente o cuando las empresas o trabajadores/servidores lo
            soliciten.
            Art. 436.- Suspensión de labores y cierre de locales. El Ministerio de Trabajo y Empleo podrá disponer la suspensión de actividades o el cierre de los lugares o medios colectivos de labor, en los que se
            atentare o afectare a la salud y seguridad e higiene de los trabajadores/servidores, o se contraviniere a las medidas de seguridad e higiene dictadas, sin perjuicio de las demás sanciones legales. Tal decisión
            requerirá dictamen previo del Jefe del Departamento de Seguridad e Higiene del Trabajo.
            Art. 628.- Caso de violación de las normas del Código del Trabajo. Las violaciones de las normas de este Código, serán sancionadas en la forma prescrita en los Artículos pertinentes y, cuando no se haya
            fijado sanción especial, el Director Regional del Trabajo podrá imponer multas de hasta doscientos dólares de los Estados Unidos de América, sin perjuicio de lo establecido en Artículo 95 del Código de la
            Niñez y Adolescencia
          </p>
          {/* Puedes seguir añadiendo el resto de artículos si lo deseas */}
        </div>
      </section>
    </div>
  );
}
