import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import BrandBanner from './components/BrandBanner';
import Strip from './components/Strip';
import Offers from './components/Offers';
import Stats from './components/Stats';
import WhyHuman from './components/WhyHuman';
import Quote from './components/Quote';
import Story from './components/Story';
import BookProject from './components/BookProject';
import SkoolCommunity from './components/SkoolCommunity';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';
import ProductDetail1 from './components/ProductDetail1';
import ProductDetail2 from './components/ProductDetail2';
import ProductDetail3 from './components/ProductDetail3';
import ContactPage from './components/ContactPage';
import PowerOfAIRegistration from './components/PowerOfAIRegistration';
import PowerOfAIThankYou from './components/PowerOfAIThankYou';
import SpeakerAnmeldung from './components/SpeakerAnmeldung';
import SpeakerFormPage from './components/speakerform/SpeakerFormPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminPasswordReset from './components/admin/AdminPasswordReset';
import Ablaufplan from './components/ablaufplan/Ablaufplan';
import { ToastProvider } from './components/Toast';
import { useReveal } from './hooks/useReveal';
import { useScrollNav } from './hooks/useScrollNav';
import { useTilt } from './hooks/useTilt';
import { useParallax } from './hooks/useParallax';
import { useCounterAnimation } from './hooks/useCounterAnimation';
import { useHashRoute } from './hooks/useHashRoute';
import WhatsAppBubble from './components/WhatsAppBubble';
import { updatePageTitle, injectStructuredData } from './lib/seo';

function HomePage() {
  useReveal();
  useScrollNav();
  useTilt('.wc', { x: 3, y: 2 }, 'translateY(-3px)');
  useParallax();
  useCounterAnimation();

  return (
    <>
      <Nav />
      <Hero />
      <div className="hero-to-light" />
      <Strip />
      <BookProject />
      <Offers />
      <BrandBanner />
      <Stats />
      <div className="ruleg"></div>
      <WhyHuman />
      <Quote />
      <div className="ruleg"></div>
      <Story />
      <div className="ruleg"></div>
      <SkoolCommunity />
      <div className="ruleg"></div>
      <FinalCTA />
      <Footer />
    </>
  );
}

function App() {
  const hash = useHashRoute();

  useEffect(() => {
    injectStructuredData();
  }, []);

  useEffect(() => {
    updatePageTitle(hash);
  }, [hash]);

  let page;
  if (hash === '#impressum') page = <Impressum />;
  else if (hash === '#datenschutz') page = <Datenschutz />;
  else if (hash === '#power-upgrade') page = <ProductDetail1 />;
  else if (hash === '#unersetzbar') page = <ProductDetail2 />;
  else if (hash === '#voice-to-brain') page = <ProductDetail3 />;
  else if (hash === '#power-of-ai-anmeldung') page = <PowerOfAIRegistration />;
  else if (hash === '#power-of-ai-danke') page = <PowerOfAIThankYou />;
  else if (hash === '#speaker-anmeldung') page = <SpeakerAnmeldung />;
  else if (hash === '#speaker-formular' || hash.startsWith('#speaker-formular?')) page = <SpeakerFormPage />;
  else if (hash === '#admin') page = <AdminLogin />;
  else if (hash === '#admin-reset' || hash.startsWith('#admin-reset?')) page = <AdminPasswordReset />;
  else if (hash === '#admin-dashboard') page = <AdminDashboard />;
  else if (hash === '#ablaufplan') page = <Ablaufplan />;
  else if (hash.startsWith('#kontakt')) page = <ContactPage hash={hash} />;
  else page = <HomePage />;

  return (
    <ToastProvider>
      {page}
      <WhatsAppBubble />
    </ToastProvider>
  );
}

export default App;
