import { useState, useCallback, useMemo } from "react";
import { uploadSource } from "../../helpers/UploadHelper";
import { useAxios } from "../../helpers/AxiosHelper";
import SourceTable from "../../components/Source/SourceTable";
import SourceUpload from "../../components/Source/SourceUpload";
import { useAlert } from "react-alert";

const Source = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [progress, setProgress] = useState(0);
	const [{ data, loading, error }, refetch] = useAxios("/source/getAll");
	const alert = useAlert();

	const onUploadHandler = useCallback((acceptedFiles) => {
		upload(acceptedFiles);
	}, []);

	const upload = (acceptedFiles) => {
		setProgress(0);

		uploadSource(acceptedFiles, (event) => {
			//TODO: ADD LOADER
			setProgress(Math.round((100 * event.loaded) / event.total));
			console.log(Math.round((100 * event.loaded) / event.total));
		})
			.then(() => {
				//Get all sources after upload
				refetch();
				//Close dropwindow
				setIsOpen(false);
				alert.info("New source added.");
			})
			.catch((error) => {
				alert.error(error.data.message);
			});
	};

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
				onUpload={onUploadHandler}
			></SourceUpload>
		</>
	);
};

export default Source;
