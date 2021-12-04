import { withRouter } from "react-router-dom";
//Verifies if token is not expired with every redirect

const parseJwt = (token) => {
	try {
		return JSON.parse(atob(token.split(".")[1]));
	} catch (e) {
		return null;
	}
};

const AuthVerify = (props) => {
	props.history.listen(() => {
		const user = JSON.parse(localStorage.getItem("user"));

		if (user) {
			const decodedJwt = parseJwt(user.token);
			if (decodedJwt.exp * 1000 < Date.now()) {
				props.logOut();
			}
		}
	});

	return <div></div>;
};

export default withRouter(AuthVerify);
