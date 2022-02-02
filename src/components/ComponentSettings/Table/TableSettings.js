import { Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import * as Yup from "yup";
import { useAxios } from "../../../helpers/AxiosHelper";
import { CapabilityTable, typeEnum } from "../../../helpers/ClassHelper";
import Button from "../../UI/Button";
import FormSelect from "../../UI/Form/FormSelect";
import AdvancedTableSettings from "./AdvancedTableSettings";
import CapabilityTableSettigs from "./CapabilityTableSettings";
import SimpleTableSettings from "./SimpleTableSettings";

const TableSettings = ({
	selectedItem,
	onItemUpdate,
	simple,
	sourceId = null,
}) => {
	const [selectData, setSelectData] = useState([]);
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [
		{ data: columnsData, loading: columnsLoading, error: columnsError },
		fetchColumns,
	] = useAxios(`/source/${sourceId}/columns`, {
		useCache: false,
		manual: true,
	});

	//Fetch new data on source change or set to empty on null source
	useEffect(() => {
		if (sourceId !== null) {
			fetchColumns().then((reponse) => setSelectData(reponse.data));
		} else {
			setSelectData([]);
		}
	}, [sourceId]);

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
		//array.push({ value: "", label: "None" });
		return array;
	};

	let initialVals = {
		sourceFormId: selectedItem.source ? selectedItem.source.id : null,
	};
	if (simple) {
		initialVals = { ...initialVals, columns: selectedItem.tableColumns };
	} else {
		initialVals = {
			...initialVals,
			processColumn: selectedItem.processColumn.sourceColumn.id,
			levelColumn: selectedItem.levelColumn.id,
			engineeringColumn: selectedItem.engineeringColumn.id,
			scoreColumn: selectedItem.scoreColumn.id,
		};
	}

	return (
		<div>
			<Formik
				enableReinitialize={true}
				initialValues={initialVals}
				validationSchema={Yup.object().shape({})}
			>
				{({ setFieldValue, handleChange }) => (
					<Form className='flex flex-col'>
						<div className='flex flex-col justify-center'>
							<div className='flex flex-col justify-center pl-4 pr-4'>
								<label className='font-medium'>Source:</label>
								<Field
									name='sourceFormId'
									options={parseSources(sourcesData)}
									component={FormSelect}
									placeholder={
										sourcesError ? "No sources found" : "Select source"
									}
									onSelect={(e) => {
										let updatedSelected = selectedItem;
										updatedSelected.source.id = e.value;
										//Change selected coluns to NONE on source change
										if (selectedItem.type === typeEnum.CAPABILITY_TABLE) {
											updatedSelected.processColumn.sourceColumn.id = null;
											updatedSelected.processColumn.sourceColumn.columnName =
												null;
											updatedSelected.levelColumn.id = null;
											updatedSelected.engineeringColumn.id = null;
											updatedSelected.scoreColumn.id = null;
											updatedSelected.levelColumn.columnName = null;
											updatedSelected.engineeringColumn.columnName = null;
											updatedSelected.scoreColumn.columnName = null;
										} else if (
											selectedItem.type === typeEnum.SIMPLE_TABLE &&
											updatedSelected.tableColumns &&
											updatedSelected.tableColumns.length > 0
										) {
											updatedSelected.tableColumns.map((column) => {
												column.sourceColumn.id = null;
												column.sourceColumn.sourceName = null;
											});
										}
										onItemUpdate(updatedSelected);
									}}
									isMulti={false}
									isLoading={sourcesLoading}
								/>
							</div>
							{simple ? (
								<FieldArray
									name='columns'
									render={() => {
										return (
											<SimpleTableSettings
												selectedItem={selectedItem}
												onItemUpdate={onItemUpdate}
												handleChange={handleChange}
												columnsData={parseColumns(selectData)}
												columnsLoading={columnsLoading}
												columnsError={columnsError}
											></SimpleTableSettings>
										);
									}}
								></FieldArray>
							) : (
								<CapabilityTableSettigs
									selectedItem={selectedItem}
									onItemUpdate={onItemUpdate}
									handleChange={handleChange}
									setFieldValue={setFieldValue}
									columnsData={parseColumns(selectData)}
									columnsLoading={columnsLoading}
									columnsError={columnsError}
								></CapabilityTableSettigs>
							)}
						</div>
					</Form>
				)}
			</Formik>
			<Formik
				enableReinitialize={true}
				initialValues={{
					sid: selectedItem.source ? selectedItem.source.id : null,
					columns: selectedItem.tableColumns,
					processColumn: selectedItem.processColumn
						? selectedItem.processColumn.sourceColumn.id
						: null,
				}}
				validationSchema={Yup.object().shape({})}
			>
				<Form></Form>
			</Formik>
		</div>
	);
};

export default TableSettings;