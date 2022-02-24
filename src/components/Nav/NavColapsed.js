import {Transition} from "@headlessui/react";

function NavColapsed(props) {
	return (
		<Transition
			show={props.isOpen}
			enter='transition ease-out duration-200 transform'
			enterFrom='opacity-0 scale-90'
			enterTo='opacity-100 scale-100'
			leave='transition ease-in duration-200 transform'
			leaveFrom='opacity-100 scale-100'
			leaveTo='opacity-0 scale-90'
		>
			<div className='md:hidden' id='mobile-menu'>
				<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>{props.children}</div>
			</div>
		</Transition>
	);
}

export default NavColapsed;
