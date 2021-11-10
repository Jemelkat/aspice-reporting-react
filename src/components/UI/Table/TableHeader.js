const TableHeader = (props) => {
	return (
		<thead>
			<tr>{props.children}</tr>
		</thead>
	);
};

export default TableHeader;
