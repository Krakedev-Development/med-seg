// Iconos simples SVG
const FileDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DocumentPreview = ({ document, onClose }) => {
  if (!document) return null;

  const getDocumentTitle = () => {
    if (document.type === 'induccion') return 'Documento de Inducción';
    if (document.type === 'inspeccion') return 'Formato de Inspección de Áreas';
    if (document.type === 'psicosocial') return 'Informe Psicosocial';
    return 'Documento';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{getDocumentTitle()}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información del documento */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Información del Documento</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Tipo:</span>
                <span className="ml-2 text-gray-800 capitalize">{document.type}</span>
              </div>
              {document.fecha && (
                <div>
                  <span className="font-medium text-gray-600">Fecha:</span>
                  <span className="ml-2 text-gray-800">{formatDate(document.fecha)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenido según tipo */}
          {document.type === 'induccion' && (
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Inducción de Personal</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {document.tipoEmpresa && (
                    <p><strong>Tipo de Empresa:</strong> {document.tipoEmpresa}</p>
                  )}
                  {document.area && (
                    <p><strong>Área:</strong> {document.area}</p>
                  )}
                  {document.nombreTrabajador && (
                    <p><strong>Trabajador:</strong> {document.nombreTrabajador}</p>
                  )}
                  {document.fecha && (
                    <p><strong>Fecha:</strong> {formatDate(document.fecha)}</p>
                  )}
                  {document.riesgosPrincipales && (
                    <div className="mt-3">
                      <p><strong>Riesgos Principales:</strong></p>
                      <p className="mt-1 whitespace-pre-line">{document.riesgosPrincipales}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {document.type === 'inspeccion' && (
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Inspección de Áreas</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {document.areaRevisada && (
                    <p><strong>Área Revisada:</strong> {document.areaRevisada}</p>
                  )}
                  {document.accionesRealizadas && document.accionesRealizadas.length > 0 && (
                    <div>
                      <p><strong>Acciones Realizadas:</strong></p>
                      <ul className="list-disc list-inside mt-1 ml-4">
                        {document.accionesRealizadas.map((accion, idx) => (
                          <li key={idx}>{accion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {document.observaciones && (
                    <div className="mt-3">
                      <p><strong>Observaciones:</strong></p>
                      <p className="mt-1 whitespace-pre-line">{document.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {document.type === 'psicosocial' && (
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Informe Psicosocial</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {document.tema && (
                    <p><strong>Tema:</strong> {document.tema}</p>
                  )}
                  {document.fecha && (
                    <p><strong>Fecha:</strong> {formatDate(document.fecha)}</p>
                  )}
                  {document.participantes && (
                    <p><strong>Participantes:</strong> {document.participantes}</p>
                  )}
                  {document.conclusiones && (
                    <div className="mt-3">
                      <p><strong>Conclusiones:</strong></p>
                      <p className="mt-1 whitespace-pre-line">{document.conclusiones}</p>
                    </div>
                  )}
                  {document.recomendaciones && (
                    <div className="mt-3">
                      <p><strong>Recomendaciones:</strong></p>
                      <p className="mt-1 whitespace-pre-line">{document.recomendaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer con botón de generar PDF */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => alert('Funcionalidad de generación de PDF en desarrollo')}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FileDown className="w-5 h-5" />
              Generar PDF
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;

