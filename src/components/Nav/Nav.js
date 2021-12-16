import { useContext, useState } from "react";
import NavPrimary from "./NavPrimary";
import NavButton from "./NavButton";
import NavColapsed from "./NavColapsed";
import NavColapsedItem from "./NavColapsedItem";
import NavPrimaryItem from "./NavPrimaryItem";
import NavProfile from "./NavProfile";
import { AuthContext } from "../../context/AuthContext";

function Nav() {
	const [isOpen, setIsOpen] = useState(false);
	const { loggedUser } = useContext(AuthContext);

	const navButtonHandler = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className='bg-gray-800'>
			<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						{/* Logo */}

						<div className='flex-shrink-0'>
							<svg
								class='w-9 h-9'
								fill='white'
								viewBox='0 0 20 20'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fill-rule='evenodd'
									d='M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z'
									clip-rule='evenodd'
								></path>
							</svg>
						</div>
						{/* Primary items */}
						<NavPrimary>
							<NavPrimaryItem text='Home' link='/' />
							{loggedUser.user && (
								<>
									<NavPrimaryItem text='Dashboard' link='/dashboard' />
									<NavPrimaryItem text='Source' link='/source' />
									<NavPrimaryItem text='Template' link='/template' />
									<NavPrimaryItem text='Report' link='/report' />
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
				<NavColapsedItem text='Home' link='/' onClick={navButtonHandler} />
				{!loggedUser.user && (
					<>
						<NavColapsedItem
							text='Sign in'
							link='/signin'
							addClasses='font-bold'
							onClick={navButtonHandler}
						/>
						<NavColapsedItem
							text='Sign up'
							link='/signup'
							addClasses='font-bold text-indigo-400 hover:text-indigo-300'
							onClick={navButtonHandler}
						/>
					</>
				)}
				{loggedUser.user && (
					<>
						<NavColapsedItem
							text='Dashboard'
							link='/dashboard'
							onClick={navButtonHandler}
						/>
						<NavColapsedItem
							text='Source'
							link='/source'
							onClick={navButtonHandler}
						/>
						<NavColapsedItem
							text='Template'
							link='/template'
							onClick={navButtonHandler}
						/>
						<NavColapsedItem
							text='Report'
							link='/report'
							onClick={navButtonHandler}
						/>
					</>
				)}
			</NavColapsed>
		</nav>
	);
}

export default Nav;
