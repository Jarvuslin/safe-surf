import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/"><h1>SafeSurf</h1></Link>
            <div className="li">
                <Link to="/profanity">Profanity Filter</Link>
                <Link to="/about-us">About Us</Link>
                <Link to="/contact-us">Contact Us</Link>
            </div>
        </nav>
    );
}

export default Navbar;