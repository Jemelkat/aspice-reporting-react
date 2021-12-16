import TemplateTable from "../../components/Template/TemplateTable";
import { Route, Switch, useRouteMatch } from "react-router";
import TemplateCreate from "../../components/Template/TemplateCreate";
import PageContainer from "../../components/UI/PageContainer";
import { useState } from "react";

const Template = () => {
	const { path } = useRouteMatch();
	const [mode, setMode] = useState("create");
	const [selectedId, setSelectedId] = useState(null);

	const changeModeHandler = (value, id) => {
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
