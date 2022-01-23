import { useRef } from "react";
import Button from "../Button";
import MyDialog from "./MyDialog";

const ConfirmDialog = (props) => {
	let completeButtonRef = useRef(null);
	return (
		<MyDialog
			isOpen={props.isOpen}
			onClose={props.onClose}
			title={props.title}
			description={props.description}
		>
			<div className='flex flex-row justify-center space-x-4'>
				<Button onClick={props.onOk} dark={true} addRef={completeButtonRef}>
					Yes
				</Button>
				<Button onClick={props.onCancel}>Cancel</Button>
			</div>
		</MyDialog>
	);
};

export default ConfirmDialog;
