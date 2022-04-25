import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

const Sidebar = ({ className, show = true, position = "left", children }) => {
	const [isScrolled, setIsScrolled] = useState(false);

	const listenToScroll = () => {
		if (window.scrollY >= 1) {
			setIsScrolled(true);
		} else {
			setIsScrolled(false);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", listenToScroll);
		return () => window.removeEventListener("scroll", listenToScroll);
	}, []);

	return (
		<Transition
			as={Fragment}
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
				className={`${className} ${
					isScrolled ? "h-screen" : "h-screen-header"
				} shadow-lg w-60 block bg-white pb-6`}
			>
				<div className='relative'>{children}</div>
			</div>
		</Transition>
	);
};

export default Sidebar;
