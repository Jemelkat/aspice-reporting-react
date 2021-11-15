import SidebarLinkItem from "./SidebarLinkItem";

const SidebarLinks = (props) => {
	return (
		<>
			<div className='flex items-center justify-center pt-6'>LOGO</div>
			<nav className='mt-6'>{props.children}</nav>
		</>
	);
};

export default SidebarLinks;
