import { Field, FieldArray, Form, Formik } from "formik";
import { useState } from "react";
import { useAlert } from "react-alert";
import * as Yup from "yup";
import { useAxios } from "../../../helpers/AxiosHelper";
import Button from "../../UI/Button";
import FormSelect from "../../UI/Form/FormSelect";
import AdvancedTableSettings from "./AdvancedTableSettings";
import SimpleTableSettings from "./SimpleTableSettings";

const TableSettings = ({
	selectedItem,
	onItemUpdate,
	simple,
	sourceId = null,
}) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/getAll", { useCache: false });
	const [globalSource, setGlobalSource] = useState(sourceId);
	const alert = useAlert();

	//Adds new column to table
	const addColumnHandler = (sourceId = null) => {
		let columns = selectedItem.tableColumns ? selectedItem.tableColumns : [];
		columns.push({
			id:
				columns.length === 0
					? 0
					: Math.max.apply(
							null,
							columns.map((item) => item.id)
					  ) + 1,
			source: { id: sourceId },
			sourceColumn: { id: null },
			width: 50,
		});
		const newSelected = {
			...selectedItem,
			tableColumns: [...columns],
		};
		onItemUpdate(newSelected);
	};

	//Removes existing column from table
	const removeColumnHandler = (id) => {
		selectedItem.tableColumns.splice(id, 1);
		const newSelected = {
			...selectedItem,
			tableColumns: [...selectedItem.tableColumns],
		};
		onItemUpdate(newSelected);
	};

	//Parse templates to value:"", label:""
	//TODO: MAKE REST RETURN value label
	const parseSources = (sources) => {
		let array = [];
		if (sources)
			sources.forEach((source) =>
				array.push({ value: source.id, label: source.sourceName })
			);
		array.push({ value: null, label: "None" });
		return array;
	};
	return (
		<div>
			<Formik
				enableReinitialize={true}
				initialValues={{
					columns: selectedItem.tableColumns,
				}}
				validationSchema={Yup.object().shape({})}
			>
				{({ setFieldValue, handleChange }) => (
					<Form className='flex flex-col'>
						<div className='flex flex-col justify-center'>
							<FieldArray
								name='columns'
								render={() => {
									if (simple) {
										return (
											<SimpleTableSettings
												onRemoveColumn={removeColumnHandler}
												selectedItem={selectedItem}
												selectedItem={selectedItem}
												sources={parseSources(sourcesData)}
												sourcesLoading={sourcesLoading}
												sourcesError={sourcesError}
												onItemUpdate={onItemUpdate}
												setGlobalSource={setGlobalSource}
												handleChange={handleChange}
												setFieldValue={setFieldValue}
											></SimpleTableSettings>
										);
									} else {
										return (
											<AdvancedTableSettings
												onRemoveColumn={removeColumnHandler}
												selectedItem={selectedItem}
												selectedItem={selectedItem}
												sources={parseSources(sourcesData)}
												sourcesLoading={sourcesLoading}
												sourcesError={sourcesError}
												onItemUpdate={onItemUpdate}
											></AdvancedTableSettings>
										);
									}
								}}
							></FieldArray>
							<div className='flex flex-col justify-center pl-4 pr-4'>
								<Button
									className='mt-4'
									onClick={() => {
										addColumnHandler(globalSource);
									}}
								>
									Add new column
								</Button>
							</div>
							{/* <AdvancedTableSettings
								simple
								selectedItem={selectedItem}
								sources={parseSources(sourcesData)}
								sourcesLoading={sourcesLoading}
								sourcesError={sourcesError}
								onItemUpdate={onItemUpdate}
							></AdvancedTableSettings> */}
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default TableSettings;
