import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLang } from './i18n';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import AstrologerDashboard from './pages/AstrologerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AstroJitMatrimonyPage from './pages/AstroJitMatrimonyPage';
import Sidebar from './components/Sidebar';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';

function AppContent() {
  const { user, role, loading } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [registerRole, setRegisterRole] = useState('client');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [activeModule, setActiveModule] = useState(() => {
    return 'panchangam';
  });

  useEffect(() => {
    if (role === 'company') setActiveModule('overview');
    else if (role === 'astrologer') setActiveModule('appointments');
    else if (role === 'vendor') setActiveModule('catalog');
    else setActiveModule('panchangam');
  }, [role]);

  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash.includes('matrimony') ? 'matrimony' : 'astrology';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('matrimony')) {
        setCurrentView('matrimony');
      } else {
        setCurrentView('astrology');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openMatrimony = () => {
    setCurrentView('matrimony');
    window.location.hash = '#/matrimony';
  };

  const backToAstrology = () => {
    setCurrentView('astrology');
    window.location.hash = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF8F1] dark:bg-[#0F0D0C] flex flex-col items-center justify-center text-slate-700 dark:text-slate-300">
        <Logo size="lg" showTagline={false} className="animate-pulse mb-3" />
        <p className="text-xs text-amber-800 dark:text-amber-400 font-bold tracking-wider uppercase">Loading Astrojit...</p>
      </div>
    );
  }

  // If Matrimony view is selected, render full-page AstroJit Matrimony portal!
  if (currentView === 'matrimony') {
    return <AstroJitMatrimonyPage onBackToAstrology={backToAstrology} />;
  }

  if (!user || !role) {
    return (
      <div className="min-h-screen bg-[#FBF8F1] dark:bg-[#0F0D0C] text-slate-800 dark:text-slate-100">
        <Navbar onOpenMatrimony={openMatrimony} />
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          {authView === 'login' ? (
            <Login
              onSwitchToRegister={(role) => {
                setRegisterRole(role);
                setAuthView('register');
              }}
            />
          ) : (
            <Register
              defaultRole={registerRole}
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F1] dark:bg-[#0F0D0C] text-slate-800 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeModule={activeModule}
        onSelectModule={(modId) => {
          setActiveModule(modId);
          if (currentView === 'matrimony') backToAstrology();
        }}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenMatrimony={openMatrimony}
        currentView={currentView}
      />

      {/* Main Content Area: dynamically offset on desktop for the fixed sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <Navbar
          onOpenMatrimony={openMatrimony}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {role === 'client' && <ClientDashboard activeTab={activeModule} onTabChange={setActiveModule} />}
          {role === 'astrologer' && <AstrologerDashboard activeTab={activeModule} onTabChange={setActiveModule} />}
          {role === 'vendor' && <VendorDashboard activeTab={activeModule} onTabChange={setActiveModule} />}
          {role === 'company' && <CompanyDashboard activeTab={activeModule} onTabChange={setActiveModule} />}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF8F1] flex flex-col items-center justify-center p-6 text-center text-slate-800">
          <div className="bg-white border border-red-200 shadow-md rounded-2xl p-6 max-w-md w-full">
            <span className="text-3xl mb-2 inline-block">⚠️</span>
            <h2 className="text-lg font-bold text-red-800 mb-1">பிழை ஏற்பட்டது / Something went wrong</h2>
            <p className="text-xs text-stone-600 mb-4">
              {this.state.error?.message || 'Unexpected application error.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#7A1A22] text-white rounded-lg text-xs font-bold shadow hover:bg-[#5C1017] transition-all cursor-pointer"
            >
              பக்கத்தை மீண்டும் ஏற்றுக (Reload App)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
