import React from 'react';
import { Building2, Plus, Trash2 } from 'lucide-react';
import { Branch } from '../../types';

interface BranchManagementProps {
  branches: Branch[];
  onOpenBranchModal: () => void;
  onDeleteBranch: (id: string) => void;
}

export const BranchManagement: React.FC<BranchManagementProps> = ({
  branches,
  onOpenBranchModal,
  onDeleteBranch,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border p-4 rounded-2xl shadow-xs">
        <div>
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Active Institutional Campuses ({branches.length})
          </h3>
          <p className="text-xs text-muted-foreground">Manage multi-branch campus locations and contact information.</p>
        </div>
        <button
          onClick={onOpenBranchModal}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-primary font-bold uppercase">{b.code}</span>
                <h4 className="font-bold text-foreground text-base mt-1">{b.name}</h4>
                <p className="text-xs text-muted-foreground">{b.address}</p>
              </div>
              <button
                onClick={() => onDeleteBranch(b.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
              <span>Principal: <strong className="text-foreground">{b.principalName}</strong></span>
              <span>Phone: <strong className="text-foreground">{b.phone}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
