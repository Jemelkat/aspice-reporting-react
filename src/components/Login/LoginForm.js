import {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router";
import {getLoggedUser, login, register} from "../../helpers/AuthHelper";
import {AuthContext} from "../../context/AuthContext";

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
			login(username, password)
				.then((response) => {
					setLoggedUser(getLoggedUser());
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
			register(username, email, password)
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
			<form className='flex flex-col p-10' onSubmit={submitHandler}>
				<div>
					<span className='pb-10 text-2xl'>
						{isLogin ? "Login" : "Register"}
					</span>
					{isLoading && (
						<div className='w-5 h-5 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin'></div>
					)}
				</div>
				<span>{error.errorMessage}</span>
				<label className='text-xl' htmlFor='username'>
					Username
				</label>
				<input
					className='px-3 py-2'
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
							className='px-3 py-2'
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
					className='px-3 py-2'
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
			</form>
		</>
	);
}

export default LoginForm;
