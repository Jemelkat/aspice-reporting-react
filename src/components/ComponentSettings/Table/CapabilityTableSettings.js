import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useAxios } from "../../../helpers/AxiosHelper";
import { allProcesses } from "../../../helpers/ProcessHelper";
import DataService from "../../../services/DataService";
import SourceColumnService from "../../../services/SourceColumnService";
import FormInput from "../../../ui/Form/FormInput";
import FormSelect from "../../../ui/Form/FormSelect";
import HorizontalLine from "../../../ui/HorizontalLine";
import * as Yup from "yup";

const CapabilityTableSettigs = ({ page = 0, selectedItem, onItemUpdate }) => {
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
			onItemUpdate(updatedSelected, page);
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
				alert.error("Error getting columns for selected sources.");
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
			validationSchema={Yup.object().shape({
				fontSize: Yup.number("Please enter valid number.")
					.moreThan(0, "Please enter number > 0.")
					.integer("Please enter valid number."),
				processWidth: Yup.number("Please enter valid number.")
					.moreThan(0, "Please enter number > 0.")
					.integer("Please enter valid number."),
				criterionWidth: Yup.number("Please enter valid number.")
					.moreThan(0, "Please enter number > 0.")
					.integer("Please enter valid number."),
			})}
		>
			{({ values, handleChange }) => (
				<Form className='flex flex-col'>
					<div className='flex flex-col justify-center'>
						<div className='flex flex-col justify-center pl-4 pr-4'>
							<label className='mt-2 font-medium'>Source</label>
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
											onItemUpdate(updatedSelected, page);
										}
									}
								}}
								isMulti={false}
								isLoading={sourcesLoading}
							/>
							<HorizontalLine />
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
										onItemUpdate(updatedSelected, page);
									}
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<label className='flex items-center pt-1 text-sm'>
								Optional filter by assessor
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
									onItemUpdate(updatedSelected, page);
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
										onItemUpdate(newSelected, page);
									}
								}}
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
										onItemUpdate(updatedSelected, page);
									}
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<label className='flex items-center pt-1 text-sm'>
								Optional filter by process
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
									onItemUpdate(updatedSelected, page);
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
										onItemUpdate(newSelected, page);
									}
								}}
							/>
							<HorizontalLine />
							<label className='font-medium'>Capability level</label>
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
									onItemUpdate(updatedSelected, page);
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							<label>Max level</label>
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
										onItemUpdate(updatedSelected, page);
									}
								}}
								isMulti={false}
							/>
							<label>Specific level</label>
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
										onItemUpdate(updatedSelected, page);
									}
								}}
								isMulti={false}
							/>
							<div className='mt-2 mb-2 border border-black border-opacity-50'></div>
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
										onItemUpdate(updatedSelected, page);
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
										onItemUpdate(newSelected, page);
									}
								}}
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
										onItemUpdate(updatedSelected, page);
									}
								}}
								isMulti={false}
								isLoading={columnsLoading}
							/>
							{selectedItem.assessorFilter.length !== 1 && (
								<>
									<label className='flex items-center pt-1 text-sm'>
										Aggregate scores
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
											onItemUpdate(updatedSelected, page);
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
