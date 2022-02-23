import {Link} from "react-router-dom";

function NavColapsedItem(props) {
	return (
		<Link
			to={props.link}
			className={`${props.addClasses} text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium`}
			onClick={props.onClick}
		>
			{props.text}
		</Link>
	);
}

export default NavColapsedItem;
