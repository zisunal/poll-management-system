import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faFlagCheckered, faBullhorn, faHome, faUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const location = useLocation();
    const [path, setPath] = useState('');
    useEffect(() => {
        setPath(location.pathname);
    }, [location.pathname]);
	return (
		<header className='home-header'>
			<h1>Poll World - Admin</h1>
            <div className='nav'>
                <Link to='/admin' className={path === '/admin' ? 'selected' : ''}>
                    <FontAwesomeIcon icon={faHome} />
                </Link>
                <Link to='/admin/create' className={path === '/admin/create' ? 'selected' : ''}>
                    <FontAwesomeIcon icon={faAdd} />
                </Link>
                <Link to='/admin/not-started' className={path === '/admin/not-started' ? 'selected' : ''}>
                    <FontAwesomeIcon icon={faBullhorn} />
                </Link>
                <Link to='/admin/finished' className={path === '/admin/finished' ? 'selected' : ''}>
                    <FontAwesomeIcon icon={faFlagCheckered} />
                </Link>
                <Link to='/admin/profile' className={path === '/admin/pofile' ? 'selected' : ''}>
                    <FontAwesomeIcon icon={faUser} />
                </Link>
            </div>
			
		</header>
	);
}

export default Header;