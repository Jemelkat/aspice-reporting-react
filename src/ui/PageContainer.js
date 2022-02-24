function PageContainer(props) {
	return (
		<main className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
			{props.children}
		</main>
	);
}

export default PageContainer;
