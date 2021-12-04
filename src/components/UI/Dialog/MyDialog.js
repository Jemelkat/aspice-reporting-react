import { Dialog } from "@headlessui/react";

function MyDialog(props) {
	return (
		<Dialog
			open={props.isOpen}
			onClose={props.setIsOpen}
			as='div'
			className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
		>
			<div className='flex items-center justify-center min-h-screen'>
				<Dialog.Overlay className='fixed inset-0 bg-gray-800 opacity-30' />

				<div className='relative flex flex-col bg-white shadow-2xl rounded-xl px-2 py-4 max-w-sm md:max-w-md'>
					<Dialog.Title className='font-semibold text-sm sm:text-lg flex justify-center pb-4'>
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
