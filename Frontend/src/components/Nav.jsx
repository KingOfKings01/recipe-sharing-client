import { Link, useLocation } from 'react-router-dom'
import "../nav.css";
import { useEffect, useState } from 'react';
import Logout from '../Functions/logout';

export default function Nav() {
    const [isLogin, setIsLogin] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation(); // Get the current location
  
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLogin(!!token);
    };
  
    const handleLogout = () => {
      Logout();
      setIsLogin(false);
    };
  
    useEffect(() => {
      checkLoginStatus();
    }, [location]);
  
  return (
    <nav>
        <ul>
          <li>
            <Link to="/"><img src="../public/Logo.svg" alt="Logo" id='logo'/></Link>
          </li>
          <li>
            <h4 className='title'>Welcome</h4>
          </li>
          <li>
            {isLogin ? (
              <div className="dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button className="dropbtn">Profile</button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/my-recipes">My Recipes</Link>
                    <Link to="/my-favorites">My Favorites</Link>
                    <Link to="/my-followers">My Followers</Link>
                    <Link to="/my-following">My Following</Link>
                    <button className='logout-btn' onClick={handleLogout}>Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
  )
}
