import { useMemo, useState } from "react";

import Table from "../UI/Table/Table";
import TableMenuButton from "../UI/Table/TableMenuButton";
import TableMenuItem from "../UI/Table/TableMenuItem";
import AdminUserForm from "./AdminUserForm";
import MyDialog from "../UI/Dialog/MyDialog";
import Button from "../UI/Button";
import { useAxios } from "../../helpers/AxiosHelper";
import ConfirmDialog from "../UI/Dialog/ConfirmDialog";

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

const AdminUser = () => {
	const [{ data, loading, error }, refetch] = useAxios("/admin/getAllUsers", {
		useCache: false,
	});

	//Delete
	const [{ deleteData, deleteLoading, deleteError }, executeDelete] = useAxios(
		{
			url: "/user/delete",
			method: "POST",
		},
		{ manual: true }
	);
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
								key='2'
								id='userEditButton'
								onClickAction={(e) => {
									handleActions(e);
									setSelectedUser(row.original);
								}}
							>
								Edit
							</TableMenuItem>
							<TableMenuItem
								key='3'
								id='userDeleteButton'
								addClasses='text-red-800'
								onClickAction={(e) => {
									handleActions(e);
									setSelectedUser(row.original);
								}}
							>
								Delete
							</TableMenuItem>
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
		if (userData !== null && userData !== undefined) {
			userData.forEach((user) => userArray.push(new User(user)));
		}
		return userArray;
	};

	const renderForms = (action) => {
		switch (action) {
			case ACTIONS.EDIT:
				return (
					<MyDialog
						title='Edit user'
						isOpen={isOpen}
						onClose={() => setShowForm(false)}
					>
						<AdminUserForm
							data={selectedUser}
							onCancel={formCancelHandler}
							onSuccess={refetch}
						></AdminUserForm>
					</MyDialog>
				);
			case ACTIONS.REMOVE:
				return (
					<ConfirmDialog
						title={`Do you really want to remove user ${selectedUser.username}?`}
						description={
							"This action will remove all sources, templates and reports asociated with this user."
						}
						isOpen={showForm}
						onClose={() => setShowForm(false)}
						onOk={userDeleteHandler}
						onCancel={() => setShowForm(false)}
					></ConfirmDialog>
				);
			default:
				return <>NIC</>;
		}
	};

	const formCancelHandler = () => {
		setShowForm(false);
	};

	const userDeleteHandler = () => {
		executeDelete({
			params: {
				id: selectedUser.id,
			},
		}).then((e) => {
			console.log(e);
			setShowForm(false);
			refetch();
		});
	};

	return (
		<div className='flex items-start flex-grow px-10 py-10 min-w-min'>
			<Table
				columns={columns}
				data={parseUserData(data)}
				isLoading={loading}
				initSortColumn={"id"}
			/>
			{showForm && renderForms(action)}
		</div>
	);
};

export default AdminUser;
