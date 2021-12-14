const Loader = ({ fullscreen = true, dark = true }) => {
	return (
		<div
			className={`${
				fullscreen === true ? "min-h-screen min-w-full" : "h-full"
			} ${
				dark === true ? "bg-gray-800" : "bg-white"
			} flex flex-1 justify-center items-center space-x-3`}
		>
			<div
				className={`${
					dark === true ? "bg-white" : "bg-gray-800"
				} w-8 h-8  rounded-full animate-bounce`}
			></div>
			<div
				className={`${
					dark === true ? "bg-white" : "bg-gray-800"
				} w-8 h-8 rounded-full animate-bounce animation-delay-500`}
			></div>
			<div
				className={`${
					dark === true ? "bg-white" : "bg-gray-800"
				} w-8 h-8  rounded-full animate-bounce`}
			></div>
		</div>
	);
};

export default Loader;
