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
}) => {
	const setValueHandler = (option) => {
		form.setFieldValue(
			field.name,
			isMulti ? option.map((item) => item.value) : option.value
		);
	};

	const getValue = () => {
		if (options) {
			return isMulti
				? options.filter((option) => field.value.indexOf(option.value) >= 0)
				: options.find((option) => option.value === field.value);
		} else {
			return isMulti ? [] : "";
		}
	};

	return (
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
	);
};

export default FormSelect;
