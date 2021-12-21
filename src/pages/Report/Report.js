import { Route, Switch, useRouteMatch } from "react-router";

import PageContainer from "../../components/UI/PageContainer";
import ReportCreate from "../../components/Report/ReportCreate";
import ReportTable from "../../components/Report/ReportTable";
import { useState } from "react";

const Report = () => {
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
						<ReportTable onModeChange={changeModeHandler}></ReportTable>
					</PageContainer>
				</Route>
				<Route path={`${path}/create`}>
					<ReportCreate mode={mode} reportId={selectedId}></ReportCreate>
				</Route>
			</Switch>
		</>
	);
};

export default Report;
