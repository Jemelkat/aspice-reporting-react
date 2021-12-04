const Button = (props) => {
	return (
		<button
			className={`${props.addClasses} inline-block bg-gray-800 text-white py-1 px-3 rounded-md hover:bg-gray-700`}
			type={props.type ? props.type : "button"}
			onClick={props.onClick}
		>
			{props.text}
		</button>
	);
};

export default Button;
