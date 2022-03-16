import {ReactComponent as SVGSimpleTable} from "../../assets/simple-table.svg";
import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";

const SimpleTableBox = ({ mini = false, onClick }) => {
	return (
		<SidebarCanvasItem mini={mini} name={"Table"} onClick={onClick}>
			<SVGSimpleTable />
		</SidebarCanvasItem>
	);
};

export default SimpleTableBox;
