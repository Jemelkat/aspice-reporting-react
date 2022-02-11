import { Transition } from "@headlessui/react";

const Sidebar = ({ className, show = true, position = "left", children }) => {
	return (
		<Transition
			appear={true}
			show={show}
			enter='transform transition ease-in-out duration-500 sm:duration-500'
			enterFrom={position === "left" ? "-translate-x-full" : "translate-x-full"}
			enterTo='translate-x-0'
			leave='transform transition ease-in-out duration-250 sm:duration-500'
			leaveFrom='translate-x-0'
			leaveTo={position === "left" ? "-translate-x-full" : "translate-x-full"}
		>
			<div
				className={`${className} h-screen min-h-screen shadow-lg w-64 block bg-white`}
			>
				<div className='relative'>{children}</div>
			</div>
		</Transition>
	);
};

export default Sidebar;
