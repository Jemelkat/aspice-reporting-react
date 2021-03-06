import {Menu} from "@headlessui/react";

const TableMenuItem = (props) => {
	return (
		<Menu.Item as='div'>
			{({ active }) => (
				<button
					id={props.id}
					className={`${active ? " bg-gray-800 text-white" : ""} ${
						props.addClasses
					} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
					onClick={props.onClickAction}
				>
					{props.children}
				</button>
			)}
		</Menu.Item>
	);
};

export default TableMenuItem;
