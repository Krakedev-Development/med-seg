import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyForm from '@entities/company/ui/CompanyForm';
import Card, { CardContent } from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';

// Iconos simples SVG
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const Building2Icon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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

const Companies = ({ companies, setCompanies }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const handleViewEmpresa = (company) => {
    navigate(`/empresas/${company.id}`);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ruc.includes(searchTerm) ||
    company.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = (newCompany) => {
    setCompanies([...companies, newCompany]);
    setShowForm(false);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleUpdateCompany = (updatedCompany) => {
    setCompanies(companies.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    ));
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta empresa?')) {
      setCompanies(companies.filter(company => company.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Empresas</h1>
          <p className="text-gray-600 mt-1">Gestión de empresas registradas</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Building2Icon className="w-5 h-5" />
          {showForm ? 'Ocultar Formulario' : 'Nueva Empresa'}
        </Button>
      </div>

      {showForm && (
        <CompanyForm 
          onAddCompany={handleAddCompany}
          onUpdateCompany={handleUpdateCompany}
          editingCompany={editingCompany}
          onCancel={handleCancel}
        />
      )}

      {/* Barra de búsqueda */}
      <Card className="p-4 shadow-md">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por nombre, RUC o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
          />
        </div>
      </Card>

      {/* Tabla de empresas */}
      <Card className="shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron empresas
                  </td>
                </tr>
              ) : (
                filteredCompanies.map(company => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={`Logo ${company.name}`}
                          className="w-12 h-12 object-contain border border-gray-200 rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                          <Building2Icon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{company.ruc}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-light text-secondary-dark">
                        {company.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{company.address || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{company.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewEmpresa(company)}
                          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-xs"
                          title="Ver empresa completa"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="text-primary hover:text-primary-dark transition-colors"
                          title="Editar empresa"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar empresa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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

export default Companies;

