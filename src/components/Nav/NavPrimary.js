function NavPrimary(props) {
	return (
		<div className='hidden md:block'>
			<div className='ml-10 flex items-baseline space-x-4'>
				{props.children}
			</div>
		</div>
	);
}

export default NavPrimary;
