import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
import PageTitle from "../../components/UI/PageTitle";

function Profile() {
	const { loggedUser } = useContext(AuthContext);

	return loggedUser.user ? (
		<>
			<PageTitle text='Profile'></PageTitle>
			<div>
				<div>ID : {loggedUser.user.id}</div>
				<div>USERNAME : {loggedUser.user.username}</div>
				<div>EMAIL : {loggedUser.user.email}</div>
				<div>ROLES : {loggedUser.user.roles}</div>
				<div>TOKEN :</div>
				<div className='overflow-x-scroll'>{loggedUser.user.token}</div>
			</div>
		</>
	) : (
		<>{console.log(loggedUser)}</>
	);
}

export default Profile;
