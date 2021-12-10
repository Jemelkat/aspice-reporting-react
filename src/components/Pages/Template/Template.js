import TemplateGrid from "./TemplateGrid";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../..//node_modules/react-resizable/css/styles.css";
import Title from "../../UI/Title";
import TemplateTable from "./TemplateTable";
import { Route, Switch, useRouteMatch } from "react-router";
import TemplateCreate from "./TemplateCreate";
import PageContainer from "../../UI/PageContainer";
import { useState } from "react";

const Template = () => {
	const { url, path } = useRouteMatch();
	const [mode, setMode] = useState("create");
	const [selectedId, setSelectedId] = useState(null);

	const changeModeHandler = (value, id) => {
		debugger;
		setMode(value);
		setSelectedId(id);
	};

	return (
		<>
			<Switch>
				<Route exact path={path}>
					<PageContainer>
						<TemplateTable onModeChange={changeModeHandler}></TemplateTable>
					</PageContainer>
				</Route>
				<Route path={`${path}/create`}>
					<TemplateCreate mode={mode} templateId={selectedId}></TemplateCreate>
				</Route>
			</Switch>
		</>
	);
};

export default Template;
