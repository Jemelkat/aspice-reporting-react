import { Link } from "react-router-dom";

const SidebarLinkItem = (props) => {
	return (
		<Link
			className='flex items-center justify-start w-full p-4 my-2 text-gray-800 uppercase transition-colors border-r-4 border-transparent hover:border-gray-800'
			to={props.link}
		>
			<span className='text-left'>{props.children}</span>
			<span className='mx-4 text-md'>{props.text}</span>
		</Link>
	);
};

export default SidebarLinkItem;
