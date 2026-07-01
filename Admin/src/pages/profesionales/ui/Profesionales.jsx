import { useState } from 'react';
import ProfesionalForm from '@shared/ui/ProfesionalForm';
import Card from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';

// Iconos simples SVG
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const UserCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const Trash2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const EditIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Profesionales = ({ profesionales, setProfesionales }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProfesional, setEditingProfesional] = useState(null);

  const filteredProfesionales = profesionales.filter(prof =>
    `${prof.nombres} ${prof.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prof.especialidad && prof.especialidad.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProfesional = (newProfesional) => {
    setProfesionales([...profesionales, newProfesional]);
    setShowForm(false);
    setEditingProfesional(null);
  };

  const handleEditProfesional = (profesional) => {
    setEditingProfesional(profesional);
    setShowForm(true);
  };

  const handleUpdateProfesional = (updatedProfesional) => {
    setProfesionales(profesionales.map(prof => 
      prof.id === updatedProfesional.id ? updatedProfesional : prof
    ));
    setShowForm(false);
    setEditingProfesional(null);
  };

  const handleDeleteProfesional = (id) => {
    if (window.confirm('¿Está seguro de eliminar este profesional?')) {
      setProfesionales(profesionales.filter(prof => prof.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProfesional(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profesionales</h1>
          <p className="text-gray-600 mt-1">Gestión de profesionales registrados</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <UserCircleIcon className="w-5 h-5" />
          {showForm ? 'Ocultar Formulario' : 'Nuevo Profesional'}
        </Button>
      </div>

      {showForm && (
        <ProfesionalForm 
          onAddProfesional={handleAddProfesional}
          onUpdateProfesional={handleUpdateProfesional}
          editingProfesional={editingProfesional}
          onCancel={handleCancel}
        />
      )}

      {/* Barra de búsqueda */}
      <Card className="p-4 shadow-md">
        <Input
          type="text"
          placeholder="Buscar por nombre, código o especialidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
        />
      </Card>

      {/* Lista de profesionales */}
      <Card className="shadow-md overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfesionales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No se encontraron profesionales
                  </td>
                </tr>
              ) : (
                filteredProfesionales.map((prof) => (
                  <tr key={prof.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {prof.nombres} {prof.apellidos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{prof.codigo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{prof.tipoProfesional}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{prof.especialidad || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{prof.registro || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleEditProfesional(prof)}
                          variant="outline"
                          className="flex items-center justify-center p-2"
                          title="Editar profesional"
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteProfesional(prof.id)}
                          variant="outline"
                          className="flex items-center justify-center p-2 text-red-600 hover:bg-red-60 hover:text-red-700"
                          title="Eliminar profesional"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Profesionales;

