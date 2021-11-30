import TemplateGrid from "./TemplateGrid";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../..//node_modules/react-resizable/css/styles.css";
import Title from "../../UI/Title";

const Template = () => {
	return (
		<>
			<Title text='Create'></Title>
			<div>
				<TemplateGrid></TemplateGrid>
			</div>
		</>
	);
};

export default Template;
