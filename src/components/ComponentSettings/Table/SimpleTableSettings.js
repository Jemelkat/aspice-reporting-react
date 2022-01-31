import { Field } from "formik";
import { useAlert } from "react-alert";
import Button from "../../UI/Button";
import CanvasPanelDisclosure from "../../UI/Canvas/CanvasPanelDisclosure";
import FormInput from "../../UI/Form/FormInput";
import FormSelect from "../../UI/Form/FormSelect";
import TableColumnSelect from "./TableColumnSelect";

const SimpleTableSettings = ({
	onRemoveColumn,
	selectedItem,
	sources,
	sourcesLoading,
	sourcesError,
	onItemUpdate,
	setGlobalSource,
	handleChange,
	setFieldValue,
}) => {
	const alert = useAlert();
	return (
		<>
			<div className='flex flex-col justify-center pl-4 pr-4'>
				<label>Source:</label>
				<Field
					name={`columns.0.source.id`}
					options={sources}
					component={FormSelect}
					placeholder={sourcesError ? "No sources found" : "Select source"}
					onSelect={(e) => {
						setGlobalSource(e.value);
						if (selectedItem.tableColumns) {
							let updatedItems = selectedItem.tableColumns.map((column) => {
								column.source.id = e.value;
								column.sourceColumn.id = null;
								return column;
							});
							selectedItem.tableColumns = updatedItems;
							onItemUpdate(selectedItem);
						}
					}}
					isMulti={false}
					isLoading={sourcesLoading}
				/>
			</div>
			<div className='mt-4'>
				{selectedItem.tableColumns && selectedItem.tableColumns.length > 0 ? (
					selectedItem.tableColumns.map((column, index) => {
						return (
							<CanvasPanelDisclosure
								key={index}
								name={`Column ${column.name ? column.name : index}`}
							>
								<div className='flex flex-col justify-center pl-4 pr-4'>
									{!sourcesLoading && selectedItem.tableColumns[index].source && (
										<div key={index}>
											<label className='mt-2'>Column:</label>
											<TableColumnSelect
												selectedItem={selectedItem}
												sourceId={selectedItem.tableColumns[index].source.id}
												index={index}
												onItemUpdate={onItemUpdate}
												setFieldValue={setFieldValue}
											></TableColumnSelect>
											<FormInput
												label='Column width'
												name={`columns.${index}.width`}
												type='number'
												onChange={(e) => {
													handleChange(e);
													if (e.target.value > 0) {
														let newSelected = selectedItem;
														newSelected.tableColumns[index].width =
															e.target.value;
														onItemUpdate(newSelected);
													}
												}}
											/>
										</div>
									)}
									<Button
										className='mt-2'
										onClick={() => {
											onRemoveColumn(index);
										}}
									>
										Remove column
									</Button>
								</div>
							</CanvasPanelDisclosure>
						);
					})
				) : (
					<div className='pt-2 text-center'>This table has no columns yet.</div>
				)}
			</div>
		</>
	);
};

export default SimpleTableSettings;
