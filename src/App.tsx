import React, { ReactNode, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { CartFavouritesProvider } from './context/CartFavouritesContext';
import Layout from './components/Layout';
import BackgroundAnim from './components/BackgroundAnim';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Location from './pages/Location';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        if (this.state.error && this.state.error.message) {
          const parsedError = JSON.parse(this.state.error.message);
          if (parsedError.error) {
            errorMessage = `Firestore Error: ${parsedError.error} during ${parsedError.operationType} on ${parsedError.path}`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Application Error</h2>
            <p className="text-gray-600">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-accent transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).lenisInstance) {
      (window as any).lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <CartFavouritesProvider>
          <LanguageProvider>
            <BackgroundAnim />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <Layout>
                      <About />
                    </Layout>
                  }
                />
                <Route
                  path="/menu"
                  element={
                    <Layout>
                      <Menu />
                    </Layout>
                  }
                />
                <Route
                  path="/location"
                  element={
                    <Layout>
                      <Location />
                    </Layout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Layout>
                      <Contact />
                    </Layout>
                  }
                />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </CartFavouritesProvider>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
