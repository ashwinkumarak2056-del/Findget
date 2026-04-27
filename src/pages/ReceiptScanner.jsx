import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, FileText, Loader2, AlertCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { extractReceiptData } from '../utils/ocrEngine';
import { useAppContext } from '../context/AppContext';

const ReceiptScanner = () => {
  const { dispatch } = useAppContext();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, scanning, review, success, error
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setStatus('scanning');
    setProgress(0);

    try {
      const data = await extractReceiptData(selectedFile, (p) => {
        setProgress(Math.round(p * 100));
      });
      setExtractedData(data);
      setStatus('review');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const newExpense = {
      id: Date.now().toString(),
      ...extractedData,
      amount: parseFloat(extractedData.amount),
      gst: parseFloat(extractedData.gst)
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    setStatus('success');
    
    setTimeout(() => {
      setStatus('idle');
      setFile(null);
      setExtractedData(null);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Smart Receipt Scanner</h2>
        <p className="text-[var(--text-muted)]">Upload a receipt or invoice to automatically extract data and categorize expenses using AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <GlassCard className="h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          {status === 'idle' || status === 'error' ? (
            <form 
              onDragEnter={handleDrag} 
              onDragLeave={handleDrag} 
              onDragOver={handleDrag} 
              onDrop={handleDrop}
              className={`w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
                dragActive ? 'border-fin-primary bg-fin-primary/10' : 'border-[var(--border-color)] hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <input type="file" id="file-upload" className="hidden" accept="image/*,.pdf" onChange={handleChange} />
              <UploadCloud size={64} className={`mb-4 ${dragActive ? 'text-fin-primary' : 'text-[var(--text-muted)]'}`} />
              <h3 className="text-lg font-bold text-center mb-2">Drag & Drop Receipt</h3>
              <p className="text-sm text-[var(--text-muted)] text-center mb-6">Supports JPG, PNG, PDF up to 10MB</p>
              <label htmlFor="file-upload" className="glass-button cursor-pointer">
                Browse Files
              </label>
              
              {status === 'error' && (
                <div className="absolute bottom-4 flex items-center text-red-400 text-sm">
                  <AlertCircle size={16} className="mr-1" /> OCR failed. Please try a clearer image.
                </div>
              )}
            </form>
          ) : status === 'scanning' ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <Loader2 size={64} className="text-fin-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-fin-primary">
                  {progress}%
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 animate-pulse">Running AI OCR...</h3>
              <p className="text-sm text-[var(--text-muted)] text-center">Extracting merchant, amount, and items.</p>
            </div>
          ) : status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center text-fin-primary"
            >
              <CheckCircle size={64} className="mb-4" />
              <h3 className="text-lg font-bold">Expense Saved Successfully!</h3>
            </motion.div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <FileText size={64} className="text-[var(--text-muted)] mb-4" />
              <h3 className="text-lg font-bold text-center mb-2">{file?.name}</h3>
              <p className="text-sm text-fin-primary text-center mb-6">Extraction Complete</p>
              <button onClick={() => setStatus('idle')} className="text-sm text-[var(--text-muted)] hover:underline">
                Scan another
              </button>
            </div>
          )}
        </GlassCard>

        {/* Results Section */}
        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-4">Extracted Data</h3>
          
          {status === 'review' && extractedData ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="text-xs text-[var(--text-muted)] block mb-1">Merchant</label>
                  <input 
                    type="text" 
                    className="glass-input font-medium" 
                    value={extractedData.merchant}
                    onChange={(e) => setExtractedData({...extractedData, merchant: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Total Amount (₹)</label>
                    <input 
                      type="text" 
                      className="glass-input font-medium text-fin-primary" 
                      value={`₹${extractedData.amount}`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Extracted Date</label>
                    <div className="glass-input font-medium flex items-center justify-between opacity-80">
                      <span>{extractedData.date || 'Not Found'}</span>
                      <CheckCircle size={14} className="text-fin-primary" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Category (AI Suggested)</label>
                    <input 
                      type="text" 
                      className="glass-input text-blue-400" 
                      value={extractedData.category}
                      onChange={(e) => setExtractedData({...extractedData, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Payment Mode</label>
                    <input 
                      type="text" 
                      className="glass-input" 
                      value={extractedData.paymentMode}
                      onChange={(e) => setExtractedData({...extractedData, paymentMode: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                <button onClick={handleSave} className="w-full glass-button flex justify-center items-center bg-fin-primary/20 hover:bg-fin-primary/30">
                  <CheckCircle size={18} className="mr-2" />
                  Confirm & Save Expense
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center opacity-50">
              <p className="text-sm text-center">Upload a receipt to view extracted data</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default ReceiptScanner;
