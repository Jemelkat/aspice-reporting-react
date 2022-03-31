import { Field, Form, Formik } from "formik";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../../ui/Form/FormSelect";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useAlert } from "react-alert";
import HorizontalLine from "../../../ui/HorizontalLine";
import SourceColumnService from "../../../services/SourceColumnService";
import DataService from "../../../services/DataService";
import FormInput from "../../../ui/Form/FormInput";

const allProcesses = [
	{ value: "ACQ.3", label: "ACQ.3" },
	{ value: "ACQ.4", label: "ACQ.3" },
	{ value: "ACQ.11", label: "ACQ.11" },
	{ value: "ACQ.12", label: "ACQ.12" },
	{ value: "ACQ.13", label: "ACQ.13" },
	{ value: "ACQ.14", label: "ACQ.14" },
	{ value: "ACQ.15", label: "ACQ.15" },
	{ value: "MAN.3", label: "MAN.3" },
	{ value: "MAN.5", label: "MAN.5" },
	{ value: "MAN.6", label: "MAN.6" },
	{ value: "PIM.3", label: "PIM.3" },
	{ value: "REU.2", label: "REU.2" },
	{ value: "SPL.1", label: "SPL.1" },
	{ value: "SPL.2", label: "SPL.2" },
	{ value: "SUP.1", label: "SUP.1" },
	{ value: "SUP.2", label: "SUP.2" },
	{ value: "SUP.4", label: "SUP.4" },
	{ value: "SUP.7", label: "SUP.7" },
	{ value: "SUP.8", label: "SUP.8" },
	{ value: "SUP.9", label: "SUP.9" },
	{ value: "SUP.10", label: "SUP.10" },
	{ value: "SWE.1", label: "SWE.1" },
	{ value: "SWE.2", label: "SWE.2" },
	{ value: "SWE.3", label: "SWE.3" },
	{ value: "SWE.4", label: "SWE.4" },
	{ value: "SWE.5", label: "SWE.5" },
	{ value: "SWE.6", label: "SWE.6" },
	{ value: "SYS.1", label: "SYS.1" },
	{ value: "SYS.2", label: "SYS.2" },
	{ value: "SYS.3", label: "SYS.3" },
	{ value: "SYS.4", label: "SYS.4" },
	{ value: "SYS.5", label: "SYS.5" },
];

