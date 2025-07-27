import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HRPathway from './pages/HRPathway';
import NHEJPathway from './pages/NHEJPathway';
import ProteinList from './components/ProteinList';
import { ProteinForm } from './components/ProteinForm';
import ProteinDetail from './pages/ProteinDetail';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BlogEditor from './pages/BlogEditor';
import { proteinApi } from './services/api';
import { authService } from './services/authService';
import { Protein } from './types';

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

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

function ProteinFormWrapper() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState<Partial<Protein>>({});
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await authService.verifyToken();
      if (!user) {
        // Redirect to admin login if not authenticated
        navigate('/dna-repair/admin/login');
        return;
      }
      setAuthChecked(true);
      
      // Load protein data if editing
      if (id) {
        setLoading(true);
        try {
          const data = await proteinApi.getOne(id);
          setInitialData(data);
        } catch (error) {
          console.error('Failed to fetch protein:', error);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/dna-repair/admin/login');
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/dna-repair/proteins');
  };

  const handleSubmit = async (data: any) => {
    try {
      if (id) {
        await proteinApi.update(id, data);
      } else {
        await proteinApi.create(data);
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save protein:', error);
    }
  };

  if (!authChecked) {
    return <div>Checking authentication...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProteinForm
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialData={initialData}
    />
  );
}

function DnaRepairApp() {
  return (
    <div className="main-content">
      <Navigation />
      <div>
        <Routes>
          <Route path="" element={<HRPathway />} />
          <Route path="nhej" element={<NHEJPathway />} />
          <Route path="proteins" element={<ProteinList />} />
          <Route path="proteins/new" element={<ProteinFormWrapper />} />
          <Route path="proteins/:id/edit" element={<ProteinFormWrapper />} />
          <Route path="proteins/:id" element={<ProteinDetail />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogEditor />} />
          <Route path="blog/edit/:id" element={<BlogEditor />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/new-post" element={<BlogEditor />} />
          <Route path="admin/edit/:id" element={<BlogEditor />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router {...router}>
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
        <footer className="footer" style={{ fontSize: '14px', color: '#666', padding: '20px 0', textAlign: 'center' }}>
          <div>© {new Date().getFullYear()} Yiran. All rights reserved.</div>
  
          <div style={{ marginTop: '10px' }}>
            <span style={{ marginRight: '16px' }}>
                <a 
                  href="https://beian.miit.gov.cn/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  ICP备案：辽ICP备2025059283号
              </a>
            </span>
    
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <a 
                href="https://beian.mps.gov.cn/#/query/webSearch?code=21011202001086" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#666', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                <img src="/beian.png" alt="公安备案图标" style={{ width: '16px', height: '16px', marginRight: '5px' }} />
                辽公网安备21011202001086号
              </a>
            </span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
