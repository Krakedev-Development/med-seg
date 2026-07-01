import { useState } from 'react';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import Card, { CardHeader, CardContent } from '@shared/ui/organisms/Card';

// Iconos simples SVG
const UserCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const Plus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ProfesionalForm = ({ onAddProfesional, onUpdateProfesional, editingProfesional, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    if (editingProfesional) {
      return {
        nombres: editingProfesional.nombres || '',
        apellidos: editingProfesional.apellidos || '',
        codigo: editingProfesional.codigo || '',
        especialidad: editingProfesional.especialidad || '',
        tipoProfesional: editingProfesional.tipoProfesional || 'Médico',
        registro: editingProfesional.registro || '',
        email: editingProfesional.email || '',
        telefono: editingProfesional.telefono || ''
      };
    }
    return {
      nombres: '',
      apellidos: '',
      codigo: '',
      especialidad: '',
      tipoProfesional: 'Médico',
      registro: '',
      email: '',
      telefono: ''
    };
  });

  const tiposProfesional = ['Médico', 'Ingeniero', 'Técnico', 'Otro'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombres && formData.apellidos && formData.codigo) {
      if (editingProfesional && onUpdateProfesional) {
        // Modo edición
        const updatedProfesional = {
          ...editingProfesional,
          ...formData,
          id: editingProfesional.id
        };
        onUpdateProfesional(updatedProfesional);
      } else if (onAddProfesional) {
        // Modo creación
        const newProfesional = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        onAddProfesional(newProfesional);
        setFormData({
          nombres: '',
          apellidos: '',
          codigo: '',
          especialidad: '',
          tipoProfesional: 'Médico',
          registro: '',
          email: '',
          telefono: ''
        });
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">
            {editingProfesional ? 'Editar Profesional' : 'Registrar Nuevo Profesional'}
          </h2>
        </div>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombres" required>
            <Input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Apellidos" required>
            <Input
              type="text"
              name="apellidos"
              value={formData.apellidos}
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
              placeholder="Ej: PROF-001"
            />
          </FormField>
          <FormField label="Tipo de Profesional">
            <Select
              name="tipoProfesional"
              value={formData.tipoProfesional}
              onChange={handleChange}
            >
              {tiposProfesional.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Especialidad">
            <Input
              type="text"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              placeholder="Ej: Medicina Ocupacional"
            />
          </FormField>
          <FormField label="Número de Registro">
            <Input
              type="text"
              name="registro"
              value={formData.registro}
              onChange={handleChange}
              placeholder="Nº de registro profesional"
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
          <FormField label="Correo">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            {editingProfesional ? 'Actualizar Profesional' : 'Registrar Profesional'}
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

export default ProfesionalForm;

