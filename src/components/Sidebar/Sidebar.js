const Sidebar = (props) => {
	return (
		<div class='h-screen min-h-screen hidden lg:block shadow-lg relative w-80'>
			<div class='bg-white h-full'>{props.children}</div>
		</div>
	);
};

export default Sidebar;
