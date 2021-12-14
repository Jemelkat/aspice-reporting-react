const Button = (props) => {
	return (
		<button
			className={`${props.className} inline-block ${
				props.dark === true
					? "bg-gray-800 text-white hover:bg-gray-700"
					: "text-gray-800 border-2 hover:bg-gray-200"
			}  py-1 px-3 rounded-md `}
			type={props.type ? props.type : "button"}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
};

export default Button;
