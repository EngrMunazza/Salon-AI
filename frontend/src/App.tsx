import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import About from '@/pages/About';
import ScrollToTop from '@/components/ScrollToTop';

export default function App() {
  return (
    <div className="font-body antialiased">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
