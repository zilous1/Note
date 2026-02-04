import React, { useState } from "react";
import {
  Check,
  Minus,
  X,
  Save,
  EyeOff,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data based on the image provided
const INITIAL_NOTES = [
  {
    id: 1,
    title: "UI concepts",
    content:
      "worth existing and exploring further for the next update.",
    color: "#F472B6",
  },
  {
    id: 2,
    title: "Book Review",
    content:
      "The Design of Everyday Things by Don Norman. Focus on affordances.",
    color: "#F87171",
  },
  {
    id: 3,
    title: "Animes",
    content:
      "produced by Ufotable. Demon Slayer, Fate/stay night UBW.",
    color: "#4ADE80",
  },
  {
    id: 4,
    title: "Mangas",
    content:
      "planned to read: Chainsaw Man, JJK, Solo Leveling.",
    color: "#FDE047",
  },
];

export function NoteApp() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);

  // iPhone 16 Dimensions
  const width = 393;
  const height = 852;

  const handleUpdateNote = (id, field, value) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, [field]: value } : note,
      ),
    );
  };

  const handleSave = () => {
    alert("모든 노트가 안전하게 저장되었습니다.");
  };

  const handleLoad = () => {
    alert("데이터를 성공적으로 새로고침했습니다.");
  };

  const handleNewNote = () => {
    const colors = [
      "#F472B6",
      "#F87171",
      "#4ADE80",
      "#FDE047",
      "#67E8F9",
      "#A78BFA",
    ];
    const newNote = {
      id: Date.now(),
      title: "제목 입력",
      content: "내용을 입력하세요...",
      color: colors[notes.length % colors.length],
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Minimized Shape
  if (isMinimized) {
    return (
      <div className="fixed top-20 right-10 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-white/90 backdrop-blur shadow-2xl rounded-2xl border-2 border-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        >
          <div className="flex flex-col gap-1 items-center">
            <div className="w-8 h-1 bg-black rounded-full" />
            <div className="w-6 h-1 bg-gray-300 rounded-full" />
          </div>
        </motion.div>
      </div>
    );
  }

  // Hidden State
  if (isHidden) {
    return (
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setIsHidden(false)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 border-2 border-white/10"
      >
        <FolderOpen size={28} />
      </motion.button>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] p-4 font-sans">
      <AnimatePresence>
        <motion.div
          key="app-frame"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ width, height }}
          className="bg-[#1a1a1a] rounded-[60px] shadow-[0_0_0_12px_rgba(0,0,0,1),0_40px_100px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col border-[8px] border-black"
        >
          {/* Top Controls Bar */}
          <div className="pt-10 px-8 pb-4 flex justify-between items-center z-30">
            <button
              onClick={() => setIsAlwaysOnTop(!isAlwaysOnTop)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAlwaysOnTop ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-white/10 text-gray-400"}`}
            >
              <Check size={20} strokeWidth={3} />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <Minus size={20} strokeWidth={3} />
              </button>
              <button
                onClick={() => setIsHidden(true)}
                className="w-10 h-10 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* iPhone Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-40" />

          {/* Main List Area (Editing occurs directly here) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            <div className="flex flex-col gap-4 pb-24">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  className="rounded-[28px] overflow-hidden shadow-lg group relative bg-white min-h-[140px]"
                  style={{ backgroundColor: note.color }}
                >
                  <div className="flex h-full min-h-[140px]">
                    {/* Left Column (35%) - Title Edit */}
                    <div className="w-[35%] p-4 border-r border-black/5 flex flex-col">
                      <span className="text-[9px] font-black text-black/20 uppercase tracking-widest mb-1">
                        Title
                      </span>
                      <textarea
                        value={note.title}
                        onChange={(e) =>
                          handleUpdateNote(
                            note.id,
                            "title",
                            e.target.value,
                          )
                        }
                        className="w-full bg-transparent font-bold text-sm outline-none resize-none placeholder:text-black/20"
                        placeholder="Untitled"
                        rows={4}
                      />
                    </div>

                    {/* Right Column (65%) - Content Edit with Lines */}
                    <div className="w-[65%] p-4 relative flex flex-col">
                      <span className="text-[9px] font-black text-black/20 uppercase tracking-widest mb-1">
                        Content
                      </span>

                      {/* Integrated Writing Lines */}
                      <div
                        className="absolute inset-x-4 top-10 bottom-4 pointer-events-none opacity-10"
                        style={{
                          backgroundImage:
                            "linear-gradient(#000 1px, transparent 1px)",
                          backgroundSize: "100% 1.4rem",
                        }}
                      />

                      <textarea
                        value={note.content}
                        onChange={(e) =>
                          handleUpdateNote(
                            note.id,
                            "content",
                            e.target.value,
                          )
                        }
                        className="w-full h-full bg-transparent text-sm leading-[1.4rem] outline-none resize-none relative z-10 placeholder:text-black/20"
                        placeholder="Start typing..."
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/20 hover:text-black active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}

              <button
                onClick={handleNewNote}
                className="h-28 rounded-[28px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 hover:border-white/30 hover:text-white/40 transition-all bg-white/5 group"
              >
                <Plus
                  size={32}
                  strokeWidth={1.5}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-[10px] font-bold mt-1 uppercase tracking-widest">
                  New Note
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="px-8 pt-6 pb-12 flex justify-between items-center bg-[#1a1a1a] border-t border-white/5 shadow-2xl z-30">
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/5 group-active:scale-95">
                <Save size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                SAVE
              </span>
            </button>

            <button
              onClick={() => setIsHidden(true)}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/5 group-active:scale-95">
                <EyeOff size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                HIDE
              </span>
            </button>

            <button
              onClick={handleLoad}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/5 group-active:scale-95">
                <FolderOpen size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                LOAD
              </span>
            </button>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full z-40" />
        </motion.div>
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        body {
          background-color: #f3f4f6;
          overflow: hidden;
        }
        textarea {
          scrollbar-width: none;
        }
        textarea::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
    </div>
  );
}