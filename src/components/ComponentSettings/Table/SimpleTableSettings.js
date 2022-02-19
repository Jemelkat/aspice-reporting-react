import { useAlert } from "react-alert";
import Button from "../../UI/Button";
import CanvasPanelDisclosure from "../../UI/Canvas/CanvasPanelDisclosure";
import FormInput from "../../UI/Form/FormInput";
import TableColumnSelect from "./TableColumnSelect";

const SimpleTableSettings = ({
	selectedItem,
	onItemUpdate,
	handleChange,
	columnsData,
	columnsLoading,
	columnsError,
}) => {
	const alert = useAlert();
	//Adds new column to table
	const addColumnHandler = () => {
		let columns = selectedItem.tableColumns ? selectedItem.tableColumns : [];
		columns.push({
			id:
				columns.length === 0
					? 0
					: Math.max.apply(
							null,
							columns.map((item) => item.id)
					  ) + 1,
			sourceColumn: null,
			width: 50,
		});
		let newSelected = selectedItem;
		selectedItem.tableColumns = [...columns];
		onItemUpdate(newSelected);
	};

	//Removes existing column from table
	const removeColumnHandler = (id) => {
		let newSelected = selectedItem;
		newSelected.tableColumns.splice(id, 1);
		onItemUpdate(newSelected);
	};

	return (
		<>
			<div className='mt-4'>
				{selectedItem.tableColumns && selectedItem.tableColumns.length > 0 ? (
					selectedItem.tableColumns.map((column, index) => {
						return (
							<CanvasPanelDisclosure
								key={index}
								name={`Column ${column.name ? column.name : index}`}
							>
								<div className='flex flex-col justify-center pl-4 pr-4'>
									{selectedItem.source && (
										<div key={index}>
											<label className='mt-2'>Column:</label>
											<TableColumnSelect
												name={"columns"}
												selectedItem={selectedItem}
												index={index}
												onItemUpdate={onItemUpdate}
												columnsData={columnsData}
												columnsLoading={columnsLoading}
												columnsError={columnsError}
											></TableColumnSelect>
											<FormInput
												label='Column width'
												name={`columns.${index}.width`}
												type='number'
												onChange={(e) => {
													handleChange(e);
													if (e.target.value > 0) {
														let newSelected = selectedItem;
														newSelected.tableColumns[index].width =
															e.target.value;
														onItemUpdate(newSelected);
													}
												}}
											/>
										</div>
									)}
									<Button
										className='mt-2'
										onClick={() => {
											removeColumnHandler(index);
										}}
									>
										Remove column
									</Button>
								</div>
							</CanvasPanelDisclosure>
						);
					})
				) : (
					<div className='pt-2 text-center'>This table has no columns yet.</div>
				)}
				<div className='flex flex-col justify-center pl-4 pr-4'>
					<Button
						className='mt-4'
						onClick={() => {
							addColumnHandler();
						}}
					>
						Add new column
					</Button>
				</div>
			</div>
		</>
	);
};

export default SimpleTableSettings;
