import { Field, Form, Formik } from "formik";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../UI/Form/FormSelect";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useAlert } from "react-alert";
import SourceColumnService, {
	getColumnsForSource,
} from "../../../services/SourceColumnService";

const CapabilityBarGraphSettings = ({ selectedItem, onItemUpdate }) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [columnsData, setColumnsData] = useState([]);
	const [columnsLoading, setColumnsLoading] = useState(false);
	const [columnsError, setColumnsError] = useState(false);
	const [processColumnData, setprocessColumnData] = useState({
		data: [],
		loading: false,
		error: false,
	});
	const alert = useAlert();

	//Load columns if source is defined on load
	useEffect(() => {
		getColumnsHandler(selectedItem.source.id);
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
		return array;
	};

	//Load new columns data on source change
	const getColumnsHandler = async (sourceId) => {
		setColumnsError(false);
		if (sourceId === null) {
			setColumnsData([]);
			setprocessColumnData({ data: [], loading: false, error: false });
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
			//Get filter values for process
			if (selectedItem.processColumn.id) {
				getProcessFilterData(sourceId, selectedItem.processColumn.id);
			}
		}
	};

	const getProcessFilterData = async (sourceId, columnId) => {
		setprocessColumnData({ data: [], loading: true, error: false });
		try {
			const response = await SourceColumnService.getColumDistinctValues(
				sourceId,
				columnId
			);
			debugger;
			const newData = response.data.map((filter) => ({
				value: filter,
				label: filter,
			}));
			setprocessColumnData((prevState) => ({
				...prevState,
				data: newData,
				loading: false,
			}));
		} catch (e) {
			alert.error("Error getting process column values.");
			setprocessColumnData((prevState) => ({
				...prevState,
				loading: false,
				error: true,
			}));
		}
	};

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				orientation: selectedItem.orientation,
				sourceFormId: selectedItem.source && selectedItem.source.id,
				processColumn:
					selectedItem.processColumn && selectedItem.processColumn.id,
				processFilter: selectedItem.processFilter.map((i) => i),
				levelColumn: selectedItem.levelColumn && selectedItem.levelColumn.id,
				attributeColumn:
					selectedItem.attributeColumn && selectedItem.attributeColumn.id,
				scoreColumn: selectedItem.scoreColumn && selectedItem.scoreColumn.id,
			}}
			validationSchema={Yup.object().shape({})}
		>
			{({ values }) => (
				<Form className='flex flex-col'>
					{console.log(values.processColumn)}
					<div className='flex flex-col justify-center'>
						<div className='flex flex-col justify-center pl-4 pr-4 mt-2'>
							<label className='font-medium'>Graph orientation:</label>
							<Field
								name='orientation'
								options={[
									{ value: "VERTICAL", label: "Vertical" },
									{ value: "HORIZONTAL", label: "Horizontal" },
								]}
								component={FormSelect}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.orientation = e.value;
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
							/>
							<div className='mt-2 mb-3 border border-gray-800 border-opacity-30'></div>
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
										: sourcesData && sourcesData.length > 0
										? "Select source"
										: "No sources"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									if (updatedSelected.source.id !== e.value) {
										setColumnsError(false);
										updatedSelected.source.id = e.value;
										//Load columns for new source
										getColumnsHandler(e.value);
										//Change selected coluns to NONE on source change
										updatedSelected.processColumn.id = null;
										updatedSelected.levelColumn.id = null;
										updatedSelected.attributeColumn.id = null;
										updatedSelected.scoreColumn.id = null;
										updatedSelected.processColumn.columnName = null;
										updatedSelected.levelColumn.columnName = null;
										updatedSelected.attributeColumn.columnName = null;
										updatedSelected.scoreColumn.columnName = null;
										//Reset filters
										updatedSelected.processFilter = [];
										onItemUpdate(updatedSelected);
									}
								}}
								isMulti={false}
								isLoading={sourcesLoading}
							/>
							<label className='flex items-center pt-1 text-sm'>
								Optional filter by asessor:
								<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
							</label>
							<Field
								name='assessorFilter'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error!"
										: columnsData.length > 0
										? "Select assessor"
										: "No columns"
								}
								onSelect={(e) => {
									//TODO
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<div className='mt-2 mb-3 border border-gray-800 border-opacity-30'></div>
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
									updatedSelected.processColumn.id = e.value;
									updatedSelected.processColumn.columnName = e.label;
									updatedSelected.processFilter = [];
									onItemUpdate(updatedSelected);
									getProcessFilterData(values.sourceFormId, e.value);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<label className='pt-1 text-sm'>
								Optional filter by process:
							</label>
							<Field
								name='processFilter'
								options={processColumnData.data}
								component={FormSelect}
								placeholder={
									values.processColumn
										? processColumnData.loading
											? "Loading..."
											: processColumnData.error
											? "Error!"
											: processColumnData.data?.length > 0
											? "Filter values"
											: "No values"
										: ""
								}
								onSelect={(e) => {
									debugger;
									let updatedSelected = selectedItem;
									updatedSelected.processFilter = e.map(
										(filter) => filter.value
									);
									onItemUpdate(updatedSelected);
								}}
								isMulti={true}
								isLoading={processColumnData.loading}
							/>
							<div className='mt-2 mb-3 border border-gray-800 border-opacity-30'></div>
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
							<div className='mt-2 mb-3 border border-gray-800 border-opacity-30'></div>
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
									updatedSelected.attributeColumn.id = e.value;
									updatedSelected.attributeColumn.columnName = e.label;
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<div className='mt-2 mb-3 border border-gray-800 border-opacity-30'></div>
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
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default CapabilityBarGraphSettings;
