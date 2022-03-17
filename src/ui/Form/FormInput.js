import { useField } from "formik";

const FormInput = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input> and alse replace ErrorMessage entirely.
	const [field, meta] = useField(props);
	return (
		<>
			{label && <label htmlFor={props.id || props.name}>{label}</label>}
			<input
				className='px-3 py-1 border border-gray-400 rounded'
				{...field}
				{...props}
			/>
			{meta.error ? (
				<div className='text-red-500 col-span-full'>{meta.error}</div>
			) : null}
		</>
	);
};

export default FormInput;
