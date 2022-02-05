const Loader = ({ fullscreen, dark, size = "normal", ...props }) => {
	return (
		<div className='justify-center text-center'>
			<div
				className={`${fullscreen ? "min-h-screen min-w-full" : "h-full"} ${
					dark ? "bg-gray-800" : "bg-white"
				} flex justify-center items-center space-x-3`}
			>
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
			<p className={`${size === "small" ? "text-sm" : "text-base"}`}>
				{props.children}
			</p>
		</div>
	);
};

export default Loader;
