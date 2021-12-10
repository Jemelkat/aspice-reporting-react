const Sidebar = (props) => {
	return (
		<div
			className={`${props.className} h-screen min-h-screen shadow-lg w-64 hidden lg:block`}
		>
			<div>{props.children}</div>
		</div>
	);
};

export default Sidebar;
