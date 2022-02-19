import { Field, Form, Formik } from "formik";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../UI/Form/FormSelect";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { getColumnsForSource } from "../../../services/SourceColumnService";

const LevelPieGraphSettings = ({ selectedItem, onItemUpdate }) => {
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
				sourceFormId: selectedItem.source?.id,
				processColumn: selectedItem.processColumn?.id,
				levelColumn: selectedItem.levelColumn?.id,
				attributeColumn: selectedItem.attributeColumn?.id,
				scoreColumn: selectedItem.scoreColumn?.id,
			}}
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
										? "Error!"
										: sourcesData && sourcesData.length > 1
										? "Select source"
										: "No sources"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									if (e.value === null) {
										if (e.value !== updatedSelected.source) {
											setColumnsError(false);
											updatedSelected.source = null;
											//Change selected coluns to NONE on source change
											updatedSelected.processColumn = null;
											updatedSelected.levelColumn = null;
											updatedSelected.attributeColumn = null;
											updatedSelected.scoreColumn = null;
											onItemUpdate(updatedSelected);
											setColumnsData([]);
										}
									} else {
										if (
											!updatedSelected.source?.id ||
											e.value !== updatedSelected.source.id
										) {
											debugger;
											updatedSelected.source = {
												id: e.value,
												sourceName: e.label,
											};
											//Load columns for new source
											setColumnsError(false);
											getColumnsHandler(e.value);
											//Change selected coluns to NONE on source change
											updatedSelected.processColumn = null;
											updatedSelected.assessorColumn = null;
											updatedSelected.levelColumn = null;
											updatedSelected.attributeColumn = null;
											updatedSelected.scoreColumn = null;
											//Reset filters
											onItemUpdate(updatedSelected);
										}
									}
								}}
								isMulti={false}
								isLoading={sourcesLoading}
							/>
							<label className='font-medium'>Process column:</label>
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
									if (e.value !== null) {
										updatedSelected.processColumn = {
											id: e.value,
											columnName: e.label,
										};
									} else {
										updatedSelected.processColumn = null;
									}
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
									if (e.value !== null) {
										updatedSelected.levelColumn = {
											id: e.value,
											columnName: e.label,
										};
									} else {
										updatedSelected.levelColumn = null;
									}
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<label className='font-medium'>Attribute column:</label>
							<Field
								name='attributeColumn'
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
									if (e.value !== null) {
										updatedSelected.attributeColumn = {
											id: e.value,
											columnName: e.label,
										};
									} else {
										updatedSelected.attributeColumn = null;
									}
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
										? "Error!"
										: columnsData.length > 0
										? "Select column"
										: "No columns"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									if (e.value !== null) {
										updatedSelected.scoreColumn = {
											id: e.value,
											columnName: e.label,
										};
									} else {
										updatedSelected.scoreColumn = null;
									}
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

export default LevelPieGraphSettings;
