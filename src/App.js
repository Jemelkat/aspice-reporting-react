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
import { FullScreenContext } from "./context/FullScreenContext";
import { AuthContext } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import AdminPanel from "./components/AdminPanel/AdminPanel";

function App() {
	const { navbar } = useContext(FullScreenContext);
	const { loggedUser, removeLoggedUser } = useContext(AuthContext);

	const logoutHandler = () => {
		logout();
		removeLoggedUser();
	};

	return (
		<>
			{navbar && <Nav></Nav>}
			<PageContainer>
				<Switch>
					<Route exact path='/'>
						<Home />
					</Route>
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
					{loggedUser.user && (
						<>
							<PrivateRoute path='/profile'>
								<Profile />
							</PrivateRoute>
							<AdminRoute path='/admin'>
								<AdminPanel></AdminPanel>
							</AdminRoute>
						</>
					)}
				</Switch>
			</PageContainer>
			<AuthVerify logOut={logoutHandler} />
		</>
	);
}

export default App;
