import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import "./App.css";

import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import PrivateRoute from "./components/Other/PrivateRoute";
import Nav from "./components/Nav/Nav";
import PageContainer from "./components/UI/PageContainer";
import { logout } from "./helpers/AuthHelper";
import AuthVerify from "./helpers/AuthVerify";
import { AuthContext } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import AdminPanel from "./components/AdminPanel/AdminPanel";

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
