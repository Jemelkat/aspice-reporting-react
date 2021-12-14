import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAxios } from "../../../helpers/AxiosHelper";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import Title from "../../UI/Title";
import { useRouteMatch } from "react-router";
import TableMenuItem from "../../UI/Table/TableMenuItem";
import TableMenuButton from "../../UI/Table/TableMenuButton";

class TemplateObject {
	constructor(data) {
		this.id = data.templateId;
		this.templateName = data.templateName;
		this.templateCreated = data.templateCreated;
		this.templateShared = data.templateShared;
	}
}

const TemplateTable = (props) => {
	const { url } = useRouteMatch();
	const [{ data, loading, error }, refetch] = useAxios("/template/getAll", {
		useCache: false,
	});

	const [selectedRow, setSelectedRow] = useState(null);

	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "Template name",
				accessor: "templateName",
			},
			{
				Header: "Created at",
				accessor: "templateCreated",
			},
			{
				Header: "Shared with group",
				accessor: "shared",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => (
					<TableMenuButton buttonText='Actions'>
						<Link
							to={`${url}/create`}
							onClick={() => props.onModeChange("edit", row.original.id)}
						>
							<TableMenuItem key='1' itemText='Edit'>
								Edit
							</TableMenuItem>
						</Link>
						<TableMenuItem
							key='2'
							id='userDeleteButton'
							addClasses='text-red-800'
							onClickAction={(e) => {
								setSelectedRow(row.original);
							}}
							itemText='Delete'
						>
							Delete
						</TableMenuItem>
					</TableMenuButton>
				),
			},
		],
		[]
	);

	const parseData = (data) => {
		let objectArray = [];
		if (data)
			data.forEach((item) => objectArray.push(new TemplateObject(item)));
		return objectArray;
	};

	return (
		<>
			<Title text='Templates'></Title>
			<div className='flex justify-end px-2 py-4'>
				<Link to={`${url}/create`}>
					<Button
						className='mr-2'
						onClick={() => props.onModeChange("create", null)}
						dark={true}
					>
						Create new template
					</Button>
				</Link>
				<Button onClick={refetch} dark={true}>
					Refresh data
				</Button>
			</div>
			<div className='flex items-start flex-grow px-2 py-2 min-w-min'>
				<Table
					columns={columns}
					data={parseData(data)}
					isLoading={loading}
					initSortColumn={"id"}
				/>
			</div>
		</>
	);
};

export default TemplateTable;
