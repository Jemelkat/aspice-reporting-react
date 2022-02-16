import { Field } from "formik";
import { useEffect } from "react";
import FormSelect from "../../UI/Form/FormSelect";

const TableColumnSelect = ({
	name,
	selectedItem,
	index,
	onItemUpdate,
	columnsData,
	columnsLoading,
	columnsError,
}) => {
	return (
		<Field
			name={`${name}.${index}.sourceColumn.id`}
			options={columnsData}
			component={FormSelect}
			placeholder={columnsError ? "Error" : "Select column"}
			onSelect={(e) => {
				if (selectedItem.tableColumns.length > 0) {
					selectedItem.tableColumns[index].sourceColumn.id = e.value;
					selectedItem.tableColumns[index].sourceColumn.columnName = e.label;
					onItemUpdate(selectedItem);
				} else {
					return;
				}
			}}
			isMulti={false}
			isLoading={columnsLoading}
		/>
	);
};

export default TableColumnSelect;
