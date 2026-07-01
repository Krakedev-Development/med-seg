import { useState } from 'react';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import Card, { CardHeader, CardContent, CardFooter } from '@shared/ui/organisms/Card';
// Iconos simples SVG
const UserPlus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-6-3a3 3 0 11-6 0 3 3 0 016 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);
const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EmployeeForm = ({ onAddEmployee, onUpdateEmployee, companies, employees, editingEmployee, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    if (editingEmployee) {
      return {
        names: editingEmployee.names || editingEmployee.firstName || '',
        lastNames: editingEmployee.lastNames || editingEmployee.lastName || '',
        dni: editingEmployee.dni || editingEmployee.cedula || '',
        position: editingEmployee.position || '',
        actividadesPuesto: editingEmployee.actividadesPuesto || '',
        sexo: editingEmployee.sexo || '',
        fechaInicioLabores: editingEmployee.fechaInicioLabores || '',
        fechaSalida: editingEmployee.fechaSalida || '',
        companyId: editingEmployee.companyId || (companies.length > 0 ? companies[0].id : ''),
        email: editingEmployee.email || ''
      };
    }
    return {
      names: '',
      lastNames: '',
      dni: '',
      position: '',
      actividadesPuesto: '',
      sexo: '',
      fechaInicioLabores: '',
      fechaSalida: '',
      companyId: companies.length > 0 ? companies[0].id : '',
      email: ''
    };
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'companyId' 
        ? parseInt(e.target.value) 
        : e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.names && formData.lastNames && formData.dni && formData.companyId) {
      if (editingEmployee && onUpdateEmployee) {
        // Modo edición
        const updatedEmployee = {
          ...editingEmployee,
          ...formData,
          id: editingEmployee.id
        };
        onUpdateEmployee(updatedEmployee);
      } else if (onAddEmployee) {
        // Modo creación
        const newEmployee = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        onAddEmployee(newEmployee);
        setFormData({
          names: '',
          lastNames: '',
          dni: '',
          position: '',
          actividadesPuesto: '',
          sexo: '',
          fechaInicioLabores: '',
          fechaSalida: '',
          companyId: companies.length > 0 ? companies[0].id : '',
          email: ''
        });
      }
    }
  };

  // Get employees for the selected company to show in the select
  const getEmployeesForCompany = (companyId) => {
    return employees.filter(emp => emp.companyId === companyId);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-800">
          {editingEmployee ? 'Editar Trabajador' : 'Registrar Nuevo Trabajador'}
        </h2>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombres" required>
            <Input
              type="text"
              name="names"
              value={formData.names}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Apellidos" required>
            <Input
              type="text"
              name="lastNames"
              value={formData.lastNames}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Cédula" required>
            <Input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Cargo">
            <Input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Actividades del Puesto" className="md:col-span-2">
            <textarea
              name="actividadesPuesto"
              value={formData.actividadesPuesto}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción de las actividades principales del puesto..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </FormField>
          <FormField label="Sexo">
            <Select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="H">H</option>
              <option value="M">M</option>
            </Select>
          </FormField>
          <FormField label="Fecha de Inicio de Labores">
            <Input
              type="date"
              name="fechaInicioLabores"
              value={formData.fechaInicioLabores}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Fecha de Salida">
            <Input
              type="date"
              name="fechaSalida"
              value={formData.fechaSalida}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Empresa" required>
            <Select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
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
            <UserPlus className="w-5 h-5 mr-2" />
            {editingEmployee ? 'Actualizar Trabajador' : 'Registrar Trabajador'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;

