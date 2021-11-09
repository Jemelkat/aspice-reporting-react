import PreviousMap from "postcss/lib/previous-map";
import { createContext, useState, useEffect } from "react";
import { getLoggedUser } from "../helpers/AuthHelper";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [loggedUser, setLoggedUser] = useState({
		user: null,
		isAdmin: false,
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
		console.log(getLoggedUser());
		setLoggedUser({
			user: getLoggedUser(),
			isAdmin: getLoggedUser()
				? getLoggedUser().roles.includes("ROLE_ADMIN")
				: false,
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
