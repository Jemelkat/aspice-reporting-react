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
				let updatedSelected = selectedItem;
				if (updatedSelected.tableColumns.length > 0) {
					if (e.value !== null) {
						updatedSelected.tableColumns[index].sourceColumn = {
							id: e.value,
							columnName: e.label,
						};
					} else {
						updatedSelected.tableColumns[index].sourceColumn = null;
					}
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
