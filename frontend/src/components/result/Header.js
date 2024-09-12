import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
	return (
		<header className='home-header'>
			<h1>Poll World Result</h1>
			<Link to='/' className='result-nav-icon'>
				<FontAwesomeIcon icon={faHome} />
			</Link>
		</header>
	);
}

export default Header;