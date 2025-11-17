import { useState, useEffect } from 'react';
import { BarChart3, DollarSign, TrendingUp, Users, Calendar, CheckCircle, FileText, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ReportsProps {
  user: User;
}

interface Stats {
  totalRevenue: number;
  totalJobs: number;
  completedJobs: number;
  totalClients: number;
  pendingInvoices: number;
  paidInvoices: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  overdueInvoices: number;
  invoiceRevenueThisMonth: number;
  invoiceRevenueLastMonth: number;
  totalExpenses: number;
  expensesThisMonth: number;
  expensesLastMonth: number;
  paidInvoicesCount: number;
}

export function Reports({ user }: ReportsProps) {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalJobs: 0,
    completedJobs: 0,
    totalClients: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    totalInvoices: 0,
    draftInvoices: 0,
    sentInvoices: 0,
    overdueInvoices: 0,
    invoiceRevenueThisMonth: 0,
    invoiceRevenueLastMonth: 0,
    totalExpenses: 0,
    expensesThisMonth: 0,
    expensesLastMonth: 0,
    paidInvoicesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    const [jobsRes, clientsRes, invoicesRes, thisMonthJobsRes, lastMonthJobsRes, expensesRes] = await Promise.all([
      supabase.from('jobs').select('*'),
      supabase.from('clients').select('id'),
      supabase.from('invoices').select('*'),
      supabase.from('jobs').select('amount').gte('scheduled_date', thisMonthStart),
      supabase.from('jobs').select('amount').gte('scheduled_date', lastMonthStart).lt('scheduled_date', lastMonthEnd),
      supabase.from('expenses').select('*'),
    ]);

    const jobs = jobsRes.data || [];
    const clients = clientsRes.data || [];
    const invoices = invoicesRes.data || [];
    const thisMonthJobs = thisMonthJobsRes.data || [];
    const lastMonthJobs = lastMonthJobsRes.data || [];
    const expenses = expensesRes.data || [];

    const paidInvoicesData = invoices.filter(inv => inv.status === 'paid');
    const paidInvoicesAmount = paidInvoicesData.reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoicesCount = paidInvoicesData.length;

    const totalRevenue = jobs.reduce((sum, job) => sum + (job.amount || 0), 0) + paidInvoicesAmount;
    const completedJobsCount = jobs.filter(job => job.status === 'completed').length;
    const totalCompletedItems = completedJobsCount + paidInvoicesCount;
    const pendingInvoices = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0);

    const thisMonthPaidInvoices = paidInvoicesData.filter(inv => inv.issue_date >= thisMonthStart);
    const lastMonthPaidInvoices = paidInvoicesData.filter(inv =>
      inv.issue_date >= lastMonthStart && inv.issue_date < thisMonthStart
    );

    const revenueThisMonth = thisMonthJobs.reduce((sum, job) => sum + (job.amount || 0), 0) +
      thisMonthPaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const revenueLastMonth = lastMonthJobs.reduce((sum, job) => sum + (job.amount || 0), 0) +
      lastMonthPaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const totalInvoices = invoices.length;
    const draftInvoices = invoices.filter(inv => inv.status === 'draft').length;
    const sentInvoices = invoices.filter(inv => inv.status === 'sent').length;
    const overdueInvoices = invoices.filter(inv =>
      inv.status !== 'paid' && new Date(inv.due_date) < new Date(today)
    ).length;

    const thisMonthInvoices = invoices.filter(inv => inv.issue_date >= thisMonthStart);
    const lastMonthInvoices = invoices.filter(inv =>
      inv.issue_date >= lastMonthStart && inv.issue_date < thisMonthStart
    );

    const invoiceRevenueThisMonth = thisMonthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const invoiceRevenueLastMonth = lastMonthInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const thisMonthExpenses = expenses.filter(exp => exp.expense_date >= thisMonthStart);
    const lastMonthExpenses = expenses.filter(exp =>
      exp.expense_date >= lastMonthStart && exp.expense_date < thisMonthStart
    );
    const expensesThisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expensesLastMonth = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    setStats({
      totalRevenue,
      totalJobs: jobs.length + paidInvoicesCount,
      completedJobs: totalCompletedItems,
      totalClients: clients.length,
      pendingInvoices,
      paidInvoices: paidInvoicesAmount,
      revenueThisMonth,
      revenueLastMonth,
      totalInvoices,
      draftInvoices,
      sentInvoices,
      overdueInvoices,
      invoiceRevenueThisMonth,
      invoiceRevenueLastMonth,
      totalExpenses,
      expensesThisMonth,
      expensesLastMonth,
      paidInvoicesCount,
    });

    setLoading(false);
  };

  const revenueGrowth = stats.revenueLastMonth > 0
    ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth * 100)
    : 0;

  const invoiceGrowth = stats.invoiceRevenueLastMonth > 0
    ? ((stats.invoiceRevenueThisMonth - stats.invoiceRevenueLastMonth) / stats.invoiceRevenueLastMonth * 100)
    : 0;

  const completionRate = stats.totalJobs > 0
    ? (stats.completedJobs / stats.totalJobs * 100)
    : 0;

  const collectionRate = (stats.paidInvoices + stats.pendingInvoices) > 0
    ? (stats.paidInvoices / (stats.paidInvoices + stats.pendingInvoices) * 100)
    : 0;

  const expenseGrowth = stats.expensesLastMonth > 0
    ? ((stats.expensesThisMonth - stats.expensesLastMonth) / stats.expensesLastMonth * 100)
    : 0;

  const netProfit = stats.totalRevenue - stats.totalExpenses;
  const netProfitThisMonth = stats.revenueThisMonth - stats.expensesThisMonth;
  const netProfitLastMonth = stats.revenueLastMonth - stats.expensesLastMonth;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600">Track your business performance and growth</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-green-100 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <p className="text-blue-100 text-sm mb-1">Total Jobs</p>
              <p className="text-3xl font-bold">{stats.totalJobs}</p>
              <p className="text-blue-100 text-xs mt-2">{stats.completedJobs} completed</p>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-teal-100 text-sm mb-1">Total Clients</p>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-emerald-100 text-sm mb-1">Completion Rate</p>
              <p className="text-3xl font-bold">{completionRate.toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>
              <p className="text-red-100 text-sm mb-1">Total Expenses</p>
              <p className="text-3xl font-bold">${stats.totalExpenses.toFixed(2)}</p>
            </div>

            <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 shadow-lg text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <p className={`${netProfit >= 0 ? 'text-green-100' : 'text-red-100'} text-sm mb-1`}>Net Profit</p>
              <p className="text-3xl font-bold">${netProfit.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <p className="text-amber-100 text-sm mb-1">Profit Margin</p>
              <p className="text-3xl font-bold">
                {stats.totalRevenue > 0 ? ((netProfit / stats.totalRevenue) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">This Month</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${stats.revenueThisMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Last Month</span>
                    <span className="text-2xl font-bold text-gray-700">
                      ${stats.revenueLastMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gray-400 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: stats.revenueThisMonth > 0
                          ? `${(stats.revenueLastMonth / stats.revenueThisMonth) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Growth</span>
                    <div className={`flex items-center gap-2 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`w-5 h-5 ${revenueGrowth < 0 ? 'rotate-180' : ''}`} />
                      <span className="text-xl font-bold">
                        {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Invoice Status</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Paid Invoices</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${stats.paidInvoices.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: (stats.paidInvoices + stats.pendingInvoices) > 0
                          ? `${(stats.paidInvoices / (stats.paidInvoices + stats.pendingInvoices)) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Pending Invoices</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ${stats.pendingInvoices.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: (stats.paidInvoices + stats.pendingInvoices) > 0
                          ? `${(stats.pendingInvoices / (stats.paidInvoices + stats.pendingInvoices)) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${(stats.paidInvoices + stats.pendingInvoices).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Expenses</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">This Month</span>
                    <span className="text-2xl font-bold text-red-600">
                      ${stats.expensesThisMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Last Month</span>
                    <span className="text-2xl font-bold text-gray-700">
                      ${stats.expensesLastMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gray-400 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: stats.expensesThisMonth > 0
                          ? `${(stats.expensesLastMonth / stats.expensesThisMonth) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Growth</span>
                    <div className={`flex items-center gap-2 ${expenseGrowth >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      <TrendingUp className={`w-5 h-5 ${expenseGrowth < 0 ? 'rotate-180' : ''}`} />
                      <span className="text-xl font-bold">
                        {expenseGrowth >= 0 ? '+' : ''}{expenseGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Net Profit Trend</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">This Month</span>
                    <span className={`text-2xl font-bold ${netProfitThisMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${netProfitThisMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${netProfitThisMonth >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} h-3 rounded-full transition-all duration-500`}
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Last Month</span>
                    <span className={`text-2xl font-bold ${netProfitLastMonth >= 0 ? 'text-gray-700' : 'text-red-600'}`}>
                      ${netProfitLastMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gray-400 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: Math.abs(netProfitThisMonth) > 0
                          ? `${Math.min((Math.abs(netProfitLastMonth) / Math.abs(netProfitThisMonth)) * 100, 100)}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Revenue</span>
                    <span className="text-xl font-bold text-green-600">
                      ${stats.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 font-medium">Total Expenses</span>
                    <span className="text-xl font-bold text-red-600">
                      ${stats.totalExpenses.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Invoice Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Total Invoices</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">Paid</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.totalInvoices - stats.draftInvoices - stats.sentInvoices - stats.overdueInvoices}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Sent</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.sentInvoices}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">Draft</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{stats.draftInvoices}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-700">Overdue</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Invoice Revenue Trend</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">This Month</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${stats.invoiceRevenueThisMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Last Month</span>
                    <span className="text-2xl font-bold text-gray-700">
                      ${stats.invoiceRevenueLastMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gray-400 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: stats.invoiceRevenueThisMonth > 0
                          ? `${(stats.invoiceRevenueLastMonth / stats.invoiceRevenueThisMonth) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Growth</span>
                    <div className={`flex items-center gap-2 ${invoiceGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`w-5 h-5 ${invoiceGrowth < 0 ? 'rotate-180' : ''}`} />
                      <span className="text-xl font-bold">
                        {invoiceGrowth >= 0 ? '+' : ''}{invoiceGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Collection Rate</span>
                    <span className="text-xl font-bold text-green-600">
                      {collectionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${collectionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${stats.totalJobs > 0 ? (stats.totalRevenue / stats.totalJobs).toFixed(2) : '0.00'}
                </p>
                <p className="text-gray-600 text-sm">Average Job Value</p>
              </div>

              <div className="text-center p-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${stats.totalInvoices > 0 ? ((stats.paidInvoices + stats.pendingInvoices) / stats.totalInvoices).toFixed(2) : '0.00'}
                </p>
                <p className="text-gray-600 text-sm">Average Invoice Value</p>
              </div>

              <div className="text-center p-4">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {completionRate.toFixed(0)}%
                </p>
                <p className="text-gray-600 text-sm">Job Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
