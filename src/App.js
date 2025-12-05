import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Scuba from "./pages/Scuba";
import Footer from "./components/Footer";
import Skydive from "./pages/Skydive";
import About from "./pages/About";
import Profile from "./pages/Profile";
import MyEnquiries from "./pages/MyEnquiries";
import MyEnquiriesById from "./pages/MyEnquiriesById";
import AdminEnquiry from "./pages/AdminEnquiry";
import AdminEnquiryById from "./pages/AdminEnquiryById";
import ProtectedRedirect from "./pages/ProtectedRedirect";
import ServiceDetail from "./pages/ServiceDetail";
import TermsPage from "./pages/TermsPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scuba" element={<Scuba />} />
            <Route path="/scuba/:sku" element={<ServiceDetail />} />
            <Route path="/skydive" element={<Skydive />} />
            <Route path="/skydive/:sku" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-enquiries" element={<MyEnquiries />} />
            <Route path="/my-enquiries/:enqNo/" element={<MyEnquiriesById />} />
            <Route path="/link/:kind/:enqNo" element={<ProtectedRedirect />} />
            <Route path="/admin/enquiries" element={<AdminEnquiry />} />
            <Route
              path="/admin/enquiries/:enqNo"
              element={<AdminEnquiryById />}
            />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          </Routes>
        </Router>
        <Footer />
      </QueryClientProvider>
    </>
  );
}

export default App;
