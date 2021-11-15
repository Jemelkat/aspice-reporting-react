import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import SidebarLinks from "../Sidebar/SidebarLinks";
import SidebarLinkItem from "../Sidebar/SidebarLinkItem";
import AdminPanelUsers from "./AdminPanelUsers";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AdminPanelGroups from "./AdminPanelGroups";

const AdminPanel = () => {
	const { url, path } = useRouteMatch();

	return (
		<div className='flex'>
			<Sidebar>
				<SidebarLinks>
					<SidebarLinkItem link={`${url}/users`} text='Users'>
						{/*TODO import react icons library*/}
						<svg
							width='20'
							height='20'
							fill='currentColor'
							className='m-auto'
							viewBox='0 0 2048 1792'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path d='M1024 1131q0-64-9-117.5t-29.5-103-60.5-78-97-28.5q-6 4-30 18t-37.5 21.5-35.5 17.5-43 14.5-42 4.5-42-4.5-43-14.5-35.5-17.5-37.5-21.5-30-18q-57 0-97 28.5t-60.5 78-29.5 103-9 117.5 37 106.5 91 42.5h512q54 0 91-42.5t37-106.5zm-157-520q0-94-66.5-160.5t-160.5-66.5-160.5 66.5-66.5 160.5 66.5 160.5 160.5 66.5 160.5-66.5 66.5-160.5zm925 509v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm0-260v-56q0-15-10.5-25.5t-25.5-10.5h-568q-15 0-25.5 10.5t-10.5 25.5v56q0 15 10.5 25.5t25.5 10.5h568q15 0 25.5-10.5t10.5-25.5zm0-252v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm256-320v1216q0 66-47 113t-113 47h-352v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-768v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-352q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1728q66 0 113 47t47 113z'></path>
						</svg>
					</SidebarLinkItem>
					<SidebarLinkItem link={`${url}/groups`} text='GROUPS'>
						<svg
							width='20'
							height='20'
							fill='currentColor'
							className='m-auto'
							viewBox='0 0 2048 1792'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path d='M960 0l960 384v128h-128q0 26-20.5 45t-48.5 19h-1526q-28 0-48.5-19t-20.5-45h-128v-128zm-704 640h256v768h128v-768h256v768h128v-768h256v768h128v-768h256v768h59q28 0 48.5 19t20.5 45v64h-1664v-64q0-26 20.5-45t48.5-19h59v-768zm1595 960q28 0 48.5 19t20.5 45v128h-1920v-128q0-26 20.5-45t48.5-19h1782z'></path>
						</svg>
					</SidebarLinkItem>
				</SidebarLinks>
			</Sidebar>
			<Switch>
				<Route path={`${path}/users`}>
					<AdminPanelUsers></AdminPanelUsers>
				</Route>
				<Route path={`${path}/groups`}>
					<AdminPanelGroups></AdminPanelGroups>
				</Route>
			</Switch>
		</div>
	);
};

export default AdminPanel;
