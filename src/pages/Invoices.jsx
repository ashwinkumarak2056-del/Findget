import GlassCard from '../components/ui/GlassCard';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Invoices = () => {
  const { state } = useAppContext();
  const invoices = state.invoices || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Bulk Invoice Processing</h2>
          <p className="text-text-muted">Upload and process multiple invoices via AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 border-dashed border-2 border-fin-primary/30 flex flex-col items-center justify-center text-center p-12 hover:border-fin-primary transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-fin-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud size={32} className="text-fin-primary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">Drop Invoices Here</h3>
          <p className="text-sm text-text-muted mb-4">Support for PDF, JPG, PNG (Max 50 files)</p>
          <button className="glass-button w-full">Browse Files</button>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Recent Extractions</h3>
          
          <div className="space-y-3">
            {invoices.map((inv) => (
              <GlassCard key={inv.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    inv.status === 'processed' ? 'bg-fin-primary/10 text-fin-primary' : 
                    inv.status === 'flagged' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{inv.vendor}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                      <span>{inv.invoiceNumber}</span>
                      <span>•</span>
                      <span>{new Date(inv.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-text-primary">${inv.amount.toFixed(2)}</p>
                    <p className="text-xs text-text-muted">GST: ${inv.gst.toFixed(2)}</p>
                  </div>
                  
                  <div className="w-24 flex justify-end">
                    {inv.status === 'processed' && (
                      <span className="flex items-center gap-1 text-xs text-fin-primary bg-fin-primary/10 px-2 py-1 rounded-full">
                        <CheckCircle size={12} /> Auto-Matched
                      </span>
                    )}
                    {inv.status === 'flagged' && (
                      <span className="flex items-center gap-1 text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                        <AlertCircle size={12} /> Flagged
                      </span>
                    )}
                    {inv.status === 'pending' && (
                      <span className="flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
            {invoices.length === 0 && (
               <GlassCard className="p-8 text-center text-text-muted">
                 No recent invoices.
               </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
