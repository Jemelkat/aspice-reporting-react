import {Field, Form, Formik} from "formik";
import SidebarDisclosure from "../../../ui/Sidebar/SidebarDisclosure";
import FormInput from "../../../ui/Form/FormInput";
import * as Yup from "yup";
import {ChromePicker} from "react-color";
import {useEffect, useState} from "react";

const TextSettings = ({ selectedItem, onItemUpdate }) => {
	const [color, setColor] = useState(selectedItem.textStyle.color);

	const colorChangeHandler = (newColor) => {
		const newSelected = {
			...selectedItem,
			textStyle: {
				...selectedItem.textStyle,
				color: newColor.hex,
			},
		};
		onItemUpdate(newSelected);
		setColor(newColor.hex);
	};

	useEffect(() => {
		if (selectedItem.textStyle.color != color) {
			setColor(selectedItem.textStyle.color);
		}
	}, [selectedItem.textStyle.color]);

	return (
		<div>
			<Formik
				enableReinitialize={true}
				initialValues={{
					textArea: selectedItem.textArea ? selectedItem.textArea : "",
					fontSize: selectedItem.textStyle.fontSize
						? selectedItem.textStyle.fontSize
						: 11,
					bold: selectedItem.textStyle.bold
						? selectedItem.textStyle.bold
						: false,
					italic: selectedItem.textStyle.italic
						? selectedItem.textStyle.italic
						: false,
					underline:
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
						<SidebarDisclosure name='Text style'>
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
								<div className='flex flex-col col-span-full'>
									<label>Color:</label>
									<ChromePicker
										className='w-full border-2 shadow-md '
										color={color}
										onChange={colorChangeHandler}
									></ChromePicker>
								</div>
							</div>
						</SidebarDisclosure>
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
	);
};

export default TextSettings;
