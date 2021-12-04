import { useMemo, useState } from "react";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import useAxios from "axios-hooks";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import TableMenuItem from "../../UI/Table/TableMenuItem";
import MyDialog from "../../UI/Dialog/MyDialog";
import FormGroups from "./FormGroups";

const API_URL = "http://localhost:8080/admin/getAllGroups";

class Group {
	constructor(groupData) {
		this.id = groupData.id;
		this.name = groupData.groupName;
		this.numberOfUsers = groupData.users.length;
	}
}

const ACTIONS = {
	EDIT: "edit",
	ADD: "add",
	REMOVE: "delete",
	NONE: "none",
};

const AdminPanelGroups = () => {
	const [{ data, loading, error }, refetch] = useAxios(API_URL, {
		useCache: false,
	});
	const [isOpen, setIsOpen] = useState(false);
	const [action, setAction] = useState(ACTIONS.NONE);
	const [showForm, setShowForm] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState({});

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
							key='1'
							id='addUserToGroupButton'
							onClickAction={(e) => {
								handleActions(e);
								setSelectedGroup(row.original);
							}}
							itemText='Add to group'
						></TableMenuItem>
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

	const parseGroupData = (groupData) => {
		let groupArray = [];
		if (groupData)
			groupData.forEach((group) => groupArray.push(new Group(group)));
		return groupArray;
	};

	//Check what kind of button was clicked to create correct modal form
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
		setIsOpen(true);
		setShowForm(true);
	};

	//Renders different forms in modal
	const renderModalHandler = () => {
		switch (action) {
			case ACTIONS.EDIT:
				return (
					<form>
						EDIT FORM
						<Button text='Save' onClick={() => setIsConfirmOpen(true)}></Button>
					</form>
				);
			case ACTIONS.ADD:
				return <form>ADD FORM</form>;
			case ACTIONS.REMOVE:
				return <form>DELETE FORM</form>;
			default:
				return <>NIC</>;
		}
	};

	const formCancelHandler = () => {
		setShowForm(false);
	};

	const renderForms = (action) => {
		switch (action) {
			case ACTIONS.EDIT:
				return (
					<MyDialog isOpen={isOpen} setIsOpen={setIsOpen}>
						<FormGroups
							data={selectedGroup}
							onCancel={formCancelHandler}
						></FormGroups>
					</MyDialog>
				);
			case ACTIONS.REMOVE:
				return <form>DELETE FORM</form>;
			default:
				return <>NIC</>;
		}
	};

	return (
		<div className='flex-grow py-10 px-10 min-w-min flex items-start'>
			<Table
				columns={columns}
				data={parseGroupData(data)}
				isLoading={loading}
			/>
			{/*<MyDialog isOpen={isOpen} setIsOpen={setIsOpen}>
				{isOpen ? renderModalHandler() : <></>}
				<MyDialog
					title='Do you want to save changes?'
					isOpen={isConfirmOpen}
					setIsOpen={setIsConfirmOpen}
				>
					<div className='flex flex-row items-center justify-evenly'>
						<Button text='Yes'></Button>
						<Button
							text='Cancel'
							onClick={() => setIsConfirmOpen(false)}
						></Button>
					</div>
				</MyDialog>
			</MyDialog>
*/}
			{showForm && renderForms(action)}
		</div>
	);
};

export default AdminPanelGroups;
