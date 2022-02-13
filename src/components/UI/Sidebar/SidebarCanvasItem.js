const SidebarCanvasItem = (props) => {
	return (
		<div
			className='items-center justify-center mb-4 cursor-pointer w-52 hover:bg-gray-200 '
			onClick={props.onClick}
		>
			<div className='h-6 pl-2 text-white bg-gray-800'>{props.name}</div>
			<div className='border border-gray-800 shadow-lg h-28'>
				{props.children}
			</div>
		</div>
	);
};

export default SidebarCanvasItem;
