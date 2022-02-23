import {Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {useAxios} from "../../../helpers/AxiosHelper";
import SourceColumnService, {getColumnsForSource} from "../../../services/SourceColumnService";
import Button from "../../../ui/Button";
import SidebarDisclosure from "../../../ui/Sidebar/SidebarDisclosure";
import FormInput from "../../../ui/Form/FormInput";
import FormSelect from "../../../ui/Form/FormSelect";
import TableColumnSelect from "./TableColumnSelect";

const SimpleTableSettings = ({ selectedItem, onItemUpdate }) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [columnsData, setColumnsData] = useState([]);
	const [columnsLoading, setColumnsLoading] = useState(false);
	const [columnsError, setColumnsError] = useState(false);

	//Load columns if source is defined on load
	useEffect(() => {
		selectedItem.source?.id && getColumnsHandler(selectedItem.source.id);
	}, [selectedItem]);

	//Parse sources
	const parseSources = (sources) => {
		let array = [];
		if (sources)
			sources.forEach((source) =>
				array.push({ value: source.id, label: source.sourceName })
			);
		array.push({ value: null, label: "None" });
		return array;
	};

	//Parse columns
	const parseColumns = (columns) => {
		let array = [];
		if (columns)
			columns.forEach((column) =>
				array.push({ value: column.id, label: column.columnName })
			);
		array.push({ value: null, label: "None" });
		return array;
	};

	//Load new columns data on source change
	const getColumnsHandler = async (sourceId) => {
		setColumnsError(false);
		if (sourceId === null) {
			setColumnsData([]);
		} else {
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await SourceColumnService.getColumnsForSource(sourceId);
				setColumnsData(parseColumns(response.data));
				setColumnsLoading(false);
			} catch (e) {
				setColumnsLoading(false);
				setColumnsError(true);
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
		onItemUpdate(newSelected);
	};

	//Removes existing column from table
	const removeColumnHandler = (id) => {
		let newSelected = selectedItem;
		newSelected.tableColumns.splice(id, 1);
		onItemUpdate(newSelected);
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
								<label className='font-medium'>Source:</label>
								<Field
									name='sourceFormId'
									options={parseSources(sourcesData)}
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
										//Reset filters
										onItemUpdate(updatedSelected);

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
										key={index}
										name={`Column ${column.name ? column.name : index}`}
									>
										<div className='flex flex-col justify-center pl-4 pr-4'>
											{selectedItem.source && (
												<div key={index}>
													<label className='mt-2'>Column:</label>
													<TableColumnSelect
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
																onItemUpdate(newSelected);
															}
														}}
													/>
												</div>
											)}
											<Button
												className='mt-2'
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
