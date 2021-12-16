import { ChevronDoubleUpIcon } from "@heroicons/react/solid";
import { useSortBy, useTable } from "react-table";

function Table({ columns, data, isLoading, initSortColumn }) {
	// Use the state and functions returned from useTable to build your UI
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable(
			{
				columns,
				data,
				initialState: {
					sortBy: [
						{
							id: initSortColumn,
							desc: false,
						},
					],
				},
			},
			useSortBy
		);

	// Render the UI for your table
	return (
		<table {...getTableProps()} className='flex-grow rounded-lg shadow-xl'>
			<thead className='bg-gray-800'>
				{headerGroups.map((headerGroup) => (
					<tr key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th
								key={column}
								{...column.getHeaderProps(column.getSortByToggleProps())}
								scope='col'
								className='px-2 py-4 text-xs font-medium tracking-wider text-left text-white uppercase '
							>
								<div className='flex flex-row'>
									{column.render("Header")}

									{column.isSorted ? (
										<ChevronDoubleUpIcon
											className={`${
												column.isSortedDesc ? "transform rotate-180" : ""
											} w-4 h-4 text-white`}
										/>
									) : (
										""
									)}
								</div>
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
								className='transition duration-1000 ease-in-out transform'
							>
								{headerGroups[0].headers.map((cell) => (
									<td className='px-2 py-2'>
										<span className='flex py-5 bg-gray-300 rounded-lg animate-pulse'></span>
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
