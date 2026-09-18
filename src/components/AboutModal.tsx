import React from 'react';
import {
  Sparkles,
  Award,
  Code2,
  X,
  ExternalLink,
  BookOpen,
  Monitor,
  Heart,
  Layers,
  GraduationCap
} from 'lucide-react';
import { DEVELOPER_CREDIT, DEPARTMENT_INFO } from '../data/initialData';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ข้อมูลระบบและผู้พัฒนา (Project & Developer Info)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Department Banner */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-blue-950/20 to-slate-900/40 border border-cyan-500/20">
          <img
            src={DEPARTMENT_INFO.logoUrl}
            alt="Department Logo"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shrink-0 bg-white p-1"
          />
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {DEPARTMENT_INFO.nameTh}
            </h4>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
              {DEPARTMENT_INFO.nameEn}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ศูนย์ปฏิบัติการคอมพิวเตอร์และนวัตกรรมดิจิทัล ห้อง 311, 312, 314, 315
            </p>
          </div>
        </div>

        {/* Developer Credit Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
            <GraduationCap className="w-4 h-4" />
            <span>พัฒนาโดย (Developed By)</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              พ
            </div>
            <div>
              <h5 className="text-base font-bold text-slate-900 dark:text-white">
                {DEVELOPER_CREDIT.name}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {DEVELOPER_CREDIT.department} • {DEVELOPER_CREDIT.organization}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {DEVELOPER_CREDIT.academicYear} • โครงงานพัฒนาระบบสารสนเทศเพื่อการศึกษา
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Info */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            เทคโนโลยีที่ใช้ในการพัฒนา (Technology Stack)
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <strong className="block text-slate-800 dark:text-slate-200 font-mono">React 18 + Vite</strong>
              <span>สถาปัตยกรรม SPA ประสิทธิภาพสูง</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <strong className="block text-slate-800 dark:text-slate-200 font-mono">Tailwind CSS</strong>
              <span>Tech / Modern UI + Dark Mode</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <strong className="block text-slate-800 dark:text-slate-200 font-mono">Interactive Floor Plan</strong>
              <span>ผังที่นั่งเสมือนจริง 4 ห้องแล็บ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <strong className="block text-slate-800 dark:text-slate-200 font-mono">QR Code Engine</strong>
              <span>สร้างและตรวจสอบรหัสบัตรดิจิทัล</span>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 text-xs text-cyan-900 dark:text-cyan-200 space-y-1.5 leading-relaxed">
          <strong className="block font-bold">วัตถุประสงค์ของโครงการ:</strong>
          <p>
            1. ยกระดับการจัดการห้องปฏิบัติการคอมพิวเตอร์ แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล ให้เป็นระบบอัตโนมัติ<br />
            2. ป้องกันปัญหาการใช้ห้องชนกัน (Time Conflict Prevention) ด้วยระบบคำนวณช่วงเวลาแบบเรียลไทม์<br />
            3. ตรวจสอบการเข้าใช้งานผ่าน QR Code และส่งออกรายงานการใช้ทรัพยากรห้องเพื่อการบริหารจัดการอย่างมีประสิทธิภาพ
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition-colors"
        >
          ปิดหน้าต่าง
        </button>

      </div>
    </div>
  );
};
