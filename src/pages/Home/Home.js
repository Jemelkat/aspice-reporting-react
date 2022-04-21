import { ArrowUpIcon } from "@heroicons/react/solid";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import landingPage from "../../assets/landing-page.png";

function Home() {
	const { loggedUser } = useContext(AuthContext);
	return (
		<>
			<div className='grid grid-cols-1 pt-16 pl-4 pr-4 md:pl-10 md:pr-10 md:grid-cols-2'>
				<div>
					<div className='text-6xl font-bold lg:text-8xl md:text-6xl'>
						ASPICE <br />
						reporting <br />
						tool
					</div>
					<div className='pt-10 text-xl'>
						{!loggedUser.user ? (
							<>
								Please sign in or register to continue.
								<div className='px-4 py-4 space-x-5'>
									<Link to={"/signin"}>
										<button className='px-5 py-2 font-bold text-white bg-blue-900 rounded-md'>
											Sign in
										</button>
									</Link>
									<Link to={"/signup"}>
										<button className='px-5 py-2 font-bold text-white bg-green-600 rounded-md'>
											Register
										</button>
									</Link>
								</div>
							</>
						) : (
							<>
								<div className='flex items-center'>
									<span>
										You are logged in - keep using the app with navigation menu
										above.
									</span>
									<ArrowUpIcon className='w-20 h-20'></ArrowUpIcon>
								</div>
							</>
						)}
					</div>
				</div>
				<div className='flex flex-col items-center justify-center pt-2'>
					<img
						alt=''
						src={landingPage}
						className='w-10/12 border-2 border-gray-800'
					/>
				</div>
			</div>
		</>
	);
}

export default Home;
