const SidebarCanvasItem = ({ name, mini = false, ...props }) => {
	return (
		<div
			className={`flex flex-col items-center justify-center border border-black cursor-pointer ${
				mini ? "w-24" : "w-40"
			} mb-4 shadow-md`}
			onClick={props.onClick}
		>
			<span
				className={` ${
					mini ? "font-extralight text-xs text-center h-4" : "pl-2 h-6"
				} w-full   text-white bg-gray-800`}
			>
				{name}
			</span>
			<div className='w-full hover:bg-gray-200'>
				<div className={`border-gray-808 ${mini ? "h-16" : "h-24"}`}>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default SidebarCanvasItem;
