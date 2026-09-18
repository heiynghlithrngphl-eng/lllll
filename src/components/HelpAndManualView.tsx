import React, { useState } from 'react';
import {
  HelpCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Send,
  Wrench,
  Shield,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Room, IssueReport, User } from '../types';
import { StorageService } from '../services/storageService';

interface HelpAndManualViewProps {
  rooms: Room[];
  currentUser: User;
  issues: IssueReport[];
  onAddIssue: (issue: IssueReport) => void;
  defaultTab?: 'manual' | 'faq' | 'report';
}

export const HelpAndManualView: React.FC<HelpAndManualViewProps> = ({
  rooms,
  currentUser,
  issues,
  onAddIssue,
  defaultTab = 'manual',
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'faq' | 'report'>(defaultTab);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Report Issue Form State
  const [roomId, setRoomId] = useState<'311' | '312' | '314' | '315'>('311');
  const [equipmentName, setEquipmentName] = useState('');
  const [seatId, setSeatId] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  const faqs = [
    {
      q: 'สามารถจองห้องล่วงหน้าได้กี่วัน?',
      a: 'นักศึกษาและอาจารย์สามารถจองห้องล่วงหน้าได้สูงสุด 14 วันทำการ โดยระบบจะทำการตรวจเช็คตารางสอนปกติและเวลาที่ซ้ำซ้อนให้แบบอัตโนมัติ',
    },
    {
      q: 'การสแกน QR Code เช็คอิน ต้องทำอย่างไร?',
      a: 'เมื่อถึงเวลาเริ่มการจอง ให้เปิดเมนู "รายการจองของฉัน" แล้วกด "แสดง QR Code" นำไปสแกนที่หน้าจอแท็บเล็ต/กล้องประจำหน้าห้องปฏิบัติการ เพื่อยืนยันการเข้าใช้งาน',
    },
    {
      q: 'หากต้องการยกเลิกการจอง ต้องทำอย่างไร?',
      a: 'สามารถกดยกเลิกการจองได้ที่เมนู "รายการจองของฉัน" ก่อนเวลาเริ่มใช้งานอย่างน้อย 30 นาที เพื่อเปิดโอกาสให้เพื่อนนักศึกษาหรือครูท่านอื่นสามารถจองห้องได้',
    },
    {
      q: 'สามารถนำอาหารและเครื่องดื่มเข้าไปรับประทานในห้องปฏิบัติการได้หรือไม่?',
      a: 'ไม่อนุญาตเด็ดขาด ตามระเบียบความปลอดภัยห้องปฏิบัติการคอมพิวเตอร์ เพื่อป้องกันความเสียหายต่ออุปกรณ์อิเล็กทรอนิกส์และไฟฟ้าลัดวงจร',
    },
    {
      q: 'หากคอมพิวเตอร์หรืออุปกรณ์ชำรุดระหว่างใช้งาน ต้องทำอย่างไร?',
      a: 'สามารถกรอกฟอร์มในแท็บ "แจ้งอุปกรณ์ชำรุด" ด้านบน ระบุหมายเลขเครื่อง PC เพื่อให้เจ้าหน้าที่ศูนย์วิทยบริการเข้าตรวจสอบและซ่อมบำรุงทันที',
    },
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !equipmentName.trim()) return;

    const newIssue: IssueReport = {
      id: `rep-${Date.now()}`,
      roomId,
      roomName: `ห้องปฏิบัติการ ${roomId}`,
      equipmentName,
      seatId: seatId || undefined,
      description,
      urgency,
      reportedBy: currentUser.name,
      reportedByRole: currentUser.role,
      reportedByContact: currentUser.phone || currentUser.email,
      status: 'pending',
      createdAt: new Date().toLocaleString('th-TH'),
    };

    onAddIssue(newIssue);
    StorageService.addLog(
      currentUser,
      'แจ้งอุปกรณ์ชำรุด',
      `แจ้งปัญหา ${equipmentName} ห้อง ${roomId}: ${description}`
    );

    setIsReportSubmitted(true);
    setEquipmentName('');
    setSeatId('');
    setDescription('');
    setTimeout(() => setIsReportSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            ศูนย์สนับสนุนและคู่มือการใช้งาน (Support & Help Center)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            คู่มือการจอง, ระเบียบปฏิบัติ, คำถามที่พบบ่อย (FAQ), และแบบฟอร์มแจ้งอุปกรณ์ชำรุด
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            คู่มือ & ระเบียบ
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'faq'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            คำถามที่พบบ่อย (FAQ)
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'report'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            แจ้งอุปกรณ์ชำรุด
          </button>
        </div>
      </div>

      {/* Tab 1: User Manual & Lab Safety */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* 4 Steps Guide */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600" />
              ขั้นตอนการจองห้องปฏิบัติการ (4 Simple Steps)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="w-7 h-7 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">เลือกห้อง & วันเวลา</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  เลือกห้อง 311, 312, 314 หรือ 315 ระบบจะตรวจสอบเวลาซ้ำซ้อนให้แบบอัตโนมัติทันที
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="w-7 h-7 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">ระบุวัตถุประสงค์</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ระบุรายละเอียดโครงงาน รายวิชา หรือกิจกรรม พร้อมเลือกอุปกรณ์เสริมที่ต้องการ
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="w-7 h-7 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">รอการอนุมัติ</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  อาจารย์หรือผู้ดูแลตรวจสอบและกดอนุมัติ ระบบจะส่งแจ้งเตือนผ่าน Line / Email
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="w-7 h-7 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">สแกน QR เช็คอิน</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  เปิดบัตรจองบนมือถือ แล้วสแกน QR Code หน้าห้องเพื่อเช็คอินและเริ่มใช้งาน
                </p>
              </div>
            </div>
          </div>

          {/* Lab Regulations */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              ระเบียบและข้อปฏิบัติการใช้ห้องปฏิบัติการคอมพิวเตอร์
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>แต่งกายด้วยเครื่องแบบนักศึกษาให้เรียบร้อยตามระเบียบของสถานศึกษา</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>ห้ามนำอาหาร เครื่องดื่ม ขนมขบเคี้ยว หรือหมากฝรั่งเข้ามาในห้องเด็ดขาด</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>ห้ามเคลื่อนย้าย สับเปลี่ยน หรือถอดประกอบชิ้นส่วนคอมพิวเตอร์โดยไม่ได้รับอนุญาต</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>ห้ามใช้เครื่องคอมพิวเตอร์ในการเล่นเกมการพนัน หรือเข้าเว็บไซต์ที่ไม่เหมาะสม</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>ก่อนออกจากห้อง ให้ปิดเครื่องคอมพิวเตอร์ (Shut Down) และดันเก้าอี้เก็บเข้าที่ทุกครั้ง</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>หากพบปัญหาอุปกรณ์ชำรุด ให้รีบแจ้งครูผู้สอนหรือบันทึกในระบบทันที</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: FAQ Accordion */}
      {activeTab === 'faq' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            คำถามที่พบบ่อย (Frequently Asked Questions)
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-cyan-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Report Issue Form & Issue List */}
      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-rose-500" />
              แบบฟอร์มแจ้งปัญหาการใช้งาน / อุปกรณ์ชำรุด
            </h2>
            <p className="text-xs text-slate-500">
              แจ้งข้อมูลถึงศูนย์ซ่อมบำรุงและผู้ดูแลระบบ เพื่อดำเนินการแก้ไขอย่างรวดเร็ว
            </p>

            {isReportSubmitted && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว เจ้าหน้าที่จะเร่งดำเนินการตรวจสอบ</span>
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ห้องปฏิบัติการที่เกิดปัญหา
                  </label>
                  <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        ห้อง {r.id} ({r.name.split('(')[1]?.replace(')', '') || ''})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    หมายเลขเครื่อง PC (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น PC-18"
                    value={seatId}
                    onChange={(e) => setSeatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  อุปกรณ์หรือส่วนที่มีปัญหา <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สายจอ DisplayPort, เมาส์, เครื่องปรับอากาศตัวหน้า, โปรเจกเตอร์"
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ระดับความเร่งด่วน
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'low', label: 'ทั่วไป (Low)' },
                    { id: 'medium', label: 'ปานกลาง (Medium)' },
                    { id: 'high', label: 'เร่งด่วน (High)' },
                  ].map((lvl) => (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setUrgency(lvl.id as any)}
                      className={`py-1.5 rounded-xl text-xs font-semibold border ${
                        urgency === lvl.id
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รายละเอียดอาการเสียหรือปัญหาที่พบ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="อธิบายอาการอย่างละเอียด เช่น เครื่องเปิดไม่ติด, จอฟ้าโค้ด error, ไฟไม่เข้าปลั๊กไฟแถว 2..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>ส่งรายงานแจ้งซ่อม</span>
              </button>
            </form>
          </div>

          {/* Recent Issue Reports List */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              รายการแจ้งซ่อมและสถานะการแก้ไข ({issues.length})
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        {issue.equipmentName} {issue.seatId ? `(${issue.seatId})` : ''}
                      </strong>
                      <p className="text-[11px] text-slate-400">
                        {issue.roomName} • แจ้งโดย: {issue.reportedBy}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        issue.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : issue.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {issue.status === 'resolved'
                        ? 'แก้ไขแล้ว'
                        : issue.status === 'in_progress'
                        ? 'กำลังซ่อม'
                        : 'รอดำเนินการ'}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">{issue.description}</p>

                  {issue.adminComment && (
                    <div className="p-2 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/40 text-[11px] text-cyan-800 dark:text-cyan-300">
                      ช่าง/ผู้ดูแล: "{issue.adminComment}"
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400">
                    เวลาที่แจ้ง: {issue.createdAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
