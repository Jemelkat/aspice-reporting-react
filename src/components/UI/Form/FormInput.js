import { useField } from "formik";

const FormInput = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input> and alse replace ErrorMessage entirely.
	const [field, meta] = useField(props);
	return (
		<>
			<label htmlFor={props.id || props.name}>{label}</label>
			<input
				className='bg-gray-100 border-2 border-gray-300'
				{...field}
				{...props}
			/>
			{meta.error ? <div className='text-red-500'>{meta.error}</div> : null}
		</>
	);
};

export default FormInput;
