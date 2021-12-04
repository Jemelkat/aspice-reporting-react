import { Formik, Form } from "formik";
import FormInput from "../../UI/Form/FormInput";
import FormSelect from "../../UI/Form/FormSelect";
import * as Yup from "yup";
import useAxios from "axios-hooks";
import axios from "axios";
import FormHidden from "../../UI/Form/FormHidden";
import { useEffect } from "react/cjs/react.development";

const API_URL = "http://localhost:8080/groups/edit";

const FormGroups = (props) => {
	const [executePost] = useAxios(
		{
			url: API_URL,
			method: "POST",
		},
		{ manual: true }
	);

	function updateData(data) {
		executePost({
			data: {
				id: data.id,
				groupName: data.groupName,
			},
		}).then(props.onCancel);
	}

	return (
		<Formik
			initialValues={{
				id: props.data.id,
				groupName: props.data.groupName,
			}}
			validationSchema={Yup.object({
				groupName: Yup.string().required("Required"),
			})}
			onSubmit={(values, { setSubmitting }) => {
				updateData(values);
				setSubmitting(false);
			}}
		>
			<Form className='flex flex-col border-2 p-4'>
				<FormHidden name='id'></FormHidden>
				<FormInput
					label='Group name'
					name='groupName'
					type='text'
					placeholder='Group name...'
				/>
				<button type='submit' className='mt-4'>
					Submit
				</button>
				<button className='mt-4' onClick={props.onCancel}>
					Cancel
				</button>
			</Form>
		</Formik>
	);
};

export default FormGroups;
