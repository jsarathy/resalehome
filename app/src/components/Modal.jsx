import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 520 }) {
  const cardRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const first = cardRef.current?.querySelector(
          'input, select, textarea, button:not(.modal-close)'
        );
        first?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Focus trap
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      cardRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={cardRef}
        className="modal-card"
        style={{ maxWidth }}
        onKeyDown={handleKeyDown}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {title && <h2 className="modal-heading" id="modal-title">{title}</h2>}
        {subtitle && <p className="modal-sub">{subtitle}</p>}
        {children}
      </div>
    </div>,
    document.body
  );
}
