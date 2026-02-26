import React, { useEffect, useRef, useState } from "react";
import { linkifyText } from "../../utils/linkify";

type InitialQuote = {
  text: string;
  absoluteStart: number;
  absoluteEnd: number;
} | null;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (c: {
    text: string;
    quote?: string;
    quoteAbsoluteStart?: number;
    quoteAbsoluteEnd?: number;
  }) => void;
  initialQuote?: InitialQuote;
};

const CommentInputBottomSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialQuote = null,
}) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<{ start?: number; end?: number }>({});
  const [text, setText] = useState("");
  const [quote, setQuote] = useState<string | undefined>(undefined);
  const [quoteAbsoluteStart, setQuoteAbsoluteStart] = useState<
    number | undefined
  >(undefined);
  const [quoteAbsoluteEnd, setQuoteAbsoluteEnd] = useState<number | undefined>(
    undefined,
  );
  const [translateY, setTranslateY] = useState(0);
  const dragging = useRef<{ active: boolean; startY: number }>({
    active: false,
    startY: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setQuote(initialQuote?.text ?? undefined);
      setQuoteAbsoluteStart(initialQuote?.absoluteStart);
      setQuoteAbsoluteEnd(initialQuote?.absoluteEnd);
      selectionRef.current.start = initialQuote?.absoluteStart;
      selectionRef.current.end = initialQuote?.absoluteEnd;
      setTimeout(
        () => sheetRef.current?.querySelector("textarea")?.focus(),
        50,
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      selectionRef.current = {};
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialQuote]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({
      text: text.trim(),
      quote,
      quoteAbsoluteStart,
      quoteAbsoluteEnd,
    });
    setText("");
    setQuote(undefined);
    setQuoteAbsoluteStart(undefined);
    setQuoteAbsoluteEnd(undefined);
    selectionRef.current = {};
    onClose();
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

  const renderQuotedHTML = (
    rawQuote?: string,
    start?: number,
    end?: number,
  ) => {
    const raw = rawQuote || "";
    if (typeof start === "number" && typeof end === "number") {
      const relStart = start || 0;
      const relEnd = end || 0;
      if (relStart >= 0 && relEnd > relStart) {
        const before = raw.slice(0, relStart);
        const target = raw.slice(relStart, relEnd);
        const after = raw.slice(relEnd);
        return (
          linkifyText(before) +
          `<span class=\"bg-red-200\">${linkifyText(target)}</span>` +
          linkifyText(after)
        ).replace(/\n/g, "<br/>");
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
            <div className="text-lg font-semibold">コメントを書く</div>
            <button onClick={onClose} className="text-gray-600">
              閉じる
            </button>
          </div>
        </div>

        <div className="px-4 py-3 overflow-auto flex-1">
          {quote && (
            <div className="mb-3 text-sm text-gray-700 bg-red-50 p-2 rounded max-h-40 overflow-auto">
              <div className="font-semibold text-gray-800 mb-1">
                引用プレビュー
              </div>
              <div
                className="whitespace-pre-wrap break-words text-sm"
                dangerouslySetInnerHTML={{
                  __html: renderQuotedHTML(
                    quote,
                    quoteAbsoluteStart,
                    quoteAbsoluteEnd,
                  ),
                }}
              />
              <div className="text-right mt-2">
                <button
                  onClick={() => setQuote(undefined)}
                  className="text-xs text-gray-500">
                  クリア
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
              rows={4}
              placeholder="コメントを入力してください"
            />
          </div>
        </div>

        <div className="px-4 pb-6 pt-2 border-t bg-white flex-shrink-0">
          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-60"
              disabled={!text.trim()}>
              送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentInputBottomSheet;
