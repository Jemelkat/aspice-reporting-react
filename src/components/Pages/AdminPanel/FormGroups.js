import { Formik, Form, Field } from "formik";
import FormInput from "../../UI/Form/FormInput";
import FormSelect from "../../UI/Form/FormSelect";
import * as Yup from "yup";
import FormHidden from "../../UI/Form/FormHidden";
import { useEffect } from "react/cjs/react.development";
import Select from "react-select";
import CustomSelect from "../../UI/Form/FormSelect";
import { useState } from "react";
import { useAxios } from "../../../helpers/AxiosHelper";

const FormGroups = (props) => {
	const [usersDataSelect, setUsersDataSelect] = useState([]);
	//Get select users values
	const [{ usersData, usersLoading, usersError }, refetchUsers] = useAxios(
		{
			url: "/admin/getAllUsers",
			method: "GET",
		},
		{
			manual: true,
			useCache: false,
		}
	);

	//Post group data to server
	const [
		{ data: postData, loading: postLoading, error: postError },
		executePost,
	] = useAxios(
		{
			url: "/group/create",
			method: "POST",
		},
		{ manual: true }
	);

	//Send data to server
	function updateData(data) {
		let usersData = [];
		//Use user IDs
		if (data.users) {
			data.users.forEach((user) => {
				usersData.push({ id: user });
			});
		}
		//Post data
		executePost({
			data: {
				id: data.id,
				groupName: data.groupName,
				users: usersData,
			},
		}).then(() => {
			props.onCancel();
			props.onSuccess();
		});
	}

	//Parse users to value:"", label:""
	const parseUsersSelect = (users) => {
		let usersArray = [];
		if (users)
			users.forEach((user) =>
				usersArray.push({ value: user.id, label: user.username })
			);
		return usersArray;
	};

	//Get users and format them for select
	useEffect(() => {
		refetchUsers().then((data) => {
			setUsersDataSelect(parseUsersSelect(data.data));
		});
	}, []);

	return (
		<Formik
			initialValues={{
				id: props.data.id,
				groupName: props.data.name,
				users: [],
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
				<label>Select users</label>
				<Field
					className='custom-select'
					name='users'
					options={usersDataSelect}
					component={CustomSelect}
					placeholder='Select multi languages...'
					isMulti={true}
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
