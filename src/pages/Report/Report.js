import { Route, Switch, useRouteMatch } from "react-router";

import PageContainer from "../../ui/PageContainer";
import ReportCreate from "../../components/Report/ReportCreate";
import ReportTable from "../../components/Report/ReportTable";
import { useState } from "react";

const Report = (props) => {
	const { path } = useRouteMatch();
	const [mode, setMode] = useState(
		props.history.location.state ? props.history.location.state.mode : "create"
	);
	const [selectedId, setSelectedId] = useState(
		props.history.location.state ? props.history.location.state.reportId : null
	);
	const [addItem, setAddItem] = useState(
		props.history.location.state ? props.history.location.state.item : null
	);

	const changeModeHandler = (value, id) => {
		setMode(value);
		setSelectedId(id);
		setAddItem(null);
	};

	console.log(props);
	return (
		<>
			<Switch>
				<Route exact path={path}>
					<PageContainer>
						<ReportTable onModeChange={changeModeHandler}></ReportTable>
					</PageContainer>
				</Route>
				<Route path={`${path}/create`}>
					<ReportCreate
						mode={mode}
						reportId={selectedId}
						addItem={addItem}
					></ReportCreate>
				</Route>
			</Switch>
		</>
	);
};

export default Report;
