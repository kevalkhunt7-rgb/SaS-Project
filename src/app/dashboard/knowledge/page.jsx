"use client";

import React, { useState, useEffect } from "react";
import { 
  RiAddLine, 
  RiSearchLine, 
  RiBookLine, 
  RiDeleteBinLine, 
  RiEditLine,
  RiGlobalLine,
  RiFileUploadLine,
  RiRobotLine
} from "react-icons/ri";
import { knowledgeApi } from "@/lib/api";
import { toast } from "react-hot-toast";

const KnowledgeBase = () => {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({ id: "", title: "", content: "" });
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await knowledgeApi.getMyKnowledge();
      if (res.data.success) {
       setKnowledge(res.data.knowledge || res.data.knowledges || []);
      }
    } catch (error) {
      console.error("Error fetching knowledge:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("title", fileToUpload.name);

    setLoading(true);
    try {
      const res = await knowledgeApi.upload(formData);
      if (res.data.success) {
        setIsUploading(false);
        setFileToUpload(null);
        toast.success("File processed successfully!");
        fetchKnowledge();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response?.data?.message || "Error processing file");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await knowledgeApi.create(newEntry); 
      if (res.data.success) {
        setIsAdding(false);
        setNewEntry({ title: "", content: "" });
        toast.success("Entry added successfully!");
        fetchKnowledge();
      }
    } catch (error) {
      console.error("Error creating knowledge:", error);
      toast.error("Failed to add entry");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await knowledgeApi.update(currentEntry.id, {
        title: currentEntry.title,
        content: currentEntry.content
      });
      if (res.data.success) {
        setIsEditing(false);
        setCurrentEntry({ id: "", title: "", content: "" });
        toast.success("Entry updated successfully!");
        fetchKnowledge();
      }
    } catch (error) {
      console.error("Error updating knowledge:", error);
      toast.error("Failed to update entry");
    }
  };

  const openEditModal = (item) => {
    setCurrentEntry({
      id: item._id,
      title: item.title,
      content: item.content
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
     if (!id) {
      toast.error("Knowledge ID missing");
      return;
    }
    if (window.confirm("Are you sure you want to delete this knowledge entry?")) {
      try {
        const res = await knowledgeApi.delete(id);
        if (res.data.success) {
          toast.success("Entry deleted successfully");
          fetchKnowledge();
        }
      } catch (error) {
        console.error("Error deleting knowledge:", error);
        toast.error("Failed to delete entry");
      }
    }
  };

 const filteredKnowledge = (knowledge || []).filter(k =>
  (k.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (k.content || "").toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-slate-500 font-medium mt-1">Train your AI with business data</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            <RiAddLine size={20} />
            Add Entry
          </button>
          <button 
            onClick={() => setIsUploading(true)}
            className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <RiFileUploadLine size={20} />
            Upload File
          </button>
        </div>
      </div>

      {/* Stats and Training */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-500/30">
            <RiRobotLine size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Status: Ready</h3>
            <p className="text-slate-400 text-sm font-medium">Last trained 2 hours ago • {knowledge.length} documents indexed</p>
          </div>
        </div>
        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all">
          Train AI Model
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative max-w-md">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search your knowledge base..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
        />
      </div>

      {/* Knowledge List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-[2rem] animate-pulse" />)
        ) : filteredKnowledge.length > 0 ? (
          filteredKnowledge.map((item) => (
            <div key={item._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <RiBookLine size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">General FAQ</p>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm font-medium line-clamp-4 mb-6 flex-1 leading-relaxed">
                {item.content}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <RiEditLine size={18} />
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
                <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full uppercase">
                  {new Date(item.createdDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
            <RiBookLine size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-900">No knowledge entries found</h3>
            <p className="text-slate-500 font-medium">Start by adding your first business document</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Knowledge Entry</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <RiAddLine size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Title</label>
                <input 
                  required
                  type="text" 
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="e.g. Refund Policy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Content</label>
                <textarea 
                  required
                  rows={8}
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  placeholder="Paste your business information here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Upload Document</h2>
              <button onClick={() => setIsUploading(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <RiAddLine size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleFileUpload} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group relative">
                  <input 
                    type="file" 
                    onChange={(e) => setFileToUpload(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.docx,.txt"
                  />
                  <RiFileUploadLine size={48} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-4 transition-all" />
                  <p className="text-slate-600 font-bold">{fileToUpload ? fileToUpload.name : "Click to select or drag and drop"}</p>
                  <p className="text-slate-400 text-xs mt-2 font-medium">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!fileToUpload || loading}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Start Training"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Knowledge Entry</h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <RiAddLine size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Title</label>
                <input 
                  required
                  type="text" 
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Content</label>
                <textarea 
                  required
                  rows={8}
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  Update Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
