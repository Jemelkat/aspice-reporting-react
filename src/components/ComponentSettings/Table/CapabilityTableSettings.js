import { Field } from "formik";
import FormInput from "../../UI/Form/FormInput";
import FormSelect from "../../UI/Form/FormSelect";

const CapabilityTableSettigs = ({
	selectedItem,
	onItemUpdate,
	columnsData,
	columnsLoading,
	columnsError,
	handleChange,
}) => {
	return (
		<div className='flex flex-col justify-center pl-4 pr-4'>
			<FormInput
				label='Text size:'
				name={`fontSize`}
				type='number'
				onChange={(e) => {
					handleChange(e);
					if (e.target.value > 0) {
						let newSelected = selectedItem;
						newSelected.fontSize = e.target.value;
						onItemUpdate(newSelected);
					}
				}}
			/>
			<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
			<label className='font-medium'>Process name:</label>
			<Field
				name='processColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={
					columnsLoading
						? "Loading..."
						: columnsError
						? "Error!"
						: columnsData.length > 0
						? "Select column"
						: "No columns"
				}
				onSelect={(e) => {
					let updatedSelected = selectedItem;
					updatedSelected.processColumn.sourceColumn.id = e.value;
					updatedSelected.processColumn.sourceColumn.columnName = e.label;
					onItemUpdate(updatedSelected);
				}}
				isMulti={false}
				isLoading={columnsLoading}
			/>
			<FormInput
				label='Process column width'
				name={`processWidth`}
				type='number'
				onChange={(e) => {
					handleChange(e);
					if (e.target.value > 0) {
						let newSelected = selectedItem;
						newSelected.processWidth = e.target.value;
						onItemUpdate(newSelected);
					}
				}}
			/>
			<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
			<label className='font-medium'>Capability level:</label>
			<Field
				name='levelColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={
					columnsLoading
						? "Loading..."
						: columnsError
						? "Error!"
						: columnsData.length > 0
						? "Select column"
						: "No columns"
				}
				onSelect={(e) => {
					let updatedSelected = selectedItem;
					updatedSelected.levelColumn.id = e.value;
					updatedSelected.levelColumn.columnName = e.label;
					onItemUpdate(updatedSelected);
				}}
				isMulti={false}
				isLoading={columnsLoading}
			/>
			<FormInput
				label='Max level:'
				name={`levelLimit`}
				type='number'
				onChange={(e) => {
					handleChange(e);
					if (e.target.value >= 0 && e.target.value <= 5) {
						debugger;
						let newSelected = selectedItem;
						newSelected.levelLimit = e.target.value;
						onItemUpdate(newSelected);
					}
				}}
			/>
			<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
			<label className='font-medium'>Performance criterion:</label>
			<Field
				name='criterionColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={
					columnsLoading
						? "Loading..."
						: columnsError
						? "Error!"
						: columnsData.length > 0
						? "Select column"
						: "No columns"
				}
				onSelect={(e) => {
					let updatedSelected = selectedItem;
					updatedSelected.criterionColumn.id = e.value;
					updatedSelected.criterionColumn.columnName = e.label;
					onItemUpdate(updatedSelected);
				}}
				isMulti={false}
				isLoading={columnsLoading}
			/>
			<FormInput
				label='Criterion columns width:'
				name={`criterionWidth`}
				type='number'
				onChange={(e) => {
					handleChange(e);
					if (e.target.value > 0) {
						let newSelected = selectedItem;
						newSelected.criterionWidth = e.target.value;
						onItemUpdate(newSelected);
					}
				}}
			/>
			<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
			<label className='font-medium'>Score/Value:</label>
			<Field
				name='scoreColumn'
				options={columnsData}
				component={FormSelect}
				placeholder={
					columnsLoading
						? "Loading..."
						: columnsError
						? "Error!"
						: columnsData.length > 0
						? "Select column"
						: "No columns"
				}
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
