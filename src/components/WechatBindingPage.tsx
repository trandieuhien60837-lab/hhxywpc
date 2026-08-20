import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  ExternalLink,
  Check
} from 'lucide-react';
import { WechatBindingConfig, PageType } from '../types';

interface WechatBindingPageProps {
  onNavigateToTab?: (page: PageType) => void;
}

const INITIAL_BINDING: WechatBindingConfig = {
  accountName: '美食优选官方服务号',
  appId: 'wx8f3d1a9876543210',
  appSecret: '98d7f6e5c4b3a21098d7f6e5c4b3a210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  isBound: true,
  boundAt: '2025-01-10 14:32:00',
  callbackUrl: 'https://api.mall.platform.com/wechat/events/callback',
  token: 'wx_mall_token_99217',
  encodingAesKey: '4bE9qL3kP0x8Z1wM7aJ6sY5vC2dN8fG1hK3jL9pQ7rT',
  templates: []
};

export const WechatBindingPage: React.FC<WechatBindingPageProps> = ({ onNavigateToTab }) => {
  const [binding, setBinding] = useState<WechatBindingConfig>(INITIAL_BINDING);
  const [inputAppId, setInputAppId] = useState(INITIAL_BINDING.appId);
  const [inputAppSecret, setInputAppSecret] = useState(INITIAL_BINDING.appSecret);
  const [isBindingLoading, setIsBindingLoading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bind or Re-bind
  const handleBind = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAppId.trim() || !inputAppSecret.trim()) {
      showToast('请输入有效的 AppID 与 AppSecret');
      return;
    }
    setIsBindingLoading(true);
    setTimeout(() => {
      setBinding(prev => ({
        ...prev,
        appId: inputAppId,
        appSecret: inputAppSecret,
        isBound: true,
        boundAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }));
      setIsBindingLoading(false);
      showToast('公众号绑定与授权凭证校验成功！');
    }, 800);
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
            <span>新人红包</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">公众号绑定设置</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#1890ff]" />
            <span>公众号绑定设置</span>
            <span className="text-xs px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● 微信服务号已连通
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            管理微信认证服务号的开发者凭证与授权绑定配置。
          </p>
        </div>

        {/* Quick Sub-Tab Navigation Switcher */}
        {onNavigateToTab && (
          <div className="flex items-center bg-[#fafafa] p-1 rounded border border-[#d9d9d9] text-xs">
            <button
              onClick={() => onNavigateToTab('newcomer-rules')}
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              1. 规则配置
            </button>
            <button
              onClick={() => onNavigateToTab('wechat-binding')}
              className="px-3 py-1.5 rounded font-medium bg-[#1890ff] text-white shadow-xs"
            >
              2. 公众号绑定
            </button>
            <button
              onClick={() => onNavigateToTab('inactive-recall')}
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              3. 不活跃召回
            </button>
          </div>
        )}
      </div>

      {/* 1. 公众号信息展示 & 绑定操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 已绑定公众号信息展示卡片 */}
        <div className="lg:col-span-5 bg-white border border-[#e8e8e8] rounded p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <span className="text-sm font-bold text-[#262626] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1890ff]" />
                <span>当前已绑定公众号</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                已授权正常
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <img
                src={binding.avatarUrl}
                alt="Wechat Avatar"
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400/60 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#262626] flex items-center gap-1.5">
                  <span>{binding.accountName}</span>
                  <span className="text-[10px] bg-blue-50 text-[#1890ff] px-1.5 py-0.2 rounded border border-blue-200">
                    微信认证服务号
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  AppID: <span className="text-gray-800 font-semibold">{binding.appId}</span>
                </div>
                <div className="text-[11px] text-gray-400">
                  授权绑定时间：{binding.boundAt}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" />
              开发者权限状态：正常 (已获得接口能力)
            </span>
            <a
              href="https://mp.weixin.qq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1890ff] hover:underline flex items-center gap-1"
            >
              <span>前往微信后台</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 绑定/授权与凭证配置表单 */}
        <div className="lg:col-span-7 bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#e8e8e8]">
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#1890ff]" />
              <span>绑定 / 变更公众号开发者凭证</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              填写微信公众平台「开发 - 基本配置」中的开发者ID与密码，用于调用微信接口。
            </div>
          </div>

          <form onSubmit={handleBind} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <span>公众号 AppID (开发者ID)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={inputAppId}
                onChange={(e) => setInputAppId(e.target.value)}
                placeholder="例如: wx8f3d1a9876543210"
                className="w-full px-3 py-2 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-mono text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <span>公众号 AppSecret (开发者密码)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={inputAppSecret}
                onChange={(e) => setInputAppSecret(e.target.value)}
                placeholder="请输入 32 位 AppSecret 密钥"
                className="w-full px-3 py-2 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-mono text-gray-800"
              />
              <div className="text-[11px] text-gray-400">
                密钥将进行高强度非对称加密存储，仅供系统向微信服务器请求 access_token 使用。
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={isBindingLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-xs disabled:opacity-60"
              >
                {isBindingLoading ? (
                  <span>正在校验凭证...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>保存并重新授权</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => showToast('API 连通性检测通过：已成功获取微信 access_token')}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
              >
                测试 API 连通性
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
