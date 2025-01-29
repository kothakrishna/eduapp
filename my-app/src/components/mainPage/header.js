import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const Navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo" onClick={()=>Navigate('/')}>Rubix IT Solutions</div>
      <nav className="nav-links">
        <ul>
          <li onClick={()=>Navigate('/')}>Home</li>
          <li onClick={()=>Navigate('/AboutUs')}>About Us</li>
          <li onClick={()=>Navigate('/Services')}>Services</li>
          <li onClick={()=>Navigate('/ContactUs')}>Contact</li>
          <button className="login-button" onClick={()=>Navigate('/LoginForm')}>Login</button>
        </ul>
      </nav>
    </header>
  );
};
export default Header;