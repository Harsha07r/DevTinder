import React from 'react'
import EditProfile from './EditProfile.jsx';
import {useSelector} from 'react-redux';
const Profile = () => {
    const user = useSelector((store) => store.user.user);
  return (
  user ? (
    <div>
      <EditProfile user={user} />
    </div>
  ) : null
);
}

export default Profile
