import "./App.css";

import {Route, Switch} from "react-router-dom";

import AdminPanel from "./pages/Admin/AdminPanel";
import AdminRoute from "./routes/AdminRoute";
import {AuthContext} from "./context/AuthContext";
import AuthVerify from "./helpers/AuthVerify";
import DashBoard from "./pages/DashBoard/Dashboard";
import Home from "./pages/Home/Home";
import Loader from "./ui/Loader/Loader";
import Login from "./pages/Login/Login";
import Nav from "./components/Nav/Nav";
import PageContainer from "./ui/PageContainer";
import PrivateRoute from "./routes/PrivateRoute";
import Report from "./pages/Report/Report";
import Source from "./pages/Source/Source";
import Template from "./pages/Template/Template";
import {useContext} from "react";
import AuthService from "./services/AuthService";

function App() {
	const { loggedUser, removeLoggedUser } = useContext(AuthContext);

	const logoutHandler = () => {
		AuthService.logout();
		removeLoggedUser();
	};

	return (
		<>
			{!loggedUser.isLoading ? (
				<>
					<Nav></Nav>
					<Switch>
						<>
							<Route exact path='/'>
								<PageContainer>
									<Home />
								</PageContainer>
							</Route>
							{/*When user is not logged in*/}
							{!loggedUser.user && (
								<>
									<Route path='/signin'>
										<Login isLogin={true} />
									</Route>
									<Route path='/signup'>
										<Login isLogin={false} />
									</Route>
								</>
							)}
							{/*When user is logged in*/}
							{loggedUser.user && (
								<>
									<PrivateRoute path='/dashboard'>
										<DashBoard />
									</PrivateRoute>
									<PrivateRoute path='/source'>
										<PageContainer>
											<Source />
										</PageContainer>
									</PrivateRoute>
									<PrivateRoute path='/template'>
										<Template />
									</PrivateRoute>
									<PrivateRoute path='/report'>
										<Report />
									</PrivateRoute>
								</>
							)}

							{/*Fullscreen content*/}
							<AdminRoute path='/admin'>
								<AdminPanel></AdminPanel>
							</AdminRoute>
						</>
					</Switch>

					<AuthVerify logOut={logoutHandler} />
				</>
			) : (
				<Loader fullscreen dark>
					Loading...
				</Loader>
			)}
		</>
	);
}

export default App;
