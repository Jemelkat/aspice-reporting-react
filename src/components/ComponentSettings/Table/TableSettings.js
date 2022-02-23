import { Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useAxios } from "../../../helpers/AxiosHelper";
import { typeEnum } from "../../../helpers/ClassHelper";
import FormSelect from "../../UI/Form/FormSelect";
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
		if (sources) {
			sources.forEach((source) =>
				array.push({ value: source.id, label: source.sourceName })
			);
			array.push({ value: null, label: "None" });
		}
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

	let initialVals = {
		sourceFormId: selectedItem.source ? selectedItem.source.id : null,
	};
	if (simple) {
		initialVals = { ...initialVals, columns: selectedItem.tableColumns };
	} else {
		initialVals = {
			...initialVals,
			fontSize: selectedItem.fontSize,
			processColumn: selectedItem.processColumn?.id,
			processWidth: selectedItem.processWidth,
			levelColumn: selectedItem.levelColumn?.id,
			levelLimit: selectedItem.levelLimit,
			criterionColumn: selectedItem.criterionColumn?.id,
			criterionWidth: selectedItem.criterionWidth,
			scoreColumn: selectedItem.scoreColumn?.id,
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
										sourcesLoading
											? "Loading..."
											: sourcesError
											? "Error getting sources"
											: sourcesData && sourcesData.length > 0
											? "Select source"
											: "No sources found"
									}
									onSelect={(e) => {
										let updatedSelected = selectedItem;
										if (e.value === null) {
											if (e.value !== updatedSelected.source) {
												//Reset all item columns
												updatedSelected.source = null;
												//Change selected coluns to NONE on source change
												if (selectedItem.type === typeEnum.CAPABILITY_TABLE) {
													updatedSelected.processColumn.sourceColumn = null;
													updatedSelected.levelColumn = null;
													updatedSelected.criterionColumn = null;
													updatedSelected.scoreColumn = null;
												} else if (
													selectedItem.type === typeEnum.SIMPLE_TABLE &&
													updatedSelected.tableColumns &&
													updatedSelected.tableColumns.length > 0
												) {
													updatedSelected.tableColumns.map((column) => {
														column.sourceColumn.id = null;
														column.sourceColumn.columnName = null;
													});
												}
												onItemUpdate(updatedSelected);
												setSelectData([]);
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
												//Change selected coluns to NONE on source change
												if (selectedItem.type === typeEnum.CAPABILITY_TABLE) {
													updatedSelected.processColumn = null;
													updatedSelected.levelColumn = null;
													updatedSelected.criterionColumn = null;
													updatedSelected.scoreColumn = null;
												} else if (
													selectedItem.type === typeEnum.SIMPLE_TABLE &&
													updatedSelected.tableColumns &&
													updatedSelected.tableColumns.length > 0
												) {
													updatedSelected.tableColumns.map((column) => {
														column.sourceColumn = null;
													});
												}
												onItemUpdate(updatedSelected);
												setSelectData([]);
											}
										}
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
									columnsData={parseColumns(selectData)}
									columnsLoading={columnsLoading}
									columnsError={columnsError}
									handleChange={handleChange}
								></CapabilityTableSettigs>
							)}
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default TableSettings;
