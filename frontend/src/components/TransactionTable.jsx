import React, { useState } from 'react';
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiClock, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheckCircle, 
  FiAlertCircle,
  FiFileText
} from 'react-icons/fi';
import Modal from './Modal';

const TransactionTable = ({ 
  transactions = [], 
  itemsPerPage = 7,
  showPagination = true 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transactions.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <>
      <div className="bg-[#FFFFFF] rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                <th className="py-3.5 px-4 sm:px-6">Date</th>
                <th className="py-3.5 px-4 sm:px-6">Description</th>
                <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">Transaction ID</th>
                <th className="py-3.5 px-4 sm:px-6">Type</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Amount</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                      <FiFileText className="w-10 h-10 text-[#94A3B8] mb-2" />
                      <p className="text-sm font-medium">No transactions found</p>
                      <p className="text-xs text-[#94A3B8]">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((txn) => {
                  const isCredit = txn.type === 'Credit';
                  const isPending = txn.status === 'Pending';

                  return (
                    <tr
                      key={txn.id}
                      onClick={() => setSelectedTxn(txn)}
                      className="hover:bg-[#F8FAFC]/80 cursor-pointer transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs text-[#64748B]">
                        <span className="font-medium text-[#0F172A] block sm:inline">
                          {txn.displayDate?.split(',')[0] || txn.date.split(' ')[0]}
                        </span>
                        <span className="block sm:inline sm:ml-1 text-[11px] text-[#94A3B8]">
                          {txn.displayDate?.split(',')[1] || txn.date.split(' ')[1] || ''}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isCredit
                                ? 'bg-[#16A34A]/10 text-[#16A34A]'
                                : 'bg-[#EFF6FF] text-[#2563EB]'
                            }`}
                          >
                            {isCredit ? (
                              <FiArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <FiArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                              {txn.description}
                            </p>
                            <p className="text-[11px] text-[#64748B]">
                              {txn.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Transaction ID */}
                      <td className="py-4 px-4 sm:px-6 hidden md:table-cell whitespace-nowrap font-mono text-xs text-[#64748B]">
                        {txn.id}
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isCredit
                              ? 'bg-[#16A34A]/10 text-[#16A34A]'
                              : 'bg-red-50 text-[#DC2626]'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap font-mono font-bold text-sm">
                        <span className={isCredit ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                          {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', {
                            minimumFractionDigits: txn.amount % 1 === 0 ? 0 : 2
                          })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B]">
                            <FiClock className="w-3 h-3" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                            <FiCheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {showPagination && transactions.length > itemsPerPage && (
          <div className="py-3 px-4 sm:px-6 bg-[#FFFFFF] border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-[#64748B]">
              Showing <span className="font-semibold text-[#0F172A]">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#0F172A]">
                {Math.min(startIndex + itemsPerPage, transactions.length)}
              </span>{' '}
              of <span className="font-semibold text-[#0F172A]">{transactions.length}</span> transactions
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Transaction Details"
        footer={
          <button
            onClick={() => setSelectedTxn(null)}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors"
          >
            Close
          </button>
        }
      >
        {selectedTxn && (
          <div className="space-y-4">
            {/* Amount Banner */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#BFDBFE]/50 text-center">
              <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">
                Transaction Amount
              </span>
              <div
                className={`text-3xl font-extrabold font-mono mt-1 ${
                  selectedTxn.type === 'Credit' ? 'text-[#16A34A]' : 'text-[#DC2626]'
                }`}
              >
                {selectedTxn.type === 'Credit' ? '+' : '-'}₹{selectedTxn.amount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                {selectedTxn.status === 'Pending' ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F59E0B]/20 text-[#F59E0B]">
                    Pending Verification
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#16A34A]/20 text-[#16A34A]">
                    Transaction Successful
                  </span>
                )}
              </div>
            </div>

            {/* Key Value Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F8FAFC]">
                <p className="text-[#64748B]">Transaction ID</p>
                <p className="font-mono font-semibold text-[#0F172A] mt-0.5 break-all">
                  {selectedTxn.id}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC]">
                <p className="text-[#64748B]">Reference Number</p>
                <p className="font-mono font-semibold text-[#0F172A] mt-0.5 break-all">
                  {selectedTxn.referenceNo || 'N/A'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC]">
                <p className="text-[#64748B]">Date & Time</p>
                <p className="font-semibold text-[#0F172A] mt-0.5">
                  {selectedTxn.displayDate || selectedTxn.date}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC]">
                <p className="text-[#64748B]">Category</p>
                <p className="font-semibold text-[#0F172A] mt-0.5">
                  {selectedTxn.category}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC]">
                <p className="text-[#64748B]">Account</p>
                <p className="font-mono font-semibold text-[#0F172A] mt-0.5">
                  {selectedTxn.account || 'XXXX XXXX 4521'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC]">
                <p className="text-[#64748B]">Type</p>
                <p className="font-semibold text-[#0F172A] mt-0.5">
                  {selectedTxn.type}
                </p>
              </div>
            </div>

            {selectedTxn.remarks && (
              <div className="p-3 rounded-lg bg-[#F8FAFC] text-xs">
                <p className="text-[#64748B]">Remarks</p>
                <p className="font-medium text-[#0F172A] mt-0.5">
                  {selectedTxn.remarks}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default TransactionTable;
