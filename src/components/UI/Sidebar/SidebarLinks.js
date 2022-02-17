const SidebarLinks = (props) => {
	return (
		<>
			<div className='flex items-center justify-center pt-4 text-lg font-semibold text-gray-800 uppercase'>
				{props.sidebarName}
			</div>
			<div className='flex justify-center'>{props.children}</div>
		</>
	);
};

export default SidebarLinks;
