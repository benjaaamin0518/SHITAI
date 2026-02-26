import React, { useEffect, useRef, useState } from "react";
import { linkifyText } from "../../utils/linkify";

type Comment = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  quote?: string;
  createdAt: string;
  quoteAbsoluteStart?: number;
  quoteAbsoluteEnd?: number;
};

type InitialQuote = {
  text: string;
  absoluteStart: number;
  absoluteEnd: number;
} | null;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenInput?: () => void;
  comments?: Comment[];
};

const CommentBottomSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenInput,
  comments = [],
}) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<{ start?: number; end?: number }>({});
  const [text, setText] = useState("");
  // viewer-only: no internal quote state for submission
  const [translateY, setTranslateY] = useState(0);
  const dragging = useRef<{ active: boolean; startY: number }>({
    active: false,
    startY: 0,
  });

  useEffect(() => {
    if (isOpen) {
      // viewer: prevent body scroll while open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = () => {
    // viewer does not submit
    return;
  };

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const onPointerDown = (e: PointerEvent) => {
      dragging.current.active = true;
      dragging.current.startY = e.clientY;
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current.active) return;
      const delta = e.clientY - dragging.current.startY;
      if (delta > 0) setTranslateY(delta);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging.current.active) return;
      dragging.current.active = false;
      const delta = e.clientY - dragging.current.startY;
      setTranslateY(0);
      if (delta > 120) onClose();
    };

    handle.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onClose]);

  const renderQuotedHTML = (c: Comment) => {
    const raw = c.quote || "";
    if (
      typeof c.quoteAbsoluteStart === "number" &&
      typeof c.quoteAbsoluteEnd === "number"
    ) {
      const relStart = c.quoteAbsoluteStart || 0;
      const relEnd = c.quoteAbsoluteEnd || 0;
      if (relStart >= 0 && relEnd > relStart) {
        const before = raw.slice(0, relStart);
        const target = raw.slice(relStart, relEnd);
        const after = raw.slice(relEnd);
        const combined = (
          linkifyText(before) +
          `<span class="bg-red-200">${linkifyText(target)}</span>` +
          linkifyText(after)
        ).replace(/\n/g, "<br/>");
        return combined;
      }
    }
    return linkifyText(raw.replace(/\n/g, "<br/>"));
  };

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 pointer-events-none ${isOpen ? "" : ""}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${isOpen ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <div
        ref={sheetRef}
        className={`pointer-events-auto fixed left-0 right-0 bottom-0 bg-white rounded-t-xl shadow-xl transition-transform duration-200 flex flex-col ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{
          maxHeight: "70vh",
          transform: isOpen
            ? `translateY(${translateY}px)`
            : "translateY(100%)",
        }}>
        <div ref={handleRef} className="px-4 pt-3 pb-2 border-b touch-none">
          <div className="w-12 h-1.5 bg-gray-300 rounded mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">コメント</div>
            <button onClick={onClose} className="text-gray-600">
              閉じる
            </button>
          </div>
        </div>

        <div className="px-4 py-3 overflow-auto flex-1">
          {/* コメントリストの先頭に引用プレビューは表示しない（表示専用シート） */}

          {comments.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-6">
              まだコメントがありません
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-800">
                    {c.userName}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                  {c.quote && (
                    <blockquote className="border-l-4 border-red-200 bg-red-50 p-2 mb-2 text-sm text-gray-700">
                      <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: renderQuotedHTML(c),
                        }}
                      />
                    </blockquote>
                  )}
                  <div
                    className="text-gray-800 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: linkifyText(c.text),
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 入力はフッターのボタンで開くようにする（フッターに配置） */}
        </div>

        <div className="px-4 pb-6 pt-2 border-t bg-white flex-shrink-0">
          <div className="flex items-center justify-center">
            <button
              onClick={() => onOpenInput && onOpenInput()}
              className="w-full text-left rounded-xl border border-gray-200 p-3 text-sm bg-white hover:bg-gray-50">
              <div className="text-sm text-gray-500">コメントを書く...</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentBottomSheet;
