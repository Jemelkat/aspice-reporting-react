const SidebarLinks = (props) => {
	return (
		<>
			<div className='flex items-center justify-center pt-6 text-lg font-semibold text-gray-800 uppercase'>
				{props.sidebarName}
			</div>
			<nav className='mt-6'>{props.children}</nav>
		</>
	);
};

export default SidebarLinks;
