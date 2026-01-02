import { Link } from "react-router-dom";

export default function MemorialCard({ memorial }) {
  return (
    <Link
      to={`/memorials/${memorial.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          background: "#fff",
        }}
      >
        {/* IMMAGINE */}
        <div style={{ height: 180, background: "#eee" }}>
          {memorial.imageUrl ? (
            <img
              src={memorial.imageUrl}
              alt={memorial.petName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontSize: 14,
              }}
            >
              Nessuna immagine
            </div>
          )}
        </div>

        {/* TESTO */}
        <div style={{ padding: 14 }}>
          <h3 style={{ margin: "0 0 6px" }}>
            {memorial.petName}
          </h3>

          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            {memorial.species}
          </p>

          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>
            Creato il{" "}
            {new Date(memorial.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

