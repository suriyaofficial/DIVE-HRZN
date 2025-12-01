import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Scuba from "./pages/Scuba";
import Footer from "./components/Footer";
import Skydive from "./pages/Skydive";
import About from "./pages/About";
import Detail from "./pages/Detail";
import Profile from "./pages/Profile";
import EnquiryDashboard from "./pages/EnquiryDashboard";
import EnquiryDetails from "./pages/EnquiryDetails";
import MyEnquiriesView from "./components/MyEnquiriesView";
import EnquiryDetailsPage from "./components/EnquiryDetailsPage";
import DocViewPublic from "./pages/DocViewPublic";
import DocViewInternal from "./pages/DocViewInternal";
import EnquiryDetailsPagePublic from "./components/EnquiryDetailsPagePublic";
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
            <Route path="/scuba/:sku" element={<Detail />} />
            <Route path="/skydive" element={<Skydive />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/view/:kind/:enqNo/:email"
              element={<DocViewInternal />}
            />
            <Route path="/my-enquiries" element={<MyEnquiriesView />} />
            <Route
              path="/my-enquiries/:enqNo/:email"
              element={<EnquiryDetailsPage />}
            />
            <Route path="/admin/enquiries" element={<EnquiryDashboard />} />
            <Route
              path="/admin/enquiries/:enqNo"
              element={<EnquiryDetails />}
            />
            {/* public routes */}
            <Route path="/view/:kind/:enqNo" element={<DocViewPublic />} />
            <Route
              path="/my-enquiries/:enqNo/"
              element={<EnquiryDetailsPagePublic />}
            />
          </Routes>
        </Router>
        {/* <Login /> */}
        <Footer />
      </QueryClientProvider>
    </>
  );
}

export default App;
