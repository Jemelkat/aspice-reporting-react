import { useTable } from "react-table";

function Table({ columns, data, isLoading }) {
	// Use the state and functions returned from useTable to build your UI
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({
			columns,
			data,
		});

	// Render the UI for your table
	return (
		<table {...getTableProps()} className='shadow-xl rounded-lg flex-grow'>
			<thead className='bg-gray-800'>
				{headerGroups.map((headerGroup) => (
					<tr key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th
								{...column.getHeaderProps()}
								scope='col'
								className=' text-white px-2 py-4 text-left text-xs font-medium uppercase tracking-wider'
							>
								{column.render("Header")}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody
				{...getTableBodyProps()}
				className='bg-white divide-y divide-gray-200'
			>
				{isLoading
					? [...Array(4)].map((e, i) => (
							<tr
								key={i}
								className='ease-in-out transform transition duration-1000'
							>
								{headerGroups[0].headers.map((cell) => (
									<td className='py-2 px-2'>
										<span className='rounded-lg flex  py-5 bg-gray-300 animate-pulse'></span>
									</td>
								))}
							</tr>
					  ))
					: rows.map((row, i) => {
							prepareRow(row);
							return (
								<tr key={row} {...row.getRowProps()}>
									{row.cells.map((cell) => {
										return (
											<td {...cell.getCellProps()} className='px-2 py-2'>
												{cell.render("Cell")}
											</td>
										);
									})}
								</tr>
							);
					  })}
			</tbody>
		</table>
	);
}

export default Table;
