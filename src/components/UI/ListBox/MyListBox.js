import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";
import DualListBox from "react-dual-listbox";

const options = [
	{ value: "luna", label: "Moon" },
	{ value: "phobos", label: "Phobos" },
	{ value: "deimos", label: "Deimos" },
	{ value: "io", label: "Io" },
	{ value: "europa", label: "Europa" },
	{ value: "ganymede", label: "Ganymede" },
	{ value: "callisto", label: "Callisto" },
	{ value: "mimas", label: "Mimas" },
	{ value: "enceladus", label: "Enceladus" },
	{ value: "tethys", label: "Tethys" },
	{ value: "rhea", label: "Rhea" },
	{ value: "titan", label: "Titan" },
	{ value: "iapetus", label: "Iapetus" },
];

const MyListBox = () => {
	const [selected, setSelected] = useState(["phobos", "titan"]);

	const onChange = (selected) => {
		setSelected(selected);
	};

	return (
		<DualListBox
			canFilter
			options={options}
			selected={selected}
			onChange={onChange}
			icons={{
				moveLeft: <ChevronLeftIcon className='w-4 h-4'></ChevronLeftIcon>,
				moveAllLeft: [
					<ChevronDoubleLeftIcon className='w-4 h-4'></ChevronDoubleLeftIcon>,
				],
				moveRight: <ChevronRightIcon className='w-4 h-4'></ChevronRightIcon>,
				moveAllRight: [
					<ChevronDoubleRightIcon className='w-4 h-4'></ChevronDoubleRightIcon>,
				],
			}}
		/>
	);
};

export default MyListBox;
