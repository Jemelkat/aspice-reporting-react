import MyDialog from "../../ui/Dialog/MyDialog";
import SourceService from "../../services/SourceService";
import { useEffect, useState } from "react";
import Loader from "../../ui/Loader/Loader";
import { useAlert } from "react-alert";
import RangeExtendedForm from "./RangeExtendedForm";
import { Tab } from "@headlessui/react";
import RangeSimpleForm from "./RangeSimpleForm";

const RatingDialog = ({ showRatingDialog, selectedRow, onClose, ...props }) => {
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);
	const [selectedTab, setSelectedTab] = useState(0);

	const alert = useAlert();

	const getRanges = (sourceId) => {
		SourceService.getScoreRanges(sourceId)
			.then((response) => {
				setData(response.data);
				if (response.data.mode === "EXTENDED") {
					setSelectedTab(1);
				}
				setLoading(false);
			})
			.catch((e) => {
				if (e.response?.data && e.response.data?.message) {
					alert.error(e.response.data.message);
				} else {
					alert.error("There was error getting ranges!");
				}
				setLoading(false);
				onClose();
			});
	};

	useEffect(() => {
		getRanges(selectedRow.id);
	}, [selectedRow.id]);

	return (
		<MyDialog
			title={"Define " + selectedRow.sourceName + " score ranges"}
			description={
				"Define custom ranges in %, which will be used to compute process level and scores achieved."
			}
			isOpen={showRatingDialog}
			onClose={onClose}
			className={"w-96"}
		>
			{loading ? (
				<div className='h-96'>
					<Loader size='small'>Loading ranges...</Loader>
				</div>
			) : (
				<>
					<Tab.Group
						defaultIndex={selectedTab}
						onChange={setSelectedTab}
						as={"div"}
					>
						<Tab.List className='flex justify-center pb-4'>
							<Tab
								className={({ selected }) => {
									return (
										"p-2 w-20 rounded-tl-lg rounded-bl-lg border border-gray-800 text-sm " +
										(selected
											? "bg-gray-800 text-white"
											: "bg-white text-gray-800")
									);
								}}
							>
								Simple
							</Tab>
							<Tab
								className={({ selected }) => {
									return (
										"p-2 w-20 rounded-tr-lg rounded-br-lg border border-gray-800 text-sm " +
										(selected
											? "bg-gray-800 text-white"
											: "bg-white text-gray-800")
									);
								}}
							>
								Extended
							</Tab>
						</Tab.List>
						<Tab.Panels>
							<Tab.Panel>
								<RangeSimpleForm
									data={data}
									selectedRow={selectedRow}
									onClose={onClose}
									setLoading={setLoading}
								></RangeSimpleForm>
							</Tab.Panel>
							<Tab.Panel>
								<RangeExtendedForm
									data={data}
									selectedRow={selectedRow}
									onClose={onClose}
									setLoading={setLoading}
								></RangeExtendedForm>
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</>
			)}
		</MyDialog>
	);
};

export default RatingDialog;
