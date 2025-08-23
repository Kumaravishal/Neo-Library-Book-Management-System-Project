import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Home.css";


const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('user');

  return (
    <div className="home-container">
      

      {/* Main Content */}
      <main className="home-main">
        <div className="hero-section">
          <div className="hero-content">
            <h2>Welcome to Neo Library Book Management System</h2>
            <p>Manage your library collection with ease and efficiency</p>
            
            <div className="action-buttons">
              <button 
                onClick={() => navigate('/addbook')}
                className="action-btn primary"
              >
                ➕ Add Book
              </button>
              
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    navigate('/login');
                  }}
                  className="action-btn secondary"
                >
                  🔓 Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="action-btn secondary"
                >
                  🔑 Login
                </button>
              )}
            </div>
          </div>
          
          <div className="hero-image">
            <img 
              src="https://stars-ai.com/wp-content/uploads/2023/10/online-library-system.jpg" 
              alt="Library System" 
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3>What You Can Do</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h4>Add Books</h4>
              <p>Add new books to your library collection with detailed information</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h4>View Books</h4>
              <p>Browse through all books in your library with search and filter options</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h4>User Management</h4>
              <p>Manage library staff and admin users (Admin only)</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Reports</h4>
              <p>Generate reports and export data (Admin only)</p>
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default Home;
