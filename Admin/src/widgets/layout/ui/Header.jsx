import { rolesDescripcion } from '@entities/user/model/usersMock';

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

const Header = ({ currentUser, onLogout, isUserView = false, activeRolePreview, setActiveRolePreview, sidebarExpanded }) => {
  const getRolColor = (rol) => {
    return rolesDescripcion[rol]?.color || 'bg-gray-600';
  };
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      window.location.href = '/login';
    }
  };

  const isSuperAdmin = currentUser?.rol === 'super_admin';

  return (
    <header className="no-print bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 z-10 transition-all duration-300" style={{ left: isUserView ? '0' : (sidebarExpanded ? '256px' : '60px') }}>
      <div className="flex-1 flex items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          {isUserView ? 'Mi Portal de Documentos' : 'Panel Administrativo'}
        </h2>
      </div>

      {/* Selector de Rol Preview (Solo visible para Super Admin) */}
      {isSuperAdmin && !isUserView && (
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm mr-4">
          <span className="text-[9px] uppercase font-bold text-gray-400 px-2 tracking-wider">Vista Activa:</span>
          <button
            type="button"
            onClick={() => setActiveRolePreview('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-205 ${
              activeRolePreview === 'admin'
                ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            👑 Completo
          </button>
          <button
            type="button"
            onClick={() => setActiveRolePreview('sst')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-205 ${
              activeRolePreview === 'sst'
                ? 'bg-white text-primary shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🛡️ SST
          </button>
          <button
            type="button"
            onClick={() => setActiveRolePreview('medico')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-205 ${
              activeRolePreview === 'medico'
                ? 'bg-white text-teal-600 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🏥 Médico
          </button>
        </div>
      )}

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

