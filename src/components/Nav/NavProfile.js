import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import NavProfileItem from "./NavProfileItem";
import Avatar, { genConfig } from "react-nice-avatar";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";

function NavProfile() {
	let history = useHistory();
	const { loggedUser, removeLoggedUser } = useContext(AuthContext);
	const config = {
		sex: "man",
		faceColor: "#AC6651",
		earSize: "small",
		eyeStyle: "circle",
		noseStyle: "short",
		mouthStyle: "peace",
		shirtStyle: "hoody",
		glassesStyle: "none",
		hairColor: "#000",
		hairStyle: "thick",
		hatStyle: "none",
		hatColor: "#fff",
		eyeBrowStyle: "up",
		shirtColor: "#77311D",
		bgColor: "linear-gradient(45deg, #178bff 0%, #ff6868 100%)",
	};
	const myConfig = genConfig(config);

	const logoutHandler = () => {
		AuthService.logout();
		history.push("/");
		removeLoggedUser();
	};

	return (
		<Menu as='div' className='relative ml-3'>
			<Menu.Button className='flex mr-2 text-sm bg-gray-800 rounded-full md:mr-0'>
				<span className='sr-only'>Open user menu</span>
				<Avatar className='w-10 h-10' {...myConfig} />
			</Menu.Button>

			<Transition
				as={Fragment}
				enter='transition ease-out duration-200'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-200'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-xl'>
					{loggedUser.isAdmin && (
						<NavProfileItem link='/admin/users' text='Admin'></NavProfileItem>
					)}
					<NavProfileItem
						link='#'
						text='Sign out'
						onClick={logoutHandler}
						addClasses='text-red-500 font-semibold'
					></NavProfileItem>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}

export default NavProfile;
