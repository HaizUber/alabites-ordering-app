import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

const apiUrl = 'https://alabites-api.vercel.app/users';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const storage = getStorage();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userIdResponse = await axios.get(apiUrl);
          const userDataArray = userIdResponse.data.data;
          const currentUserData = Array.isArray(userDataArray)
            ? userDataArray.find((userData) => userData.email === currentUser.email)
            : null;
          if (!currentUserData) throw new Error('User not found');
          setUid(currentUserData.uid);
          setUser(currentUserData);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUsername(user.username);
      setAvatarBase64(user.studentavatar);
    }
  }, [user]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
  
    try {
      const storageRef = ref(storage, `user_avatar/${uid}_${file.name}`);
  
      // Check if there's an existing avatar to delete
      if (user?.studentavatar) {
        const oldAvatarRef = ref(storage, user.studentavatar);
        await deleteObject(oldAvatarRef);
      }
  
      // Upload the new avatar
      await uploadBytes(storageRef, file);
  
      // Get the download URL and set it as the avatarBase64
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      setAvatarBase64(downloadURL);
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      let updatedAvatar = avatarBase64;

      if (avatarFile) {
        const storageRef = ref(storage, `user_avatar/${uid}_${avatarFile.name}`);
        await uploadBytes(storageRef, avatarFile);
        updatedAvatar = await getDownloadURL(storageRef);
      }

      const updatedUserInfo = {
        ...user,
        firstName,
        lastName,
        username,
        studentavatar: updatedAvatar,
      };

      const response = await axios.put(`${apiUrl}/${user.uid}`, updatedUserInfo);
      if (response.status === 200) {
        toast.success('Profile updated successfully');
        setUser(updatedUserInfo);
        closeModal(); // Close modal after successful update
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (user?.studentavatar) {
      const avatarRef = ref(storage, user.studentavatar);
      try {
        await deleteObject(avatarRef);

        const updatedUser = { ...user, studentavatar: null };
        const response = await axios.put(`${apiUrl}/${user.uid}`, updatedUser);

        if (response.status === 200) {
          setAvatarBase64(null);
          setUser((prev) => ({ ...prev, studentavatar: null }));
          toast.success('Avatar deleted successfully');
        } else {
          throw new Error(response.data.message || 'Failed to delete avatar');
        }
      } catch (error) {
        console.error('Error deleting avatar:', error);
        toast.error('Error deleting avatar');
      }
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:w-2/3 lg:w-1/2 w-full fade-in">
        <div className="flex flex-col items-center">
          <img
            src={user.studentavatar ? user.studentavatar : 'https://via.placeholder.com/150'}
            alt="User Avatar"
            className="rounded-full w-32 h-32 mb-4"
          />
          <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-600">@{user.username}</p>
          <p className="text-gray-600">Student Number: {user.studentNumber}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Tamcredits Balance</h3>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <span className="text-3xl font-bold text-blue-600">{user.currencyBalance}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
          <ul className="space-y-4">
            {user.transactionHistory.map((transaction) => (
              <li key={transaction._id} className="bg-gray-200 p-4 rounded-lg flex justify-between">
                <span>{transaction.description || 'No Description'}</span>
                <span>{transaction.type === 'tamcredits' ? '+' : '-'}${transaction.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={openModal}
          className="mt-4 w-full p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      {/* Modal for Profile Edit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={closeModal}></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl z-50 max-w-md w-full p-6">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Avatar</label>
                <input type="file" onChange={handleFileChange} className="mt-1 block w-full" />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-4 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
