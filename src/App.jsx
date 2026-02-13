import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import Blog from "./pages/Blog";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/how" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
