import {ReactComponent as SVGSourceBarHorizontal} from "../../assets/barchart-horizontal-sources.svg";
import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";

const LevelBarGraphBox = ({ mini = false, onClick }) => {
	return (
		<SidebarCanvasItem mini={mini} name={"Level bar graph"} onClick={onClick}>
			<SVGSourceBarHorizontal />
		</SidebarCanvasItem>
	);
};

export default LevelBarGraphBox;
