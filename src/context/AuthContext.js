import {createContext, useEffect, useState} from "react";
import {getLoggedUser} from "../helpers/AuthHelper";

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
			user: getLoggedUser(),
			isAdmin: getLoggedUser()
				? getLoggedUser().roles.includes("ROLE_ADMIN")
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
