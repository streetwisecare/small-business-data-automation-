import { useState, useEffect } from 'react';
import { FileText, Plus, X, Edit2, Trash2, DollarSign, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface InvoicesProps {
  user: User;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  notes: string;
  client_id: string;
  client?: {
    name: string;
  };
}

interface Client {
  id: string;
  name: string;
}

export function Invoices({ user }: InvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    invoice_number: '',
    client_id: '',
    amount: '',
    status: 'draft',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    paid_date: '',
    notes: '',
  });

  useEffect(() => {
    loadInvoices();
    loadClients();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(name)
      `)
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error loading invoices:', error);
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  };

  const loadClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error loading clients:', error);
    } else {
      setClients(data || []);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      user_id: user.id,
      invoice_number: formData.invoice_number || generateInvoiceNumber(),
      client_id: formData.client_id,
      amount: parseFloat(formData.amount),
      status: formData.status,
      issue_date: formData.issue_date,
      due_date: formData.due_date,
      paid_date: formData.paid_date || null,
      notes: formData.notes,
    };

    if (editingInvoice) {
      const { error } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', editingInvoice.id);

      if (error) {
        console.error('Error updating invoice:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('invoices')
        .insert([invoiceData]);

      if (error) {
        console.error('Error creating invoice:', error);
        return;
      }
    }

    setShowModal(false);
    setEditingInvoice(null);
    setFormData({
      invoice_number: '',
      client_id: '',
      amount: '',
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: '',
      paid_date: '',
      notes: '',
    });
    loadInvoices();
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoice_number: invoice.invoice_number,
      client_id: invoice.client_id,
      amount: invoice.amount.toString(),
      status: invoice.status,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      paid_date: invoice.paid_date || '',
      notes: invoice.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invoice:', error);
    } else {
      loadInvoices();
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', invoice.id);

    if (error) {
      console.error('Error marking invoice as paid:', error);
    } else {
      loadInvoices();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'sent':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Invoices</h2>
            <p className="text-gray-600">Track and manage your invoices and payments</p>
          </div>
          <button
            onClick={() => {
              setEditingInvoice(null);
              setFormData({
                invoice_number: generateInvoiceNumber(),
                client_id: '',
                amount: '',
                status: 'draft',
                issue_date: new Date().toISOString().split('T')[0],
                due_date: '',
                paid_date: '',
                notes: '',
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            New Invoice
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Invoiced</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Paid</span>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">${paidAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Pending</span>
              <DollarSign className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-orange-600">${pendingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices yet</h3>
          <p className="text-gray-600 mb-6">Create your first invoice to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Your First Invoice
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{invoice.invoice_number}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    {invoice.client && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Client:</span>
                        <span>{invoice.client.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Issued:</span>
                      <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Due:</span>
                      <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${invoice.amount.toFixed(2)}
                  </div>
                  {invoice.notes && (
                    <p className="text-gray-600 text-sm mt-2">{invoice.notes}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {invoice.status !== 'paid' && (
                    <button
                      onClick={() => handleMarkAsPaid(invoice)}
                      className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium text-sm"
                      title="Mark as Paid"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Paid
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowModal(false);
                setEditingInvoice(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingInvoice ? 'Edit Invoice' : 'New Invoice'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paid Date
                  </label>
                  <input
                    type="date"
                    value={formData.paid_date}
                    onChange={(e) => setFormData({ ...formData, paid_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingInvoice(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
