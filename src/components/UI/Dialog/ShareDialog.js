import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/solid";
import MyListBox from "../ListBox/MyListBox";
import MyDialog from "./MyDialog";
import DualListBox from "react-dual-listbox";
import Button from "../Button";
import { useCallback, useEffect, useState } from "react";
import { axiosInstance, useAxios } from "../../../helpers/AxiosHelper";
import { useAlert } from "react-alert";
import Loader from "../Loader/Loader";

const ShareDialog = ({
	optionsUrl,
	shareUrl,
	selectedRow,
	showShareDialog,
	onClose,
}) => {
	const [selected, setSelected] = useState([]);
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(true);
	const alert = useAlert();

	//Set new selected items on change
	const changeHandler = (selected) => {
		setSelected(selected);
	};

	//Share data with selected groups
	const shareHandler = (selected) => {
		setLoading(true);
		axiosInstance
			.post(shareUrl, selected)
			.then((response) => {
				alert.info(response.data.message);
				onClose();
			})
			.catch((error) => {
				setLoading(false);
				alert.info(error.data.message);
			});
	};

	//Parse group array to {value: name:} object
	const parseData = (data) => {
		let objectArray = [];
		if (data)
			data.forEach((item) =>
				objectArray.push({ value: item.id, label: item.groupName })
			);
		return objectArray;
	};

	//Get all shareable groups for current used
	const loadUserGroups = async () => {
		try {
			const response = await axiosInstance.get("user/groups");
			return response.data;
		} catch (error) {
			alert.error("There was error getting groups.");
			throw error;
		}
	};

	//Get all shared groups for source
	const loadSourceGroups = async () => {
		try {
			const response = await axiosInstance.get(optionsUrl);
			return response.data;
		} catch (error) {
			alert.error("There was error getting groups.");
			throw error;
		}
	};

	const loadData = async () => {
		setLoading(true);
		let userGroups = [];
		let sourceGroups = [];
		try {
			userGroups = await loadUserGroups();
			sourceGroups = await loadSourceGroups();
		} catch (error) {
			debugger;
			onClose();
			throw error;
		}

		debugger;
		//Get all posible options - sorted by id
		let ids = new Set(userGroups.map((userGroup) => userGroup.id));
		let optionsMerged = [
			...userGroups,
			...sourceGroups.filter((sourceGroup) => !ids.has(sourceGroup.id)),
		].sort((a, b) =>
			a.groupName.toLowerCase().localeCompare(b.groupName.toLowerCase())
		);

		//Set right selected
		setSelected(sourceGroups.map((x) => x.id));
		//Set left selectable
		setOptions(parseData(optionsMerged));

		setLoading(false);
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<MyDialog
			className='w-36r'
			title={`Sharing source ${selectedRow ? selectedRow.sourceName : ""}`}
			isOpen={showShareDialog}
			onClose={onClose}
		>
			{loading ? (
				<div className='h-56'>
					<Loader fullscreen={false} dark={false}></Loader>
				</div>
			) : (
				<>
					<DualListBox
						canFilter
						options={options}
						selected={selected}
						onChange={changeHandler}
						icons={{
							moveLeft: <ChevronLeftIcon className='w-4 h-4'></ChevronLeftIcon>,
							moveAllLeft: [
								<ChevronDoubleLeftIcon
									key={1}
									className='w-4 h-4'
								></ChevronDoubleLeftIcon>,
							],
							moveRight: (
								<ChevronRightIcon className='w-4 h-4'></ChevronRightIcon>
							),
							moveAllRight: [
								<ChevronDoubleRightIcon
									key={2}
									className='w-4 h-4'
								></ChevronDoubleRightIcon>,
							],
						}}
					/>
					<div className='flex flex-row justify-center pt-4 space-x-4'>
						<Button onClick={() => shareHandler(selected)} dark={true}>
							Save
						</Button>
						<Button onClick={() => onClose()}>Cancel</Button>
					</div>
				</>
			)}
		</MyDialog>
	);
};

export default ShareDialog;
