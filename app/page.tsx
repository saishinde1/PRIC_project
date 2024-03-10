'use client'
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserData {
  id: string;
  name: string;
  phone: string;
  email: string;
}

async function fetchData(): Promise<UserData[]> {
  const querySnapshot = await getDocs(collection(db, "1"));
  const data: UserData[] = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() } as UserData);
  });
  return data;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<{ inserting: string, updating: string }>({ inserting: '', updating: '' });
  const [editUser, setEditUser] = useState<UserData>({ id: '', name: '', phone: '', email: '' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'add' | 'search'>('add');

  useEffect(() => {
    async function getData() {
      const data = await fetchData();
      setUserData(data);
    }
    getData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name.trim() === '' ||
      formData.phone.trim() === '' ||
      formData.email.trim() === '' ||
      !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(formData.phone.trim()) ||
      !/^\S+@\S+\.\S+$/.test(formData.email.trim())
    ) {
      setError({ ...error, inserting: "Please enter valid data" });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, '1'), { ...formData, phone: parseInt(formData.phone) });
      const newUser = { id: docRef.id, ...formData, phone: formData.phone };
      setUserData([...userData, newUser]);
      setFormData({ name: '', phone: '', email: '' });
      setError({ ...error, inserting: '' });
      toast.success("User added successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error adding user:", error);
      setError((prevError) => ({ ...prevError, inserting: "Error adding user: " + (error as Error).message }));

    }
  };

  const handleEdit = (user: UserData) => {
    setEditUser(user);
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditEmail(user.email);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (
      editName.trim() === '' ||
      editPhone.trim() === '' ||
      editEmail.trim() === '' ||
      !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(editPhone.trim()) ||
      !/^\S+@\S+\.\S+$/.test(editEmail.trim())
    ) {
      setError({ ...error, updating: "Please enter valid data" });
      return;
    }

    try {
      const userDocRef = doc(db, '1', editUser.id);
      await updateDoc(userDocRef, {
        name: editName,
        phone: parseInt(editPhone),
        email: editEmail
      });
      setIsEditing(false);
      fetchData();
      setError({ ...error, updating: '' });
      toast.success("User details updated successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error updating user:", error);
      setError((prevError) => ({ ...prevError, updating: "Error updating user: " + (error as Error).message }));
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "1", userId));
      setUserData(userData.filter(user => user.id !== userId));
      toast.success("User deleted successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError({ ...error, updating: '', inserting: '' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = userData.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
      <div className="flex mb-4">
        <button
          className={`mr-4 px-4 py-2 rounded-lg focus:outline-none ${activeTab === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('add')}
        >
          Add User
        </button>
        <button
          className={`px-4 py-2 rounded-lg focus:outline-none ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('search')}
        >
          Search Users
        </button>
      </div>
      {activeTab === 'add' ? (
        <div>
          <form onSubmit={handleSubmit} className="mb-4">
            <label className="block mb-2">
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 p-2 border border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md" />
            </label>
            <label className="block mb-2">
              Phone:
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 p-2 border border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md" />
            </label>
            <label className="block mb-2">
              Email:
              <input type="text" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 border border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md" />
            </label>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add User</button>
            {error.inserting && <div className="text-red-500 mt-2">{error.inserting}</div>}
          </form>
        </div>
      ) : (
        <div>
          <label className="block mb-2">
            Search by Name:
            <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Enter name to search" className="mt-1 p-2 border border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md" />
          </label>
          <div className="overflow-x-auto">
            <table className="table-auto w-full color:white border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 bg-gray-200"></th>
                  <th className="px-6 py-3 bg-gray-200"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="bg-blue shadow-md rounded-lg mb-4">
                    <td className="border px-6 py-4">{user.name}</td>
                    <td className="border px-6 py-4">{user.phone}</td>
                    <td className="border px-6 py-4">{user.email}</td>
                    <td className="border px-6 py-4">
                      <button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                    </td>
                    <td className="border px-6 py-4">
                      <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isEditing && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-blue px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit User Details</h3>
                    {error.updating && <div className="text-red-500 mb-4">{error.updating}</div>}
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 p-2 border border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="text" id="phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="mt-1 p-2 border border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" id="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="mt-1 p-2 border border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleUpdate} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
                <button onClick={handleCancel} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
