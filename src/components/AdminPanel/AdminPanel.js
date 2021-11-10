import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import SidebarLinks from "../Sidebar/SidebarLinks";
import CustomTable from "../UI/Table/CustomTable";
import TableBody from "../UI/Table/TableBody";
import TableHeader from "../UI/Table/TableHeader";
import TableHeaderItem from "../UI/Table/TableHeaderItem";
import TableRow from "../UI/Table/TableRow";
import TableRowItem from "../UI/Table/TableRowItem";
import { getAuthHeaderToken } from "../../helpers/AuthHelper";
import axios from "axios";
import { Tab } from "@headlessui/react";

const AdminPanel = () => {
	const head = ["User", "Role", "Test", "Test"];
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	let headers = head.map((header, key) => {
		return <TableHeaderItem name={header} key={key}></TableHeaderItem>;
	});

	useEffect(() => {
		setIsLoading(true);
		axios
			.get("http://localhost:8080/admin/getAllUsers", {
				headers: getAuthHeaderToken(),
			})
			.then((response) => {
				setUserData(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				//TODO add error handling
				console.log(error);
			});
	}, []);

	const userRolesParser = (roles) => {
		return roles.map((role) => {
			return role.name + ", ";
		});
	};

	return (
		<div className='flex'>
			<Sidebar>
				<SidebarLinks></SidebarLinks>
			</Sidebar>
			<CustomTable tableName='Users' headers={head}>
				<TableHeader>{headers}</TableHeader>
				<TableBody>
					{!isLoading ? (
						userData.map((user) => {
							return (
								<TableRow key={user.id}>
									<TableRowItem data={user.usernamed}></TableRowItem>
									<TableRowItem data={user.email}></TableRowItem>
									<TableRowItem
										data={userRolesParser(user.roles)}
									></TableRowItem>
									<TableRowItem>
										<span className='relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
											<span
												aria-hidden='true'
												className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
											></span>
											<span className='relative'>active</span>
										</span>
									</TableRowItem>
								</TableRow>
							);
						})
					) : (
						<></>
					)}
				</TableBody>
			</CustomTable>
		</div>
	);
};

export default AdminPanel;
