import { Field } from "formik";
import FormSelect from "../../../ui/Form/FormSelect";

const TableColumnSelect = ({
	name,
	page = 0,
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
					onItemUpdate(selectedItem, page);
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
