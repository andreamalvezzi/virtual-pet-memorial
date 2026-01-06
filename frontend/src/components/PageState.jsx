export default function PageState({ variant = "loading", title, message, action }) {
  return (
    <section className={`page-state page-state--${variant}`} aria-live="polite">
      <div className="page-state__card">
        <h2 className="page-state__title">{title}</h2>
        {message && <p className="page-state__message">{message}</p>}
        {action && <div className="page-state__action">{action}</div>}
      </div>
    </section>
  );
}
