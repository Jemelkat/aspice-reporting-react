import { useDropzone } from "react-dropzone";
import MyDialog from "../UI/Dialog/MyDialog";

const SourceUpload = ({ isOpen, onOpenChange, onUpload }) => {
	const onDrop = (acceptedFiles) => {
		onUpload(acceptedFiles);
	};

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		onDrop,
		multiple: false,
	});

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
