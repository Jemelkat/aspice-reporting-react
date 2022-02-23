import TemplateTable from "../../components/Template/TemplateTable";
import {Route, Switch, useRouteMatch} from "react-router";
import TemplateCreate from "../../components/Template/TemplateCreate";
import PageContainer from "../../components/UI/PageContainer";
import {useState} from "react";

const Template = (props) => {
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

	return (
		<>
			<Switch>
				<Route exact path={path}>
					<PageContainer>
						<TemplateTable onModeChange={changeModeHandler}></TemplateTable>
					</PageContainer>
				</Route>
				<Route path={`${path}/create`}>
					<TemplateCreate
						mode={mode}
						templateId={selectedId}
						addItem={addItem}
					></TemplateCreate>
				</Route>
			</Switch>
		</>
	);
};

export default Template;
