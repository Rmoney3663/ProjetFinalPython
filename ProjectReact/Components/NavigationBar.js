import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = ({ userId }) => {
  const navStyles = {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
  };

  const linkStyles = { 
    fontSize: '60px',
    textDecoration: 'none',
    color: '#FFFFFF',
    margin: '0 20px',
    transition: 'color 0.3s',
  };

  const linkHoverStyles = {
    ...linkStyles,
    color: '#57E1E6',
  };

  return (
    <nav>
      <ul style={navStyles}>
        <li>
          <Link to="/" style={linkStyles} onMouseEnter={(e) => e.target.style.color = linkHoverStyles.color} onMouseLeave={(e) => e.target.style.color = linkStyles.color}>Home</Link>
        </li>
        <li>
          <Link to={`/Utilisateur/${userId}`} style={linkStyles} onMouseEnter={(e) => e.target.style.color = linkHoverStyles.color} onMouseLeave={(e) => e.target.style.color = linkStyles.color}>Profile</Link>
        </li>
        <li>
          <Link to={"/explorer"} style={linkStyles} onMouseEnter={(e) => e.target.style.color = linkHoverStyles.color} onMouseLeave={(e) => e.target.style.color = linkStyles.color}>Explorer</Link>
        </li>
        {/* Add more navigation links here */}
      </ul>
    </nav>
  );
};

export default NavigationBar;


