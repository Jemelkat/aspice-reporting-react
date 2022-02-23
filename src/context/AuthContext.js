import {createContext, useEffect, useState} from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [loggedUser, setLoggedUser] = useState({
		user: null,
		isAdmin: false,
		isLoading: true,
	});

	const removeLoggedUser = () => {
		setLoggedUser({
			user: null,
			isAdmin: false,
		});
	};

	const setLoggedUserHandler = (user) => {
		setLoggedUser({
			user: user,
			isAdmin: user ? user.roles.includes("ROLE_ADMIN") : false,
		});
	};

	useEffect(() => {
		setLoggedUser({
			user: AuthService.getLoggedUser(),
			isAdmin: AuthService.getLoggedUser()
				? AuthService.getLoggedUser().roles.includes("ROLE_ADMIN")
				: false,
			isLoading: false,
		});
	}, []);

	return (
		<AuthContext.Provider
			value={{
				loggedUser: loggedUser,
				removeLoggedUser: removeLoggedUser,
				setLoggedUser: setLoggedUserHandler,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
