import { useEffect, useMemo, useState } from "react";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import useAxios from "axios-hooks";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import TableMenuItem from "../../UI/Table/TableMenuItem";
import MyDialog from "../../UI/Dialog/MyDialog";

const API_URL = "http://localhost:8080/group/getAll";

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
	const [{ data, loading, error }, refetch] = useAxios(API_URL);
	const [isOpen, setIsOpen] = useState(false);
	const [action, setAction] = useState(ACTIONS.NONE);

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
				Cell: ({ cell }) => (
					<TableMenuButton buttonText='Action'>
						<TableMenuItem
							key='1'
							id='addUserToGroupButton'
							onClickAction={handleActions}
							itemText='Add to group'
						></TableMenuItem>
						<TableMenuItem
							key='2'
							id='userEditButton'
							onClickAction={handleActions}
							itemText='Edit'
						></TableMenuItem>
						<TableMenuItem
							key='3'
							id='userDeleteButton'
							addClasses='text-red-800'
							onClickAction={handleActions}
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
		debugger;
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
	};

	//Renders different forms in modal
	const renderModalHandler = () => {
		debugger;
		switch (action) {
			case ACTIONS.EDIT:
				return <form>EDIT FORM</form>;
			case ACTIONS.ADD:
				return <form>ADD FORM</form>;
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
			<MyDialog isOpen={isOpen} setIsOpen={setIsOpen}>
				{isOpen ? renderModalHandler() : <></>}
			</MyDialog>
			<MyDialog isOpen={isOpen} setIsOpen={setIsOpen}>
				{isOpen ? renderModalHandler() : <></>}
			</MyDialog>
		</div>
	);
};

export default AdminPanelGroups;
