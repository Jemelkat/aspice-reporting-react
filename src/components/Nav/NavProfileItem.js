import { Menu } from "@headlessui/react";
import { Link } from "react-router-dom";

function NavProfileItem(props) {
	return (
		<Menu.Item>
			<Link
				to={props.link}
				className={`${props.addClasses} bg-white block px-4 py-2 text-sm text-gray-800`}
				onClick={props.onClick}
			>
				{props.text}
			</Link>
		</Menu.Item>
	);
}

export default NavProfileItem;
