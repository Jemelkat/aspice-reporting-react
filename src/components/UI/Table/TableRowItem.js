const TableRowItem = (props) => {
	return (
		<td
			className={`${props.addClasses} px-5 py-5 border-b border-gray-200 bg-white text-sm`}
		>
			{props.data && (
				<p className='text-gray-900 whitespace-no-wrap'>{props.data}</p>
			)}
			{props.children}
		</td>
	);
};

export default TableRowItem;
