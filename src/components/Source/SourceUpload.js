import { useCallback, useState } from "react";
import { useAlert } from "react-alert";
import { useDropzone } from "react-dropzone";
import { uploadSource } from "../../services/SourceService";
import MyDialog from "../UI/Dialog/MyDialog";

const SourceUpload = ({ isOpen, onOpenChange, onRefetch }) => {
	const [progress, setProgress] = useState(0);
	const onDrop = (acceptedFiles) => {
		onUploadHandler(acceptedFiles);
	};
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		onDrop,
		multiple: false,
	});
	const alert = useAlert();

	const onUploadHandler = useCallback((acceptedFiles) => {
		upload(acceptedFiles);
	}, []);

	const upload = (acceptedFiles) => {
		setProgress(0);

		uploadSource(acceptedFiles, (event) => {
			setProgress(Math.round((100 * event.loaded) / event.total));
			console.log(Math.round((100 * event.loaded) / event.total));
		})
			.then(() => {
				//Get all sources after upload
				onRefetch();
				//Close dropwindow
				onOpenChange(false);
				alert.info("New source added.");
			})
			.catch((error) => {
				debugger;
				alert.error(error.toJSON.messsage);
			});
	};

	return (
		<MyDialog
			isOpen={isOpen}
			onClose={() => onOpenChange(false)}
			title='Upload new source'
		>
			<div
				{...getRootProps({
					className:
						"dropzone cursor-pointer flex justify-center flex-col items-center bg-gray-800 bg-opacity-10 px-16 py-10 rounded rounded-xl border-dashed border-gray-800 border-2 border-opacity-70s",
				})}
			>
				<input {...getInputProps()} />
				<p>Drag 'n' drop file here,</p>
				<p>or click to select file</p>
			</div>
		</MyDialog>
	);
};

export default SourceUpload;
