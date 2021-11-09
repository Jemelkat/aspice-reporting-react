import { createContext, useState } from "react";

export const FullScreenContext = createContext();

export const FullScreenContextConsumer = FullScreenContext.Consumer;

export const FullScreenContextProvider = ({ children }) => {
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [showNavbar, setShowNavbar] = useState(true);

	const showNavbarHandler = () => setShowNavbar(true);
	const hideNavbarHandler = () => setShowNavbar(false);

	const enableFullScreen = () => setIsFullScreen(true);
	const disableFullScreen = () => setIsFullScreen(false);

	return (
		<FullScreenContext.Provider
			value={{
				fullScreen: isFullScreen,
				navbar: showNavbar,
				enableFullScreen: enableFullScreen,
				disableFullScreen: disableFullScreen,
				showNavbar: showNavbarHandler,
				hideNavbar: hideNavbarHandler,
			}}
		>
			{children}
		</FullScreenContext.Provider>
	);
};
