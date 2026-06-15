import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ComparePage from './pages/ComparePage';
import RecommendPage from './pages/RecommendPage';
import AssistantPage from './pages/AssistantPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="products"       element={<ProductsPage />} />
            <Route path="compare"        element={<ComparePage />} />
            <Route path="recommend"      element={<RecommendPage />} />
            <Route path="assistant"      element={<AssistantPage />} />
            <Route path="login"          element={<LoginPage />} />
            <Route path="admin/products" element={<AdminPage />} />
            <Route path="*"              element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
