import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { getAuthHeaderToken } from "../../helpers/AuthHelper";
import Button from "../UI/Button";

import Table from "../UI/Table";

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

const AdminPanelUsers = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({
		userList: [],
	});
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
				Cell: ({ cell }) => <Button text='Actions'></Button>,
			},
		],
		[]
	);

	const parseUserData = (userData) => {
		let userArray = [];
		userData.map((user) => {
			userArray.push(new User(user));
		});
		return userArray;
	};

	const getUserData = () => {
		axios
			.get("http://localhost:8080/admin/getAllUsers", {
				headers: getAuthHeaderToken(),
			})
			.then((response) => {
				console.log(response.data);
				const userArray = parseUserData(response.data);
				setData(userArray);
				setIsLoading(false);
			})
			.catch((error) => {
				//TODO add error handling
				console.log(error);
			});
	};

	useEffect(() => {
		getUserData();
		return () => {
			setIsLoading(false);
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<p>Table loading...</p>
			) : (
				<Table columns={columns} data={data} />
			)}
		</>
	);
};

export default AdminPanelUsers;
