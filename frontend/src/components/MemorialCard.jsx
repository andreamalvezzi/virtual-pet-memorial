import { Link } from "react-router-dom";
import "./MemorialCard.css";

export default function MemorialCard({ memorial }) {
  return (
    <Link
      to={`/memorials/${memorial.slug}`}
      className="memorial-card-link"
    >
      <article className="memorial-card">
        {/* IMMAGINE */}
        <div className="memorial-card-image skeleton">
          {memorial.imageUrl ? (
            <img
              src={memorial.imageUrl.replace(
                "/upload/",
                "/upload/w_400,f_auto,q_auto/"
              )}
              srcSet={`
                ${memorial.imageUrl.replace("/upload/", "/upload/w_300,f_auto,q_auto/")} 300w,
                ${memorial.imageUrl.replace("/upload/", "/upload/w_400,f_auto,q_auto/")} 400w,
                ${memorial.imageUrl.replace("/upload/", "/upload/w_600,f_auto,q_auto/")} 600w
              `}
              sizes="(max-width: 768px) 100vw, 300px"
              alt={`Foto di ${memorial.petName}`}
              loading="lazy"
              onLoad={(e) =>
                e.currentTarget.classList.add("loaded")
              }
            />
          ) : (
            <div className="memorial-card-placeholder">
              Nessuna immagine
            </div>
          )}
        </div>

        {/* TESTO */}
        <div className="memorial-card-content">
          <h3>{memorial.petName}</h3>

          <p className="species">
            {memorial.species}
          </p>

          <p className="date">
            Creato il{" "}
            {new Date(memorial.createdAt).toLocaleDateString()}
          </p>
        </div>
      </article>
    </Link>
  );
}
