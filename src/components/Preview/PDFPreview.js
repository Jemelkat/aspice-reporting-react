import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { useState } from "react";
import sample from "./sample.pdf";

const PDFPreview = ({ pdfData }) => {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
		setPageNumber(1);
	}
	console.log(pdfData);
	return (
		<div
			className='overflow-y-scroll bg-white'
			style={{ width: "210mm", height: "297mm" }}
		>
			{pdfData !== null ? (
				<Document
					className='flex flex-col justify-center bg-white-500'
					file={pdfData}
					onLoadSuccess={onDocumentLoadSuccess}
				>
					{Array.from(new Array(numPages), (el, index) => (
						<Page
							className='border-black shadow-lg '
							key={`page_${index + 1}`}
							pageNumber={index + 1}
						/>
					))}
				</Document>
			) : (
				<div
					style={{ width: "210mm", height: "297mm" }}
					className='w-full h-full text-xl text-center'
				>
					Please generate the report first.
				</div>
			)}
		</div>
	);
};

export default PDFPreview;
