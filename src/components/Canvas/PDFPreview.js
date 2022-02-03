import { useCallback, useState } from "react";

const PDFPreview = ({ pdfData }) => {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	return (
		<div className='flex flex-col items-center justify-center'>
			<div
				className='flex justify-center overflow-x-auto overflow-y-auto bg-white'
				style={{ width: "210mm", height: "297mm" }}
			>
				{pdfData ? (
					<iframe className='flex-1' src={pdfData}></iframe>
				) : (
					<div className='pt-4 text-center align-middle'>
						Please generate the report first.
					</div>
				)}
			</div>
		</div>
	);
};

export default PDFPreview;
