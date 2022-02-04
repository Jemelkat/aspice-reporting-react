import { Field, Form, Formik } from "formik";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../UI/Form/FormSelect";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { getColumnsForSource } from "../../../services/SourceColumnService";

const CapabilityBarGraphSettings = ({ selectedItem, onItemUpdate }) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [columnsData, setColumnsData] = useState([]);
	const [columnsLoading, setColumnsLoading] = useState(false);
	const [columnsError, setColumnsError] = useState(false);

	//Load columns if source is defined on load
	useEffect(() => {
		if (selectedItem.source.id !== null) {
			getColumnsHandler(selectedItem.source.id);
		}
	}, []);

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

	//Load new columns data on source change
	const getColumnsHandler = async (sourceId) => {
		setColumnsError(false);
		if (sourceId === null) {
			setColumnsData([]);
		} else {
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await getColumnsForSource(sourceId);
				setColumnsData(parseColumns(response.data));
				setColumnsLoading(false);
			} catch (e) {
				setColumnsLoading(false);
				setColumnsError(true);
			}
		}
	};

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				sourceFormId: selectedItem.source.id,
				levelColumn: selectedItem.levelColumn.id,
				scoreColumn: selectedItem.scoreColumn.id,
			}}
			validationSchema={Yup.object().shape({})}
		>
			{() => (
				<Form className='flex flex-col'>
					<div className='flex flex-col justify-center'>
						<div className='flex flex-col justify-center pl-4 pr-4 mt-2'>
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
									if (updatedSelected.source.id !== e.value) {
										setColumnsError(false);
										updatedSelected.source.id = e.value;
										//Load columns for new source
										getColumnsHandler(e.value);
										//Change selected coluns to NONE on source change
										updatedSelected.levelColumn.id = null;
										updatedSelected.scoreColumn.id = null;
										updatedSelected.levelColumn.columnName = null;
										updatedSelected.scoreColumn.columnName = null;
										onItemUpdate(updatedSelected);
									}
								}}
								isMulti={false}
								isLoading={sourcesLoading}
							/>
							<label className='font-medium'>Capability level:</label>
							<Field
								name='levelColumn'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error getting columns"
										: columnsData.length > 0
										? "Select column"
										: "No columns found"
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
							<label className='font-medium'>Score/Value:</label>
							<Field
								name='scoreColumn'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error getting columns"
										: columnsData.length > 0
										? "Select column"
										: "No columns found"
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
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default CapabilityBarGraphSettings;
