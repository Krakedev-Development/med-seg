import ListaVerificacionSST from '@entities/document/ui/templates/anexo1/anexo1';
import Card from '@shared/ui/organisms/Card';

const Anexo1 = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-md border-l-4 border-primary">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-primary/10 p-3 rounded-lg">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Anexo 1 - Lista de Verificación SST</h1>
            <p className="text-gray-600 mt-1">Lista de verificación de cumplimiento de obligaciones de seguridad y salud en el trabajo</p>
          </div>
        </div>
      </Card>
      
      <div className="bg-transparent">
        <ListaVerificacionSST />
      </div>
    </div>
  );
};

export default Anexo1;

