import { useEffect, useMemo, useState } from "react";

import Table from "../../ui/Table/Table";
import TableMenuButton from "../../ui/Table/TableMenuButton";
import TableMenuItem from "../../ui/Table/TableMenuItem";
import AdminUserForm from "./AdminUserForm";
import MyDialog from "../../ui/Dialog/MyDialog";
import { useAxios } from "../../helpers/AxiosHelper";
import ConfirmDialog from "../../ui/Dialog/ConfirmDialog";
import { useAlert } from "react-alert";

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
	const [{ data, loading }, refetch] = useAxios("/admin/allUsers", {
		manual: true,
		useCache: false,
	});

	//Delete
	const [, executeDelete] = useAxios(
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
	const alert = useAlert();

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
							onSuccess={refetchHandler}
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
				return <></>;
		}
	};

	const formCancelHandler = () => {
		setShowForm(false);
	};

	const refetchHandler = () => {
		refetch().catch((e) => {
			alert.error("Error getting data.");
		});
	};

	const userDeleteHandler = () => {
		executeDelete({
			params: {
				id: selectedUser.id,
			},
		})
			.then((e) => {
				setShowForm(false);
				refetchHandler();
			})
			.catch((e) => {
				alert.error("Error deleting user.");
			});
	};

	useEffect(() => {
		refetchHandler();
	}, []);

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
