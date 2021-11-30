const SidebarLinks = (props) => {
	return (
		<>
			<div className='flex items-center justify-center pt-6 text-lg uppercase font-semibold text-gray-800'>
				{props.sidebarName}
			</div>
			<nav className='mt-6'>{props.children}</nav>
		</>
	);
};

export default SidebarLinks;
