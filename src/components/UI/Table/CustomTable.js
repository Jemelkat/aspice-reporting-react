import TableHeaderItem from "./TableHeaderItem";
import TableRowItem from "./TableRowItem";

const CustomTable = (props) => {
	return (
		<div className='flex-grow bg-gray-200'>
			<div className='px-4 sm:px-8 min-w-min flex-grow'>
				<div className='py-8'>
					<div className='flex flex-row mb-1 sm:mb-0 justify-between w-full'>
						<h2 className='text-2xl leading-tight'>{props.tableName}</h2>
					</div>
					<div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
						{/*TABLE*/}
						<div className='flex flex-col shadow rounded-lg overflow-hidden'>
							<table className='leading-normal  overflow-x-auto'>
								{props.children}
							</table>
							<div className='px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between'>
								<div className='flex items-center'>
									<button
										type='button'
										className='w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100 rounded-lg'
									>
										Load more
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomTable;
