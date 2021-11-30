import { useEffect, useMemo, useState } from "react";

import Table from "../../UI/Table/Table";
import useAxios from "axios-hooks";
import MyDialog from "../../UI/Dialog/MyDialog";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import TableMenuItem from "../../UI/Table/TableMenuItem";

const API_URL = "http://localhost:8080/admin/getAllUsers";

class User {
	constructor(userData) {
		this.id = userData.id;
		this.username = userData.username;
		this.email = userData.email;
		this.roles = userData.roles
			.map((role) => {
				return role["name"];
			})
			.join(", ");
	}
}

const ACTIONS = {
	EDIT: "edit",
	ADD: "add",
	REMOVE: "delete",
	NONE: "none",
};

const AdminPanelUsers = () => {
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
				Header: "Username",
				accessor: "username",
			},
			{
				Header: "Email",
				accessor: "email",
			},
			{
				Header: "Roles",
				accessor: "roles",
			},
			{
				Header: "Actions",
				Cell: ({ cell }) => (
					<TableMenuButton buttonText='Actions'>
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

	//Check what kind of button was clicked to create correct modal form
	const handleActions = (e) => {
		e.preventDefault();
		console.log(e.target.id);
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

	const parseUserData = (userData) => {
		let userArray = [];
		if (userData) userData.forEach((user) => userArray.push(new User(user)));
		return userArray;
	};

	//Renders different forms in modal
	const renderModalHandler = () => {
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
			<Table columns={columns} data={parseUserData(data)} isLoading={loading} />
		</div>
	);
};

export default AdminPanelUsers;