const LevelBarGraphSettings = ({ selectedItem, onItemUpdate }) => {
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
	const alert = useAlert();

	//Load columns if source is defined on load
	useEffect(() => {
		getColumnsHandler(selectedItem.sources.map((s) => s.id));
	}, [selectedItem.sources]);

	//Parse sources
	const parseSources = (sources) => {
		let array = [];
		if (sources)
			sources.forEach((source) =>
				array.push({ value: source.id, label: source.sourceName })
			);
		return array;
	};

	//Load new columns data on source change
	const getColumnsHandler = async (sourceId) => {
		setColumnsError(false);
		if (sourceId.length === 0) {
			let updatedSelected = selectedItem;
			updatedSelected.assessorColumnName = null;
			updatedSelected.processColumnName = null;
			updatedSelected.attributeColumnName = null;
			updatedSelected.criterionColumnName = null;
			updatedSelected.scoreColumnName = null;
			setColumnsData([]);
			setAssessorFilter({ data: [], loading: false, error: false });
			onItemUpdate(updatedSelected);
		} else {
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await SourceColumnService.getColumnsForSources(
					sourceId
				);
				//Reset selected columns when changed
				updateSelectedColumns(response.data);

				setColumnsData(DataService.parseSimpleSelectData(response.data));
				setColumnsLoading(false);
			} catch (e) {
				setColumnsLoading(false);
				setColumnsError(true);
				alert.error("Error getting columns for selected sources.");
			}

			//Get filter values for assessors
			if (selectedItem.assessorColumnName != null) {
				getAssessorFilterData(sourceId, selectedItem.assessorColumnName);
			}
		}
	};

	//Set selected columns to null if they dont exist in any source
	const updateSelectedColumns = (columnsData) => {
		let newSelected = selectedItem;
		let changed = false;
		if (!columnsData.includes(newSelected.assessorColumnName)) {
			newSelected.assessorColumnName = null;
			setAssessorFilter({ data: [], loading: false, error: false });
			changed = true;
		}
		if (!columnsData.includes(newSelected.processColumnName)) {
			newSelected.processColumnName = null;
			changed = true;
		}
		if (!columnsData.includes(newSelected.attributeColumnName)) {
			newSelected.attributeColumnName = null;
			changed = true;
		}
		if (!columnsData.includes(newSelected.criterionColumnName)) {
			newSelected.criterionColumnName = null;
			changed = true;
		}
		if (!columnsData.includes(newSelected.scoreColumnName)) {
			newSelected.scoreColumnName = null;
			changed = true;
		}

		if (changed) {
			onItemUpdate(newSelected);
		}
	};

	//Gets distinct values from assessor column
	const getAssessorFilterData = async (sourceId, columnName) => {
		setAssessorFilter({ data: [], loading: true, error: false });
		try {
			const response = await SourceColumnService.getValuesForSourcesAndColumn(
				sourceId,
				columnName
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
			if (e.response.data && e.response.data.message) {
				alert.error(e.response.data.message);
			} else {
				alert.error("Error getting assessor filter values.");
			}
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
				sources: selectedItem?.sources.map((i) => i.id),
				assessorColumnName: selectedItem.assessorColumnName,
				assessorFilter: selectedItem.assessorFilter,
				processColumnName: selectedItem.processColumnName,
				processFilter: selectedItem.processFilter,
				attributeColumnName: selectedItem.attributeColumnName,
				criterionColumnName: selectedItem.criterionColumnName,
				scoreColumnName: selectedItem.scoreColumnName,
				aggregateScoresFunction: selectedItem.aggregateScoresFunction,
				aggregateLevels: selectedItem.aggregateLevels,
				aggregateSourcesFunction: selectedItem.aggregateSourcesFunction,
			}}
		>
			{({ values, handleChange }) => (
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
								name='sources'
								options={parseSources(sourcesData)}
								component={FormSelect}
								placeholder={
									values.sources
										? sourcesLoading
											? "Loading..."
											: sourcesError
											? "Error!"
											: sourcesData?.length > 0
											? "Sources"
											: "No values"
										: ""
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									debugger;
									if (!updatedSelected.sources.includes(e.value)) {
										updatedSelected.sources = e.map((selected) => {
											return {
												id: selected.value,
											};
										});
										onItemUpdate(updatedSelected);
									}
								}}
								isMulti={true}
								isLoading={sourcesLoading}
								ordering={true}
							/>
							<HorizontalLine />
							<label className='font-medium'> Assessor column</label>
							<Field
								name='assessorColumnName'
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
										updatedSelected.assessorColumnName = e.value;
										getAssessorFilterData(
											updatedSelected.sources.map((source) => source.id),
											e.value
										);
									} else {
										updatedSelected.assessorColumnName = null;
										setAssessorFilter({
											data: [],
											loading: false,
											error: false,
										});
									}

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
										? "Select assessor"
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
								isLoading={assessorFilter.loading}
							/>
							<HorizontalLine />
							<label className='font-medium'>Process column:</label>
							<Field
								name='processColumnName'
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
										updatedSelected.processColumnName = e.value;
									} else {
										updatedSelected.processColumnName = null;
									}
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
								options={allProcesses}
								component={FormSelect}
								placeholder={"Select process"}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.processFilter = e.map(
										(filter) => filter.value
									);
									onItemUpdate(updatedSelected);
								}}
								isMulti={true}
							/>
							<HorizontalLine />
							<label className='font-medium'>Process attribute</label>
							<Field
								name='attributeColumnName'
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
										updatedSelected.attributeColumnName = e.value;
									} else {
										updatedSelected.attributeColumnName = null;
									}
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<HorizontalLine />
							<label className='font-medium'>Performance criterion</label>
							<Field
								name='criterionColumnName'
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
										updatedSelected.criterionColumnName = e.value;
									} else {
										updatedSelected.criterionColumnName = null;
									}
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<HorizontalLine />
							<label className='font-medium'>Score/Value</label>
							<Field
								name='scoreColumnName'
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
										updatedSelected.scoreColumnName = e.value;
									} else {
										updatedSelected.scoreColumnName = null;
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
								name='aggregateScoresFunction'
								options={[
									{ value: "MIN", label: "MIN" },
									{ value: "MAX", label: "MAX" },
									{ value: "AVG", label: "AVG" },
									{ value: "NONE", label: "NONE" },
								]}
								component={FormSelect}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.aggregateScoresFunction = e.value;
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
							/>
							<div className='flex flex-row items-center pl-0.5 pt-1 text-sm'>
								<FormInput
									name='aggregateLevels'
									type='checkbox'
									onChange={(e) => {
										handleChange(e);
										let updatedSelected = selectedItem;
										updatedSelected.aggregateLevels = e.target.checked;
										if (e.target.checked) {
											if (
												updatedSelected.aggregateScoresFunction !== "MIN" &&
												updatedSelected.aggregateScoresFunction !== "MAX"
											) {
												updatedSelected.aggregateScoresFunction = "MIN";
											}
										}
										onItemUpdate(updatedSelected);
									}}
								/>
								<div className='flex items-center justify-center'>
									<label className='pl-1'>Merge by levels </label>
									<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
								</div>
							</div>
							<label className='flex items-center pt-1 text-sm'>
								Merge scores
								<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
							</label>
							<Field
								name='aggregateSourcesFunction'
								options={[
									{ value: "NONE", label: "NONE" },
									{ value: "MAX", label: "MAX" },
									{ value: "MIN", label: "MIN" },
								]}
								component={FormSelect}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.aggregateSourcesFunction = e.value;
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

export default LevelBarGraphSettings;
