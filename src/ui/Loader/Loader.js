import { Transition } from "@headlessui/react";
import { useEffect } from "react";

const Loader = ({ fullscreen, dark, size = "normal", bg = "", ...props }) => {
	useEffect(() => {}, []);

	return (
		<div
			className={`flex flex-col justify-center text-center ${
				bg ? bg : dark ? "bg-gray-800" : "bg-white"
			} ${fullscreen ? "min-h-screen min-w-screen" : "h-full"} `}
		>
			<Transition
				appear={true}
				show={true}
				enter='transform transition ease-in-out'
				enterFrom='opacity-0 scale-50'
				enterTo='opacity-100 scale-100'
			>
				<div className={`flex justify-center items-center space-x-3`}>
					<div
						className={`${dark ? "bg-white" : "bg-gray-800"}  ${
							size === "small" ? "w-4 h-4 " : "w-8 h-8 "
						} rounded-full animate-bounce`}
					></div>
					<div
						className={`${dark ? "bg-white" : "bg-gray-800"} ${
							size === "small" ? "w-4 h-4 " : "w-8 h-8 "
						} rounded-full animate-bounce animation-delay-500`}
					></div>
					<div
						className={`${dark ? "bg-white" : "bg-gray-800"} ${
							size === "small" ? "w-4 h-4 " : "w-8 h-8 "
						}  rounded-full animate-bounce`}
					></div>
				</div>
				<span
					className={`${size === "small" ? "text-sm pt-1" : "text-base pt-2"} ${
						dark ? "text-white" : "text-gray-800"
					}`}
				>
					{props.children}
				</span>
			</Transition>
		</div>
	);
};

export default Loader;
