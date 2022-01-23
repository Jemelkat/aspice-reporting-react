import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

function MyDialog({ isOpen, onClose, title, description, ...props }) {
	let completeButtonRef = useRef(null);
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				className='w-36r'
				initialFocus={completeButtonRef}
				onClose={onClose}
				as='div'
				className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
			>
				<div className='flex items-center justify-center min-h-screen'>
					<Dialog.Overlay className='fixed inset-0 bg-gray-800 opacity-30' />

					<Transition.Child
						as={Fragment}
						enter='ease-out duration-200'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						<div
							className={`${props.className} relative flex flex-col max-w-sm px-2 py-4 bg-white rounded-md shadow-2xl md:max-w-xl`}
							ref={completeButtonRef}
						>
							<Dialog.Title className='flex justify-center pb-4 font-semibold text-md sm:text-lg'>
								{title}
							</Dialog.Title>
							<Dialog.Description className='pb-4 pl-2 pr-2 text-center md:pl-8 md:pr-8'>
								{description}
							</Dialog.Description>

							{props.children}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}

export default MyDialog;
