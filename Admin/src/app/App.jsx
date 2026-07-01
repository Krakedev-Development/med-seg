import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from '@widgets/layout/ui/Sidebar';
import Header from '@widgets/layout/ui/Header';
import Login from '@pages/login/ui/LoginPage';
import Dashboard from '@pages/dashboard/ui/Dashboard';
import Companies from '@pages/companies/ui/Companies';
import Employees from '@pages/employees/ui/Employees';
import Documents from '@pages/documents/ui/Documents';
import SeleccionarEmpresaView from '@pages/seleccionar-empresa-view/ui/SeleccionarEmpresaView';
import Repository from '@pages/repository/ui/Repository';
import UsuarioDocumentos from '@pages/usuario-documentos/ui/UsuarioDocumentos';
import PortalEmpresa from '@pages/portal-empresa/ui/PortalEmpresa';
import ResponderEvaluacionPage from '@pages/responder-evaluacion-page/ui/ResponderEvaluacionPage';
import Settings from '@pages/settings/ui/Settings';
import { initialCompanies } from '@entities/company/model/companiesMock';
import { initialEmployees } from '@entities/employee/model/employeesMock';
import { initialEstablecimientosSalud } from '@shared/api/mock/establecimientosSaludData';
import { initialProfesionales } from '@shared/api/mock/profesionalesData';
import { mockDocuments } from '@shared/api/mock/mockDocuments';
import EstablecimientosSalud from '@pages/establecimientos-salud/ui/EstablecimientosSalud';
import Profesionales from '@pages/profesionales/ui/Profesionales';
import EnviarEvaluacionPage from '@pages/enviar-evaluacion-page/ui/EnviarEvaluacionPage';
import SeguimientoEvaluacion from '@pages/seguimiento-evaluacion/ui/SeguimientoEvaluacion';
import EmpresaCapacitaciones from '@pages/empresa-capacitaciones/ui/EmpresaCapacitaciones';
import EmpresaEvaluaciones from '@pages/empresa-evaluaciones/ui/EmpresaEvaluaciones';
import Anexo1 from '@pages/anexo1/ui/Anexo1';
import GestionAnexo1 from '@pages/gestion-anexo1/ui/GestionAnexo1';
import EditorAnexo1 from '@pages/anexo1-checklist/ui/Anexo1EditorPage';
import DocumentosInSitu from '@pages/documentos-in-situ/ui/DocumentosInSitu';
import HistoricoAnexo1 from '@pages/historico-anexo1/ui/HistoricoAnexo1';
import GestionEvidenciasItem from '@pages/gestion-evidencias-item/ui/GestionEvidenciasItem';
import CrearCapacitacionItem from '@pages/crear-capacitacion-item/ui/CrearCapacitacionItem';
import CrearEvaluacionItem from '@pages/crear-evaluacion-item/ui/CrearEvaluacionItem';
import EmpresaView from '@pages/empresa-view/ui/EmpresaView';
import EmpresaAnexo1View from '@pages/empresa-anexo1view/ui/EmpresaAnexo1View';
import EmpresaAnexo1Estado from '@pages/empresa-anexo1estado/ui/EmpresaAnexo1Estado';
import EmpresaRepositorio from '@pages/empresa-repositorio/ui/EmpresaRepositorio';
import EmpresaFormulariosDinamicos from '@pages/empresa-formularios-dinamicos/ui/EmpresaFormulariosDinamicos';
import FormulariosDinamicos from '@pages/formularios-dinamicos/ui/FormulariosDinamicos';
import RepositorioGeneral from '@pages/repositorio-general/ui/RepositorioGeneral';
import EmpresaDocumentos from '@pages/empresa-documentos/ui/EmpresaDocumentos';
import FormulariosDinamicosEmpresa from '@pages/company-forms/ui/CompanyFormsCatalogPage';
import EmpresaMediDocs from '@pages/medical-records/ui/MedicalRecordsManagerPage';
import MatrizEmpleados from '@pages/employees-matrix/ui/EmployeesMatrixPage';
import RegistroActividades from '@pages/registro-actividades/ui/RegistroActividades';

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
  const [activeRolePreview, setActiveRolePreview] = useState('admin');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        if (user.rol === 'super_admin') {
          setActiveRolePreview(localStorage.getItem('activeRolePreview') || 'admin');
        } else if (user.rol === 'medico') {
          setActiveRolePreview('medico');
        } else {
          setActiveRolePreview('sst');
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    if (userData.rol === 'super_admin') {
      setActiveRolePreview(localStorage.getItem('activeRolePreview') || 'admin');
    } else if (userData.rol === 'medico') {
      setActiveRolePreview('medico');
    } else {
      setActiveRolePreview('sst');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('activeRolePreview');
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
                <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
                <div className="flex-1 transition-all duration-300" style={{ marginLeft: sidebarExpanded ? '256px' : '60px' }}>
                  <Header 
                    currentUser={currentUser} 
                    onLogout={handleLogout} 
                    activeRolePreview={activeRolePreview}
                    setActiveRolePreview={(role) => {
                      setActiveRolePreview(role);
                      localStorage.setItem('activeRolePreview', role);
                    }}
                    sidebarExpanded={sidebarExpanded}
                  />
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
                             <EmpresaAnexo1View companies={companies} activeRolePreview={activeRolePreview} />
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
                          path="medidocs" 
                          element={
                            <ProtectedRoute>
                              <EmpresaMediDocs companies={companies} />
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

