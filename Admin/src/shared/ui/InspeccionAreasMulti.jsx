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

export default function InspeccionAreasMulti({
  logoEmpresa,
  nombreEmpresa = "ASOPROMIN S.A.",
  fechaInspeccion = "____/____/______",
  tecnicoResponsable = "_________________",
  coordinacion = "",
  firmaUrl = "",
  secciones = [
    {
      area: "BOCA MINA",
      items: ["¿Condiciones de la vía, cunetas, alcantarillas?"],
    },
    {
      area: "POLVORÍN",
      items: [
        "Explosivos almacenados <= 70% capacidad",
        "Productos compatibles almacenados",
      ],
    },
  ],
  recsPolvorin = [""],
  recsFinal = [""],
  editable = false,
  onFieldChange,
}) {
  return (
    <div
      id="documento-inspeccion"
      className="bg-white text-sm text-black max-w-4xl mx-auto print:text-black print:bg-white"
      style={{
        backgroundColor: '#fff',
        color: '#000',
        visibility: 'visible',
        opacity: 1,
        display: 'block',
        fontSize: '12pt',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {Array(2)
        .fill(0)
        .map((_, blockIndex) => (
          <section
            key={blockIndex}
            className="border border-black p-4 mb-4"
            style={{ 
              pageBreakInside: "avoid", 
              breakBefore: blockIndex > 0 ? "page" : "auto",
              pageBreakAfter: blockIndex === 1 ? "avoid" : "auto",
              marginBottom: blockIndex < 1 ? '1rem' : '0'
            }}
          >
            {/* ENCABEZADO */}
            <header className="border border-black mb-4" style={{ pageBreakInside: "avoid" }}>
              <div 
                className="flex justify-between items-center border-b border-black p-2"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #000',
                  padding: '8px'
                }}
              >
                {logoEmpresa ? (
                  <img
                    src={logoEmpresa}
                    alt="Logo"
                    className="w-20 h-20 object-contain border border-gray-300"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'contain',
                      border: '1px solid #ccc',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div 
                    className="w-20 h-20 border border-gray-300 flex items-center justify-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      border: '1px solid #ccc',
                      flexShrink: 0,
                      backgroundColor: '#f3f4f6'
                    }}
                  >
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ color: '#6b7280' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                <h1 
                  className="text-center text-xl font-bold uppercase flex-1"
                  style={{
                    textAlign: 'center',
                    fontSize: '20pt',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: 0,
                    padding: 0,
                    flex: 1
                  }}
                >
                  <EditableText
                    field="nombreEmpresa"
                    value={nombreEmpresa}
                    placeholder="Nombre de la empresa"
                    editable={editable}
                    onFieldChange={onFieldChange}
                  />
                  <br />
                  <span 
                    className="text-base font-semibold block mt-1"
                    style={{
                      fontSize: '16pt',
                      fontWeight: 600,
                      display: 'block',
                      marginTop: '4px'
                    }}
                  >
                    INSPECCIÓN DE SEGURIDAD
                  </span>
                </h1>
              </div>

              <table 
                className="w-full border-t border-black text-sm border-collapse"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderTop: '1px solid #000',
                  fontSize: '11pt'
                }}
              >
                <tbody>
                  <tr 
                    className="border-t border-black"
                    style={{ borderTop: '1px solid #000' }}
                  >
                    <td 
                      className="border-r border-black p-2 font-semibold w-1/2"
                      style={{
                        border: '1px solid #000',
                        borderRight: '1px solid #000',
                        padding: '8px',
                        fontSize: '11pt',
                        width: '50%',
                        verticalAlign: 'middle'
                      }}
                    >
                      FECHA INSPECCIÓN:{" "}
                      <EditableText
                        field="fechaInspeccion"
                        value={fechaInspeccion}
                        placeholder="____/____/______"
                        editable={editable}
                        onFieldChange={onFieldChange}
                        className="font-normal"
                      />
                    </td>
                    <td 
                      className="p-2 font-semibold text-center border-black"
                      style={{
                        border: '1px solid #000',
                        padding: '8px',
                        fontSize: '11pt',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      FIRMA:
                      {firmaUrl && (
                        <img
                          src={firmaUrl}
                          alt="Firma"
                          className="mx-auto mt-1 w-24 h-10 object-contain"
                        />
                      )}
                    </td>
                  </tr>
                  <tr 
                    className="border-t border-black"
                    style={{ borderTop: '1px solid #000' }}
                  >
                    <td 
                      className="border-r border-black p-2 font-semibold align-top"
                      style={{
                        border: '1px solid #000',
                        borderRight: '1px solid #000',
                        padding: '8px',
                        fontSize: '11pt',
                        verticalAlign: 'top'
                      }}
                    >
                      INSPECCIÓN REALIZADA POR:{" "}
                      <EditableText
                        field="tecnicoResponsable"
                        value={tecnicoResponsable}
                        placeholder="_________________"
                        editable={editable}
                        onFieldChange={onFieldChange}
                        className="font-normal"
                      />{" "}
                      (TÉCNICO DE SEGURIDAD)
                    </td>
                    <td 
                      className="p-2"
                      style={{
                        border: '1px solid #000',
                        padding: '8px'
                      }}
                    ></td>
                  </tr>
                  <tr 
                    className="border-t border-black"
                    style={{ borderTop: '1px solid #000' }}
                  >
                    <td 
                      colSpan="2" 
                      className="p-2 font-semibold"
                      style={{
                        border: '1px solid #000',
                        padding: '8px',
                        fontSize: '11pt'
                      }}
                    >
                      EN COORDINACIÓN CON:{" "}
                      <EditableText
                        field="coordinacion"
                        value={coordinacion}
                        placeholder="_________________"
                        editable={editable}
                        onFieldChange={onFieldChange}
                        className="font-normal"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </header>

            {/* SECCIONES */}
            {secciones.map((sec, i) => (
              <div key={i} className="mb-4" style={{ pageBreakInside: "avoid" }}>
                <table 
                  className="w-full border border-black text-center border-collapse"
                  style={{ 
                    tableLayout: "fixed", 
                    fontFamily: "Arial, sans-serif",
                    width: "100%",
                    fontSize: "11pt"
                  }}
                >
                  <thead style={{ display: "table-header-group", visibility: "visible" }}>
                    <tr className="bg-[#A9D18E] text-center" style={{ backgroundColor: "#A9D18E", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", display: "table-row", visibility: "visible" }}>
                      <th 
                        rowSpan="2" 
                        className="border border-black text-left"
                        style={{ 
                          width: "35%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          fontWeight: "bold",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        {sec.area}
                      </th>
                      <th 
                        rowSpan="2" 
                        className="border border-black"
                        style={{ 
                          width: "5%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          fontWeight: "bold",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        B
                      </th>
                      <th 
                        rowSpan="2" 
                        className="border border-black"
                        style={{ 
                          width: "5%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          fontWeight: "bold",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        M
                      </th>
                      <th 
                        rowSpan="2" 
                        className="border border-black"
                        style={{ 
                          width: "5%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          fontWeight: "bold",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        NA
                      </th>
                      <th 
                        colSpan="3" 
                        className="border border-black"
                        style={{ 
                          width: "50%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          fontWeight: "bold",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        OBSERVACIONES
                      </th>
                    </tr>
                    <tr className="bg-[#A9D18E] text-center" style={{ backgroundColor: "#A9D18E", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", display: "table-row", visibility: "visible" }}>
                      <th 
                        className="border border-black"
                        style={{ 
                          width: "15%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          fontWeight: "bold",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        SIN NOVEDAD
                      </th>
                      <th 
                        className="border border-black"
                        style={{ 
                          width: "15%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          fontWeight: "bold",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        FALTA
                      </th>
                      <th 
                        className="border border-black recomendacion"
                        style={{ 
                          width: "20%", 
                          padding: "4px", 
                          verticalAlign: "middle",
                          whiteSpace: "nowrap",
                          fontSize: "10pt",
                          backgroundColor: "#A9D18E",
                          color: "#000",
                          fontWeight: "bold",
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact"
                        }}
                      >
                        RECOMENDACIÓN
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sec.items.map((item, idx) => (
                      <tr key={idx}>
                        <td 
                          className="border border-black text-left align-middle"
                          style={{ 
                            padding: "4px", 
                            verticalAlign: "middle", 
                            fontSize: "11pt",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            overflow: "visible",
                            textAlign: "left",
                            height: "auto",
                            color: "#000",
                            fontFamily: "Arial, sans-serif",
                            WebkitPrintColorAdjust: "exact",
                            printColorAdjust: "exact"
                          }}
                        >
                          <span style={{ color: "#000", display: "inline", visibility: "visible" }}>{item}</span>
                        </td>
                        <td 
                          className="border border-black"
                          style={{ padding: "4px", verticalAlign: "middle" }}
                        >
                          <input 
                            type="checkbox" 
                            className="cursor-pointer" 
                            style={{ margin: "0 auto", display: "block" }}
                          />
                        </td>
                        <td 
                          className="border border-black"
                          style={{ padding: "4px", verticalAlign: "middle" }}
                        >
                          <input 
                            type="checkbox" 
                            className="cursor-pointer" 
                            style={{ margin: "0 auto", display: "block" }}
                          />
                        </td>
                        <td 
                          className="border border-black"
                          style={{ padding: "4px", verticalAlign: "middle" }}
                        >
                          <input 
                            type="checkbox" 
                            className="cursor-pointer" 
                            style={{ margin: "0 auto", display: "block" }}
                          />
                        </td>
                        <td 
                          className="border border-black"
                          style={{ padding: "4px", verticalAlign: "middle" }}
                        >
                          <input 
                            type="checkbox" 
                            className="cursor-pointer" 
                            style={{ margin: "0 auto", display: "block" }}
                          />
                        </td>
                        <td 
                          className="border border-black"
                          style={{ padding: "4px", verticalAlign: "middle" }}
                        >
                          <input 
                            type="checkbox" 
                            className="cursor-pointer" 
                            style={{ margin: "0 auto", display: "block" }}
                          />
                        </td>
                        <td 
                          className="border border-black"
                          style={{ 
                            padding: "4px", 
                            verticalAlign: "middle"
                          }}
                        >
                          <input
                            type="text"
                            className="w-full text-xs border-none focus:outline-none focus:ring-0"
                            placeholder=""
                            style={{ 
                              padding: "2px", 
                              fontSize: "11pt", 
                              textAlign: "center",
                              width: "100%"
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* BLOQUE DE RECOMENDACIONES DESPUÉS DE POLVORÍN */}
                {sec.area === "POLVORÍN" && (
                  <div className="mt-4 border border-black p-2" style={{ pageBreakInside: "avoid" }}>
                    <h3 className="font-semibold mb-2" style={{ margin: "4px 0", fontSize: "11pt" }}>
                      RECOMENDACIONES PARA LA MEJORA CONTINUA:
                    </h3>
                    {recsPolvorin.map((rec, ri) => (
                      <div key={ri} className="flex items-start mb-2">
                        <span className="w-6 font-semibold" style={{ fontSize: "11pt" }}>{ri + 1}.</span>
                        <textarea
                          value={rec}
                          readOnly
                          className="flex-1 border border-black p-1 text-xs resize-none"
                          placeholder="Ingrese la recomendación..."
                          style={{ 
                            fontFamily: "Arial, sans-serif", 
                            fontSize: "11pt",
                            minHeight: "40px",
                            height: "auto",
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            overflow: "visible",
                            whiteSpace: "pre-wrap"
                          }}
                        ></textarea>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* RECOMENDACIONES FINALES */}
            <div className="mt-6 border border-black p-2" style={{ pageBreakInside: "avoid" }}>
              <h3 className="font-semibold mb-2" style={{ margin: "4px 0", fontSize: "11pt" }}>
                RECOMENDACIONES PARA LA MEJORA CONTINUA (GENERALES):
              </h3>
              {recsFinal.map((rec, ri) => (
                <div key={ri} className="flex items-start mb-2">
                  <span className="w-6 font-semibold" style={{ fontSize: "11pt" }}>{ri + 1}.</span>
                  <textarea
                    value={rec}
                    readOnly
                    className="flex-1 border border-black p-1 text-xs resize-none"
                    placeholder="Ingrese la recomendación general..."
                    style={{ 
                      fontFamily: "Arial, sans-serif", 
                      fontSize: "11pt",
                      minHeight: "40px",
                      height: "auto",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      overflow: "visible",
                      whiteSpace: "pre-wrap"
                    }}
                  ></textarea>
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
