import logo from "./logo.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
function App() {
const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/wander" element={<ActiveWander />} />
              <Route path="/wander/active/wander" element={<ActiveWander />} />
              <Route path="/wander/invite" element={<Invite />} />
              <Route path="/wander/reports" element={<Reports />} />
              <Route path="/wander/reports/view" element={<ReportsView />} /> */}
            </Routes>
          </Router>
          {/* <Login /> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
