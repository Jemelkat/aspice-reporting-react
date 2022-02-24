import LoginForm from "../../components/Login/LoginForm";
import {Link} from "react-router-dom";

function Login(props) {
	return (
		<div className='bg-gray-800 min-w-screen h-screen absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center'>
			<div className='flex justify-center items-center'>
				<div className='shadow-lg bg-white p-6 rounded-lg'>
					<LoginForm isLogin={props.isLogin}></LoginForm>
					<span>
						<Link to='/'>Go to homepage</Link>
					</span>
				</div>
			</div>
		</div>
	);
}

export default Login;
