import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Nav from "./components/Nav/Nav";
import PageContainer from "./components/UI/PageContainer";
import { logout } from "./helpers/AuthHelper";
import Source from "./pages/Source/Source";
import AuthVerify from "./helpers/AuthVerify";
import { AuthContext } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminPanel from "./pages/Admin/AdminPanel";
import Profile from "./pages/Profile/Profile";
import Template from "./pages/Template/Template";
import Report from "./pages/Report/Report";
import DashBoard from "./pages/DashBoard/Dashboard";
import Loader from "./components/UI/Loader/Loader";

function App() {
	const { loggedUser, removeLoggedUser } = useContext(AuthContext);

	const logoutHandler = () => {
		logout();
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
										<PageContainer>
											<DashBoard />
										</PageContainer>
									</PrivateRoute>
									<PrivateRoute path='/profile'>
										<PageContainer>
											<Profile />
										</PageContainer>
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
				<Loader fullscreen={true} dark={true}></Loader>
			)}
		</>
	);
}

export default App;
