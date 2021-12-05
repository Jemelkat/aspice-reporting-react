import { useMemo, useState } from "react";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import useAxios from "axios-hooks";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import TableMenuItem from "../../UI/Table/TableMenuItem";
import MyDialog from "../../UI/Dialog/MyDialog";
import FormGroups from "./FormGroups";

const API_URL = "http://localhost:8080";

class Group {
	constructor(groupData) {
		this.id = groupData.id;
		this.name = groupData.groupName;
		this.users = groupData.users;
		this.numberOfUsers = groupData.users.length;
	}
}

const ACTIONS = {
	EDIT: "edit",
	REMOVE: "delete",
	NONE: "none",
};

const AdminPanelGroups = () => {
	//Fetch group data
	const [{ data, loading, error }, refetch] = useAxios(
		API_URL + "/admin/getAllGroups",
		{
			useCache: false,
		}
	);
	//Delete
	const [{ deleteData, deleteLoading, deleteError }, executeDelete] = useAxios(
		{
			url: API_URL + "/group/delete",
			method: "POST",
		},
		{ manual: true }
	);

	const [action, setAction] = useState(ACTIONS.NONE);
	const [showForm, setShowForm] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState({});

	//Create columns
	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "Group name",
				accessor: "name",
			},
			{
				Header: "Number of users",
				accessor: "numberOfUsers",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<TableMenuButton buttonText='Action'>
						<TableMenuItem
							key='2'
							id='userEditButton'
							onClickAction={(e) => {
								handleActions(e);
								setSelectedGroup(row.original);
							}}
							itemText='Edit'
						></TableMenuItem>
						<TableMenuItem
							key='3'
							id='userDeleteButton'
							addClasses='text-red-800'
							onClickAction={(e) => {
								handleActions(e);
								setSelectedGroup(row.original);
							}}
							itemText='Delete'
						></TableMenuItem>
					</TableMenuButton>
				),
			},
		],
		[]
	);

	//Format loaded data for table
	const parseGroupData = (groupData) => {
		let groupArray = [];
		if (groupData)
			groupData.forEach((group) => groupArray.push(new Group(group)));
		return groupArray;
	};

	//Check what kind of button was clicked
	const handleActions = (e) => {
		e.preventDefault();
		switch (e.target.id) {
			case "addUserToGroupButton":
				setAction(ACTIONS.ADD);
				break;
			case "userDeleteButton":
				setAction(ACTIONS.REMOVE);
				break;
			case "userEditButton":
				setAction(ACTIONS.EDIT);
				break;
			default:
				break;
		}
		setShowForm(true);
	};

	//Render form based on action
	const renderForms = (action) => {
		switch (action) {
			case ACTIONS.EDIT:
				return (
					<MyDialog isOpen={showForm} setIsOpen={setShowForm}>
						<FormGroups
							data={selectedGroup}
							onCancel={formCancelHandler}
						></FormGroups>
					</MyDialog>
				);
			case ACTIONS.REMOVE:
				return (
					<MyDialog
						title='Do you want to delete group?'
						isOpen={showForm}
						setIsOpen={setShowForm}
					>
						<div className='flex flex-row items-center justify-evenly'>
							<Button text='Yes' onClick={() => groupDeleteHandler()}></Button>
							<Button text='Cancel' onClick={() => setShowForm(false)}></Button>
						</div>
					</MyDialog>
				);
			default:
				return <></>;
		}
	};

	//Hide form handler
	const formCancelHandler = () => {
		setShowForm(false);
	};

	const groupDeleteHandler = () => {
		debugger;
		executeDelete({
			params: {
				id: selectedGroup.id,
			},
		}).then(refetch());
	};

	return (
		<div className='flex-grow py-10 px-10 min-w-min flex items-start'>
			<Table
				columns={columns}
				data={parseGroupData(data)}
				isLoading={loading}
			/>
			{/*Render forms if they need to be shown */}
			{showForm && renderForms(action)}
		</div>
	);
};

export default AdminPanelGroups;
