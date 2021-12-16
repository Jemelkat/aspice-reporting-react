function NavPrimary(props) {
	return (
		<div className='hidden md:block'>
			<div className='flex items-baseline ml-5 space-x-4'>{props.children}</div>
		</div>
	);
}

export default NavPrimary;
