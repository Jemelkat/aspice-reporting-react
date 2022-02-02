import { Field } from "formik";
import FormSelect from "../../UI/Form/FormSelect";

const CapabilityTableSettigs = ({
	selectedItem,
	onItemUpdate,
	columnsData,
	columnsLoading,
	columnsError,
}) => {
	return (
		<div className='flex flex-col justify-center pl-4 pr-4'>
			<label className='font-medium'>Process name:</label>
			<Field
				name='processColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={columnsError ? "No columns found" : "Select column"}
				onSelect={(e) => {
					let updatedSelected = selectedItem;
					updatedSelected.processColumn.sourceColumn.id = e.value;
					updatedSelected.processColumn.sourceColumn.columnName = e.label;
					onItemUpdate(updatedSelected);
				}}
				isMulti={false}
				isLoading={columnsLoading}
			/>
			<label className='font-medium'>Capability level:</label>
			<Field
				name='levelColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={columnsError ? "No columns found" : "Select column"}
				onSelect={(e) => {
					let updatedSelected = selectedItem;
					updatedSelected.levelColumn.id = e.value;
					updatedSelected.levelColumn.columnName = e.label;
					onItemUpdate(updatedSelected);
				}}
				isMulti={false}
				isLoading={columnsLoading}
			/>
			<label className='font-medium'>Performance criterion:</label>
			<Field
				name='engineeringColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={columnsError ? "No columns found" : "Select column"}
				onSelect={(e) => {
					let updatedSelected = selectedItem;
					updatedSelected.engineeringColumn.id = e.value;
					updatedSelected.engineeringColumn.columnName = e.label;
					onItemUpdate(updatedSelected);
				}}
				isMulti={false}
				isLoading={columnsLoading}
			/>
			<label className='font-medium'>Score/Value:</label>
			<Field
				name='scoreColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={columnsError ? "No columns found" : "Select column"}
				onSelect={(e) => {
					let updatedSelected = selectedItem;
					updatedSelected.scoreColumn.id = e.value;
					updatedSelected.scoreColumn.columnName = e.label;
					onItemUpdate(updatedSelected);
				}}
				isMulti={false}
				isLoading={columnsLoading}
			/>
		</div>
	);
};

export default CapabilityTableSettigs;
