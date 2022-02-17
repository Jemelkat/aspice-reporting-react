import React from "react";
import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoggedRoute({ children, ...rest }) {
	const { loggedUser } = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={({ location, ...props }) => {
				return loggedUser.user ? (
					React.cloneElement(children, { ...props })
				) : (
					<Redirect
						to={{
							pathname: "/signin",
							state: { from: location },
						}}
					/>
				);
			}}
		/>
	);
}

export default LoggedRoute;
