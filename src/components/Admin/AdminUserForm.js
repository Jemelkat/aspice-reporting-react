import { Field, Form, Formik } from "formik";
import FormInput from "../../ui/Form/FormInput";
import * as Yup from "yup";
import FormHidden from "../../ui/Form/FormHidden";
import { useAxios } from "../../helpers/AxiosHelper";
import Button from "../../ui/Button";
import FormSelect from "../../ui/Form/FormSelect";
import { useAlert } from "react-alert";

const AdminUserForm = (props) => {
	const [, executePost] = useAxios(
		{
			url: "/user/edit",
			method: "POST",
		},
		{ manual: true }
	);
	const alert = useAlert();

	function updateData(data) {
		executePost({
			data: {
				id: data.id,
				username: data.username,
				email: data.email,
				roles: data.roles.map((role) => {
					return {
						name: role,
					};
				}),
			},
		})
			.then(() => {
				props.onCancel();
				props.onSuccess();
			})
			.catch((e) => {
				if (e.response?.data && e.response?.data.message) {
					alert.error(e.response.data.message);
				} else {
					alert.error("Error editing user.");
				}
			});
	}

	return (
		<Formik
			initialValues={{
				id: props.data.id,
				username: props.data.username,
				email: props.data.email,
				roles: props.data.roles.split(", ").map((u) => u),
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
				<label>Roles</label>
				<Field
					name='roles'
					options={[{ value: "ROLE_ADMIN", label: "Admin" }]}
					component={FormSelect}
					placeholder='Select roles...'
					isMulti={true}
				/>
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
