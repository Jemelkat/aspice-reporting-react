import SidebarCanvasItem from "../Sidebar/SidebarCanvasItem";
import {ReactComponent as SVGBarHorizontal} from "../../assets/barchart-horizontal.svg";

const LevelBarGraphBox = ({ mini, onClickFunction }) => {
	return (
		<SidebarCanvasItem mini name={"Level bar"} onClick={onClickFunction}>
			<SVGBarHorizontal></SVGBarHorizontal>
		</SidebarCanvasItem>
	);
};

export default LevelBarGraphBox;
