import React, { useState, useEffect } from 'react';
import { Cat, Wallet, TrendingDown, Target, PlusCircle, MinusCircle, Settings, History, ArrowDownToLine, ArrowUpFromLine, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'motion/react';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  note?: string;
  timestamp: number;
};

export default function App() {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('budget_balance');
    return saved !== null ? parseFloat(saved) : 0;
  });
  const [totalSpent, setTotalSpent] = useState<number>(() => {
    const saved = localStorage.getItem('budget_totalSpent');
    return saved !== null ? parseFloat(saved) : 0;
  });
  const [limit, setLimit] = useState<number>(() => {
    const saved = localStorage.getItem('budget_limit');
    return saved !== null ? parseFloat(saved) : 0;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('budget_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('budget_balance', balance.toString());
    localStorage.setItem('budget_totalSpent', totalSpent.toString());
    localStorage.setItem('budget_limit', limit.toString());
    localStorage.setItem('budget_transactions', JSON.stringify(transactions));
  }, [balance, totalSpent, limit, transactions]);

  const [incomeInput, setIncomeInput] = useState<string>("");
  const [incomeNote, setIncomeNote] = useState<string>("");
  const [expenseInput, setExpenseInput] = useState<string>("");
  const [expenseNote, setExpenseNote] = useState<string>("");
  const [limitInput, setLimitInput] = useState<string>("");

  const [catState, setCatState] = useState<'normal' | 'warning' | 'danger'>('normal');
  const [catMessage, setCatMessage] = useState<string>("Chào bạn! Mình là chú mèo thông thái đây! Hãy nhập hạn mức để mình theo dõi nhé.");

  const normalMessages = [
    "Chào bạn! Dạo này quản lý chi tiêu rất tốt. Cứ thế phát huy nha!",
    "Meo meo! Tiết kiệm tiền mua pate cho mình nhé!",
    "Hôm nay trời đẹp, ví tiền cũng rủng rỉnh. Làm tốt lắm!",
    "Tuyệt vời ông mặt trời! Đừng quên tiết kiệm một khoản phòng thân nha.",
    "Bạn giữ tiền ngoan như mình giữ cá vậy. Giỏi lắm!",
    "Meo! Cố gắng phân bổ ngân sách hợp lý để mua sắm nha!",
    "Kỷ luật tài chính của bạn thật đáng nể!",
    "Nhìn số dư thích quá đi! Cứ tiếp tục nhé!"
  ];

  const warningMessages = [
    "Meo meo! Bạn đã tiêu hơn 80% hạn mức rồi đó nha, cẩn thận kẻo hết tiền!",
    "Báo động vàng! Ví đang xẹp đi do mua sắm nhiều kìa. Chú ý nhé!",
    "Khoan khoan ngừng tay! Sắp vượt hạn mức rồi, xem lại giỏ hàng đi!",
    "Meo tui nhắc nhẹ: Tiền không mọc trên cây đâu nha!",
    "Chỉ còn một chút hạn mức nữa thôi. Cân nhắc kỹ nhé!",
    "Tính kĩ xem mấy món vừa rồi có thực sự cần thiết không nha bạn!",
    "Hơi mạo hiểm rồi đấy! Ráng quản lý chặt ví tới cuối tháng nha."
  ];

  const dangerMessages = [
    "Meowww!!! Bạn đã tiêu quá tay rồi! Ăn mì tôm thôi!",
    "Cảnh báo đỏ! Hãy khóa chặt ví tiền của bạn ngay lập tức!",
    "Ối dồi ôi! Hạn mức đã bị phá vỡ, nghèo đói đang vẫy gọi!",
    "Ngưng mua sắm ngay đi! Tôi không muốn cả tháng ăn hạt khô đâu!",
    "Báo động! Bạn đang đốt tiền đấy à? Tỉnh táo lại đi!",
    "Thật bất ổn! Bạn đã chính thức thủng eo rồi!",
    "Thôi xong, từ giờ đến cuối tháng là chuỗi ngày tăm tối. Cố lên nhé!"
  ];

  useEffect(() => {
    if (limit === 0) {
      setCatState('normal');
      setCatMessage("Chào bạn! Mình là chú mèo thông thái đây! Hãy thiết lập hạn mức để mình tư vấn nhé.");
      return;
    }

    const ratio = totalSpent / limit;

    if (ratio > 1) {
      setCatState('danger');
      setCatMessage(dangerMessages[Math.floor(Math.random() * dangerMessages.length)]);
    } else if (ratio > 0.8) {
      setCatState('warning');
      setCatMessage(warningMessages[Math.floor(Math.random() * warningMessages.length)]);
    } else {
      setCatState('normal');
      setCatMessage(normalMessages[Math.floor(Math.random() * normalMessages.length)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSpent, limit]);

  const handleSetLimit = () => {
    const val = parseFloat(limitInput);
    if (!isNaN(val) && val > 0) {
      setLimit(val);
      setLimitInput("");
      Swal.fire({
        title: 'Thành công!',
        text: `Đã thiết lập hạn mức: ${formatVND(val)}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng nhập số tiền hợp lệ.',
        icon: 'error',
        confirmButtonText: 'Đóng'
      });
    }
  };

  const handleAddIncome = () => {
    const val = parseFloat(incomeInput);
    if (!isNaN(val) && val > 0) {
      setBalance(prev => prev + val);
      setTotalSpent(prev => Math.max(0, prev - val));
      setTransactions(prev => [
        {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          type: 'income',
          amount: val,
          note: incomeNote.trim(),
          timestamp: Date.now()
        },
        ...prev
      ]);
      setIncomeInput("");
      setIncomeNote("");
      Swal.fire({
        title: 'Đã thêm thu nhập!',
        text: `+ ${formatVND(val)}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng nhập số tiền hợp lệ.',
        icon: 'error',
        confirmButtonText: 'Đóng'
      });
    }
  };

  const handleAddExpense = () => {
    const val = parseFloat(expenseInput);
    if (!isNaN(val) && val > 0) {
      setBalance(prev => prev - val);
      setTotalSpent(prev => prev + val);
      setTransactions(prev => [
        {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          type: 'expense',
          amount: val,
          note: expenseNote.trim(),
          timestamp: Date.now()
        },
        ...prev
      ]);
      setExpenseInput("");
      setExpenseNote("");
      Swal.fire({
        title: 'Đã ghi nhận khoản chi!',
        text: `- ${formatVND(val)}`,
        icon: 'warning',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng nhập số tiền hợp lệ.',
        icon: 'error',
        confirmButtonText: 'Đóng'
      });
    }
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleDeleteTransaction = (id: string, type: 'income' | 'expense', amount: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    // Also adjust balance/spent so as not to mess up the math, actually optional but let's reverse it.
    if (type === 'income') {
      setBalance(prev => prev - amount);
    } else {
      setBalance(prev => prev + amount);
      setTotalSpent(prev => Math.max(0, prev - amount));
    }
  };

  const handleClearTransactions = () => {
    Swal.fire({
      title: 'Xóa toàn bộ lịch sử?',
      text: "Không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        setTransactions([]);
        setBalance(0);
        setTotalSpent(0);
        setLimit(0);
        Swal.fire(
          'Đã xóa!',
          'Lịch sử giao dịch và số dư đã được đặt lại từ đầu.',
          'success'
        )
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Page Header */}
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-200/50">
            <Cat size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mèo Thông Thái</h1>
            <p className="text-slate-500 text-sm">Quản lý chi tiêu dễ thương & dễ dàng</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        
        {/* Left Column: Cat & Overview */}
        <div className="lg:col-span-4 lg:col-start-1 space-y-6">
          
          {/* Cat Assistant Card */}
          <div className={`rounded-3xl p-6 border-2 transition-all duration-500 ${
            catState === 'normal' ? 'bg-indigo-50/50 border-indigo-100' : 
            catState === 'warning' ? 'bg-amber-50/50 border-amber-200' : 'bg-rose-50/50 border-rose-200'
          }`}>
            <div className="flex gap-4 items-start">
              <div className={`p-4 rounded-2xl flex-shrink-0 transition-colors duration-500 ${
                catState === 'normal' ? 'bg-indigo-100 text-indigo-600 animate-sway-gentle' : 
                catState === 'warning' ? 'bg-amber-100 text-amber-600 animate-sway-gentle' : 'bg-rose-100 text-rose-600 animate-bounce'
              }`}>
                <Cat size={32} />
              </div>
              <div className="pt-1">
                <h3 className={`font-bold mb-1 ${
                  catState === 'normal' ? 'text-indigo-800' : 
                  catState === 'warning' ? 'text-amber-800' : 'text-rose-800'
                }`}>Mèo bảo nè:</h3>
                <p className={`text-sm leading-relaxed ${
                  catState === 'normal' ? 'text-indigo-700/80' : 
                  catState === 'warning' ? 'text-amber-700/80' : 'text-rose-700/80 font-medium'
                }`}>
                  {catMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Overview Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Wallet size={16}/> Tổng quan ví
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">Số dư hiện tại</p>
                <div className={`text-4xl font-black tracking-tight flex items-baseline gap-1 ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={balance}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {formatVND(balance)}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 pb-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><TrendingDown size={14}/> Đã chi</p>
                  <p className="text-lg font-bold text-slate-700 truncate">{formatVND(totalSpent)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Target size={14}/> Hạn mức</p>
                  <p className="text-lg font-bold text-slate-700 truncate">{limit > 0 ? formatVND(limit) : "---"}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-wide">Tiến độ chi tiêu</span>
                  <span className={catState === 'danger' ? 'text-rose-500' : catState === 'warning' ? 'text-amber-500' : 'text-indigo-500'}>
                    {limit > 0 ? Math.round((totalSpent / limit) * 100) : 0}%
                  </span>
                </div>
                <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ease-out rounded-full ${
                      catState === 'danger' ? 'bg-rose-500' : catState === 'warning' ? 'bg-amber-400' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${limit > 0 ? Math.min((totalSpent / limit) * 100, 100) : 0}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          {/* Set Limit Box */}
          <div className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Settings size={16}/> Hạn mức tháng này
             </label>
             <div className="flex gap-2">
               <input 
                 type="number" 
                 className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium" 
                 placeholder="Nhập số tiền..."
                 value={limitInput}
                 onChange={e => setLimitInput(e.target.value)} 
                 onKeyDown={e => e.key === 'Enter' && handleSetLimit()}
               />
               <button 
                 onClick={handleSetLimit} 
                 className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white px-5 py-3 rounded-2xl font-semibold transition-colors shadow-sm"
               >
                 Lưu
               </button>
             </div>
          </div>

        </div>

        {/* Right Column: Actions & History */}
        <div className="lg:col-span-8 lg:col-start-5 space-y-6">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Add Income */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
              <h3 className="font-bold text-emerald-600 flex items-center gap-2 mb-5">
                <PlusCircle size={20}/> Nhập Thu Nhập
              </h3>
              <div className="space-y-3 relative z-10">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+</span>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 font-semibold text-lg" 
                    placeholder="Số tiền..."
                    value={incomeInput}
                    onChange={e => setIncomeInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAddIncome()}
                  />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm" 
                  placeholder="Ghi chú (nhận lương...)"
                  value={incomeNote}
                  onChange={e => setIncomeNote(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleAddIncome()}
                />
                <button 
                  onClick={handleAddIncome} 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold transition-colors mt-2 shadow-sm shadow-emerald-200"
                >
                  Ghi nhận
                </button>
              </div>
            </div>

            {/* Add Expense */}
            <div className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
              <h3 className="font-bold text-rose-600 flex items-center gap-2 mb-5">
                <MinusCircle size={20}/> Nhập Khoản Chi
              </h3>
              <div className="space-y-3 relative z-10">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">-</span>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 font-semibold text-lg" 
                    placeholder="Số tiền..."
                    value={expenseInput}
                    onChange={e => setExpenseInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAddExpense()}
                  />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 text-sm" 
                  placeholder="Ghi chú (ăn uống, đi lại...)"
                  value={expenseNote}
                  onChange={e => setExpenseNote(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleAddExpense()}
                />
                <button 
                  onClick={handleAddExpense} 
                  className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white py-3.5 rounded-2xl font-bold transition-colors mt-2 shadow-sm shadow-rose-200"
                >
                  Ghi nhận
                </button>
              </div>
            </div>

          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-3xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History size={16} /> Lịch sử giao dịch
              </h2>
              {transactions.length > 0 && (
                <button 
                  onClick={handleClearTransactions}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-xl hover:bg-rose-50/80"
                  title="Xóa tất cả lịch sử"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {transactions.length === 0 ? (
                <div className="text-center py-16 h-full flex flex-col justify-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Chưa có giao dịch nào.</p>
                  <p className="text-slate-400 text-sm mt-1">Hãy ghi nhận thu chi để bắt đầu theo dõi.</p>
                </div>
              ) : (
                transactions.map(t => (
                  <div key={t.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {t.type === 'income' ? <ArrowDownToLine size={20} /> : <ArrowUpFromLine size={20} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-700 flex flex-wrap items-center gap-2">
                          {t.type === 'income' ? 'Thu nhập' : 'Khoản chi'}
                          {t.note && <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-full block">{t.note}</span>}
                        </p>
                        <p className="text-xs font-medium text-slate-400 mt-1">
                          {new Date(t.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                      <span className={`text-lg font-black tracking-tight ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatVND(t.amount)}
                      </span>
                      <button 
                        onClick={() => handleDeleteTransaction(t.id, t.type, t.amount)}
                        className="opacity-100 sm:opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-50"
                        title="Xóa giao dịch này"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
