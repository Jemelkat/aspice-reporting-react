import {Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {useAxios} from "../../../helpers/AxiosHelper";
import SourceColumnService from "../../../services/SourceColumnService";
import Button from "../../../ui/Button";
import SidebarDisclosure from "../../../ui/Sidebar/SidebarDisclosure";
import FormInput from "../../../ui/Form/FormInput";
import FormSelect from "../../../ui/Form/FormSelect";
import TableColumnSelect from "./TableColumnSelect";
import DataService from "../../../services/DataService";
import {useAlert} from "react-alert";

const SimpleTableSettings = ({ page = 0, selectedItem, onItemUpdate }) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [columnsData, setColumnsData] = useState([]);
	const [columnsLoading, setColumnsLoading] = useState(false);
	const [columnsError, setColumnsError] = useState(false);
	const alert = useAlert();
	//Load columns if source is defined on load
	useEffect(() => {
		selectedItem.source?.id && getColumnsHandler(selectedItem.source.id);
	}, [selectedItem]);

	//Load new columns data on source change
	const getColumnsHandler = async (sourceId) => {
		setColumnsError(false);
		if (sourceId === null) {
			setColumnsData([]);
		} else {
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await SourceColumnService.getColumnsForSource(
					sourceId
				);
				setColumnsData(DataService.parseColumnsSelectData(response.data));
				setColumnsLoading(false);
			} catch (e) {
				setColumnsLoading(false);
				setColumnsError(true);
				if (e.response?.data && e.response.data?.message) {
					alert.error(e.response.data.message);
				} else {
					alert.error("Error getting columns.");
				}
			}
		}
	};

	//Adds new column to table
	const addColumnHandler = () => {
		let columns = selectedItem.tableColumns ? selectedItem.tableColumns : [];
		columns.push({
			id:
				columns.length === 0
					? 0
					: Math.max.apply(
							null,
							columns.map((item) => item.id)
					  ) + 1,
			sourceColumn: null,
			width: 50,
		});
		let newSelected = selectedItem;
		selectedItem.tableColumns = [...columns];
		onItemUpdate(newSelected, page);
	};

	//Removes existing column from table
	const removeColumnHandler = (id) => {
		let newSelected = selectedItem;
		newSelected.tableColumns.splice(id, 1);
		onItemUpdate(newSelected, page);
	};

	return (
		<>
			<Formik
				enableReinitialize={true}
				initialValues={{
					sourceFormId: selectedItem.source ? selectedItem.source.id : null,
					columns: selectedItem.tableColumns,
				}}
			>
				{({ handleChange }) => (
					<Form className='flex flex-col'>
						<div className='flex flex-col justify-center mb-4'>
							<div className='flex flex-col justify-center pl-4 pr-4'>
								<label className='mt-2 font-medium'>Source</label>
								<Field
									name='sourceFormId'
									options={DataService.parseSourcesSelectData(sourcesData)}
									component={FormSelect}
									placeholder={
										sourcesLoading
											? "Loading..."
											: sourcesError
											? "Error!"
											: sourcesData && sourcesData.length > 1
											? "Select source"
											: "No sources"
									}
									onSelect={(e) => {
										let updatedSelected = selectedItem;
										setColumnsError(false);
										//Change selected coluns to NONE on source change
										updatedSelected.tableColumns.map((column) => {
											column.sourceColumn = null;
										});

										if (e.value === null) {
											if (e.value !== updatedSelected.source) {
												updatedSelected.source = null;
												setColumnsData([]);
											}
										} else {
											if (
												!updatedSelected.source?.id ||
												e.value !== updatedSelected.source.id
											) {
												updatedSelected.source = {
													id: e.value,
													sourceName: e.label,
												};
												//Load columns for new source
												getColumnsHandler(e.value);
											}
										}
										//Reset filters
										onItemUpdate(updatedSelected, page);
									}}
									isMulti={false}
									isLoading={sourcesLoading}
								/>
							</div>
						</div>
						{selectedItem.tableColumns &&
						selectedItem.tableColumns.length > 0 ? (
							selectedItem.tableColumns.map((column, index) => {
								return (
									<SidebarDisclosure
										dark
										key={index}
										name={`${
											column.sourceColumn
												? column.sourceColumn?.columnName
												: "Column " + index
										}`}
									>
										<div className='flex flex-col justify-center pl-4 pr-4'>
											{selectedItem.source && (
												<div className='pt-2' key={index}>
													<label>Column</label>
													<TableColumnSelect
														page={page}
														name={"columns"}
														selectedItem={selectedItem}
														index={index}
														onItemUpdate={onItemUpdate}
														columnsData={columnsData}
														columnsLoading={columnsLoading}
														columnsError={columnsError}
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
																onItemUpdate(newSelected, page);
															}
														}}
													/>
												</div>
											)}
											<Button
												className='mt-2 mb-2'
												onClick={() => {
													removeColumnHandler(index);
												}}
											>
												Remove column
											</Button>
										</div>
									</SidebarDisclosure>
								);
							})
						) : (
							<div className='pt-2 text-center'>
								This table has no columns yet.
							</div>
						)}
						<div className='flex flex-col justify-center pl-4 pr-4'>
							<Button
								className='mt-4'
								onClick={() => {
									addColumnHandler();
								}}
								dark
							>
								Add new column
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default SimpleTableSettings;
