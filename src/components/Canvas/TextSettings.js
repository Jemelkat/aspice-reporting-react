import { Field, Form, Formik } from "formik";
import CanvasPanelDisclosure from "../UI/Canvas/CanvasPanelDisclosure";
import FormInput from "../UI/Form/FormInput";
import * as Yup from "yup";

const TextSettings = ({ selectedItem, onItemUpdate }) => {
	console.log(selectedItem);
	return (
		<>
			<div>
				<Formik
					enableReinitialize={true}
					initialValues={{
						textArea:
							selectedItem && selectedItem.textArea
								? selectedItem.textArea
								: "",
						fontSize:
							selectedItem &&
							selectedItem.textStyle &&
							selectedItem.textStyle.fontSize
								? selectedItem.textStyle.fontSize
								: 11,
						bold:
							selectedItem &&
							selectedItem.textStyle &&
							selectedItem.textStyle.bold
								? selectedItem.textStyle.bold
								: false,
						italic:
							selectedItem &&
							selectedItem.textStyle &&
							selectedItem.textStyle.italic
								? selectedItem.textStyle.italic
								: false,
						underline:
							selectedItem &&
							selectedItem.textStyle &&
							selectedItem.textStyle.underline != null
								? selectedItem.textStyle.underline
								: false,
					}}
					validationSchema={Yup.object().shape({
						fontSize: Yup.number("Please enter valid number.")
							.moreThan(0, "Please enter number > 0.")
							.integer("Please enter valid number."),
					})}
				>
					{({ handleChange }) => (
						<Form className='flex flex-col'>
							<CanvasPanelDisclosure name='Text style'>
								<div className='grid grid-cols-2 pt-2 pb-2 pl-4 pr-4'>
									<FormInput
										label='Font size:'
										name='fontSize'
										type='number'
										onChange={(e) => {
											handleChange(e);
											if (e.target.value > 0) {
												const newSelected = {
													...selectedItem,
													textStyle: {
														...selectedItem.textStyle,
														fontSize: e.target.value,
													},
												};
												onItemUpdate(newSelected);
											}
										}}
									/>
									<FormInput
										label='Bold:'
										name='bold'
										type='checkbox'
										onChange={(e) => {
											handleChange(e);
											const newSelected = {
												...selectedItem,
												textStyle: {
													...selectedItem.textStyle,
													bold: e.target.checked,
												},
											};
											onItemUpdate(newSelected);
										}}
									/>
									<FormInput
										label='Italic:'
										name='italic'
										type='checkbox'
										onChange={(e) => {
											handleChange(e);
											const newSelected = {
												...selectedItem,
												textStyle: {
													...selectedItem.textStyle,
													italic: e.target.checked,
												},
											};
											onItemUpdate(newSelected);
										}}
									/>
									<FormInput
										label='Underline:'
										name='underline'
										type='checkbox'
										onChange={(e) => {
											handleChange(e);
											const newSelected = {
												...selectedItem,
												textStyle: {
													...selectedItem.textStyle,
													underline: e.target.checked,
												},
											};
											onItemUpdate(newSelected);
										}}
									/>
									<FormInput label='Color:' name='color' type='text' />
								</div>
							</CanvasPanelDisclosure>
							<div className='flex flex-col pl-4 pr-4'>
								<label className='mt-2' htmlFor='template'>
									Text:
								</label>
								<Field
									style={{ minHeight: "10rem" }}
									as='textarea'
									name='textArea'
									className='border-2 border-gray-300'
									onChange={(e) => {
										handleChange(e);
										const newSelected = {
											...selectedItem,
											textArea: e.target.value,
										};
										onItemUpdate(newSelected);
									}}
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
};

export default TextSettings;
