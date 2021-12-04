import { useMemo, useState } from "react";

import Table from "../../UI/Table/Table";
import useAxios from "axios-hooks";
import TableMenuButton from "../../UI/Table/TableMenuButton";
import TableMenuItem from "../../UI/Table/TableMenuItem";
import FormEditUser from "./FormEditUser";
import MyDialog from "../../UI/Dialog/MyDialog";

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
	REMOVE: "delete",
	NONE: "none",
};

const AdminPanelUsers = () => {
	const [{ data, loading, error }, refetch] = useAxios(API_URL, {
		useCache: false,
	});
	const [isOpen, setIsOpen] = useState(false);
	const [action, setAction] = useState(ACTIONS.NONE);
	const [showForm, setShowForm] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

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
				Cell: ({ row }) => {
					return (
						<TableMenuButton key='1' buttonText='Actions'>
							<TableMenuItem
								key='1'
								id='addUserToGroupButton'
								onClickAction={(e) => {
									handleActions(e);
									setSelectedUser(row.original);
								}}
								itemText='Add to group'
							></TableMenuItem>
							<TableMenuItem
								key='2'
								id='userEditButton'
								onClickAction={(e) => {
									handleActions(e);
									setSelectedUser(row.original);
								}}
								itemText='Edit'
							></TableMenuItem>
							<TableMenuItem
								key='3'
								id='userDeleteButton'
								addClasses='text-red-800'
								onClickAction={(e) => {
									handleActions(e);
									setSelectedUser(row.original);
								}}
								itemText='Delete'
							></TableMenuItem>
						</TableMenuButton>
					);
				},
			},
		],
		[]
	);

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

	const parseUserData = (userData) => {
		let userArray = [];
		if (userData) userData.forEach((user) => userArray.push(new User(user)));
		return userArray;
	};

	const renderForms = (action) => {
		switch (action) {
			case ACTIONS.EDIT:
				return (
					<MyDialog isOpen={isOpen} setIsOpen={setIsOpen}>
						<FormEditUser
							data={selectedUser}
							onCancel={formCancelHandler}
						></FormEditUser>
					</MyDialog>
				);
			case ACTIONS.REMOVE:
				return <form>DELETE FORM</form>;
			default:
				return <>NIC</>;
		}
	};

	const formCancelHandler = () => {
		setShowForm(false);
	};

	return (
		<div className='flex-grow py-10 px-10 min-w-min flex items-start'>
			<Table columns={columns} data={parseUserData(data)} isLoading={loading} />
			{showForm && renderForms(action)}
		</div>
	);
};

export default AdminPanelUsers;
