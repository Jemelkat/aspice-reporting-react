import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const TableMenuButton = (props) => {
	return (
		<Menu as='div' className='relative inline-block text-left'>
			<Menu.Button className='bg-gray-800 rounded-lg text-white p-2'>
				{props.buttonText}
			</Menu.Button>
			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='z-10 absolute right-0 w-36 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
					{props.children}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default TableMenuButton;
