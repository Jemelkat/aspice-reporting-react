import { Field } from "formik";
import { useEffect, useRef } from "react";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../UI/Form/FormSelect";

const TableColumnSelect = ({
	selectedItem,
	sourceId,
	index,
	onItemUpdate,
	setFieldValue,
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

	//Set selected columns to null when source changes
	const firstUpdate = useRef(true);
	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			refetch();
			return;
		}
		refetch();
		setFieldValue(`columns.${index}.sourceColumn.id`, null);
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
					selectedItem.tableColumns[index].sourceColumn.columnName = e.label;
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
