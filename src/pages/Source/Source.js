import { useState, useCallback, useMemo } from "react";
import Button from "../../components/UI/Button";
import Table from "../../components/UI/Table/Table";
import Title from "../../components/UI/Title";
import { uploadSource } from "../../helpers/UploadHelper";
import { useDropzone } from "react-dropzone";
import MyDialog from "../../components/UI/Dialog/MyDialog";
import { useAxios } from "../../helpers/AxiosHelper";

class SourceObject {
	constructor(source) {
		this.id = source.sourceId;
		this.sourceName = source.sourceName;
		this.sourceCreated = source.sourceCreated;
		this.sourceLastUpdated = source.sourceLastUpdated;
	}
}

const Source = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [progress, setProgress] = useState(0);
	const [{ data, loading, error }, refetch] = useAxios("/source/getAll", {
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
				Cell: ({ row }) => <Button dark={true}>Actions</Button>,
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
				<Button className='mr-2' onClick={() => setIsOpen(true)} dark={true}>
					Add source
				</Button>
				<Button onClick={refetch} dark={true}>
					Refresh data
				</Button>
			</div>
			<div className='flex items-start flex-grow px-2 py-2 min-w-min'>
				<Table
					columns={columns}
					data={parseSourceData(data)}
					isLoading={loading}
					initSortColumn={"id"}
				/>
			</div>
			<MyDialog
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
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
		</>
	);
};

export default Source;
