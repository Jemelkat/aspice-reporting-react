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

const SourceLevelBarGraphSettings = ({ selectedItem, onItemUpdate }) => {
	const [{ data: sourcesData, loading: sourcesLoading, error: sourcesError }] =
		useAxios("/source/allSimple", { useCache: false });
	const [columnsData, setColumnsData] = useState([]);
	const [columnsLoading, setColumnsLoading] = useState(false);
	const [columnsError, setColumnsError] = useState(false);

	const alert = useAlert();

	//Load columns if source is defined on load
	useEffect(() => {
		selectedItem.sources.length > 0 &&
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
		if (sourceId === null) {
			setColumnsData([]);
		} else {
			//Load new columns for source
			try {
				console.log("calling");
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
		}
	};

	//Set selected columns to null if they dont exist in any source
	const updateSelectedColumns = (columnsData) => {
		let newSelected = selectedItem;
		let changed = false;
		if (!columnsData.includes(newSelected.assessorColumn)) {
			newSelected.assessorColumn = null;
			changed = true;
		}
		if (!columnsData.includes(newSelected.processColumn)) {
			newSelected.processColumn = null;
			changed = true;
		}
		if (!columnsData.includes(newSelected.attributeColumn)) {
			newSelected.attributeColumn = null;
			changed = true;
		}
		if (!columnsData.includes(newSelected.scoreColumn)) {
			newSelected.scoreColumn = null;
			changed = true;
		}

		if (changed) {
			onItemUpdate(newSelected);
		}
	};

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				orientation: selectedItem.orientation,
				sources: selectedItem?.sources.map((i) => i.id),
				assessorColumn: selectedItem.assessorColumn,
				assessorFilter: selectedItem.assessorFilter,
				processColumn: selectedItem.processColumn,
				processFilter: selectedItem.processFilter,
				attributeColumn: selectedItem.attributeColumn,
				criterionColumn: selectedItem.criterionColumn,
				scoreColumn: selectedItem.scoreColumn,
				scoreFunction: selectedItem.scoreFunction,
				mergeLevels: selectedItem.mergeLevels,
				mergeScores: selectedItem.mergeScores,
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
							/>
							<HorizontalLine />
							<label className='font-medium'> Assessor column</label>
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
										updatedSelected.assessorColumn = e.value;
									} else {
										updatedSelected.assessorColumn = null;
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
							<FormInput
								label=''
								name='assessorFilter'
								type='text'
								placeholder='Type assessor...'
								onChange={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.assessorFilter = e.target.value;
									onItemUpdate(updatedSelected);
								}}
							/>
							<HorizontalLine />
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
										: columnsData.length > 1
										? "Select column"
										: "No columns"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									if (e.value !== null) {
										updatedSelected.processColumn = e.value;
									} else {
										updatedSelected.processColumn = null;
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
										updatedSelected.attributeColumn = e.value;
									} else {
										updatedSelected.attributeColumn = null;
									}
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
								isLoading={columnsLoading}
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
										: columnsData.length > 0
										? "Select column"
										: "No columns"
								}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									if (e.value !== null) {
										updatedSelected.criterionColumn = e.value;
									} else {
										updatedSelected.criterionColumn = null;
									}
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
										updatedSelected.scoreColumn = e.value;
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
									{ value: "MIN", label: "MIN" },
									{ value: "MAX", label: "MAX" },
									{ value: "AVG", label: "AVG" },
								]}
								component={FormSelect}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.scoreFunction = e.value;
									onItemUpdate(updatedSelected);
								}}
								isMulti={false}
							/>
							<div className='flex flex-row items-center pl-0.5 pt-1 text-sm'>
								<FormInput
									name='mergeLevels'
									type='checkbox'
									onChange={(e) => {
										handleChange(e);
										let updatedSelected = selectedItem;
										updatedSelected.mergeLevels = e.target.checked;
										if (e.target.checked) {
											if (
												updatedSelected.scoreFunction !== "MIN" &&
												updatedSelected.scoreFunction !== "MAX"
											) {
												updatedSelected.scoreFunction = "MIN";
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
								name='mergeScores'
								options={[
									{ value: "NONE", label: "NONE" },
									{ value: "MAX", label: "MAX" },
									{ value: "MIN", label: "MIN" },
								]}
								component={FormSelect}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.mergeScores = e.value;
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

export default SourceLevelBarGraphSettings;
