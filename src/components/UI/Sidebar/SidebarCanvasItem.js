const SidebarCanvasItem = (props) => {
	return (
		<div
			className='items-center justify-center w-48 mb-4 shadow-md cursor-pointer hover:bg-gray-200'
			onClick={props.onClick}
		>
			<div className='h-6 pl-2 text-white bg-gray-800'>{props.name}</div>
			<div className='h-24 border border-gray-800 '>{props.children}</div>
		</div>
	);
};

export default SidebarCanvasItem;
