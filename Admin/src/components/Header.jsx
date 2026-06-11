import { rolesDescripcion } from '../data/usuariosData';

// Iconos simples SVG
const LogOut = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const User = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Header = ({ currentUser, onLogout, isUserView = false }) => {
  const getRolColor = (rol) => {
    return rolesDescripcion[rol]?.color || 'bg-gray-600';
  };
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="no-print bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 z-10" style={{ left: isUserView ? '0' : '60px' }}>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800">
          {isUserView ? 'Mi Portal de Documentos' : 'Panel Administrativo'}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-5 h-5 text-gray-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{currentUser?.nombre || 'Usuario'}</span>
              {currentUser?.rol && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${getRolColor(currentUser.rol)}`}>
                  {rolesDescripcion[currentUser.rol]?.nombre || currentUser.rol}
                </span>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

