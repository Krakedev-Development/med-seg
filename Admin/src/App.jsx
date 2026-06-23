import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Employees from './pages/Employees';
import Documents from './pages/Documents';
import SeleccionarEmpresaView from './pages/SeleccionarEmpresaView';
import Repository from './pages/Repository';
import UsuarioDocumentos from './pages/UsuarioDocumentos';
import PortalEmpresa from './pages/PortalEmpresa';
import ResponderEvaluacionPage from './pages/ResponderEvaluacionPage';
import Settings from './pages/Settings';
import { initialCompanies } from './data/companiesData';
import { initialEmployees } from './data/employeesData';
import { initialEstablecimientosSalud } from './data/establecimientosSaludData';
import { initialProfesionales } from './data/profesionalesData';
import { mockDocuments } from './data/mockDocuments';
import EstablecimientosSalud from './pages/EstablecimientosSalud';
import Profesionales from './pages/Profesionales';
import EnviarEvaluacionPage from './pages/EnviarEvaluacionPage';
import SeguimientoEvaluacion from './pages/SeguimientoEvaluacion';
import EmpresaCapacitaciones from './pages/EmpresaCapacitaciones';
import EmpresaEvaluaciones from './pages/EmpresaEvaluaciones';
import EmpresaResultados from './pages/EmpresaResultados';
import Anexo1 from './pages/Anexo1';
import GestionAnexo1 from './pages/GestionAnexo1';
import EditorAnexo1 from './pages/EditorAnexo1';
import DocumentosInSitu from './pages/DocumentosInSitu';
import HistoricoAnexo1 from './pages/HistoricoAnexo1';
import GestionEvidenciasItem from './pages/GestionEvidenciasItem';
import CrearCapacitacionItem from './pages/CrearCapacitacionItem';
import CrearEvaluacionItem from './pages/CrearEvaluacionItem';
import EmpresaView from './pages/EmpresaView';
import EmpresaAnexo1View from './pages/EmpresaAnexo1View';
import EmpresaAnexo1Estado from './pages/EmpresaAnexo1Estado';
import EmpresaRepositorio from './pages/EmpresaRepositorio';
import EmpresaFormulariosDinamicos from './pages/EmpresaFormulariosDinamicos';
import FormulariosDinamicos from './pages/FormulariosDinamicos';
import RepositorioGeneral from './pages/RepositorioGeneral';
import EmpresaDocumentos from './pages/EmpresaDocumentos';
import FormulariosDinamicosEmpresa from './pages/FormulariosDinamicosEmpresa';
import MatrizEmpleados from './pages/MatrizEmpleados';
import RegistroActividades from './pages/RegistroActividades';

// Componente para redirigir rutas directas del editor a rutas anidadas
const EditorRedirect = () => {
  const { empresaId, anexoId } = useParams();
  if (anexoId) {
    return <Navigate to={`/anexo1/empresa/${empresaId}/editor/${anexoId}`} replace />;
  }
  return <Navigate to={`/anexo1/empresa/${empresaId}/editor`} replace />;
};

