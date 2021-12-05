import { useState, useCallback, useMemo } from "react";
import Button from "../../UI/Button";
import Table from "../../UI/Table/Table";
import Title from "../../UI/Title";
import { uploadSource } from "../../../helpers/UploadHelper";
import { useDropzone } from "react-dropzone";
import useAxios from "axios-hooks";
import MyDialog from "../../UI/Dialog/MyDialog";

const API_URL = "http://localhost:8080/source/getAll";

class SourceObject {
	constructor(source) {
		this.id = source.id;
		this.sourceName = source.sourceName;
	}
}

const Source = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [progress, setProgress] = useState(0);
	const [{ data, loading, error }, refetch] = useAxios(API_URL, {
		useCache: false,
	});
	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "Source name",
				accessor: "sourceName",
			},
			{
				Header: "Created at",
				accessor: "sourceCreated",
			},
			{
				Header: "Last updated",
				accessor: "sourceLastUpdated",
			},
			{
				Header: "Actions",
				Cell: ({ row }) => <Button text='Actions'></Button>,
			},
		],
		[]
	);

	const parseSourceData = (sourceData) => {
		let sourceArray = [];
		if (sourceData)
			sourceData.forEach((source) =>
				sourceArray.push(new SourceObject(source))
			);
		return sourceArray;
	};

	const onDrop = useCallback((acceptedFiles) => {
		upload(acceptedFiles);
	}, []);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		onDrop,
		multiple: false,
	});

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	const upload = (acceptedFiles) => {
		setProgress(0);

		uploadSource(acceptedFiles, (event) => {
			//TODO: ADD LOADER
			setProgress(Math.round((100 * event.loaded) / event.total));
		})
			.then((response) => {
				//Get all sources after upload
				refetch();
				//Close dropwindow
				setIsOpen(false);
			})

			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<Title text='Sources'></Title>
			<div className='flex justify-end px-2 py-4'>
				<Button text='Add source' onClick={() => setIsOpen(true)}></Button>
				<Button text='Refresh data' onClick={refetch}></Button>
			</div>
			<div className='flex-grow py-2 px-2 min-w-min flex items-start'>
				<Table
					columns={columns}
					data={parseSourceData(data)}
					isLoading={loading}
				/>
			</div>
			<MyDialog isOpen={isOpen} setIsOpen={setIsOpen} title='Upload new source'>
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
		</>
	);
};

export default Source;
