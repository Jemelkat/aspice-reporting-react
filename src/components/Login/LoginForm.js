import {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router";
import {AuthContext} from "../../context/AuthContext";
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

	const validateInput = (username, email, password, isRegister) => {
		if (username.length < 3 || username.length > 20) {
			setIsLoading(false);
			setError({
				error: true,
				errorMessage: "Username must be between 3 and 20 characters long.",
			});
			return false;
		}
		if (isRegister) {
			var input = document.getElementById("email");
			if (!input.checkValidity()) {
				setIsLoading(false);
				setError({
					error: true,
					errorMessage: "Email not valid",
				});
				return false;
			}
		}
		if (password.length < 6 || password.length > 50) {
			setIsLoading(false);
			setError({
				error: true,
				errorMessage: "Password must be between 6 and 50 characters long.",
			});
			return false;
		}
		return true;
	};

	const submitHandler = (e) => {
		setIsLoading(true);
		e.preventDefault();
		if (isLogin) {
			if (validateInput(username, "", password, false)) {
				AuthService.login(username, password)
					.then((response) => {
						setLoggedUser(AuthService.getLoggedUser());
						setIsLoading(false);
						history.push("/home");
					})
					.catch((error) => {
						setIsLoading(false);
						if (error.response?.data?.message) {
							setError({
								error: true,
								errorMessage: error.response.data.message,
							});
						} else {
							setError({
								error: true,
								errorMessage: "Error logging in",
							});
						}
					});
			} else {
				setIsLoading(false);
			}
		} else {
			if (validateInput(username, email, password, true)) {
				AuthService.register(username, email, password)
					.then((response) => {
						AuthService.login(username, password)
							.then((response) => {
								setLoggedUser(AuthService.getLoggedUser());
								setIsLoading(false);
								history.push("/home");
							})
							.catch((error) => {
								setIsLoading(false);
								if (error.response?.data?.message) {
									setError({
										error: true,
										errorMessage: error.response.data.message,
									});
								} else {
									setError({
										error: true,
										errorMessage: "Error logging in",
									});
								}
							});
					})
					.catch((error) => {
						setIsLoading(false);
						if (error.response?.data?.message) {
							setError({
								error: true,
								errorMessage: error.response.data.message,
							});
						} else {
							setError({
								error: true,
								errorMessage: "Error creating account",
							});
						}
					});
			} else {
				setIsLoading(false);
			}
		}
	};

	return (
		<>
			<form
				className={`flex flex-col pl-5 pr-5 pb-10 ${
					isLogin ? "h-80" : "h-96"
				} w-96`}
				onSubmit={submitHandler}
			>
				{isLoading ? (
					<Loader>{isLogin ? "Loging in..." : "Registering..."}</Loader>
				) : (
					<>
						<div>
							<span className='pb-10 text-2xl'>
								{isLogin ? "Login" : "Register"}
							</span>
						</div>
						<span className='text-red-500'>{error.errorMessage}</span>
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
							value={username}
						></input>
						{!isLogin && (
							<>
								<label className='text-xl' htmlFor='email'>
									Email
								</label>
								<input
									className='px-3 py-2 border border-gray-800 rounded'
									type='email'
									id='email'
									required
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									value={email}
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
							value={password}
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
