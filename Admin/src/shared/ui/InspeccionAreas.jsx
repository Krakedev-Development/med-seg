import React from "react";

export default function InspeccionAreas({
  logoEmpresa,
  nombreEmpresa,
  fechaInspeccion,
  nombreEncargado,
  observaciones = "",
  categoriasSeleccionadas = {},
  onObservacionesChange,
  onCategoriaChange,
  readOnly = false
}) {
  const categorias = [
    "Condiciones de la vía, cunetas, alcantarillas",
    "Existen bitácoras de entrada",
    "Señalamientos de restricción de entrada, velocidad y EPP",
    "La garita está bien ubicada y construida con materiales seguros",
    "El personal conoce la política y lineamientos de acceso",
    "Misión, Visión, Política y Objetivos están visibles",
    "Condiciones de orden y limpieza",
    "Uso y condición del equipo de protección personal",
    "Lámpara de emergencia disponible y operativa",
    "Accesos y caminos adecuados",
  ];

  const handleCheckboxChange = (categoriaIndex, columna) => {
    if (readOnly || !onCategoriaChange) return;
    
    const key = `${categoriaIndex}-${columna}`;
    const newValue = !categoriasSeleccionadas[key];
    onCategoriaChange(categoriaIndex, columna, newValue);
  };

  return (
    <div
      id="documento-inspeccion"
      className="bg-white p-8 text-sm text-gray-900 font-sans max-w-4xl mx-auto border border-gray-300 rounded-lg shadow-sm"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center space-x-4">
          {logoEmpresa && (
            <img
              src={logoEmpresa}
              alt="Logo Empresa"
              className="w-20 h-20 object-contain border border-gray-200 rounded"
            />
          )}
          <div>
            <h1 className="text-xl font-bold uppercase">
              Inspección de Seguridad
            </h1>
            <p className="text-gray-700 font-semibold">
              {nombreEmpresa || "Nombre de la empresa"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            Fecha de Inspección:{" "}
            <span className="font-normal">
              {fechaInspeccion || "____/____/______"}
            </span>
          </p>
          <p className="font-semibold">
            Técnico Responsable:{" "}
            <span className="font-normal">
              {nombreEncargado || "_________________"}
            </span>
          </p>
        </div>
      </div>

      {/* Tabla de inspección */}
      <table className="w-full border border-gray-300 mb-6">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="p-2 border text-left w-[65%]">Ítem de Inspección</th>
            <th className="p-2 border text-center w-[12%]">Sin novedad</th>
            <th className="p-2 border text-center w-[12%]">Falta</th>
            <th className="p-2 border text-center w-[12%]">Recomendación</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((item, i) => {
            const keySinnovedad = `${i}-sinnovedad`;
            const keyFalta = `${i}-falta`;
            const keyRecomendacion = `${i}-recomendacion`;
            
            return (
              <tr key={i} className="border-b">
                <td className="p-2 border">{item}</td>
                <td className="p-2 text-center border">
                  <input 
                    type="checkbox" 
                    checked={categoriasSeleccionadas[keySinnovedad] || false}
                    onChange={() => handleCheckboxChange(i, 'sinnovedad')}
                    disabled={readOnly}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-2 text-center border">
                  <input 
                    type="checkbox" 
                    checked={categoriasSeleccionadas[keyFalta] || false}
                    onChange={() => handleCheckboxChange(i, 'falta')}
                    disabled={readOnly}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-2 text-center border">
                  <input 
                    type="checkbox" 
                    checked={categoriasSeleccionadas[keyRecomendacion] || false}
                    onChange={() => handleCheckboxChange(i, 'recomendacion')}
                    disabled={readOnly}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Observaciones */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-800 mb-1">
          Observaciones Generales
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-700 h-24 resize-none focus:outline-primary focus:ring-2 focus:ring-primary/30"
          placeholder="Escriba aquí las observaciones de la inspección..."
          value={observaciones}
          onChange={(e) => onObservacionesChange && onObservacionesChange(e.target.value)}
          readOnly={readOnly}
        ></textarea>
      </div>

      {/* Firma */}
      <div className="flex justify-between items-center mt-10">
        <div className="text-left">
          <p className="font-semibold">Firma del Técnico de Seguridad:</p>
          <p className="mt-8 border-t border-gray-400 w-64 text-center">
            {nombreEncargado || "___________________"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Firma del Representante de la Empresa:</p>
          <p className="mt-8 border-t border-gray-400 w-64 text-center">
            ___________________
          </p>
        </div>
      </div>

      {/* Pie */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t pt-2">
        Sistema de Gestión de Seguridad y Salud Ocupacional — Documento
        autogenerado desde la plataforma
      </div>
    </div>
  );
}

