import { useState } from 'react';
import Card, { CardContent } from '@shared/ui/organisms/Card';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import FormField from '@shared/ui/molecules/FormField';

// Iconos simples SVG
const SettingsIconComponent = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const SaveIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const BellIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Settings = () => {
  const [settings, setSettings] = useState({
    name: 'Administrador',
    email: 'admin@medicinaseguridad.com',
    notifications: true,
    emailNotifications: false
  });

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSave = () => {
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 mt-1">Ajustes del sistema y perfil</p>
      </div>

      {/* Perfil de Usuario */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">Perfil de Usuario</h2>
        </div>
        <div className="space-y-4">
          <FormField label="Nombre Completo">
            <Input
              type="text"
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </FormField>
          <FormField label="Correo Electrónico">
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </FormField>
        </div>
      </Card>

      {/* Notificaciones */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <BellIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-700">Notificaciones en el sistema</p>
              <p className="text-sm text-gray-500">Recibir alertas y notificaciones en la aplicación</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-700">Notificaciones por correo</p>
              <p className="text-sm text-gray-500">Recibir notificaciones por correo electrónico</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
          </label>
        </div>
      </Card>

      {/* Seguridad */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <LockIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">Seguridad</h2>
        </div>
        <div className="space-y-4">
          <FormField label="Contraseña Actual">
            <Input type="password" />
          </FormField>
          <FormField label="Nueva Contraseña">
            <Input type="password" />
          </FormField>
          <FormField label="Confirmar Nueva Contraseña">
            <Input type="password" />
          </FormField>
        </div>
      </Card>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          variant="primary"
          className="flex items-center gap-2"
        >
          <SaveIcon className="w-5 h-5" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};

export default Settings;

