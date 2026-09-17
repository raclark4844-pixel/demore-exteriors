import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Ops from './pages/Ops';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import InsuranceClaims from './pages/InsuranceClaims';
import Services from './pages/Services';
import Roofing from './pages/Roofing';
import Siding from './pages/Siding';
import Windows from './pages/Windows';
import Doors from './pages/Doors';
import Gutters from './pages/Gutters';
import ServiceAreas from './pages/ServiceAreas';
import Decks from './pages/Decks';
import CountyPage from './pages/CountyPage';
import CityPage from './pages/CityPage';
import MentorCityPage from './pages/MentorCityPage';
import LakeCityPage from './pages/LakeCityPage';
import CommercialCityPage from './pages/CommercialCityPage';
import CommercialServices from './pages/CommercialServices';
import ProductsIndex from './pages/ProductsIndex';
import ManufacturerPage from './pages/ManufacturerPage';
import ProductPage from './pages/ProductPage';
import DailyFact from './pages/DailyFact';
import DailyFactsIndex from './pages/DailyFactsIndex';
import Reviews from './pages/Reviews';
import Gallery from './pages/Gallery';
import DamageAssessment from './pages/DamageAssessment';
import MarketResearch from './pages/MarketResearch';
import Competitors from './pages/Competitors';
import SupplyHouses from './pages/SupplyHouses';
import SEOTargets from './pages/SEOTargets';
import SEOSummary from './pages/SEOSummary';
import ServiceCounties from './pages/ServiceCounties';
import About from './pages/About';
import Contact from './pages/Contact';
import AIControl from './pages/AIControl';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/insurance-claims" element={<InsuranceClaims />} />
      <Route path="/services" element={<Services />} />
      <Route path="/roofing" element={<Roofing />} />
      <Route path="/siding" element={<Siding />} />
      <Route path="/windows" element={<Windows />} />
      <Route path="/doors" element={<Doors />} />
      <Route path="/gutters" element={<Gutters />} />
      <Route path="/service-areas" element={<ServiceAreas />} />
      <Route path="/decks" element={<Decks />} />
      <Route path="/service-area/:county" element={<CountyPage />} />
      <Route path="/service-area/lake/mentor" element={<MentorCityPage />} />
      <Route path="/service-area/lake/willoughby" element={<LakeCityPage />} />
      <Route path="/service-area/lake/painesville" element={<LakeCityPage />} />
      <Route path="/service-area/lake/eastlake" element={<LakeCityPage />} />
      <Route path="/service-area/lake/kirtland" element={<LakeCityPage />} />
      <Route path="/service-area/lake/concord-township" element={<LakeCityPage />} />
      <Route path="/service-area/lake/mentor-on-the-lake" element={<LakeCityPage />} />
      <Route path="/service-area/lake/madison" element={<LakeCityPage />} />
      <Route path="/service-area/geauga/chardon" element={<LakeCityPage />} />
      <Route path="/service-area/:county/:city" element={<CityPage />} />
      <Route path="/service-area/:county/:city/commercial" element={<CommercialCityPage />} />
      <Route path="/services/commercial" element={<CommercialServices />} />
      <Route path="/products/:manufacturer" element={<ManufacturerPage />} />
      <Route path="/products/:manufacturer/:category/:product" element={<ProductPage />} />
      <Route path="/daily-fact/today" element={<DailyFact />} />
      <Route path="/daily-fact/:date" element={<DailyFact />} />
      <Route path="/daily-facts" element={<DailyFactsIndex />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/damage-assessment" element={<DamageAssessment />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/ops" element={<Ops />} />
        <Route path="/ops/ai-control" element={<AIControl />} />
        <Route path="/products" element={<ProductsIndex />} />
        <Route path="/market-research" element={<MarketResearch />} />
        <Route path="/market-research/competitors" element={<Competitors />} />
        <Route path="/market-research/supply-houses" element={<SupplyHouses />} />
        <Route path="/market-research/seo-targets" element={<SEOTargets />} />
        <Route path="/market-research/seo-summary" element={<SEOSummary />} />
        <Route path="/market-research/counties" element={<ServiceCounties />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  // DES-2026-000022: staging-only no-op comment for QA preview

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App