import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Title from "../../components/UI/Title";

function Profile() {
	const { loggedUser } = useContext(AuthContext);

	return loggedUser.user ? (
		<>
			<Title text='Profile'></Title>
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
