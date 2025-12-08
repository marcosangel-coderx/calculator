import React, { useState } from 'react';
import { Plus, Receipt, Edit, Trash2 } from 'lucide-react';

export interface Reimbursement {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface ReimbursementFormProps {
  reimbursements: Reimbursement[];
  onAddReimbursement: (reimbursement: Omit<Reimbursement, 'id'>) => void;
  onEditReimbursement: (reimbursement: Reimbursement) => void;
  onRemoveReimbursement: (id: number) => void;
}

export default function ReimbursementForm({ 
  reimbursements, 
  onAddReimbursement, 
  onEditReimbursement, 
  onRemoveReimbursement 
}: ReimbursementFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const categories = [
    'Transportation',
    'Meals',
    'Office Supplies',
    'Internet/Data',
    'Software/Tools',
    'Training/Education',
    'Other'
  ];

  React.useEffect(() => {
    if (!date) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !date || !category) {
      alert('Please fill all fields');
      return;
    }

    const reimbursementData = {
      description,
      amount: parseFloat(amount),
      date,
      category
    };

    if (editingId) {
      onEditReimbursement({ ...reimbursementData, id: editingId });
      setEditingId(null);
    } else {
      onAddReimbursement(reimbursementData);
    }

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
    
    // Keep date as today for convenience
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  };

  const handleEdit = (reimbursement: Reimbursement) => {
    setDescription(reimbursement.description);
    setAmount(reimbursement.amount.toString());
    setDate(reimbursement.date);
    setCategory(reimbursement.category);
    setEditingId(reimbursement.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setCategory('');
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  };

  const totalReimbursements = reimbursements.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-8 transition-all duration-300 hover:shadow-lg hover:border-blue-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Receipt className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600">
          {editingId ? 'Edit Reimbursement' : 'Add Reimbursement'}
        </h3>
        {totalReimbursements > 0 && (
          <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
            Total: ₱{totalReimbursements.toFixed(2)}
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Taxi fare, Lunch meeting"
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 hover:border-blue-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">
              Amount (₱)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 hover:border-blue-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 hover:border-blue-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 hover:border-blue-300"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            {editingId ? 'Update Reimbursement' : 'Add Reimbursement'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {reimbursements.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-blue-700 mb-3">Reimbursements List</h4>
          {reimbursements.map((reimbursement) => (
            <div
              key={reimbursement.id}
              className="bg-white p-3 rounded-lg border border-blue-200 flex items-center justify-between transition-all duration-300 hover:border-blue-300 hover:shadow-md group"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                    {reimbursement.category}
                  </span>
                  <span className="font-semibold text-gray-800">{reimbursement.description}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>₱{reimbursement.amount.toFixed(2)}</span>
                  <span>{new Date(reimbursement.date + 'T00:00:00').toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleEdit(reimbursement)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-all duration-200 hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemoveReimbursement(reimbursement.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}