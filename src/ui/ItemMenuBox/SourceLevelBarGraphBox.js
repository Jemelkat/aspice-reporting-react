import { ReactComponent as SVGSourceBarHorizontal } from "../../assets/barchart-horizontal-sources.svg";
import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";

const SourceLevelBarGraphBox = ({ mini = false, onClick }) => {
	return (
		<SidebarCanvasItem mini={mini} name={"Sources level bar"} onClick={onClick}>
			<SVGSourceBarHorizontal />
		</SidebarCanvasItem>
	);
};

export default SourceLevelBarGraphBox;
