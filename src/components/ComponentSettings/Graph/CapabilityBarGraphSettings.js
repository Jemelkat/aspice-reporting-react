import { Field, Form, Formik } from "formik";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../../ui/Form/FormSelect";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useAlert } from "react-alert";
import HorizontalLine from "../../../ui/HorizontalLine";
import SourceColumnService from "../../../services/SourceColumnService";

const CapabilityBarGraphSettings = ({ selectedItem, onItemUpdate }) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [columnsData, setColumnsData] = useState([]);
	const [columnsLoading, setColumnsLoading] = useState(false);
	const [columnsError, setColumnsError] = useState(false);
	const [processFilter, setProcessFilter] = useState({
		data: [],
		loading: false,
		error: false,
	});
	const [assessorFilter, setAssessorFilter] = useState({
		data: [],
		loading: false,
		error: false,
	});
	const alert = useAlert();

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
			setProcessFilter({ data: [], loading: false, error: false });
		} else {
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await SourceColumnService.getColumnsForSource(
					sourceId
				);
				setColumnsData(parseColumns(response.data));
				setColumnsLoading(false);
			} catch (e) {
				setColumnsLoading(false);
				setColumnsError(true);
			}
			//Get filter values for process
			if (selectedItem.processColumn?.id) {
				getProcessFilterData(sourceId, selectedItem.processColumn.id);
			}
			//Get filter values for assessor
			if (selectedItem.assessorColumn?.id) {
				getAssessorFilterData(sourceId, selectedItem.assessorColumn.id);
			}
		}
	};

	//Gets distinct values from process column
	const getProcessFilterData = async (sourceId, columnId) => {
		setProcessFilter({ data: [], loading: true, error: false });
		try {
			const response = await SourceColumnService.getColumDistinctValues(
				sourceId,
				columnId
			);
			const newData = response.data.map((filter) => ({
				value: filter,
				label: filter,
			}));
			setProcessFilter((prevState) => ({
				...prevState,
				data: newData,
				loading: false,
			}));
		} catch (e) {
			alert.error("Error getting process column values.");
			setProcessFilter((prevState) => ({
				...prevState,
				loading: false,
				error: true,
			}));
		}
	};

	//Gets distinct values from assessor column
	const getAssessorFilterData = async (sourceId, columnId) => {
		setAssessorFilter({ data: [], loading: true, error: false });
		try {
			const response = await SourceColumnService.getColumDistinctValues(
				sourceId,
				columnId
			);
			const newData = response.data.map((filter) => ({
				value: filter,
				label: filter,
			}));
			setAssessorFilter((prevState) => ({
				...prevState,
				data: newData,
				loading: false,
			}));
		} catch (e) {
			alert.error("Error getting assessor column values.");
			setAssessorFilter((prevState) => ({
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
				sourceFormId: selectedItem.source?.id,
				assessorColumn: selectedItem.assessorColumn?.id,
				assessorFilter: selectedItem.assessorFilter.map((i) => i),
				processColumn: selectedItem.processColumn?.id,
				processFilter: selectedItem.processFilter.map((i) => i),
				criterionColumn: selectedItem.criterionColumn?.id,
				attributeColumn: selectedItem.attributeColumn?.id,
				scoreColumn: selectedItem.scoreColumn?.id,
				scoreFunction: selectedItem.scoreFunction,
			}}
		>
			{({ values }) => (
				<Form className='flex flex-col'>
					<div className='flex flex-col justify-center'>
						<div className='flex flex-col justify-center pl-4 pr-4 mt-2'>
							<label className='font-medium'>Graph orientation</label>
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
							<label className='font-medium'>Source</label>
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
											//Reset all item columns
											updatedSelected.source = null;
											updatedSelected.processColumn = null;
											updatedSelected.assessorColumn = null;
											updatedSelected.levelColumn = null;
											updatedSelected.attributeColumn = null;
											updatedSelected.scoreColumn = null;
											//Reset filters
											updatedSelected.processFilter = [];
											updatedSelected.assessorFilter = [];
											onItemUpdate(updatedSelected);
											setColumnsData([]);
											setProcessFilter({
												data: [],
												loading: false,
												error: false,
											});
											setAssessorFilter({
												data: [],
												loading: false,
												error: false,
											});
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
											setColumnsError(false);
											getColumnsHandler(e.value);
											//Change selected coluns to NONE on source change
											updatedSelected.processColumn = null;
											updatedSelected.assessorColumn = null;
											updatedSelected.levelColumn = null;
											updatedSelected.attributeColumn = null;
											updatedSelected.scoreColumn = null;
											//Reset filters
											updatedSelected.processFilter = [];
											updatedSelected.assessorFilter = [];
											onItemUpdate(updatedSelected);
											setProcessFilter({
												data: [],
												loading: false,
												error: false,
											});
											setAssessorFilter({
												data: [],
												loading: false,
												error: false,
											});
										}
									}
								}}
								isMulti={false}
								isLoading={sourcesLoading}
							/>
							<HorizontalLine />
							<label className='font-medium'> Assessor</label>
							<Field
								name='assessorColumn'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error!"
										: columnsData.length > 1
										? "Select assessor"
										: "No columns"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									if (e.value !== null) {
										updatedSelected.assessorColumn = {
											id: e.value,
											columnName: e.label,
										};
										getAssessorFilterData(values.sourceFormId, e.value);
									} else {
										updatedSelected.assessorColumn = null;
										setAssessorFilter({
											data: [],
											loading: false,
											error: false,
										});
									}

									updatedSelected.assessorFilter = [];
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<label className='flex items-center pt-1 text-sm'>
								Optional filter by assessor
								<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
							</label>
							<Field
								name='assessorFilter'
								options={assessorFilter.data}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: assessorFilter.error
										? "Error!"
										: assessorFilter.data.length > 0
										? "Filter values"
										: ""
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.assessorFilter = e.map(
										(filter) => filter.value
									);
									onItemUpdate(updatedSelected);
								}}
								isMulti={true}
								isLoading={columnsLoading}
							/>
							<HorizontalLine />
							<label className='font-medium'>Process</label>
							<Field
								name='processColumn'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error!"
										: columnsData.length > 1
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
										getProcessFilterData(values.sourceFormId, e.value);
									} else {
										updatedSelected.processColumn = null;
										setProcessFilter({
											data: [],
											loading: false,
											error: false,
										});
									}
									updatedSelected.processFilter = [];
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<label className='flex items-center pt-1 text-sm'>
								Optional filter by process
								<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
							</label>
							<Field
								name='processFilter'
								options={processFilter.data}
								component={FormSelect}
								placeholder={
									values.processColumn
										? processFilter.loading
											? "Loading..."
											: processFilter.error
											? "Error!"
											: processFilter.data?.length > 0
											? "Filter values"
											: "No values"
										: ""
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.processFilter = e.map(
										(filter) => filter.value
									);
									onItemUpdate(updatedSelected);
								}}
								isMulti={true}
								isLoading={processFilter.loading}
							/>
							<HorizontalLine />
							<label className='font-medium'>Performance criterion</label>
							<Field
								name='criterionColumn'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error!"
										: columnsData.length > 1
										? "Select column"
										: "No columns"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									if (e.value !== null) {
										updatedSelected.criterionColumn = {
											id: e.value,
											columnName: e.label,
										};
									} else {
										updatedSelected.criterionColumn = null;
									}
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<HorizontalLine />
							<label className='font-medium'>Process atribute</label>
							<Field
								name='attributeColumn'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error!"
										: columnsData.length > 1
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
							<HorizontalLine />
							<label className='font-medium'>Score/Value</label>
							<Field
								name='scoreColumn'
								options={columnsData}
								component={FormSelect}
								placeholder={
									columnsLoading
										? "Loading..."
										: columnsError
										? "Error!"
										: columnsData.length > 1
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
							<label className='flex items-center pt-1 text-sm'>
								Aggregate function
								<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
							</label>
							<Field
								name='scoreFunction'
								options={[
									{ value: "MAX", label: "MAX" },
									{ value: "AVG", label: "AVG" },
									{ value: "MIN", label: "MIN" },
								]}
								component={FormSelect}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.scoreFunction = e.value;
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
							/>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default CapabilityBarGraphSettings;
