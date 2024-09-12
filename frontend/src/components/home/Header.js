import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
	return (
		<header className='home-header'>
			<h1>Poll World</h1>
			<Link to='/result'>
				<FontAwesomeIcon icon={faSquarePollVertical} />
			</Link>
		</header>
	);
}

export default Header;