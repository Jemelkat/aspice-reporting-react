import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";
import Loader from "../../ui/Loader/Loader";

function LoginForm(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [isLogin, setIsLogin] = useState(props.isLogin);
	const [error, setError] = useState({
		isError: false,
		errorMessage: "",
	});

	//Set logged user to Context
	const { setLoggedUser } = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(false);

	let history = useHistory();

	useEffect(() => {
		setIsLogin(props.isLogin);
		setError({ isError: false, errorMessage: "" });
		return () => setIsLoading(false);
	}, [props.isLogin]);

	const submitHandler = (e) => {
		setIsLoading(true);
		e.preventDefault();
		if (isLogin) {
			AuthService.login(username, password)
				.then((response) => {
					setLoggedUser(AuthService.getLoggedUser());
					setIsLoading(false);
					history.push("/home");
				})
				.catch((error) => {
					setIsLoading(false);
					if (error.response) {
						setError({
							error: true,
							errorMessage: error.response.data.message,
						});
					} else {
						setError({
							error: true,
							errorMessage: error.message,
						});
					}
				});
		} else {
			AuthService.register(username, email, password)
				.then((response) => {
					setIsLoading(false);
					history.push("/home");
				})
				.catch((error) => {
					setIsLoading(false);
					if (error.response) {
						setError({
							error: true,
							errorMessage: error.response.data.message,
						});
					} else {
						setError({
							error: true,
							errorMessage: error.message,
						});
					}
				});
		}
	};

	return (
		<>
			<form className={`flex flex-col p-10 ${isLogin ? "h-80" : "h-96"} w-72`} onSubmit={submitHandler}>
				{isLoading ? (
					<Loader>{isLogin ? "Loging in..." : "Registering..."}</Loader>
				) : (
					<>
						<div>
							<span className='pb-10 text-2xl'>
								{isLogin ? "Login" : "Register"}
							</span>
						</div>
						<span>{error.errorMessage}</span>
						<label className='text-xl' htmlFor='username'>
							Username
						</label>
						<input
							className='px-3 py-2 border border-gray-800 rounded'
							type='text'
							id='username'
							required
							onChange={(e) => {
								setUsername(e.target.value);
							}}
						></input>
						{!isLogin && (
							<>
								<label className='text-xl' htmlFor='email'>
									Email
								</label>
								<input
									className='px-3 py-2 border border-gray-800 rounded'
									type='text'
									id='email'
									required
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								></input>
							</>
						)}
						<label className='text-xl' htmlFor='password'>
							Password
						</label>
						<input
							className='px-3 py-2 border border-gray-800 rounded'
							type='password'
							id='password'
							required
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						></input>
						<button
							className='py-3 mt-5 text-xl border-2 border-black'
							type='submit'
						>
							{isLogin ? "Login" : "Register"}
						</button>
					</>
				)}
			</form>
		</>
	);
}

export default LoginForm;
