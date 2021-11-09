import { Link } from "react-router-dom";

function NavPrimaryItem(props) {
	return (
		<Link
			to={props.link}
			className={`${props.addClasses} hover:border-white border-transparent border-b-4 text-white px-3 pt-5 font-medium h-16`}
			onClick={props.onClick}
		>
			{props.text}
		</Link>
	);
}

export default NavPrimaryItem;
