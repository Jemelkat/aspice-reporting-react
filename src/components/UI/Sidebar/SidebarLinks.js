const SidebarLinks = (props) => {
	return (
		<>
			<div className='flex items-center justify-center pt-2 pb-2 text-lg font-semibold text-gray-800 uppercase'>
				{props.sidebarName}
			</div>
			<nav className=''>{props.children}</nav>
		</>
	);
};

export default SidebarLinks;
