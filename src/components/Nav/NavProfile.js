import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import NavProfileItem from "./NavProfileItem";
import Avatar, { genConfig } from "react-nice-avatar";
import { useHistory } from "react-router";
import { logout } from "../../helpers/AuthHelper";
import { AuthContext } from "../../context/AuthContext";

function NavProfile() {
	let history = useHistory();
	const { removeLoggedUser } = useContext(AuthContext);
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
		logout();
		history.push();
		removeLoggedUser();
	};

	return (
		<Menu as='div' className='ml-3 relative'>
			<Menu.Button className='bg-gray-800 flex text-sm rounded-full mr-2 md:mr-0'>
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
				<Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-xl py-1 bg-white'>
					<NavProfileItem link='/profile' text='Profile'></NavProfileItem>
					<NavProfileItem link='/admin/users' text='Admin'></NavProfileItem>
					<NavProfileItem
						link='#'
						text='Sign out'
						onClick={logoutHandler}
						addClasses='text-red-700 font-semibold'
					></NavProfileItem>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}

export default NavProfile;
