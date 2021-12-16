import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// optional configuration
const options = {
	position: positions.BOTTOM_CENTER,
	timeout: 2000,
	offset: "3px",
	transition: transitions.SCALE,
};

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthContextProvider>
				<AlertProvider template={AlertTemplate} {...options}>
					<App />
				</AlertProvider>
			</AuthContextProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
