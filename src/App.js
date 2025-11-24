import logo from "./logo.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Scuba from "./pages/Scuba";
import Footer from "./components/Footer";
import Skydive from "./pages/Skydive";
import About from "./pages/About";
import Detail from "./pages/Detail";
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
              {/* <Route path="/contact" element={<Scuba />} /> */}
              {/* <Route path="/wander" element={<ActiveWander />} />
              <Route path="/wander/active/wander" element={<ActiveWander />} />
              <Route path="/wander/invite" element={<Invite />} />
              <Route path="/wander/reports" element={<Reports />} />
              <Route path="/wander/reports/view" element={<ReportsView />} /> */}
            </Routes>
          </Router>
          {/* <Login /> */}
          <Footer />
      </QueryClientProvider>
    </>
  );
}

export default App;
