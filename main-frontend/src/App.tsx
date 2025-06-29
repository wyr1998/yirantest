import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HRPathway from './pages/HRPathway';
import NHEJPathway from './pages/NHEJPathway';
import ProteinList from './components/ProteinList';
import ProteinForm from './components/ProteinForm';
import ProteinDetail from './pages/ProteinDetail';

function Home() {
  return (
    <div className="main-content">
      <h1>Welcome to Yiran</h1>
      <p style={{ maxWidth: 500, margin: '0 auto', color: '#555' }}>
        Explore different knowledge domains: Computer Science, DNA Repair, Earth Environment, and Maths. Click a section to get started!
      </p>
      <div className="nav-buttons">
        <Link to="/computer-science"><button className="nav-btn">Computer Science</button></Link>
        <Link to="/dna-repair"><button className="nav-btn">DNA Repair</button></Link>
        <Link to="/earth-environment"><button className="nav-btn">Earth Environment</button></Link>
        <Link to="/maths"><button className="nav-btn">Maths</button></Link>
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return <div className="main-content"><h2>{title} Page Coming Soon!</h2></div>;
}

function DnaRepairApp() {
  return (
    <div className="main-content">
      <Navigation />
      <div style={{ marginTop: 24 }}>
        <Routes>
          <Route path="" element={<HRPathway />} />
          <Route path="nhej" element={<NHEJPathway />} />
          <Route path="proteins" element={<ProteinList />} />
          <Route path="proteins/new" element={<ProteinForm />} />
          <Route path="proteins/:id/edit" element={<ProteinForm />} />
          <Route path="proteins/:id" element={<ProteinDetail />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <span className="site-title">Yiran Knowledge Hub</span>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/computer-science" element={<Placeholder title="Computer Science" />} />
          <Route path="/dna-repair/*" element={<DnaRepairApp />} />
          <Route path="/earth-environment" element={<Placeholder title="Earth Environment" />} />
          <Route path="/maths" element={<Placeholder title="Maths" />} />
        </Routes>
        <footer className="footer">
          <span>© {new Date().getFullYear()} Yiran. All rights reserved.</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
