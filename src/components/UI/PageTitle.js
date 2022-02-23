const PageTitle = (props) => {
	return (
		<div className='divide-y drop-shadow-sm divide-gray-800 pb-4'>
			<h1 className='text-3xl font-bold text-gray-800'>{props.text}</h1>
			<div></div>
		</div>
	);
};

export default PageTitle;
