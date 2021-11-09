import LoginForm from "./LoginForm";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FullScreenContext } from "../../context/FullScreenContext";

function Login(props) {
	const { enableFullScreen, disableFullScreen, hideNavbar, showNavbar } =
		useContext(FullScreenContext);

	useEffect(() => {
		enableFullScreen();
		hideNavbar();
		return () => {
			disableFullScreen();
			showNavbar();
		};
	});

	return (
		<div className='min-h-screen bg-gray-800 flex justify-center items-center'>
			<div className='shadow-lg bg-white p-6 '>
				<LoginForm isLogin={props.isLogin}></LoginForm>
				<span>
					<Link to='/'>Go to homepage</Link>
				</span>
			</div>
		</div>
	);
}

export default Login;
