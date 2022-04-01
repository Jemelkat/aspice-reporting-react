import { InformationCircleIcon } from "@heroicons/react/outline";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useAxios } from "../../../helpers/AxiosHelper";
import DataService from "../../../services/DataService";
import SourceColumnService from "../../../services/SourceColumnService";
import FormInput from "../../../ui/Form/FormInput";
import FormSelect from "../../../ui/Form/FormSelect";

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

const CapabilityTableSettigs = ({ selectedItem, onItemUpdate }) => {
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
		getColumnsHandler(selectedItem.source);
	}, [selectedItem.source]);

	//Load new columns data on source change
	const getColumnsHandler = async (source) => {
		setColumnsError(false);
		if (!source?.id || source === null) {
			let updatedSelected = selectedItem;
			//Change selected colu,s to NONE on source change
			updatedSelected.processColumn = null;
			updatedSelected.assessorColumn = null;
			updatedSelected.levelColumn = null;
			updatedSelected.criterionColumn = null;
			updatedSelected.scoreColumn = null;
			updatedSelected.assessorFilter = [];
			setColumnsData([]);
			onItemUpdate(updatedSelected);
			setAssessorFilter({
				data: [],
				loading: false,
				error: false,
			});
		} else {
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await SourceColumnService.getColumnsForSource(
					source.id
				);
				setColumnsData(DataService.parseColumnsSelectData(response.data));
				setColumnsLoading(false);
			} catch (e) {
				setColumnsLoading(false);
				setColumnsError(true);
			}
			//Get filter values for assessor
			if (selectedItem.assessorColumn?.id) {
				getAssessorFilterData(source.id, selectedItem.assessorColumn.id);
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
			if (e.response?.data && e.response.data?.message) {
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
				sourceFormId: selectedItem.source ? selectedItem.source.id : null,
				assessorColumn: selectedItem.assessorColumn?.id,
				assessorFilter: selectedItem.assessorFilter,
				fontSize: selectedItem.fontSize,
				processColumn: selectedItem.processColumn?.id,
				processFilter: selectedItem.processFilter,
				processWidth: selectedItem.processWidth,
				levelColumn: selectedItem.levelColumn?.id,
				specificLevel: selectedItem.specificLevel,
				levelLimit: selectedItem.levelLimit,
				criterionColumn: selectedItem.criterionColumn?.id,
				criterionWidth: selectedItem.criterionWidth,
				scoreColumn: selectedItem.scoreColumn?.id,
				aggregateScoresFunction: selectedItem.aggregateScoresFunction,
			}}
		>
			{({ values, handleChange }) => (
				<Form className='flex flex-col'>
					<div className='flex flex-col justify-center'>
						<div className='flex flex-col justify-center pl-4 pr-4'>
							<label className='font-medium'>Source:</label>
							<Field
								name='sourceFormId'
								options={DataService.parseSourcesSelectData(sourcesData)}
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
									if (e.value !== selectedItem.source?.id) {
										let updatedSelected = selectedItem;
										if (e.value === null) {
											if (e.value !== updatedSelected.source) {
												updatedSelected.source = null;
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
												updatedSelected.processColumn = null;
												updatedSelected.assessorColumn = null;
												updatedSelected.levelColumn = null;
												updatedSelected.criterionColumn = null;
												updatedSelected.scoreColumn = null;
												updatedSelected.assessorFilter = [];
											}
											onItemUpdate(updatedSelected);
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
									if (e.value !== selectedItem.assessorColumn?.id) {
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
									}
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
								isLoading={columnsLoading}
								isMulti={true}
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
									if (e.value !== selectedItem.processColumn?.id) {
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
									}
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
							<label>Max level:</label>
							<Field
								name='levelLimit'
								options={[
									{ label: "1", value: 1 },
									{ label: "2", value: 2 },
									{ label: "3", value: 3 },
									{ label: "4", value: 4 },
									{ label: "5", value: 5 },
								]}
								component={FormSelect}
								onSelect={(e) => {
									if (e.value !== selectedItem.levelLimit) {
										let updatedSelected = selectedItem;
										updatedSelected.levelLimit = e.value;
										onItemUpdate(updatedSelected);
									}
								}}
								isMulti={false}
							/>

							<label>Specific level:</label>
							<Field
								name='specificLevel'
								options={[
									{ label: "None", value: null },
									{ label: "1", value: 1 },
									{ label: "2", value: 2 },
									{ label: "3", value: 3 },
									{ label: "4", value: 4 },
									{ label: "5", value: 5 },
								]}
								component={FormSelect}
								placeholder={"Chose level"}
								onSelect={(e) => {
									if (e.value !== selectedItem.specificLevel) {
										let updatedSelected = selectedItem;
										updatedSelected.specificLevel = e.value;
										onItemUpdate(updatedSelected);
									}
								}}
								isMulti={false}
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
									if (e.value !== selectedItem.criterionColumn?.id) {
										let updatedSelected = selectedItem;
										if (e.value !== null) {
											updatedSelected.criterionColumn = {
												id: e.value,
												columnName: e.label,
											};
										} else {
											updatedSelected.criterionColumn = null;
										}
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
									if (e.value !== selectedItem.scoreColumn?.id) {
										let updatedSelected = selectedItem;
										if (e.value !== null) {
											updatedSelected.scoreColumn = {
												id: e.value,
												columnName: e.label,
											};
										} else {
											updatedSelected.scoreColumn = null;
										}
									}
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							{selectedItem.assessorFilter.length !== 1 && (
								<>
									<label className='flex items-center pt-1 text-sm'>
										Aggregate scores
										<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
									</label>
									<Field
										name='aggregateScoresFunction'
										options={[
											{ value: "MIN", label: "MIN" },
											{ value: "MAX", label: "MAX" },
											{ value: "AVG", label: "AVG" },
										]}
										component={FormSelect}
										onSelect={(e) => {
											let updatedSelected = selectedItem;
											updatedSelected.aggregateScoresFunction = e.value;
											onItemUpdate(updatedSelected);
										}}
										isMulti={false}
									/>
								</>
							)}
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default CapabilityTableSettigs;
