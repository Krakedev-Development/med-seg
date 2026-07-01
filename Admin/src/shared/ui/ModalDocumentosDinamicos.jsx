import { useMemo } from 'react';
import { getDocumentosByEmpresa, getDocumentosByItem } from '@entities/document/model/documentsMock';

const ModalDocumentosDinamicos = ({ itemId, empresaId, anexoId, onCerrar, onVincular }) => {
  const documentosEmpresa = getDocumentosByEmpresa(empresaId);
  const documentosYaVinculados = getDocumentosByItem(itemId);
  const documentosDisponibles = useMemo(() => {
    const vinculadosIds = documentosYaVinculados.map(d => d.id);
    return documentosEmpresa.filter(d => !vinculadosIds.includes(d.id));
  }, [documentosEmpresa, documentosYaVinculados]);

  const getTipoLabel = (tipo) => {
    const labels = {
      'inspeccion': 'Inspección de Áreas',
      'induccion': 'Inducción Personal',
      'ficha-medica': 'Ficha Médica'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Vincular Documento Dinámico</h2>
          <button
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {documentosDisponibles.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay documentos disponibles
              </p>
              <p className="text-gray-500 text-sm">
                {documentosYaVinculados.length > 0 
                  ? 'Todos los documentos ya están vinculados a este ítem'
                  : 'Crea documentos dinámicos desde el tab "Formularios Dinámicos"'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentosDisponibles.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onVincular(doc.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{doc.titulo}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {getTipoLabel(doc.tipo)}
                        </span>
                        <span>{doc.fechaCreacion}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          doc.estado === 'Publicado' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.estado}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVincular(doc.id);
                      }}
                      className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                    >
                      Vincular
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {documentosYaVinculados.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Documentos ya vinculados ({documentosYaVinculados.length})
              </h3>
              <div className="space-y-2">
                {documentosYaVinculados.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{doc.titulo}</p>
                        <p className="text-xs text-gray-600">{doc.fechaCreacion}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-semibold">
                        Vinculado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onCerrar}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDocumentosDinamicos;









