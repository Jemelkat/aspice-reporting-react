import { Dialog } from "@headlessui/react";
import { useRef } from "react";

function MyDialog(props) {
	let completeButtonRef = useRef(null);
	return (
		<Dialog
			initialFocus={completeButtonRef}
			open={props.isOpen}
			onClose={props.setIsOpen}
			as='div'
			className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
		>
			<div className='flex items-center justify-center min-h-screen'>
				<Dialog.Overlay className='fixed inset-0 bg-gray-800 opacity-30' />

				<div
					className='relative flex flex-col max-w-sm px-2 py-4 bg-white shadow-2xl rounded-xl md:max-w-md'
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
		</Dialog>
	);
}

export default MyDialog;
