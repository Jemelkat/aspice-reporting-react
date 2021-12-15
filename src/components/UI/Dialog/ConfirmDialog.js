import { Dialog } from "@headlessui/react";
import Button from "../Button";

const ConfirmDialog = (props) => {
	return (
		<Dialog
			open={props.isOpen}
			onClose={props.setIsOpen}
			as='div'
			className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto '
		>
			<div className='flex items-center justify-center min-h-screen text-center sm:w-96 w-80'>
				<Dialog.Overlay className='fixed inset-0 bg-gray-800 opacity-30' />

				<div className='relative flex flex-col max-w-sm px-2 py-4 bg-white shadow-2xl rounded-xl md:max-w-md'>
					<Dialog.Title className='flex justify-center pb-4 text-sm font-semibold sm:text-lg'>
						{props.title}
					</Dialog.Title>
					<div className='flex flex-row justify-center space-x-4'>
						<Button onClick={props.onOk} dark={true}>
							Yes
						</Button>
						<Button onClick={props.onCancel}>Cancel</Button>
					</div>
				</div>
			</div>
		</Dialog>
	);
};

export default ConfirmDialog;
