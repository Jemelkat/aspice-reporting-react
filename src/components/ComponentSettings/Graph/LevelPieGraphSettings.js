import { Field, Form, Formik } from "formik";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../../ui/Form/FormSelect";
import { useEffect, useState } from "react";
import SourceColumnService from "../../../services/SourceColumnService";
import { InformationCircleIcon } from "@heroicons/react/outline";
import HorizontalLine from "../../../ui/HorizontalLine";
import { useAlert } from "react-alert";
import FormInput from "../../../ui/Form/FormInput";
import DataService from "../../../services/DataService";

const LevelPieGraphSettings = ({ page = 0, selectedItem, onItemUpdate }) => {
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
			//Change selected coluns to NONE on source change
			updatedSelected.processColumn = null;
			updatedSelected.assessorColumn = null;
			updatedSelected.levelColumn = null;
			updatedSelected.attributeColumn = null;
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
			const sourceId = source.id;
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await SourceColumnService.getColumnsForSource(
					sourceId
				);
				setColumnsData(DataService.parseColumnsSelectData(response.data));
				setColumnsLoading(false);
			} catch (e) {
				setColumnsLoading(false);
				setColumnsError(true);
				alert.error("Error getting columns for selected source.");
			}
			//Get filter values for assessor
			if (selectedItem.assessorColumn?.id) {
				getAssessorFilterData(sourceId, selectedItem.assessorColumn.id);
			}
		}
	};

	//Gets distinct values from assessor column
	const getAssessorFilterData = async (sourceId, columnId) => {
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
			const newFilters = selectedItem.assessorFilter.filter((filter) =>
				response.data.includes(filter)
			);
			let updatedSelected = selectedItem;
			selectedItem.assessorFilter = newFilters;
			onItemUpdate(updatedSelected, page);
			setAssessorFilter({
				data: newData,
				loading: false,
				error: false,
			});
		} catch (e) {
			if (e.response?.data && e.response.data?.message) {
				alert.error(e.response.data.message);
			} else {
				alert.error("Error getting assessor filter values.");
			}
			setAssessorFilter({
				data: [],
				loading: false,
				error: true,
			});
		}
	};

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				title: selectedItem.title,
				sourceFormId: selectedItem.source?.id,
				assessorColumn: selectedItem.assessorColumn?.id,
				assessorFilter: selectedItem.assessorFilter,
				processColumn: selectedItem.processColumn?.id,
				criterionColumn: selectedItem.criterionColumn?.id,
				attributeColumn: selectedItem.attributeColumn?.id,
				scoreColumn: selectedItem.scoreColumn?.id,
				aggregateScoresFunction: selectedItem.aggregateScoresFunction,
				aggregateLevels: selectedItem.aggregateLevels,
			}}
		>
			{({ values, handleChange }) => (
				<Form className='flex flex-col'>
					<div className='flex flex-col justify-center'>
						<div className='flex flex-col justify-center pl-4 pr-4 mt-2'>
							<label className='mt-2 font-medium'>Title:</label>
							<Field
								style={{ minHeight: "2rem" }}
								as='textarea'
								name='title'
								className='border-2 border-gray-300'
								onChange={(e) => {
									const newSelected = {
										...selectedItem,
										title: e.target.value,
									};
									onItemUpdate(newSelected, page);
								}}
							/>
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
												updatedSelected.attributeColumn = null;
												updatedSelected.criterionColumn = null;
												updatedSelected.scoreColumn = null;
												updatedSelected.assessorFilter = [];
											}
										}
										onItemUpdate(updatedSelected, page);
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
									onItemUpdate(updatedSelected, page);
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
										: columnsData.length > 0
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
										: columnsData.length > 0
										? "Select column"
										: "No columns"
								}
								onSelect={(e) => {
									if (e.value !== selectedItem.attributeColumn?.id) {
										let updatedSelected = selectedItem;
										if (e.value !== null) {
											updatedSelected.attributeColumn = {
												id: e.value,
												columnName: e.label,
											};
										} else {
											updatedSelected.attributeColumn = null;
										}
										onItemUpdate(updatedSelected, page);
									}
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
							<HorizontalLine />
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
							<label className='flex items-center pt-1 text-sm'>
								Aggregate scores
								<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
							</label>
							<Field
								name='aggregateScoresFunction'
								options={
									selectedItem.aggregateLevels
										? [
												{ value: "MIN", label: "MIN" },
												{ value: "MAX", label: "MAX" },
										  ]
										: [
												{ value: "MIN", label: "MIN" },
												{ value: "MAX", label: "MAX" },
												{ value: "AVG", label: "AVG" },
										  ]
								}
								component={FormSelect}
								onSelect={(e) => {
									let updatedSelected = selectedItem;
									updatedSelected.aggregateScoresFunction = e.value;
									onItemUpdate(updatedSelected, page);
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
												updatedSelected.aggregateScoresFunction = "MAX";
											}
										}
										onItemUpdate(updatedSelected, page);
									}}
								/>
								<div className='flex items-center justify-center'>
									<label className='pl-1'>Aggregate by levels </label>
									<InformationCircleIcon className='w-4 h-4 ml-1 text-gray-600'></InformationCircleIcon>
								</div>
							</div>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default LevelPieGraphSettings;
