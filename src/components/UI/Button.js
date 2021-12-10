const Button = (props) => {
	return (
		<button
			className={`${props.className} inline-block bg-gray-800 text-white py-1 px-3 rounded-md hover:bg-gray-700`}
			type={props.type ? props.type : "button"}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
};

export default Button;
