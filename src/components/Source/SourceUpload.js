import {useCallback, useState} from "react";
import {useAlert} from "react-alert";
import {useDropzone} from "react-dropzone";
import SourceService, {uploadSource} from "../../services/SourceService";
import MyDialog from "../../ui/Dialog/MyDialog";
import Loader from "../../ui/Loader/Loader";

const SourceUpload = ({ isOpen, onOpenChange, onRefetch }) => {
	const [progress, setProgress] = useState(0);
	const [isUploading, setisUploading] = useState(false);
	const [isStoring, setIsStoring] = useState(false);
	const onDrop = (acceptedFiles) => {
		if (acceptedFiles.length === 1) {
			onUploadHandler(acceptedFiles);
		} else {
			alert.info("This file format is not supported.");
		}
	};
	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		multiple: false,
		accept: ".csv, .xlsx, .xls",
	});

	const alert = useAlert();

	const onUploadHandler = useCallback((acceptedFiles) => {
		upload(acceptedFiles);
	}, []);

	const upload = (acceptedFiles) => {
		setProgress(0);
		setisUploading(true);
		SourceService.uploadSource(acceptedFiles, (event) => {
			const newProgress = Math.round((100 * event.loaded) / event.total);
			setProgress(newProgress);
			if (newProgress === 100) {
				setisUploading(false);
				setIsStoring(true);
			}
		})
			.then(() => {
				setisUploading(false);
				setIsStoring(false);
				//Get all sources after upload
				onRefetch();
				//Close dropwindow
				onOpenChange(false);
				alert.info("New source added.");
			})
			.catch((e) => {
				setisUploading(false);
				setIsStoring(false);
				if (e.response.data && e.response.data.message) {
					alert.error(e.response.data.message);
				} else {
					alert.error("Error saving file.");
				}
			});
	};

	return (
		<MyDialog
			isOpen={isOpen}
			onClose={() => onOpenChange(false)}
			title='Upload new source'
			description='Suported file formats are .csv, .xls and .xlsx.'
		>
			<div
				className={`w-full flex items-center justify-center border-2 border-gray-800 border-dashed cursor-pointer h-36 bg-opacity-10 rounded-xl focus:border-dashed border-opacity-70s`}
			>
				{isUploading ? (
					<Loader size='small'>{`Uploading: ${progress}%`}</Loader>
				) : isStoring ? (
					<Loader size='small'>{`Storing file...`}</Loader>
				) : (
					<div
						{...getRootProps({
							className:
								"w-full h-full rounded-xl flex-1 flex flex-col items-center justify-center px-4 py-10",
						})}
					>
						<input {...getInputProps()} />
						<p>Drag 'n' drop file here,</p>
						<p>or click to select file</p>
					</div>
				)}
			</div>
		</MyDialog>
	);
};

export default SourceUpload;
