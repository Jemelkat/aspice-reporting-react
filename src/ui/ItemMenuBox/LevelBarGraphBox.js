import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";
import {ReactComponent as SVGBarHorizontal} from "../../assets/barchart-horizontal.svg";

const LevelBarGraphBox = ({ mini = false, onClick }) => {
	return (
		<SidebarCanvasItem mini={mini} name={"Level bar"} onClick={onClick}>
			<SVGBarHorizontal></SVGBarHorizontal>
		</SidebarCanvasItem>
	);
};

export default LevelBarGraphBox;
