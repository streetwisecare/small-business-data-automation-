import { useState, useEffect } from 'react';
import { Plus, X, DollarSign, Calendar, Tag, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ExpensesProps {
  user: User;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  expense_date: string;
  created_at: string;
}

const EXPENSE_CATEGORIES = [
  'Fuel',
  'Equipment',
  'Supplies',
  'Maintenance',
  'Marketing',
  'Insurance',
  'Utilities',
  'Other',
];

export function Expenses({ user }: ExpensesProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Fuel',
    expense_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      expense_date: formData.expense_date,
      user_id: user.id,
    };

    if (editingExpense) {
      const { error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', editingExpense.id);

      if (error) {
        console.error('Error updating expense:', error);
      }
    } else {
      const { error } = await supabase.from('expenses').insert([expenseData]);

      if (error) {
        console.error('Error creating expense:', error);
      }
    }

    setShowModal(false);
    setEditingExpense(null);
    setFormData({
      description: '',
      amount: '',
      category: 'Fuel',
      expense_date: new Date().toISOString().split('T')[0],
    });
    loadExpenses();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      expense_date: expense.expense_date,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const { error } = await supabase.from('expenses').delete().eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
      } else {
        loadExpenses();
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const expensesByCategory = EXPENSE_CATEGORIES.map((category) => {
    const categoryExpenses = expenses.filter((exp) => exp.category === category);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total, count: categoryExpenses.length };
  }).filter((cat) => cat.count > 0);

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h2>
          <p className="text-gray-600">Track and manage your business expenses</p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setFormData({
              description: '',
              amount: '',
              category: 'Fuel',
              expense_date: new Date().toISOString().split('T')[0],
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-red-100 text-sm mb-1">Total Expenses</p>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Tag className="w-6 h-6" />
            </div>
          </div>
          <p className="text-orange-100 text-sm mb-1">Categories</p>
          <p className="text-3xl font-bold">{expensesByCategory.length}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-amber-100 text-sm mb-1">Total Entries</p>
          <p className="text-3xl font-bold">{expenses.length}</p>
        </div>
      </div>

      {expensesByCategory.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Expenses by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expensesByCategory.map((cat) => (
              <div key={cat.category} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{cat.category}</p>
                <p className="text-2xl font-bold text-gray-900">${cat.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{cat.count} entries</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No expenses yet</p>
            <p className="text-gray-400 text-sm">Start tracking your business expenses</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-gray-900">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-medium">{expense.description}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-gray-900 font-semibold text-lg">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingExpense(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter expense description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingExpense(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingExpense ? 'Update' : 'Add'} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
