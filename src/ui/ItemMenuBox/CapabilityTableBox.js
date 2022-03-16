import { ReactComponent as SVGCapabilityTable } from "../../assets/capability-table.svg";
import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";

const CapabilityTableBox = ({ mini = false, onClick }) => {
	return (
		<SidebarCanvasItem mini={mini} name={"Capability table"} onClick={onClick}>
			<SVGCapabilityTable />
		</SidebarCanvasItem>
	);
};

export default CapabilityTableBox;
