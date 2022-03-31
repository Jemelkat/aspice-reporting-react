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
	ordering,
}) => {
	const setValueHandler = (option) => {
		form.setFieldValue(
			field.name,
			isMulti ? option.map((item) => item.value) : option.value
		);
	};

	const getValue = () => {
		let newValue = [];
		if (options) {
			if (isMulti) {
				if (ordering) {
					field.value.forEach((value) => {
						newValue.push(options.find((option) => option.value === value));
					});
				} else {
					newValue = options.filter(
						(option) => field.value.indexOf(option.value) >= 0
					);
				}
			} else {
				newValue = options.find((option) => option.value === field.value);
			}
		} else {
			newValue = isMulti ? [] : null;
		}
		return newValue === undefined ? null : newValue;
	};

	const styles = {
		menu: (base) => ({
			...base,
			marginTop: 0,
		}),
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
				maxMenuHeight={200}
				styles={styles}
			/>

			{error ? <div className='text-red-500 col-span-full'>{error}</div> : null}
		</>
	);
};

export default FormSelect;
