import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { getAuthHeaderToken } from "../../helpers/AuthHelper";
import Button from "../UI/Button";
import Table from "../UI/Table";

class Group {
	constructor(groupData) {
		this.id = groupData.id;
		this.name = groupData.groupName;
		this.numberOfUsers = groupData.users.length;
	}
}

const AdminPanelGroups = (props) => {
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
				Header: "Group name",
				accessor: "name",
			},
			{
				Header: "Number of users",
				accessor: "numberOfUsers",
			},
			{
				Header: "Actions",
				Cell: ({ cell }) => <Button text='Actions'></Button>,
			},
		],
		[]
	);

	const parseGroupData = (groupData) => {
		let groups = [];
		groupData.map((group) => {
			groups.push(new Group(group));
		});
		return groups;
	};

	const getUserData = () => {
		axios
			.get("http://localhost:8080/group/getAll", {
				headers: getAuthHeaderToken(),
			})
			.then((response) => {
				const userArray = parseGroupData(response.data);
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

export default AdminPanelGroups;
