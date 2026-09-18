import React, { useState } from 'react';
import {
  Monitor,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Zap,
  Layers,
  Wrench,
  Shield,
  X
} from 'lucide-react';
import { Room, RoomId } from '../types';

interface RoomManagementViewProps {
  rooms: Room[];
  onSaveRooms: (updatedRooms: Room[]) => void;
}

export const RoomManagementView: React.FC<RoomManagementViewProps> = ({
  rooms,
  onSaveRooms,
}) => {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form states
  const [roomName, setRoomName] = useState('');
  const [roomCapacity, setRoomCapacity] = useState(40);
  const [computersCount, setComputersCount] = useState(36);
  const [roomStatus, setRoomStatus] = useState<'available' | 'maintenance' | 'occupied'>('available');
  const [description, setDescription] = useState('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [gpu, setGpu] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [equipmentList, setEquipmentList] = useState<string[]>([]);

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setIsAddingNew(false);
    setRoomName(room.name);
    setRoomCapacity(room.capacity);
    setComputersCount(room.computersCount);
    setRoomStatus(room.status);
    setDescription(room.description);
    setCpu(room.specs.cpu);
    setRam(room.specs.ram);
    setGpu(room.specs.gpu);
    setEquipmentList([...room.equipment]);
  };

  const handleToggleStatus = (room: Room) => {
    const nextStatus = room.status === 'available' ? 'maintenance' : 'available';
    const updated = rooms.map((r) =>
      r.id === room.id ? { ...r, status: nextStatus as any } : r
    );
    onSaveRooms(updated);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom && !isAddingNew) return;

    if (editingRoom) {
      const updated = rooms.map((r) => {
        if (r.id === editingRoom.id) {
          return {
            ...r,
            name: roomName,
            capacity: Number(roomCapacity),
            computersCount: Number(computersCount),
            status: roomStatus,
            description,
            specs: {
              ...r.specs,
              cpu,
              ram,
              gpu,
            },
            equipment: equipmentList,
          };
        }
        return r;
      });
      onSaveRooms(updated);
    }
    setEditingRoom(null);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Monitor className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            จัดการข้อมูลห้องปฏิบัติการ (Room Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ปรับปรุงข้อมูลห้อง 311, 312, 314, 315 สเปกคอมพิวเตอร์ อุปกรณ์ประจำห้อง และสถานะเปิด/ปิดปรับปรุง
          </p>
        </div>
      </div>

      {/* Rooms Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const isMaintenance = room.status === 'maintenance';
          return (
            <div
              key={room.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      ห้อง {room.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {room.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{room.description}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                    isMaintenance
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isMaintenance ? 'ปิดปรับปรุง' : 'เปิดใช้งานปกติ'}
                </span>
              </div>

              {/* Specs info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">จำนวนเครื่อง PC / ความจุ:</span>
                  <strong className="font-mono">{room.computersCount} เครื่อง / {room.capacity} ที่นั่ง</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">หน่วยประมวลผล (CPU):</span>
                  <span className="truncate max-w-[200px]">{room.specs.cpu}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">การ์ดจอ & แรม:</span>
                  <span className="truncate max-w-[200px]">{room.specs.gpu} • {room.specs.ram}</span>
                </div>
              </div>

              {/* Equipment list */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  อุปกรณ์ประจำห้อง:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {room.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleToggleStatus(room)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isMaintenance
                      ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{isMaintenance ? 'เปลี่ยนเป็น: เปิดใช้งาน' : 'เปลี่ยนเป็น: ปิดปรับปรุง'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(room)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>แก้ไขข้อมูล</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-600" />
                แก้ไขข้อมูลห้องปฏิบัติการ {editingRoom.id}
              </h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  ชื่อห้องปฏิบัติการ
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    จำนวนเครื่องคอมพิวเตอร์
                  </label>
                  <input
                    type="number"
                    value={computersCount}
                    onChange={(e) => setComputersCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    ความจุที่นั่งทั้งหมด
                  </label>
                  <input
                    type="number"
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  สถานะห้องปฏิบัติการ
                </label>
                <select
                  value={roomStatus}
                  onChange={(e) => setRoomStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="available">พร้อมใช้งาน (Available)</option>
                  <option value="maintenance">ปิดปรับปรุงชั่วคราว (Under Maintenance)</option>
                  <option value="occupied">กำลังใช้งาน (Occupied)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  คำอธิบายการใช้งาน
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">สเปกฮาร์ดแวร์</span>
                <input
                  type="text"
                  placeholder="CPU เช่น Intel Core i7-14700"
                  value={cpu}
                  onChange={(e) => setCpu(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="RAM เช่น 32 GB DDR5"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="GPU เช่น NVIDIA RTX 4060 8GB"
                  value={gpu}
                  onChange={(e) => setGpu(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-xs"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
