import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { useCallback, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";

const PDFPreview = ({ pdfData }) => {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
		setPageNumber(1);
	}

	const changePage = (offset) => {
		debugger;
		const nextPage = pageNumber + offset;
		if (nextPage > numPages || nextPage < 0) return;
		setPageNumber((prevPageNumber) => (prevPageNumber || 1) + offset);
	};

	const previousPage = useCallback(() => changePage(-1), [changePage]);

	const nextPage = useCallback(() => changePage(1), [changePage]);

	return (
		<div className='flex flex-col items-center justify-center'>
			<div className='sticky top-0 flex items-center justify-center w-full h-10 space-x-4 text-white bg-gray-800'>
				<button type='button' onClick={() => previousPage()}>
					<ArrowLeftIcon className='w-4 h-4 cursor-pointer'></ArrowLeftIcon>
				</button>
				<span>Number of pages: {numPages || "--"}</span>
				<button type='button' onClick={() => nextPage()}>
					<ArrowRightIcon className='w-4 h-4 cursor-pointer'></ArrowRightIcon>
				</button>
			</div>
			<div
				className='overflow-x-auto overflow-y-auto bg-white'
				style={{ width: "240mm", height: "299mm" }}
			>
				{pdfData !== null ? (
					<Document
						className='flex flex-col items-center justify-center bg-gray-800 bg-opacity-50'
						file={pdfData}
						onLoadSuccess={onDocumentLoadSuccess}
					>
						{Array.from(new Array(numPages), (el, index) => (
							<Page
								className='mt-1 mb-1 border-black shadow-lg'
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
		</div>
	);
};

export default PDFPreview;
