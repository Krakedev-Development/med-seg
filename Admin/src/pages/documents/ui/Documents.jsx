import { useLocation, useNavigate } from 'react-router-dom';
import CrearDocumento from '@pages/crear-documento/ui/CrearDocumento';

const Documents = ({ companies, employees, establecimientos, profesionales }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener datos de navegación si existen
  const { empresa, empleado, profesional, tipo, documento, plantilla } = location.state || {};

  const ArrowLeftIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const handleVolver = () => {
    if (location.state?.returnTo) {
      const { empresaId, empleadoId, pestanaActiva, scrollY } = location.state.returnTo;
      navigate(`/anexo1/empresa/${empresaId}/matriz-empleados`, {
        state: { empleadoId, pestanaActiva, scrollY }
      });
    } else {
      navigate('/formularios/lista');
    }
  };

  const handleCancelar = () => {
    if (location.state?.returnTo) {
      const { empresaId, empleadoId, pestanaActiva, scrollY } = location.state.returnTo;
      navigate(`/anexo1/empresa/${empresaId}/matriz-empleados`, {
        state: { empleadoId, pestanaActiva, scrollY }
      });
    } else {
      navigate('/documents');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleVolver}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          title="Volver a la lista"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Plantillas y Documentos de Empresa</h1>
          <p className="text-gray-600 mt-1">Crear documentos dinámicos y subir documentos firmados</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-surface border-l-4 border-primary rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Nota:</strong> Para subir documentos firmados y ver la lista completa de documentos, 
          visita el <a href="/repository" className="text-primary hover:underline font-semibold">Repositorio</a>.
        </p>
      </div>

      {/* Mostrar información del documento si está editando */}
      {documento && (
        <div className="bg-surface border-l-4 border-primary rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Editando documento: {documento.nombre}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Empresa: {documento.empresa} • Fecha: {documento.fecha} • Estado: {documento.estado}
              </p>
            </div>
            <button
              onClick={handleCancelar}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-300"
            >
              Cancelar edición
            </button>
          </div>
        </div>
      )}

      {/* Mostrar información de la plantilla seleccionada */}
      {plantilla && !documento && (
        <div className="bg-gradient-to-r from-surface via-primary-light/60 to-secondary-light/60 border-l-4 border-primary rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{plantilla.icono}</div>
              <div>
                <h3 className="font-semibold text-gray-900">Creando documento: {plantilla.nombre}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {plantilla.descripcion}
                  {empresa && ` • Empresa: ${empresa.name}`}
                  {empleado && ` • Empleado: ${empleado.firstName || empleado.names} ${empleado.lastName || empleado.lastNames}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancelar}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Contenido */}
      <CrearDocumento
          companies={companies}
          employees={employees}
          establecimientos={establecimientos}
          profesionales={profesionales}
          empresaPredefinida={empresa}
          empleadoPredefinido={empleado}
          profesionalPredefinido={profesional}
          tipoPredefinido={tipo}
          documentoExistente={documento}
          plantilla={plantilla}
        />
    </div>
  );
};

export default Documents;
