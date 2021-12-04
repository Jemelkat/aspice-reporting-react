import { useContext } from "react";

import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children, ...rest }) {
	const { loggedUser } = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={({ location }) => {
				return loggedUser.user && loggedUser.isAdmin ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/",
							state: { from: location },
						}}
					/>
				);
			}}
		/>
	);
}

export default AdminRoute;
