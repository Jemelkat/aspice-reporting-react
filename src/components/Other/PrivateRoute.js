import { React, useContext } from "react";

import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function LoggedRoute({ children, ...rest }) {
	const { loggedUser } = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={({ location }) => {
				return loggedUser.user ? (
					children
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
