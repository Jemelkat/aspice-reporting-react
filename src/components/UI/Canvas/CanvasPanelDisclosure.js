import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

const CanvasPanelDisclosure = (props) => {
	return (
		<Disclosure>
			{({ open }) => (
				<>
					<Disclosure.Button className='flex justify-between w-full px-4 py-2 font-medium text-left text-gray-800 bg-gray-200 rounded-sm shadow-sm hover:bg-gray-300 drop-shadow-2xl'>
						<span>{props.name}</span>
						<ChevronUpIcon
							className={`${
								open ? "transform rotate-180" : ""
							} w-6 h-6 text-gray-800`}
						/>
					</Disclosure.Button>
					<Transition
						enter='transition duration-100 ease-out'
						enterFrom='transform scale-95 opacity-0'
						enterTo='transform scale-100 opacity-100'
						leave='transition duration-75 ease-out'
						leaveFrom='transform scale-100 opacity-100'
						leaveTo='transform scale-95 opacity-0'
					>
						<Disclosure.Panel className='pb-1 text-gray-800 border'>
							{props.children}
						</Disclosure.Panel>
					</Transition>
				</>
			)}
		</Disclosure>
	);
};

export default CanvasPanelDisclosure;
