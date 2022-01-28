import { Field } from "formik";
import { useEffect } from "react";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../UI/Form/FormSelect";

const TableColumnSelect = ({
	selectedItem,
	sourceId,
	index,
	onItemUpdate,
	handleChange,
}) => {
	const [
		{ data: columnData, loading: columnLoading, error: columnError },
		refetch,
	] = useAxios(`/source/${sourceId}/columns`, {
		useCache: false,
		manual: true,
	});

	//Parse sources
	const parseColumns = (columns) => {
		let array = [];
		if (columns)
			columns.forEach((column) =>
				array.push({ value: column.id, label: column.columnName })
			);
		array.push({ value: null, label: "None" });
		return array;
	};
	useEffect(() => {
		console.log(selectedItem.tableColumns[index]);
		refetch();
	}, [selectedItem.tableColumns[index].source.id]);

	return (
		<Field
			name={`columns.${index}.sourceColumn.id`}
			options={parseColumns(columnData)}
			component={FormSelect}
			placeholder={columnError ? "No columns found" : "Select column"}
			onSelect={(e) => {
				if (selectedItem.tableColumns.length > 0) {
					selectedItem.tableColumns[index].sourceColumn.id = e.value;
					onItemUpdate(selectedItem);
				} else {
					alert.error("Error updating this column.");
					return;
				}
			}}
			isMulti={false}
			isLoading={columnLoading}
		/>
	);
};

export default TableColumnSelect;
