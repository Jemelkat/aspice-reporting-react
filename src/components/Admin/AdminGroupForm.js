import {Field, Form, Formik} from "formik";
import FormInput from "../../ui/Form/FormInput";
import CustomSelect from "../../ui/Form/FormSelect";
import * as Yup from "yup";
import FormHidden from "../../ui/Form/FormHidden";
import {useEffect, useState} from "react";
import {useAxios} from "../../helpers/AxiosHelper";
import Button from "../../ui/Button";
import {useAlert} from "react-alert";

const AdminGroupForm = ({ create = false, ...props }) => {
	const [usersDataSelect, setUsersDataSelect] = useState([]);
	//Get select users values
	const [{}, refetchUsers] = useAxios(
		{
			url: "/admin/allUsersSimple",
			method: "GET",
		},
		{
			manual: true,
			useCache: false,
		}
	);

	//Post group data to server
	const [{}, executePost] = useAxios(
		{
			url: "/group/edit",
			method: "POST",
		},
		{ manual: true }
	);

	//Create new group
	const [{}, executeCreate] = useAxios(
		{
			url: "/group/create",
			method: "POST",
		},
		{ manual: true }
	);

	const alert = useAlert();

	//Send data to server
	function submitForm(data) {
		let usersData = [];
		//Use user IDs
		if (data.users) {
			data.users.forEach((user) => {
				usersData.push({ id: user });
			});
		}
		if (create) {
			executeCreate({
				data: {
					id: null,
					groupName: data.groupName,
					users: usersData,
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
						alert.error("Error creating group.");
					}
				});
		} else {
			//Post data
			executePost({
				data: {
					id: data.id,
					groupName: data.groupName,
					users: usersData,
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
						alert.error("Error editing group.");
					}
				});
		}
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
		refetchUsers()
			.then((data) => {
				setUsersDataSelect(parseUsersSelect(data.data));
			})
			.catch((e) => {
				alert.error("Error getting data.");
			});
	}, []);

	return (
		<>
			<Formik
				initialValues={{
					id: props.data?.id ? props.data.id : null,
					groupName: props.data?.name ? props.data.name : "",
					users: props.data?.users ? props.data?.users.map((u) => u.id) : [],
				}}
				validationSchema={Yup.object({
					groupName: Yup.string().required("Required"),
				})}
				onSubmit={(values, { setSubmitting }) => {
					submitForm(values);
					setSubmitting(false);
				}}
			>
				<Form className='flex flex-col sm:w-96 w-80'>
					<FormHidden name='id'></FormHidden>
					<FormInput
						label='Group name'
						name='groupName'
						type='text'
						placeholder='Group name...'
					/>
					<label>Select users</label>
					<Field
						name='users'
						options={usersDataSelect}
						component={CustomSelect}
						placeholder='Select users...'
						isMulti={true}
					/>
					<div className='flex justify-center mt-4 space-x-2 space'>
						<Button type='submit' className='mt-2' dark={true}>
							Save
						</Button>
						<Button className='mt-2' onClick={props.onCancel}>
							Cancel
						</Button>
					</div>
				</Form>
			</Formik>
		</>
	);
};

export default AdminGroupForm;
