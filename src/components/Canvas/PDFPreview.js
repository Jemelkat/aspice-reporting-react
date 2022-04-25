const PDFPreview = ({ pdfData }) => {
	return (
		<div
			className='flex justify-center mt-2 bg-white'
			style={{ width: "210mm", height: "297mm" }}
		>
			{pdfData ? (
				<iframe title='preview' className='w-full' src={pdfData}></iframe>
			) : (
				<div className='pt-4 text-center align-middle'>
					Please generate the report first.
				</div>
			)}
		</div>
	);
};

export default PDFPreview;
