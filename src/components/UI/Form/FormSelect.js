import { useEffect } from "react";
import Select from "react-select";

export const FormSelect = ({
	className,
	placeholder,
	field,
	form,
	options,
	isMulti = false,
	isLoading = false,
	onSelect,
	error,
}) => {
	const setValueHandler = (option) => {
		form.setFieldValue(
			field.name,
			isMulti ? option.map((item) => item.value) : option.value
		);
	};

	const getValue = () => {
		let newValue;
		if (options) {
			newValue = isMulti
				? options.filter((option) => field.value.indexOf(option.value) >= 0)
				: options.find((option) => option.value === field.value);
		} else {
			newValue = isMulti ? [] : null;
		}
		return newValue == undefined ? null : newValue;
	};

	return (
		<>
			<Select
				className={className}
				name={field.name}
				value={getValue()}
				onChange={(e) => {
					setValueHandler(e);
					if (onSelect) onSelect(e);
				}}
				placeholder={placeholder}
				options={options}
				isMulti={isMulti}
				isLoading={isLoading}
			/>

			{error ? <div className='text-red-500 col-span-full'>{error}</div> : null}
		</>
	);
};

export default FormSelect;
