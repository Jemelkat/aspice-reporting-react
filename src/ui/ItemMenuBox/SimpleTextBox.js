import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";

const SimpleTextBox = ({ mini = false, onClick }) => {
	return (
		<SidebarCanvasItem mini={mini} name={"Text"} onClick={onClick}>
			<div className='flex items-center justify-center h-full overflow-hidden text-sm text-center'>
				Simple text
			</div>
		</SidebarCanvasItem>
	);
};

export default SimpleTextBox;
