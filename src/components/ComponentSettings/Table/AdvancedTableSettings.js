import { Field, FieldArray } from "formik";
import { useEffect } from "react";
import { useAlert } from "react-alert";
import { getColumns } from "../../../services/SourceService";
import Button from "../../UI/Button";
import CanvasPanelDisclosure from "../../UI/Canvas/CanvasPanelDisclosure";
import FormInput from "../../UI/Form/FormInput";
import FormSelect from "../../UI/Form/FormSelect";
import TableColumnSelect from "./TableColumnSelect";

const AdvancedTableSettings = ({
	onRemoveColumn,
	selectedItem,
	sources,
	sourcesLoading,
	sourcesError,
	onItemUpdate,
}) => {
	return (
		<>
			{selectedItem.tableColumns && selectedItem.tableColumns.length > 0 ? (
				selectedItem.tableColumns.map((column, index) => {
					return (
						<CanvasPanelDisclosure
							key={index}
							name={`Column ${column.name ? column.name : index}`}
						>
							<div className='flex flex-col justify-center pl-4 pr-4'>
								<label>Source:</label>
								<Field
									name={`columns.${index}.source.id`}
									options={sources}
									component={FormSelect}
									placeholder={
										sourcesError ? "No sources found" : "Select source"
									}
									onSelect={(e) => {
										if (selectedItem.tableColumns.length > 0) {
											selectedItem.tableColumns[index].source.id = e.value;
											selectedItem.tableColumns[index].sourceColumn.id = null;
										} else {
											alert.error("Cannot update this item");
											return;
										}

										onItemUpdate(selectedItem);
									}}
									isMulti={false}
									isLoading={sourcesLoading}
								/>
								{!sourcesLoading && selectedItem.tableColumns[index].source.id && (
									<div>
										<label className='mt-2'>Column:</label>
										<TableColumnSelect
											selectedItem={selectedItem}
											sourceId={selectedItem.tableColumns[index].source.id}
											index={index}
											onItemUpdate={onItemUpdate}
										></TableColumnSelect>
										<FormInput
											label='Column width'
											name={`column.width.${index}`}
											type='number'
											onChange={(e) => {
												//handleChange(e);
												if (e.target.value > 0) {
													const newSelected = {
														...selectedItem,
														textStyle: {
															...selectedItem.textStyle,
															fontSize: e.target.value,
														},
													};
													onItemUpdate(selectedItem);
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
		</>
	);
};

export default AdvancedTableSettings;
