import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

function MyDialog(props) {
	let completeButtonRef = useRef(null);
	return (
		<Transition appear show={props.isOpen} as={Fragment}>
			<Dialog
				initialFocus={completeButtonRef}
				onClose={props.onClose}
				as='div'
				className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-200'
					enterFrom='opacity-0 scale-95'
					enterTo='opacity-100 scale-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<div className='flex items-center justify-center min-h-screen'>
						<Dialog.Overlay className='fixed inset-0 bg-gray-800 opacity-30' />

						<div
							className='relative flex flex-col max-w-sm px-2 py-4 bg-white rounded-md shadow-2xl md:max-w-md'
							ref={completeButtonRef}
						>
							<Dialog.Title className='flex justify-center pb-4 text-sm font-semibold sm:text-lg'>
								{props.title}
							</Dialog.Title>
							<Dialog.Description className=''>
								{props.description}
							</Dialog.Description>

							{props.children}
						</div>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
}

export default MyDialog;
