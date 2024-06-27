import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import TransactionHistory from './TransactionHistory';
import PendingOrders from './PendingOrders';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import motion from framer-motion

const apiUrl = 'https://alabites-api.vercel.app';
const usersUrl = `${apiUrl}/users`;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    username: '',
    avatarFile: null,
    avatarBase64: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('recent'); // 'recent' or 'oldest'
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const storage = getStorage();

  useEffect(() => {
    const auth = getAuth();
    const fetchUserDetails = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const userIdResponse = await axios.get(usersUrl);
            const userDataArray = userIdResponse.data.data;
            const currentUserData = Array.isArray(userDataArray)
              ? userDataArray.find((userData) => userData.email === currentUser.email)
              : null;
            if (!currentUserData) throw new Error('User not found');
            setUser(currentUserData);
            setFormState({
              firstName: currentUserData.firstName,
              lastName: currentUserData.lastName,
              username: currentUserData.username,
              avatarBase64: currentUserData.studentavatar,
            });
            setTransactionHistory(currentUserData.transactionHistory || []);
            fetchPendingOrders(currentUserData.email);
          } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to fetch user details');
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
    };
    fetchUserDetails();
  }, []);

  const fetchPendingOrders = useCallback(async (email) => {
    try {
      const response = await axios.get(`${apiUrl}/orders`);
      let orders = response.data || [];

      // Apply search filter
      let filteredOrders = orders.filter(order => order.customer.email === email && order.orderStatus === 'Pending');
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Apply sort filter
      if (filterOption === 'recent') {
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filterOption === 'oldest') {
        filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      setPendingOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      toast.error('Failed to fetch pending orders');
    }
  }, [searchTerm, filterOption]);

  const refreshPendingOrders = useCallback(() => {
    if (user && user.email) {
      fetchPendingOrders(user.email);
    }
  }, [fetchPendingOrders, user]);
  

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    setFormState((prevState) => ({
      ...prevState,
      avatarFile: file,
    }));

    try {
      const storageRef = ref(storage, `user_avatar/${user.uid}_${file.name}`);

      // Delete previous avatar if exists
      if (user?.studentavatar) {
        const oldAvatarRef = ref(storage, user.studentavatar);
        await deleteObject(oldAvatarRef);
      }

      // Upload new avatar
      await uploadBytes(storageRef, file);

      // Get download URL and update state
      const downloadURL = await getDownloadURL(storageRef);
      setFormState((prevState) => ({
        ...prevState,
        avatarBase64: downloadURL,
      }));
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    }
  }, [storage, user]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    // Basic form validation
    if (!formState.firstName || !formState.lastName || !formState.username) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      let updatedAvatar = formState.avatarBase64;

      // Upload avatar if a new file is selected
      if (formState.avatarFile) {
        const storageRef = ref(storage, `user_avatar/${user.uid}_${formState.avatarFile.name}`);
        await uploadBytes(storageRef, formState.avatarFile);
        updatedAvatar = await getDownloadURL(storageRef);
      }

      // Update user info
      const updatedUserInfo = {
        ...user,
        ...formState,
        studentavatar: updatedAvatar,
      };

      const response = await axios.put(`${apiUrl}/users/${user.uid}`, updatedUserInfo);
      if (response.status === 200) {
        toast.success('Profile updated successfully');
        setUser(updatedUserInfo);
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSubmitting(false);
    }
  }, [storage, user, formState]);

  const handleDeleteAvatar = useCallback(async () => {
    if (user?.studentavatar) {
      const avatarRef = ref(storage, user.studentavatar);
      try {
        // Delete avatar from storage
        await deleteObject(avatarRef);

        // Update user info without avatar
        const updatedUser = { ...user, studentavatar: null };
        const response = await axios.put(`${apiUrl}/users/${user.uid}`, updatedUser);

        if (response.status === 200) {
          setFormState((prevState) => ({
            ...prevState,
            avatarBase64: null,
          }));
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
  }, [storage, user]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteConfirmation(false); // Reset delete confirmation state on modal close
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteAvatar();
    setDeleteConfirmation(false);
  };

  if (loading) {
    return <div className="loader">Loading...</div>; // Add a loader while fetching user data
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Profile Page</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            onClick={openModal}
          >
            Edit Profile <FaEdit className="inline ml-2" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {formState.avatarBase64 && (
            <img src={formState.avatarBase64} alt="User Avatar" className="w-24 h-24 rounded-full object-cover" />
          )}
          <div>
            <h3 className="text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-gray-600">@{user?.username}</p>
          </div>
        </div>
        <PendingOrders
          pendingOrders={pendingOrders}
          searchTerm={searchTerm}
          filterOption={filterOption}
          onRefresh={refreshPendingOrders}
          setSearchTerm={setSearchTerm} // Pass setSearchTerm as prop
          setFilterOption={setFilterOption} // Pass setFilterOption as prop
        />
      </div>
      <div className="mt-4">
        <TransactionHistory
          transactions={transactionHistory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />
      </div>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="modal-content bg-white p-4 rounded-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">First Name:</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={formState.firstName}
                  onChange={(e) =>
                    setFormState((prevState) => ({ ...prevState, firstName: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Last Name:</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={formState.lastName}
                  onChange={(e) =>
                    setFormState((prevState) => ({ ...prevState, lastName: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Username:</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={formState.username}
                  onChange={(e) =>
                    setFormState((prevState) => ({ ...prevState, username: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Avatar:</label>
                <input type="file" onChange={handleFileChange} />
                {formState.avatarBase64 && (
                  <div className="mt-2 flex items-center">
                    <img src={formState.avatarBase64} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover" />
                    <button
                      type="button"
                      className="ml-4 text-red-500 hover:underline"
                      onClick={handleDeleteConfirmation}
                    >
                      <FaTrash className="inline mr-1" /> Delete Avatar
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                  disabled={submitting}
                >
                  Save Changes
                </button>
              </div>
            </form>
            {deleteConfirmation && (
              <div className="mt-4 p-4 bg-red-100 rounded">
                <p className="text-red-700">Are you sure you want to delete your avatar?</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                    onClick={() => setDeleteConfirmation(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                    onClick={handleConfirmDelete}
                    disabled={submitting}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
