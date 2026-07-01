import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarios } from '@entities/user/model/usersMock';
import Button from '@shared/ui/atoms/Button';
import Input from '@shared/ui/atoms/Input';
import Label from '@shared/ui/atoms/Label';
import Card, { CardContent } from '@shared/ui/organisms/Card';

// Iconos simples SVG
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const Login = ({ employees, companies, onLogin }) => {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [ruc, setRuc] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('admin'); // 'admin', 'user', 'empresa'
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');

  // Filtrar empleados para la lista rápida
  const filteredEmployees = useMemo(() => {
    if (!employeeSearch.trim()) return employees.slice(0, 5);
    return employees.filter(emp => {
      const nombre = `${emp.names || emp.firstName || ''} ${emp.lastNames || emp.lastName || ''}`.toLowerCase();
      const dni = (emp.dni || emp.cedula || '').toLowerCase();
      const search = employeeSearch.toLowerCase();
      return nombre.includes(search) || dni.includes(search);
    }).slice(0, 5);
  }, [employees, employeeSearch]);

  const handleQuickLogin = (empleado) => {
    setCedula(empleado.dni || empleado.cedula);
    setPassword('123');
    setShowEmployeeList(false);
    setEmployeeSearch('');
  };

  const employeeListRef = useRef(null);

  // Cerrar lista al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (employeeListRef.current && !employeeListRef.current.contains(event.target)) {
        setShowEmployeeList(false);
      }
    };

    if (showEmployeeList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmployeeList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (tipoUsuario === 'admin') {
      // Login como administrador con validación de múltiples usuarios
      if (!usuario || !password) {
        setError('Por favor ingrese usuario y contraseña');
        return;
      }

      const usuarioEncontrado = usuarios.find(u => 
        u.usuario === usuario && u.password === password && u.activo
      );

      if (!usuarioEncontrado) {
        setError('Usuario o contraseña incorrectos');
        return;
      }

      if (onLogin) {
        onLogin({ 
          tipo: 'admin', 
          nombre: usuarioEncontrado.nombre,
          usuario: usuarioEncontrado.usuario,
          rol: usuarioEncontrado.rol,
          id: usuarioEncontrado.id,
          email: usuarioEncontrado.email
        });
      }
      navigate('/dashboard');
    } else if (tipoUsuario === 'user') {
      // Login como usuario (empleado)
      if (!cedula || !password) {
        setError('Por favor ingrese su cédula y contraseña');
        return;
      }

      if (password !== '123') {
        setError('Contraseña incorrecta. La contraseña es: 123');
        return;
      }

      // Buscar empleado por cédula
      const empleado = employees.find(emp => 
        (emp.dni || emp.cedula) === cedula
      );

      if (!empleado) {
        setError('No se encontró un usuario con esa cédula');
        return;
      }

      if (onLogin) {
        onLogin({
          tipo: 'user',
          empleado: empleado,
          nombre: `${empleado.names || empleado.firstName} ${empleado.lastNames || empleado.lastName}`,
          cedula: empleado.dni || empleado.cedula
        });
      }
      navigate('/usuario/documentos');
    } else if (tipoUsuario === 'empresa') {
      // Login como empresa
      if (!ruc || !password) {
        setError('Por favor ingrese RUC y contraseña');
        return;
      }

      if (password !== '123') {
        setError('Contraseña incorrecta. La contraseña es: 123');
        return;
      }

      // Buscar empresa por RUC
      const empresa = companies?.find(emp => emp.ruc === ruc);

      if (!empresa) {
        setError('No se encontró una empresa con ese RUC');
        return;
      }

      if (onLogin) {
        onLogin({
          tipo: 'empresa',
          empresa: empresa,
          nombre: empresa.name,
          ruc: empresa.ruc,
          empresaId: empresa.id
        });
      }
      navigate('/portal-empresa');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="rounded-lg overflow-hidden bg-white border-2 border-gray-200" style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px', padding: '4px', aspectRatio: '1/1' }}>
                <img 
                  src="/images/Logo.jpg" 
                  alt="MEDI&SEG Logo" 
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Iniciar Sesión</h1>
            <p className="text-sm text-gray-600">Sistema de Gestión SST</p>
          </div>

          {/* Selector de tipo de usuario */}
          <div className="mb-6">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => {
                  setTipoUsuario('admin');
                  setUsuario('');
                  setPassword('');
                  setCedula('');
                  setRuc('');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors text-xs ${
                  tipoUsuario === 'admin'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Administrador
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipoUsuario('empresa');
                  setUsuario('');
                  setPassword('');
                  setCedula('');
                  setRuc('');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors text-xs ${
                  tipoUsuario === 'empresa'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Empresa
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipoUsuario('user');
                  setUsuario('');
                  setPassword('');
                  setCedula('');
                  setRuc('');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors text-xs ${
                  tipoUsuario === 'user'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Trabajador
              </button>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tipoUsuario === 'admin' && (
            <>
              <div>
                <Label>Usuario</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ingrese su usuario"
                    required
                    className="pl-10 py-3"
                  />
                </div>
              </div>
              <div>
                <Label>Contraseña</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                    className="pl-10 py-3"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Usuario: admin, Contraseña: 123
                </p>
              </div>
            </>
          )}

          {tipoUsuario === 'empresa' && (
            <>
              <div>
                <Label>RUC de la Empresa</Label>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    placeholder="Ingrese el RUC de la empresa"
                    required
                    className="pl-10 py-3"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ejemplo: 20123456789
                </p>
              </div>
              <div>
                <Label>Contraseña</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                    className="pl-10 py-3"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Contraseña por defecto: 123
                </p>
              </div>
            </>
          )}

          {tipoUsuario === 'user' && (
            <>
              <div>
                <Label>Cédula / Usuario</Label>
                <div className="relative" ref={employeeListRef}>
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={cedula}
                    onChange={(e) => {
                      setCedula(e.target.value);
                      setEmployeeSearch(e.target.value);
                      setShowEmployeeList(true);
                    }}
                    onFocus={() => setShowEmployeeList(true)}
                    placeholder="Ingrese su número de cédula o busque su nombre"
                    required
                    className="pl-10 py-3"
                  />
                  {showEmployeeList && filteredEmployees.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredEmployees.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => handleQuickLogin(emp)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <UserIcon className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {emp.names || emp.firstName} {emp.lastNames || emp.lastName}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              Cédula: {emp.dni || emp.cedula}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Busque por nombre o cédula para acceso rápido
                </p>
              </div>
              <div>
                <Label>Contraseña</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                    className="pl-10 py-3"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Contraseña por defecto: 123
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-3">
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© Medicina & Seguridad</p>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

