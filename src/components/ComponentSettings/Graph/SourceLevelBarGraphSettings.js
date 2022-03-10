import { Field, Form, Formik } from "formik";
import { useAxios } from "../../../helpers/AxiosHelper";
import FormSelect from "../../../ui/Form/FormSelect";
import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useAlert } from "react-alert";
import HorizontalLine from "../../../ui/HorizontalLine";
import SourceColumnService from "../../../services/SourceColumnService";
import DataService from "../../../services/DataService";

const SourceLevelBarGraphSettings = ({ selectedItem, onItemUpdate }) => {
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
		debugger;
		selectedItem.sources.length > 0 &&
			getColumnsHandler(selectedItem.sources.map((s) => s.id));
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

	//Load new columns data on source change
	const getColumnsHandler = async (sourceId) => {
		debugger;
		setColumnsError(false);
		if (sourceId === null) {
			setColumnsData([]);
			setProcessFilter({ data: [], loading: false, error: false });
		} else {
			//Load new columns for source
			try {
				setColumnsLoading(true);
				const response = await SourceColumnService.getColumnsForSources(
					sourceId
				);
				setColumnsData(DataService.parseSimpleSelectData(response.data));
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
				sources: selectedItem?.sources.map((i) => i.id),
				assessorColumn: selectedItem.assessorColumn,
				processColumn: selectedItem.processColumn,
				attributeColumn: selectedItem.attributeColumn,
				scoreColumn: selectedItem.scoreColumn,
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
										const selectedArray = e.map((selected) => selected.value);
										getColumnsHandler(selectedArray);
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
							<HorizontalLine />
							<label className='font-medium'>Attribute column</label>
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
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default SourceLevelBarGraphSettings;
