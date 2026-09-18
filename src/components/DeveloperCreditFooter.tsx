import React from 'react';
import { Sparkles, Code2, Award, ExternalLink, Heart, Layers, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { APP_ASSETS } from '../data/initialData';

interface DeveloperCreditFooterProps {
  onOpenAboutModal?: () => void;
  onOpenAbout?: () => void;
}

export const DeveloperCreditFooter: React.FC<DeveloperCreditFooterProps> = ({
  onOpenAboutModal,
  onOpenAbout,
}) => {
  const handleOpen = () => {
    if (onOpenAboutModal) onOpenAboutModal();
    if (onOpenAbout) onOpenAbout();
  };
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Col 1: System info & Logo */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={APP_ASSETS.logo}
                alt="โลโก้แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล"
                className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shadow-sm"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  ระบบจองเข้าใช้ห้องปฏิบัติการ
                </h3>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                  แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล (Digital Business Technology)
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              ศูนย์ปฏิบัติการคอมพิวเตอร์และนวัตกรรมดิจิทัล ห้อง 311, 312, 314, และ 315 อาคาร 3 เฉลิมพระเกียรติ พัฒนาขึ้นเพื่อเพิ่มประสิทธิภาพการจัดการทรัพยากรห้องแล็บ สนับสนุนการเรียนการสอน การทำโครงงาน และการอบรมเชิงปฏิบัติการ
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                ระบบพร้อมใช้งาน (System Operational)
              </span>
              <span>• เวอร์ชัน 2.5 (2026)</span>
            </div>
          </div>

          {/* Col 2: Developer Credit Highlight (Explicitly requested by user) */}
          <div className="md:col-span-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-500/30 dark:border-cyan-500/20 shadow-lg shadow-cyan-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                <Code2 className="w-3.5 h-3.5" />
                ผู้พัฒนาระบบ (System Developer)
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                นักศึกษา ปวส.2
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={APP_ASSETS.studentAvatar}
                alt="นางสาว พิชชาภา มั่งมีผล"
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-cyan-500/40 shadow-sm"
              />
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {APP_ASSETS.developer.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {APP_ASSETS.developer.department}
                </p>
                <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">
                  รหัสนักศึกษา: 66309010023
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {APP_ASSETS.developer.email}
                </span>
              </div>
              <button
                onClick={handleOpen}
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 font-medium hover:underline flex items-center gap-0.5"
              >
                ดูข้อมูลเพิ่มเติม
              </button>
            </div>
          </div>

          {/* Col 3: Quick links & rooms */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              ห้องปฏิบัติการคอมพิวเตอร์
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center justify-between">
                <span>ห้อง 311 : Multimedia Studio</span>
                <span className="text-[10px] font-mono text-emerald-500">40 PCs</span>
              </li>
              <li className="flex items-center justify-between">
                <span>ห้อง 312 : Software & E-Com</span>
                <span className="text-[10px] font-mono text-amber-500">36 PCs</span>
              </li>
              <li className="flex items-center justify-between">
                <span>ห้อง 314 : Network & Cyber Sec</span>
                <span className="text-[10px] font-mono text-emerald-500">30 PCs</span>
              </li>
              <li className="flex items-center justify-between">
                <span>ห้อง 315 : AI & Digital Business</span>
                <span className="text-[10px] font-mono text-emerald-500">36 PCs</span>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-400">
              ติดต่อธุรการแผนก: โทร 02-xxx-xxxx ต่อ 3110
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {APP_ASSETS.developer.year} แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              Designed & Developed by <strong className="text-cyan-700 dark:text-cyan-400 font-semibold">{APP_ASSETS.developer.name}</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
