import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import "./App.css";

import Home from "./components/Pages/Home/Home";
import Login from "./components/Login/Login";
import Nav from "./components/Nav/Nav";
import PageContainer from "./components/UI/PageContainer";
import { logout } from "./helpers/AuthHelper";
import Source from "./components/Pages/Source/Source";
import AuthVerify from "./helpers/AuthVerify";
import { AuthContext } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminPanel from "./components/Pages/AdminPanel/AdminPanel";
import Profile from "./components/Pages/Profile/Profile";
import axiosAuthInterceptor from "./helpers/AxiosHelper";
import Template from "./components/Pages/Template/Template";

function App() {
	const { loggedUser, removeLoggedUser } = useContext(AuthContext);

	const logoutHandler = () => {
		logout();
		removeLoggedUser();
	};

	return (
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
							<Route exact path='/signin'>
								<PageContainer>
									<Login isLogin={true} />
								</PageContainer>
							</Route>
							<Route exact path='/signup'>
								<PageContainer>
									<Login isLogin={false} />
								</PageContainer>
							</Route>
						</>
					)}
					{/*When user is logged in*/}
					{loggedUser.user && (
						<>
							<PrivateRoute exact path='/profile'>
								<PageContainer>
									<Profile />
								</PageContainer>
							</PrivateRoute>
							<PrivateRoute exact path='/source'>
								<PageContainer>
									<Source />
								</PageContainer>
							</PrivateRoute>
							<PrivateRoute exact path='/template'>
								<PageContainer>
									<Template />
								</PageContainer>
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
	);
}

export default App;
