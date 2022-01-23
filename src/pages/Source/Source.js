import { useState } from "react";
import { useAxios } from "../../helpers/AxiosHelper";
import SourceTable from "../../components/Source/SourceTable";
import SourceUpload from "../../components/Source/SourceUpload";

const Source = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [{ data, loading, error }, refetch] = useAxios("/source/getAll");

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
