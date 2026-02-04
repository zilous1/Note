import React, { useState, useEffect } from 'react';
import { Check, Minus, X, Save, EyeOff, FolderOpen, Plus, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_NOTES = [
  // ... 그대로 유지
];

export function NoteApp() {
  const [notes, setNotes] = useState(
    INITIAL_NOTES.map(note => ({
      ...note,
      isEditing: false,
      tempTitle: note.title,
      tempContent: note.content,
      hiddenRanges: [] as { start: number; end: number }[],
    }))
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeNote, setActiveNote] = useState<typeof notes[number] | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);

  // 숨김 적용 함수
  const hideSelectedText = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selectedId) return;

    const range = selection.getRangeAt(0);
    const start = Math.min(range.startOffset, range.endOffset);
    const end = Math.max(range.startOffset, range.endOffset);

    setNotes(prev =>
      prev.map(note =>
        note.id === selectedId
          ? { ...note, hiddenRanges: [...note.hiddenRanges, { start, end }] }
          : note
      )
    );

    selection.removeAllRanges();
  };

  // 숨김 복구
  const restoreHidden = () => {
    if (!selectedId) return;
    setNotes(prev =>
      prev.map(note =>
        note.id === selectedId ? { ...note, hiddenRanges: [] } : note
      )
    );
  };

  // 내용 렌더링
  const renderContent = (note: typeof notes[number]) => {
    if (note.isEditing) return note.tempContent || note.content;

    const content = note.tempContent || note.content;
    if (note.hiddenRanges.length === 0) return content;

    const parts: React.ReactNode[] = [];
    let last = 0;
    const sorted = [...note.hiddenRanges].sort((a, b) => a.start - b.start);

    sorted.forEach(({ start, end }) => {
      if (last < start) parts.push(content.slice(last, start));
      parts.push(
        <span key={`${start}-${end}`} style={{ color: note.color }}>
          {content.slice(start, end)}
        </span>
      );
      last = end;
    });

    if (last < content.length) parts.push(content.slice(last));
    return parts;
  };

  const handleNewNote = () => {
    const colors = ['#F472B6', '#F87171', '#4ADE80', '#FDE047', '#67E8F9', '#A78BFA'];
    const newNote = {
      id: Date.now(),
      title: 'New Title',
      content: '',
      color: colors[notes.length % colors.length],
      isEditing: false,
      tempTitle: 'New Title',
      tempContent: '',
      hiddenRanges: [],
    };
    setNotes([...notes, newNote]);
    setSelectedId(newNote.id);
    setActiveNote(newNote);
  };

  const updateNote = (id: number, patch: Partial<{ title: string; content: string }>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));
    if (activeNote?.id === id) setActiveNote(prev => prev ? { ...prev, ...patch } : null);
  };

  // Delete key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        const activeEl = document.activeElement as HTMLElement | null;
        if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') return;
        setNotes(prev => prev.filter(n => n.id !== selectedId));
        if (activeNote?.id === selectedId) setActiveNote(null);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, activeNote]);

  // ... 나머지 minimized / hidden 상태 return 부분은 그대로 유지 ...

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] p-4 font-sans">
      <AnimatePresence>
        <motion.div
          // ... 기존 스타일 유지 ...
        >
          {/* Top Controls Bar - 그대로 유지 */}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            <div className="flex flex-col gap-3 pb-20">
              {notes.map(note => (
                <motion.div
                  key={note.id}
                  layoutId={`note-${note.id}`}
                  onClick={() => setSelectedId(note.id)}
                  onDoubleClick={() => { setSelectedId(note.id); setActiveNote(note); }}
                  className={`rounded-[24px] overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg group relative ${selectedId === note.id ? 'ring-4 ring-white/30 scale-[1.01]' : ''}`}
                  style={{ backgroundColor: note.color, minHeight: '120px' }}
                >
                  <div className="flex h-full min-h-[120px]">
                    {/* 왼쪽 제목 부분 - 그대로 유지 */}

                    <div className="w-[65%] p-4 relative flex items-center">
                      {activeNote && activeNote.id === note.id ? (
                        <div className="w-full h-full relative">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Content</span>

                          {/* Ruled Lines */}
                          <div 
                            className="absolute inset-x-0 top-6 bottom-0 pointer-events-none opacity-20"
                            style={{
                              backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                              backgroundSize: '100% 2rem',
                              margin: '0 1.5rem'
                            }}
                          />

                          <textarea
                            value={activeNote.content}
                            onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                            className="w-full h-full bg-transparent text-sm leading-[1.6rem] outline-none resize-none relative z-10"
                            placeholder="Start typing..."
                          />
                        </div>
                      ) : (
                        <>
                          <div 
                            className="absolute inset-y-4 left-4 right-4 opacity-10 pointer-events-none"
                            style={{
                              backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                              backgroundSize: '100% 1.4rem',
                            }}
                          />
                          <p className="text-sm text-black/70 whitespace-pre-wrap break-words relative z-10">
                            {renderContent(note)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Trash 버튼 - 그대로 */}
                </motion.div>
              ))}

              {/* 새 노트 추가 버튼 - 그대로 */}
            </div>
          </div>

          {/* Bottom Toolbar - 감추기 + 복구 버튼으로 교체 */}
          <div className="px-8 pt-6 pb-12 flex justify-between items-center bg-[#1a1a1a] border-t border-white/5 shadow-2xl z-30">
            <button onClick={handleSave} className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/5">
                <Save size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-tighter">SAVE</span>
            </button>

            <button
              onClick={hideSelectedText}
              disabled={!selectedId}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-all disabled:opacity-50"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/5">
                <EyeOff size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-tighter">감추기</span>
            </button>

            <button
              onClick={restoreHidden}
              disabled={!selectedId}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-all disabled:opacity-50"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/5">
                <Eye size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-tighter">복구</span>
            </button>

            <button onClick={handleLoad} className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/5">
                <FolderOpen size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-tighter">LOAD</span>
            </button>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full z-40" />
        </motion.div>
      </AnimatePresence>

      {/* 스타일 - 그대로 */}
    </div>
  );
}