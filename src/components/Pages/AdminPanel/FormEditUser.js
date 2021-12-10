import { Formik, Form } from "formik";
import FormInput from "../../UI/Form/FormInput";
import FormSelect from "../../UI/Form/FormSelect";
import * as Yup from "yup";
import FormHidden from "../../UI/Form/FormHidden";
import { useEffect } from "react/cjs/react.development";
import { useAxios } from "../../../helpers/AxiosHelper";

const FormEditUser = (props) => {
	const [
		{ data: postData, loading: postLoading, error: postError },
		executePost,
	] = useAxios(
		{
			url: "/user/edit",
			method: "POST",
		},
		{ manual: true }
	);

	function updateData(data) {
		executePost({
			data: {
				id: data.id,
				username: data.username,
				email: data.email,
				roles: [],
			},
		}).then(props.onCancel);
	}

	return (
		<Formik
			initialValues={{
				id: props.data.id,
				username: props.data.username,
				email: props.data.email,
			}}
			validationSchema={Yup.object({
				username: Yup.string().required("Required"),
				email: Yup.string().required("Required"),
			})}
			onSubmit={(values, { setSubmitting }) => {
				updateData(values);
				setSubmitting(false);
			}}
		>
			<Form className='flex flex-col border-2 p-4'>
				<FormHidden name='id'></FormHidden>
				<FormInput
					label='Username'
					name='username'
					type='text'
					placeholder='Username...'
				/>
				<FormInput
					label='Email'
					name='email'
					type='text'
					placeholder='Email...'
				/>
				<span>Current roles: {props.data.roles}</span>
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

export default FormEditUser;
