import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Upload, RefreshCw, Download, AlertTriangle, Info, Terminal } from 'lucide-react';

const RcaReport = () => {
  const { id } = useParams();
  const [successLog, setSuccessLog] = useState(null);
  const [failureLog, setFailureLog] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);

  const fetchLatestReport = async () => {
    try {
      const res = await api.get(`/rca/pipeline/${id}`);
      if (res.data.length > 0) {
        setReport(res.data[0]); // Get the most recent one
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLatestReport();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!successLog || !failureLog) return alert('Please upload both logs.');
    
    const formData = new FormData();
    formData.append('pipelineId', id);
    formData.append('successLog', successLog);
    formData.append('failureLog', failureLog);

    setIsGenerating(true);
    try {
      await api.post('/logs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Trigger generation
      const rcaRes = await api.post('/rca/generate', { pipelineId: id });
      setReport(rcaRes.data);
    } catch (err) {
      console.error(err);
      alert('Error generating RCA: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    try {
      const response = await api.get(`/rca/${report._id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RCA_Report_${report._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error downloading PDF: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Root Cause Analysis</h1>
        {report && (
          <button onClick={handleDownloadPDF} className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition border border-gray-700">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Upload Logs for Analysis</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:bg-gray-800/50 transition">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-300 font-medium">Success Log (.log, .txt)</p>
            <input type="file" onChange={e => setSuccessLog(e.target.files[0])} className="mt-3 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-900 file:text-indigo-300 hover:file:bg-indigo-800 cursor-pointer" />
          </div>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:bg-gray-800/50 transition">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-3" />
            <p className="text-sm text-gray-300 font-medium">Failure Log (.log, .txt)</p>
            <input type="file" onChange={e => setFailureLog(e.target.files[0])} className="mt-3 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-900 file:text-red-300 hover:file:bg-red-800 cursor-pointer" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button 
              type="submit" 
              disabled={isGenerating}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition ${isGenerating ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
              <span>{isGenerating ? 'Analyzing with AI...' : 'Generate RCA Report'}</span>
            </button>
          </div>
        </form>
      </div>

      {report && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">PIPELINE FAILURE RCA REPORT</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Job Name</h3>
                <p className="text-xl font-bold text-white">{report.jobName}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Failure Time</h3>
                <p className="text-xl font-bold text-white">{report.failureTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-r-xl shadow-lg">
            <h3 className="text-lg font-bold text-red-400 flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 mr-2" /> Root Cause
            </h3>
            <p className="text-gray-200 leading-relaxed text-lg">{report.rootCause}</p>
          </div>

          <div className="bg-purple-500/10 border-l-4 border-purple-500 p-6 rounded-r-xl shadow-lg">
            <h3 className="text-lg font-bold text-purple-400 flex items-center mb-3">
              <Info className="w-5 h-5 mr-2" /> Evidence
            </h3>
            <ul className="space-y-2">
              {report.evidence && report.evidence.length > 0 ? (
                report.evidence.map((item, index) => (
                  <li key={index} className="text-gray-200 leading-relaxed flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No evidence available</li>
              )}
            </ul>
          </div>

          {report.logDifferences && (report.logDifferences.missingInFailure?.length > 0 || report.logDifferences.unexpectedInFailure?.length > 0) && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-white flex items-center mb-4">
                <Terminal className="w-5 h-5 mr-2" /> Log Differences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.logDifferences.missingInFailure && report.logDifferences.missingInFailure.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-orange-400 mb-3 uppercase tracking-wide">Missing in failure</h4>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {report.logDifferences.missingInFailure.map((line, index) => (
                        <div key={index} className="text-xs text-gray-300 font-mono bg-orange-900/20 px-2 py-1 rounded">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {report.logDifferences.unexpectedInFailure && report.logDifferences.unexpectedInFailure.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-red-400 mb-3 uppercase tracking-wide">Unexpected in failure</h4>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {report.logDifferences.unexpectedInFailure.map((line, index) => (
                        <div key={index} className="text-xs text-gray-300 font-mono bg-red-900/20 px-2 py-1 rounded">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {report.logDifferences.flowDivergence && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-400 font-semibold text-sm">⚠️ Flow divergence detected</span>
                </div>
              )}
            </div>
          )}

          <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-r-xl shadow-lg">
            <h3 className="text-lg font-bold text-orange-400 flex items-center mb-3">
              <Info className="w-5 h-5 mr-2" /> Impact
            </h3>
            <p className="text-gray-200 leading-relaxed text-lg">{report.impact}</p>
          </div>
          
          <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-r-xl shadow-lg">
            <h3 className="text-lg font-bold text-green-400 flex items-center mb-3">
              <RefreshCw className="w-5 h-5 mr-2" /> Recommended Action
            </h3>
            <ol className="space-y-3">
              {report.recommendedAction && report.recommendedAction.length > 0 ? (
                report.recommendedAction.map((action, index) => (
                  <li key={index} className="text-gray-200 leading-relaxed flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No recommendations available</li>
              )}
            </ol>
          </div>

          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-lg">
            <h3 className="text-lg font-bold text-blue-400 flex items-center mb-3">
              <RefreshCw className="w-5 h-5 mr-2" /> Confidence Score
            </h3>
            <div className="flex items-end space-x-3">
              <span className="text-5xl font-extrabold text-white">{report.confidenceScore}%</span>
              <span className="text-gray-400 pb-2 text-lg">AI Confidence</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RcaReport;
