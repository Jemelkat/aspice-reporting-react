import {InformationCircleIcon} from "@heroicons/react/solid";
import {Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {useAxios} from "../../../helpers/AxiosHelper";
import SourceColumnService from "../../../services/SourceColumnService";
import FormInput from "../../UI/Form/FormInput";
import FormSelect from "../../UI/Form/FormSelect";

const CapabilityTableSettigs = ({
	selectedItem,
	onItemUpdate,
	handleChange,
}) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [columnsData, setColumnsData] = useState([]);
	const [columnsLoading, setColumnsLoading] = useState(false);
	const [columnsError, setColumnsError] = useState(false);
	const [assessorFilter, setAssessorFilter] = useState({
		data: [],
		loading: false,
		error: false,
	});

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
			//Get filter values for assessor
			if (selectedItem.assessorColumn?.id) {
				getAssessorFilterData(sourceId, selectedItem.assessorColumn.id);
			}
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
				sourceFormId: selectedItem.source ? selectedItem.source.id : null,
				assessorColumn: selectedItem.assessorColumn?.id,
				assessorFilter: selectedItem.assessorFilter,
				fontSize: selectedItem.fontSize,
				processColumn: selectedItem.processColumn?.id,
				processWidth: selectedItem.processWidth,
				levelColumn: selectedItem.levelColumn?.id,
				levelLimit: selectedItem.levelLimit,
				criterionColumn: selectedItem.criterionColumn?.id,
				criterionWidth: selectedItem.criterionWidth,
				scoreColumn: selectedItem.scoreColumn?.id,
			}}
		>
			{({ values, handleChange }) => (
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
										? "Error!"
										: sourcesData && sourcesData.length > 1
										? "Select source"
										: "No sources"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									setColumnsError(false);
									//Change selected coluns to NONE on source change
									updatedSelected.processColumn = null;
									updatedSelected.assessorColumn = null;
									updatedSelected.levelColumn = null;
									updatedSelected.attributeColumn = null;
									updatedSelected.scoreColumn = null;
									updatedSelected.assessorFilter = null;
									//Reset filters
									onItemUpdate(updatedSelected);
									setAssessorFilter({
										data: [],
										loading: false,
										error: false,
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
								}}
								isMulti={false}
								isLoading={sourcesLoading}
							/>
							<label className='font-medium'>Assessor</label>
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

									updatedSelected.assessorFilter = null;
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
									updatedSelected.assessorFilter = e.value;
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<FormInput
								label='Text size:'
								name={`fontSize`}
								type='number'
								onChange={(e) => {
									handleChange(e);
									if (e.target.value > 0) {
										let newSelected = selectedItem;
										newSelected.fontSize = e.target.value;
										onItemUpdate(newSelected);
									}
								}}
							/>
							<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
							<label className='font-medium'>Process name:</label>
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
									} else {
										updatedSelected.processColumn = null;
									}
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<FormInput
								label='Process column width'
								name={`processWidth`}
								type='number'
								onChange={(e) => {
									handleChange(e);
									if (e.target.value > 0) {
										let newSelected = selectedItem;
										newSelected.processWidth = e.target.value;
										onItemUpdate(newSelected);
									}
								}}
							/>
							<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
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
										: columnsData.length > 1
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
							<FormInput
								label='Max level:'
								name={`levelLimit`}
								type='number'
								onChange={(e) => {
									handleChange(e);
									if (e.target.value >= 0 && e.target.value <= 5) {
										let newSelected = selectedItem;
										newSelected.levelLimit = e.target.value;
										onItemUpdate(newSelected);
									}
								}}
							/>
							<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
							<label className='font-medium'>Performance criterion:</label>
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
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<FormInput
								label='Criterion columns width:'
								name={`criterionWidth`}
								type='number'
								onChange={(e) => {
									handleChange(e);
									if (e.target.value > 0) {
										let newSelected = selectedItem;
										newSelected.criterionWidth = e.target.value;
										onItemUpdate(newSelected);
									}
								}}
							/>
							<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
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

export default CapabilityTableSettigs;
