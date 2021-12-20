import { Document, Page, pdf, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

const PDFPreview = ({ pdfData }) => {
	return (
		<PDFViewer style={{ width: "210mm", height: "297mm" }}>
			<Document file={pdfData}>
				<Page />
			</Document>
		</PDFViewer>
	);
};

export default PDFPreview;
