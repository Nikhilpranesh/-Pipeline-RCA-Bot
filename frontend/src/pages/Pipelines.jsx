import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, FileOutput, Server } from 'lucide-react';

const Pipelines = () => {
  const [pipelines, setPipelines] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPipeline, setNewPipeline] = useState({ pipelineName: '', description: '' });
  const navigate = useNavigate();

  const fetchPipelines = async () => {
    try {
      const res = await api.get('/pipelines');
      setPipelines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pipelines', newPipeline);
      setModalOpen(false);
      setNewPipeline({ pipelineName: '', description: '' });
      fetchPipelines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pipeline?')) {
      try {
        await api.delete(`/pipelines/${id}`);
        fetchPipelines();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Pipelines</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          <span>New Pipeline</span>
        </button>
      </div>

      <div className="bg-gray-900 shadow-xl border border-gray-800 rounded-xl overflow-hidden text-gray-200">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-950">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {pipelines.map((pipeline) => (
              <tr key={pipeline._id} className="hover:bg-gray-800/50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Server className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{pipeline.pipelineName}</p>
                      <p className="text-xs text-gray-500">{pipeline.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pipeline.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                    pipeline.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {pipeline.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(pipeline.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button onClick={() => navigate(`/rca/${pipeline._id}`)} className="text-indigo-400 hover:text-indigo-300">
                    <FileOutput className="w-5 h-5 inline" /> Analyze
                  </button>
                  <button onClick={() => handleDelete(pipeline._id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {pipelines.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No pipelines found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Create Pipeline</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Pipeline Name</label>
                <input
                  type="text"
                  required
                  className="w-full border-gray-700 bg-gray-800 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={newPipeline.pipelineName}
                  onChange={(e) => setNewPipeline({ ...newPipeline, pipelineName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  className="w-full border-gray-700 bg-gray-800 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24"
                  value={newPipeline.description}
                  onChange={(e) => setNewPipeline({ ...newPipeline, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipelines;
