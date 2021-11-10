const Sidebar = (props) => {
	return (
		<div className='h-screen min-h-screen hidden lg:block shadow-lg w-48'>
			<div className='bg-white h-full'>{props.children}</div>
		</div>
	);
};

export default Sidebar;
