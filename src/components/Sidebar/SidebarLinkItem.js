import { Link } from "react-router-dom";

const SidebarLinkItem = (props) => {
	return (
		<Link
			class='w-full uppercase text-gray-800 flex items-center p-4 my-2 border-transparent transition-colors duration-200 justify-start hover:bg-gradient-to-r from-white to-indigo-100 border-r-4 hover:border-indigo-500 hover:text-indigo-500'
			to={props.link}
		>
			<span class='text-left'>{props.children}</span>
			<span class='mx-4 text-md font-normal'>{props.text}</span>
		</Link>
	);
};

export default SidebarLinkItem;
