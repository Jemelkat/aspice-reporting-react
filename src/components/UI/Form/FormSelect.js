import { useField } from "formik";

const FormSelect = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input> and alse replace ErrorMessage entirely.
	const [field, meta] = useField(props);
	return (
		<>
			<label htmlFor={props.id || props.name}>{label}</label>
			<select className='border-2' {...field} {...props} />
			{meta.touched && meta.error ? <span>{meta.error}</span> : null}
		</>
	);
};

export default FormSelect;
