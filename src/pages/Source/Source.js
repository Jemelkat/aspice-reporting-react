import { useState } from "react";
import { useAxios } from "../../helpers/AxiosHelper";
import SourceTable from "../../components/Source/SourceTable";
import SourceUpload from "../../components/Source/SourceUpload";
import { useAlert } from "react-alert";

const Source = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [{ data, loading, error }, refetch] = useAxios("/source/getAll");
	const alert = useAlert();

	if (error) {
		alert.warn("Error getting source data");
	}

	return (
		<>
			<SourceTable
				data={data}
				onAddSource={setIsOpen}
				loading={loading}
				onRefetch={refetch}
			></SourceTable>
			<SourceUpload
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				onRefetch={() => refetch()}
			></SourceUpload>
		</>
	);
};

export default Source;
