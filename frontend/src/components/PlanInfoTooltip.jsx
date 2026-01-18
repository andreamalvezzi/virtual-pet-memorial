import { useState } from "react";
import "./PlanInfoTooltip.css";

export default function PlanInfoTooltip({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="planinfo"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      aria-label="Informazioni sul piano"
    >
      <span className="planinfo-icon" aria-hidden="true">ⓘ</span>

      {open && (
        <span className="planinfo-bubble" role="tooltip">
          {title && <strong className="planinfo-title">{title}</strong>}
          <span className="planinfo-content">{children}</span>
        </span>
      )}
    </span>
  );
}

