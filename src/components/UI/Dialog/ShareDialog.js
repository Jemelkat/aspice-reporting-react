import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/solid";
import MyDialog from "./MyDialog";
import DualListBox from "react-dual-listbox";
import Button from "../Button";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../helpers/AxiosHelper";
import { useAlert } from "react-alert";
import Loader from "../Loader/Loader";

const ShareDialog = ({
	optionsUrl,
	shareUrl,
	showShareDialog,
	onClose,
	onSuccess,
	title,
	description,
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
				onSuccess();
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
			alert.error(
				error.response.data
					? error.response.data.message
					: "There was error getting groups."
			);
			throw error;
		}
	};

	const loadData = async () => {
		setLoading(true);
		let userGroups = [];
		let sourceGroups = [];
		try {
			sourceGroups = await loadSourceGroups();
			userGroups = await loadUserGroups();
		} catch (error) {
			onClose();
			throw error;
		}

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
			title={title}
			description={description}
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
