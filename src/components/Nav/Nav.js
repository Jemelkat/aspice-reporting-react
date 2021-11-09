import React, { useContext, useState } from "react";
import NavPrimary from "./NavPrimary";
import NavButton from "./NavButton";
import NavColapsed from "./NavColapsed";
import NavColapsedItem from "./NavColapsedItem";
import NavPrimaryItem from "./NavPrimaryItem";
import NavProfile from "./NavProfile";
import { logout } from "../../helpers/AuthHelper";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function Nav() {
	const [isOpen, setIsOpen] = useState(false);
	const { loggedUser, removeLoggedUser } = useContext(AuthContext);
	let history = useHistory();

	const navButtonHandler = () => {
		setIsOpen(!isOpen);
	};

	const logoutHandler = () => {
		logout();
		removeLoggedUser();
		history.push("/home");
	};

	return (
		<div>
			<nav className='bg-gray-800'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<div className='flex items-center'>
							{/* Logo */}

							<div className='flex-shrink-0'>
								<img
									className='h-8 w-8'
									src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
									alt='Workflow'
								/>
							</div>
							{/* Primary items */}
							<NavPrimary>
								<NavPrimaryItem text='Home' link='/' />
								{loggedUser.user && (
									<>
										<NavPrimaryItem text='Profile' link='/profile' />
									</>
								)}
							</NavPrimary>
						</div>
						<div className='flex'>
							{/*Add sign in, sign up and logout to right*/}
							{!loggedUser.user && (
								<>
									<NavPrimaryItem
										text='Sign in'
										link='/signin'
										addClasses='hidden md:block'
									/>
									<NavPrimaryItem
										text='Sign up'
										link='/signup'
										addClasses='text-indigo-300 hover:border-indigo-300 hidden md:block'
									/>
								</>
							)}
							{/* Profile button */}
							{loggedUser.user && <NavProfile></NavProfile>}
							{/* Hamburger button */}
							<NavButton
								isOpen={isOpen}
								onButtonClick={navButtonHandler}
							></NavButton>
						</div>
					</div>
				</div>

				<NavColapsed isOpen={isOpen}>
					<NavColapsedItem text='Home' link='/' />
					{!loggedUser.user && (
						<>
							<NavColapsedItem
								text='Sign in'
								link='/signin'
								addClasses='font-bold'
							/>
							<NavColapsedItem
								text='Sign up'
								link='/signup'
								addClasses='font-bold text-indigo-400 hover:text-indigo-300'
							/>
						</>
					)}
					{loggedUser.user && (
						<>
							<NavColapsedItem text='Source' link='/profile' />
							<NavColapsedItem text='Template' link='/profile' />
							<NavColapsedItem text='Report' link='/profile' />
						</>
					)}
				</NavColapsed>
			</nav>
		</div>
	);
}

export default Nav;
