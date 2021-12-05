import { Field, Form, Formik } from "formik";
import FormInput from "../../UI/Form/FormInput";
import * as Yup from "yup";
import CustomSelect from "../../UI/Form/FormSelect";
import { useState } from "react";
import Select from "react-select";
import useAxios from "axios-hooks";

const API_URL = "http://localhost:8080/report/create";

const Report = () => {
	const [selected, setSelected] = useState("");
	const [
		{ data: postData, loading: postLoading, error: postError },
		executePost,
	] = useAxios(
		{
			url: API_URL,
			method: "POST",
		},
		{ manual: true }
	);

	const handleSelectChange = (selectedOption) => {
		setSelected(selectedOption.target.value);
	};

	function updateData(data) {
		executePost({
			data: {
				reportName: data.reportName,
				reportItems: [
					{
						type: data.type,
						x: data.x,
						y: data.y,
						height: data.height,
						width: data.width,
					},
				],
			},
		});
	}

	return (
		<div className='flex flex-col justify-center items-center'>
			<Formik
				initialValues={{
					reportName: "Report",
				}}
				validationSchema={Yup.object({
					reportName: Yup.string().required("Required"),
					type: Yup.string().required("Required"),
				})}
				onSubmit={(values, { setSubmitting }) => {
					updateData(values);
					console.log(values);
					setSubmitting(false);
				}}
			>
				{({ errors, touched, setFieldValue }) => (
					<Form className='flex flex-col border-2 p-4'>
						<FormInput
							label='Report Name'
							name='reportName'
							type='text'
							placeholder='Report name...'
						/>
						<label>Item type</label>
						<Field
							label='Item type'
							name='type'
							as='select'
							onChange={(opt, e) => {
								handleSelectChange(opt);

								setFieldValue("type", opt.target.value);
							}}
						>
							<option value=''>Please select value..</option>
							<option value='STATIC_TEXT'>STATIC_TEXT</option>
							<option value='GRAPH'>GRAPH</option>
							<option value='TABLE'>TABLE</option>
						</Field>
						{selected == "STATIC_TEXT" && (
							<FormInput
								label='Text area'
								name='textArea'
								type='text'
								placeholder='Item text...'
							/>
						)}
						<FormInput label='X' name='x' type='number' placeholder='' />
						<FormInput label='Y' name='y' type='number' placeholder='' />
						<FormInput
							label='Height'
							name='height'
							type='number'
							placeholder=''
						/>
						<FormInput
							label='Width'
							name='width'
							type='number'
							placeholder=''
						/>
						<button type='submit' className='mt-4'>
							Submit
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Report;
