import { useState } from 'react';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import Card, { CardHeader, CardContent } from '@shared/ui/organisms/Card';
// Iconos simples SVG
const Building2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const Plus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CompanyForm = ({ onAddCompany, onUpdateCompany, editingCompany, onCancel }) => {
  const [formData, setFormData] = useState({
    name: editingCompany?.name || '',
    ruc: editingCompany?.ruc || '',
    ciiu: editingCompany?.ciiu || '',
    address: editingCompany?.address || '',
    email: editingCompany?.email || '',
    type: editingCompany?.type || 'Minería',
    tipoActividad: editingCompany?.tipoActividad || 'Minería'
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(editingCompany?.logo || null);

  const companyTypes = ['Minería', 'Alimentos', 'Servicios', 'Educación', 'Otros'];
  const actividadesDisponibles = [
    'Minería',
    'Agricultura',
    'Avicultura',
    'Pesca',
    'Manufactura',
    'Construcción',
    'Transporte',
    'Salud',
    'Alimentación',
    'Otros',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogo(file);
      setLogoPreview(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.ruc && formData.email) {
      if (editingCompany) {
        // Modo edición
        const updatedCompany = {
          ...editingCompany,
          ...formData,
          logo: logoPreview || editingCompany.logo,
          logoFile: logo || editingCompany.logoFile
        };
        onUpdateCompany(updatedCompany);
      } else {
        // Modo creación
        const newCompany = {
          id: Date.now(),
          ...formData,
          logo: logoPreview,
          logoFile: logo,
          createdAt: new Date().toISOString().split('T')[0]
        };
        onAddCompany(newCompany);
        setFormData({
          name: '',
          ruc: '',
          ciiu: '',
          address: '',
          email: '',
          type: 'Minería',
          tipoActividad: 'Minería'
        });
        setLogo(null);
        setLogoPreview(null);
        // Reset file input
        const fileInput = document.getElementById('logo-upload');
        if (fileInput) fileInput.value = '';
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center gap-2">
        <Building2 className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-800">
          {editingCompany ? 'Editar Empresa' : 'Registrar Nueva Empresa'}
        </h2>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre de la Empresa" required>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="RUC" required>
            <Input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="CIIU">
            <Input
              type="text"
              name="ciiu"
              value={formData.ciiu}
              onChange={handleChange}
              placeholder="Código CIIU"
            />
          </FormField>
          <FormField label="Dirección">
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Correo" required>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Tipo de Empresa" required>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {companyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Tipo de Actividad" required>
            <Select
              name="tipoActividad"
              value={formData.tipoActividad}
              onChange={handleChange}
              required
            >
              {actividadesDisponibles.map(actividad => (
                <option key={actividad} value={actividad}>{actividad}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Logo de la Empresa" className="md:col-span-2">
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            {logoPreview && (
              <div className="mt-2">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-24 h-24 object-contain border border-gray-300 rounded"
                />
              </div>
            )}
          </FormField>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            {editingCompany ? 'Actualizar Empresa' : 'Registrar Empresa'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;

