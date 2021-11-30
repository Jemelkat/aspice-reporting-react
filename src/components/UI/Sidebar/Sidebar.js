const Sidebar = (props) => {
	return (
		<div className='h-screen min-h-screen block shadow-lg w-64'>
			<div className='bg-white h-full'>{props.children}</div>
		</div>
	);
};

export default Sidebar;
