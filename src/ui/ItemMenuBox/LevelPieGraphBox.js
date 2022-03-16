import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";
import { ReactComponent as SVGPie } from "../../assets/piechart.svg";

const LevelPieGraphBox = ({ mini = false, onClick }) => {
	return (
		<SidebarCanvasItem mini={mini} name={"Level pie graph"} onClick={onClick}>
			<SVGPie></SVGPie>
		</SidebarCanvasItem>
	);
};

export default LevelPieGraphBox;
