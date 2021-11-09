import { useContext } from "react";
import { FullScreenContext } from "../../context/FullScreenContext";
function PageContainer(props) {
	const { fullScreen } = useContext(FullScreenContext);

	return fullScreen ? (
		<>{props.children}</>
	) : (
		<>
			<main className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
				{props.children}
			</main>
		</>
	);
}

export default PageContainer;
