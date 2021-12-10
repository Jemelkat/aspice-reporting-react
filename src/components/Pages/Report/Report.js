import { Route, Switch, useRouteMatch } from "react-router";
import PageContainer from "../../UI/PageContainer";
import ReportCreate from "./ReportCreate";
import ReportTable from "./ReportTable";

const Report = () => {
	const { url, path } = useRouteMatch();

	return (
		<>
			<Switch>
				<Route exact path={path}>
					<PageContainer>
						<ReportTable></ReportTable>
					</PageContainer>
				</Route>
				<Route path={`${path}/create`}>
					<ReportCreate></ReportCreate>
				</Route>
			</Switch>
		</>
	);
};

export default Report;
