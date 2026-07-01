import { useState } from 'react';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import FormField from '@shared/ui/molecules/FormField';
import Card, { CardHeader, CardContent } from '@shared/ui/organisms/Card';

// Iconos simples SVG
const Building = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const Plus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EstablecimientoSaludForm = ({ onAddEstablecimiento, onUpdateEstablecimiento, editingEstablecimiento, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    if (editingEstablecimiento) {
      return {
        nombre: editingEstablecimiento.nombre || '',
        codigo: editingEstablecimiento.codigo || '',
        direccion: editingEstablecimiento.direccion || '',
        telefono: editingEstablecimiento.telefono || '',
        email: editingEstablecimiento.email || ''
      };
    }
    return {
      nombre: '',
      codigo: '',
      direccion: '',
      telefono: '',
      email: ''
    };
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.codigo) {
      if (editingEstablecimiento && onUpdateEstablecimiento) {
        // Modo edición
        const updatedEstablecimiento = {
          ...editingEstablecimiento,
          ...formData,
          id: editingEstablecimiento.id
        };
        onUpdateEstablecimiento(updatedEstablecimiento);
      } else if (onAddEstablecimiento) {
        // Modo creación
        const newEstablecimiento = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        onAddEstablecimiento(newEstablecimiento);
        setFormData({
          nombre: '',
          codigo: '',
          direccion: '',
          telefono: '',
          email: ''
        });
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">
            {editingEstablecimiento ? 'Editar Establecimiento de Salud' : 'Registrar Nuevo Establecimiento de Salud'}
          </h2>
        </div>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre del Establecimiento" required>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Código" required>
            <Input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              placeholder="Ej: CMO-001"
            />
          </FormField>
          <FormField label="Dirección">
            <Input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Teléfono">
            <Input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Correo">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            {editingEstablecimiento ? 'Actualizar Establecimiento' : 'Registrar Establecimiento'}
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

export default EstablecimientoSaludForm;

