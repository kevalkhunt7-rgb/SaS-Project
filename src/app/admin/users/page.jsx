"use client";

import React, { useState, useEffect } from "react";
import { 
  RiSearchLine, 
  RiFilter3Line, 
  RiMore2Fill,
  RiMailLine,
  RiTimeLine,
  RiShieldUserLine,
  RiDeleteBin6Line
} from "react-icons/ri";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRoleChange = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating user role...");
    try {
      const res = await adminApi.updateUserRole({ userId, role: newRole });
      if (res.data.success) {
        toast.success("User role updated successfully", { id: loadingToast });
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role", { id: loadingToast });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user and their associated business? This action cannot be undone.")) {
      const loadingToast = toast.loading("Deleting user...");
      try {
        const res = await adminApi.deleteUser(userId);
        if (res.data.success) {
          toast.success("User deleted successfully", { id: loadingToast });
          fetchUsers();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(error.response?.data?.message || "Failed to delete user", { id: loadingToast });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">User Management</h2>
          <p className="text-slate-500">Manage all registered users and their permissions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all w-full md:w-64"
            />
          </div>
          <button className="bg-white border border-slate-200 p-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
            <RiFilter3Line size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Business</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold border border-violet-200">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <RiMailLine /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer
                        ${user.role === 'admin' ? 'bg-violet-100 text-violet-600' : 
                          user.role === 'owner' ? 'bg-blue-100 text-blue-600' : 
                          'bg-slate-100 text-slate-600'}`}
                    >
                      <option value="customer">Customer</option>
                      <option value="agent">Agent</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    {user.business ? (
                      <span className="text-sm font-medium text-slate-700">{user.business.businessName}</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-300 italic">No Business</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-700 flex items-center gap-1">
                      <RiTimeLine className="text-slate-400" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <RiMore2Fill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
