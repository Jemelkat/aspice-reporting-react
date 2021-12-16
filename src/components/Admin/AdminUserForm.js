import { Formik, Form } from "formik";
import FormInput from "../UI/Form/FormInput";
import FormSelect from "../UI/Form/FormSelect";
import * as Yup from "yup";
import FormHidden from "../UI/Form/FormHidden";
import { useEffect } from "react/cjs/react.development";
import { useAxios } from "../../helpers/AxiosHelper";
import Button from "../UI/Button";

const AdminUserForm = (props) => {
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
		})
			.then(() => {
				props.onCancel();
				props.onSuccess();
			})
			.error((error) => {
				console.log(error);
			});
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
			<Form className='flex flex-col p-4 sm:w-96 w-80'>
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
				<div className='flex justify-center mt-6 space-x-2 space'>
					<Button type='submit' className='mt-2' dark={true}>
						Save
					</Button>
					<Button className='mt-2' onClick={props.onCancel}>
						Cancel
					</Button>
				</div>
			</Form>
		</Formik>
	);
};

export default AdminUserForm;
