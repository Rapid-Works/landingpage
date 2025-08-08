import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Euro, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllTaskRequests } from '../utils/taskRequestService';
import AdminTaskDetailsModal from './AdminTaskDetailsModal';

const Invoicing = ({ onNavigateToTask }) => {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  
  // Modal state
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to format dates
  const formatReadableDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const formatted = d.toLocaleDateString('en-GB', options);
    
    const day = d.getDate();
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    
    return formatted.replace(/^\d+/, `${day}${suffix}`);
  };

  // Load all accepted/completed tasks with invoice data
  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      setError('');

      try {
        const allTasks = await getAllTaskRequests();
        
        // Filter tasks that have been accepted/completed and have invoice data
        const invoiceableTasks = allTasks.filter(task => 
          (task.status === 'accepted' || task.status === 'completed') && 
          task.invoiceData
        );

        // Transform to invoice format
        const invoiceData = invoiceableTasks.map(task => ({
          id: task.id,
          taskName: task.taskName,
          customerName: task.invoiceData.customerName || task.userName,
          customerEmail: task.invoiceData.customerEmail || task.userEmail,
          expertName: task.expertName || 'Unassigned',
          expertEmail: task.expertEmail,
          hours: task.invoiceData.hours || 0,
          rate: task.invoiceData.rate || 0,
          price: task.invoiceData.price || 0,
          orderedAt: task.invoiceData.orderedAt,
          completedAt: task.completedAt,
          status: task.status,
          paymentStatus: task.invoiceData.paymentStatus || (task.status === 'completed' ? 'Due' : 'Pending'),
          deadline: task.invoiceData.deadline,
          taskId: task.id
        }));

        // Sort by ordered date (newest first)
        invoiceData.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
        
        setInvoices(invoiceData);
      } catch (err) {
        console.error('Error loading invoices:', err);
        setError('Failed to load invoice data');
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.expertName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'pending' && invoice.paymentStatus === 'Pending') ||
      (statusFilter === 'due' && invoice.paymentStatus === 'Due') ||
      (statusFilter === 'paid' && invoice.paymentStatus === 'Paid');
    
    const matchesMonth = monthFilter === 'all' || 
      (invoice.orderedAt && new Date(invoice.orderedAt).getMonth() === parseInt(monthFilter));
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Get payment status styling
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Due':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Calculate totals
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.price, 0);
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.paymentStatus === 'Paid')
    .reduce((sum, invoice) => sum + invoice.price, 0);
  const pendingAmount = totalAmount - paidAmount;

  // Handle task details modal
  const handleTaskClick = (taskId, taskName) => {
    setSelectedTaskId(taskId);
    setSelectedTaskName(taskName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
    setSelectedTaskName('');
  };

  const handleViewChat = (taskId) => {
    if (onNavigateToTask) {
      onNavigateToTask(taskId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3BEC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Invoices</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
        <p className="text-gray-600 mt-1">Track and manage all client invoices and payments</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent bg-white"
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="due">Due</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Invoice Table */}
      {filteredInvoices.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Task */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTaskClick(invoice.taskId, invoice.taskName)}
                        className="text-sm font-medium text-[#7C3BEC] hover:text-[#6B32D6] truncate max-w-xs text-left hover:underline transition-colors duration-200 flex items-center group"
                      >
                        <span className="truncate">{invoice.taskName}</span>
                        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{invoice.customerName}</div>
                        <div className="text-xs text-gray-500">{invoice.customerEmail}</div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          €{invoice.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {invoice.hours}h @ €{invoice.rate}/hr
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(invoice.orderedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusStyle(invoice.paymentStatus)}`}>
                        {invoice.paymentStatus}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || monthFilter !== 'all'
              ? 'No invoices match your current filters'
              : 'No accepted orders with invoice data available yet'}
          </p>
        </div>
      )}

      {/* Summary Footer */}
      {filteredInvoices.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          Showing {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} • 
          Total: €{totalAmount.toLocaleString()} • 
          Pending: €{pendingAmount.toLocaleString()}
        </div>
      )}

      {/* Admin Task Details Modal */}
      <AdminTaskDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskId={selectedTaskId}
        taskName={selectedTaskName}
        onViewChat={handleViewChat}
      />
    </div>
  );
};

export default Invoicing;