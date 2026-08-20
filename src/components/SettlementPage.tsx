import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  DollarSign, 
  Receipt, 
  Building2, 
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { SettlementItem, ActivityItem } from '../types';
import { INITIAL_SETTLEMENTS } from '../mockData';

interface SettlementPageProps {
  activities: ActivityItem[];
}

export const SettlementPage: React.FC<SettlementPageProps> = ({ activities }) => {
  const [settlements, setSettlements] = useState<SettlementItem[]>(INITIAL_SETTLEMENTS);
  
  // Filters (活动、商家、时间、状态)
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [merchantFilter, setMerchantFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered
  const filteredSettlements = settlements.filter((item) => {
    const matchSearch = item.userId.includes(searchQuery) || item.orderNumber.includes(searchQuery) || item.merchantName.includes(searchQuery);
    const matchActivity = activityFilter === 'all' || item.activityName.includes(activityFilter);
    const matchMerchant = merchantFilter === 'all' || item.merchantName.includes(merchantFilter);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchActivity && matchMerchant && matchStatus;
  });

  // Calculate Aggregates
  const totalVerifiedCount = 4850; // Aggregate for platform or filtered
  const totalDiscountAmount = 24250.00; // 总优惠金额
  const platformSubsidyTotal = 14550.00; // 平台补贴 60%
  const merchantShareTotal = 9700.00; // 商家分摊 40%

  const handleExportReconciliation = () => {
    showToast('对账单数据已成功生成，正在下载「联盟营销核销结算清单_202501.xlsx」...');
  };

  const getStatusBadge = (status: SettlementItem['status']) => {
    switch (status) {
      case 'settled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            已结算
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            待结算
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            已退款撤销
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#262626] text-white text-xs px-4 py-2.5 rounded shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e8e8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>营销中心</span>
            <span>/</span>
            <span>财务对账</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">结算管理</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <span>结算管理与核销对账</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#1890ff] font-medium border border-blue-200">
              财务结算周期：月结 (T+30)
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            核对跨商户核销券明细，自动核算平台优惠补贴与商家分摊金额。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportReconciliation}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出结算对账单</span>
          </button>
        </div>
      </div>

      {/* 汇总卡片 (总核销券数、总优惠金额、平台补贴、商家分摊) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 总核销券数 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">总核销券数</span>
            <div className="w-8 h-8 rounded bg-blue-50 text-[#1890ff] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#262626] tracking-tight">
              {totalVerifiedCount.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">张</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            全平台联盟商户累计已使用核销
          </div>
        </div>

        {/* 2. 总优惠金额 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">总优惠减免金额</span>
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
              ¥{totalDiscountAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            带动的实际GMV流水 ¥185,200.00
          </div>
        </div>

        {/* 3. 平台承担补贴 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">平台承担补贴 (60%)</span>
            <div className="w-8 h-8 rounded bg-blue-50 text-[#1890ff] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#1890ff] tracking-tight">
              ¥{platformSubsidyTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#1890ff] font-medium">
            营销专项预算划拨列支
          </div>
        </div>

        {/* 4. 商家分摊金额 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">商家分摊金额 (40%)</span>
            <div className="w-8 h-8 rounded bg-sky-50 text-sky-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#262626] tracking-tight">
              ¥{merchantShareTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            结算时从商户流水中扣除
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* 搜索 */}
          <div className="sm:col-span-3 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户ID / 订单号..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
            />
          </div>

          {/* 活动筛选 */}
          <div className="sm:col-span-3">
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部活动</option>
              {activities.map(a => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* 商家筛选 */}
          <div className="sm:col-span-3">
            <select
              value={merchantFilter}
              onChange={(e) => setMerchantFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部核销商家</option>
              <option value="瑞幸咖啡">瑞幸咖啡(全城门店)</option>
              <option value="蜜雪冰城">蜜雪冰城(万达店)</option>
              <option value="霸王茶姬">霸王茶姬(天河城店)</option>
              <option value="喜茶">喜茶(正佳广场店)</option>
              <option value="绝味鸭脖">绝味鸭脖(天河北店)</option>
              <option value="麦当劳">麦当劳(天河直营店)</option>
            </select>
          </div>

          {/* 状态筛选 */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部结算状态</option>
              <option value="settled">已结算 (Settled)</option>
              <option value="pending">待结算 (Pending)</option>
              <option value="refunded">已退款 (Refunded)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="settlement-table">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e8e8e8] text-[11px] font-semibold text-gray-500 uppercase">
                <th className="py-3 px-4">用户ID</th>
                <th className="py-3 px-3">核销商家</th>
                <th className="py-3 px-3">关联订单号</th>
                <th className="py-3 px-3">券面额</th>
                <th className="py-3 px-3">平台补贴 / 商家分摊</th>
                <th className="py-3 px-3">核销时间</th>
                <th className="py-3 px-3 text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-xs text-gray-700">
              {filteredSettlements.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                  {/* 用户ID */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#262626]">{item.userId}</span>
                  </td>

                  {/* 核销商家 */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#262626]">{item.merchantName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{item.merchantId}</div>
                  </td>

                  {/* 订单号 */}
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                    {item.orderNumber}
                  </td>

                  {/* 券面额 */}
                  <td className="py-3 px-3 font-bold text-[#1890ff] whitespace-nowrap">
                    ¥{item.couponAmount.toFixed(2)}
                  </td>

                  {/* 平台补贴 / 商家分摊 */}
                  <td className="py-3 px-3 text-[11px] whitespace-nowrap">
                    <span className="text-[#1890ff] font-medium">平台 ¥{item.platformSubsidy.toFixed(2)}</span>
                    <span className="text-gray-300 mx-1">/</span>
                    <span className="text-gray-600">商家 ¥{item.merchantShare.toFixed(2)}</span>
                  </td>

                  {/* 核销时间 */}
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                    {item.verifiedAt}
                  </td>

                  {/* 状态 */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Bar with Export button */}
        <div className="p-3 bg-[#fafafa] border-t border-[#e8e8e8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>共 {filteredSettlements.length} 笔核销结算记录</div>
          <button
            id="btn-export-settlement"
            onClick={handleExportReconciliation}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出本期结算明细 (Excel/CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