function App() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [employees, setEmployees] = useState(initialEmployees);
  const [establecimientos, setEstablecimientos] = useState(initialEstablecimientosSalud);
  const [profesionales, setProfesionales] = useState(initialProfesionales);
  const [documents, setDocuments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Componente para rutas protegidas (admin)
  const ProtectedRoute = ({ children }) => {
    if (!currentUser || currentUser.tipo !== 'admin') {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Componente para rutas de usuario (trabajador)
  const UserRoute = ({ children }) => {
    if (!currentUser || currentUser.tipo !== 'user') {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Componente para rutas de empresa
  const EmpresaRoute = ({ children }) => {
    if (!currentUser || currentUser.tipo !== 'empresa') {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Ruta de login */}
        <Route 
          path="/login" 
          element={
            currentUser ? (
              currentUser.tipo === 'admin' ? (
                <Navigate to="/dashboard" replace />
            ) : currentUser?.tipo === 'empresa' ? (
              <Navigate to="/portal-empresa" replace />
            ) : (
              <Navigate to="/usuario/documentos" replace />
            )
            ) : (
              <Login 
                employees={employees}
                companies={companies}
                onLogin={handleLogin}
              />
            )
          } 
        />

        {/* Rutas protegidas */}
        {currentUser?.tipo === 'admin' ? (
          <Route
            path="/*"
            element={
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 transition-all duration-300" style={{ marginLeft: '60px' }}>
                  <Header currentUser={currentUser} onLogout={handleLogout} />
                  <main className="mt-16 p-6">
                    <Routes>
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Dashboard 
                              companies={companies}
                              employees={employees}
                              documents={documents}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/companies" 
                        element={
                          <ProtectedRoute>
                            <Companies 
                              companies={companies}
                              setCompanies={setCompanies}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Rutas anidadas bajo /empresas/:empresaId */}
                      <Route 
                        path="/empresas/:empresaId" 
                        element={
                          <ProtectedRoute>
                            <EmpresaView companies={companies} />
                          </ProtectedRoute>
                        } 
                      >
                        <Route 
                          index
                          element={
                            <div className="bg-white rounded-lg shadow-md p-6">
                              <h2 className="text-xl font-bold text-gray-800 mb-4">Información General</h2>
                              <p className="text-gray-600">Selecciona una pestaña para ver más información</p>
                            </div>
                          } 
                        />
                        <Route 
                          path="trabajadores" 
                          element={
                            <ProtectedRoute>
                              <Employees 
                                employees={employees}
                                setEmployees={setEmployees}
                                companies={companies}
                              />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="documentos" 
                          element={
                            <ProtectedRoute>
                              <EmpresaDocumentos companies={companies} />
                            </ProtectedRoute>
                          } 
                        />
                      </Route>
                      {/* Módulo Gestión del Anexo 1 - SST */}
                      <Route 
                        path="/anexo1" 
                        element={
                          <ProtectedRoute>
                            <GestionAnexo1 companies={companies} />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Rutas anidadas bajo /anexo1/empresa/:empresaId */}
                      <Route 
                        path="/anexo1/empresa/:empresaId" 
                        element={
                          <ProtectedRoute>
                            <EmpresaAnexo1View companies={companies} />
                          </ProtectedRoute>
                        } 
                      >
                        <Route 
                          index
                          element={
                            <EmpresaAnexo1Estado companies={companies} />
                          } 
                        />
                        <Route 
                          path="estado" 
                          element={
                            <EmpresaAnexo1Estado companies={companies} />
                          } 
                        />
                        <Route 
                          path="checklist" 
                          element={
                            <EditorAnexo1 companies={companies} />
                          } 
                        />
                        <Route 
                          path="editor" 
                          element={
                            <EditorAnexo1 companies={companies} />
                          } 
                        />
                        <Route 
                          path="editor/:anexoId" 
                          element={
                            <EditorAnexo1 companies={companies} />
                          } 
                        />
                        <Route 
                          path="formularios-dinamicos" 
                          element={
                            <ProtectedRoute>
                              <FormulariosDinamicosEmpresa companies={companies} employees={employees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="matriz-empleados" 
                          element={
                            <ProtectedRoute>
                              <MatrizEmpleados companies={companies} employees={employees} setEmployees={setEmployees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="item/:itemId/evidencias" 
                          element={
                            <ProtectedRoute>
                              <GestionEvidenciasItem companies={companies} employees={employees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="item/:itemId/capacitacion" 
                          element={
                            <ProtectedRoute>
                              <CrearCapacitacionItem companies={companies} employees={employees} profesionales={profesionales} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="item/:itemId/evaluacion" 
                          element={
                            <ProtectedRoute>
                              <CrearEvaluacionItem companies={companies} employees={employees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="historial" 
                          element={
                            <ProtectedRoute>
                              <HistoricoAnexo1 companies={companies} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="capacitaciones" 
                          element={
                            <ProtectedRoute>
                              <EmpresaCapacitaciones companies={companies} employees={employees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="evaluaciones" 
                          element={
                            <ProtectedRoute>
                              <EmpresaEvaluaciones companies={companies} employees={employees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="evaluaciones/enviar/:evaluacionId" 
                          element={
                            <ProtectedRoute>
                              <EnviarEvaluacionPage companies={companies} employees={employees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="evaluaciones/seguimiento/:evaluacionId" 
                          element={
                            <ProtectedRoute>
                              <SeguimientoEvaluacion companies={companies} employees={employees} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="resultados" 
                          element={
                            <ProtectedRoute>
                              <EmpresaResultados employees={employees} companies={companies} />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="repositorio" 
                          element={
                            <ProtectedRoute>
                              <EmpresaRepositorio companies={companies} />
                            </ProtectedRoute>
                          } 
                        />
                      </Route>
                      {/* Rutas directas del editor del Anexo 1 - Redirigen a rutas anidadas */}
                      <Route 
                        path="/anexo1/editor/:empresaId" 
                        element={
                          <ProtectedRoute>
                            <EditorRedirect />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/anexo1/editor/:empresaId/:anexoId" 
                        element={
                          <ProtectedRoute>
                            <EditorRedirect />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Módulo Formularios y Registros Dinámicos */}
                      <Route 
                        path="/formularios" 
                        element={
                          <ProtectedRoute>
                            <FormulariosDinamicos companies={companies} employees={employees} />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Módulo Establecimientos de Salud */}
                      <Route 
                        path="/establecimientos-salud" 
                        element={
                          <ProtectedRoute>
                            <EstablecimientosSalud 
                              establecimientos={establecimientos}
                              setEstablecimientos={setEstablecimientos}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Módulo Profesionales */}
                      <Route 
                        path="/profesionales" 
                        element={
                          <ProtectedRoute>
                            <Profesionales 
                              profesionales={profesionales}
                              setProfesionales={setProfesionales}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Módulo Repositorio General */}
                      <Route 
                        path="/repositorio" 
                        element={
                          <ProtectedRoute>
                            <RepositorioGeneral companies={companies} />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/employees" 
                        element={
                          <ProtectedRoute>
                            <Employees 
                              employees={employees}
                              setEmployees={setEmployees}
                              companies={companies}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/documents" 
                        element={
                          <ProtectedRoute>
                            <SeleccionarEmpresaView 
                              companies={companies}
                              employees={employees}
                              profesionales={profesionales}
                              mockDocuments={mockDocuments}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/formularios/crear" 
                        element={
                          <ProtectedRoute>
                            <Documents 
                              companies={companies}
                              employees={employees}
                              establecimientos={establecimientos}
                              profesionales={profesionales}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/formularios/lista" 
                        element={<Navigate to="/documents" replace />} 
                      />
                      <Route 
                        path="/repository" 
                        element={
                          <ProtectedRoute>
                            <Repository 
                              documents={documents}
                              setDocuments={setDocuments}
                              companies={companies}
                              employees={employees}
                            />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/anexo1" 
                        element={
                          <ProtectedRoute>
                            <Anexo1 />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/anexo1/gestion" 
                        element={
                          <ProtectedRoute>
                            <GestionAnexo1 companies={companies} />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/anexo1/editor/:empresaId" 
                        element={
                          <ProtectedRoute>
                            <EditorAnexo1 companies={companies} />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/anexo1/editor/:empresaId/:anexoId" 
                        element={
                          <ProtectedRoute>
                            <EditorAnexo1 companies={companies} />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/anexo1/documentos/:empresaId" 
                        element={
                          <ProtectedRoute>
                            <DocumentosInSitu companies={companies} />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/anexo1/historico/:empresaId" 
                        element={
                          <ProtectedRoute>
                            <HistoricoAnexo1 companies={companies} />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/registro-actividades" 
                        element={
                          <ProtectedRoute>
                            <RegistroActividades />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/" 
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        ) : currentUser?.tipo === 'user' ? (
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-100">
                <Header currentUser={currentUser} onLogout={handleLogout} isUserView={true} />
                <main className="mt-16 p-6">
                  <Routes>
                    <Route 
                      path="/usuario/documentos" 
                      element={
                        <UserRoute>
                          <UsuarioDocumentos 
                            user={currentUser}
                            documents={documents}
                            mockDocuments={mockDocuments}
                          />
                        </UserRoute>
                      } 
                    />
                    <Route 
                      path="/usuario/evaluacion/:evaluacionId/:respuestaId" 
                      element={
                        <UserRoute>
                          <ResponderEvaluacionPage user={currentUser} />
                        </UserRoute>
                      } 
                    />
                    <Route 
                      path="/*" 
                      element={<Navigate to="/usuario/documentos" replace />}
                    />
                  </Routes>
                </main>
              </div>
            }
          />
        ) : currentUser?.tipo === 'empresa' ? (
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50">
                {currentUser && <Header currentUser={currentUser} onLogout={handleLogout} isUserView={true} />}
                <main>
                  <Routes>
                    <Route 
                      path="/portal-empresa" 
                      element={
                        <EmpresaRoute>
                          <PortalEmpresa 
                            user={currentUser}
                            companies={companies}
                            employees={employees}
                          />
                        </EmpresaRoute>
                      } 
                    />
                    <Route 
                      path="/*" 
                      element={<Navigate to="/portal-empresa" replace />}
                    />
                  </Routes>
                </main>
              </div>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

