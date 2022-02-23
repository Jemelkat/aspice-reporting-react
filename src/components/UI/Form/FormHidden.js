import {useField} from "formik";

const FormHidden = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input> and alse replace ErrorMessage entirely.
	const [field] = useField(props);
	return (
		<>
			<input type='hidden' className='border-2' {...field} {...props} />
		</>
	);
};

export default FormHidden;
