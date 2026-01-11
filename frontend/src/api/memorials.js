//const API_URL = "https://virtual-pet-memorial-backend.onrender.com/api";
const API_URL = "http://localhost:3001/api";

/* ======================================================
   CREATE
   ====================================================== */
export async function createMemorial(data) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch(`${API_URL}/memorials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Errore creazione memoriale";
    try {
      const error = await res.json();
      if (error?.error) errorMessage = error.error;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return res.json();
}

/* ======================================================
   READ — SINGOLO MEMORIALE (slug, pubblico/privato)
   ====================================================== */
export async function getMemorialBySlug(slug) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/memorials/${slug}`, {
    cache: "no-store",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (res.status === 404) {
    throw new Error("Memoriale non trovato");
  }

  if (!res.ok) {
    throw new Error("Errore caricamento memoriale");
  }

  return res.json();
}

/* ======================================================
   READ — MEMORIALI DELL’UTENTE
   ====================================================== */
export async function getMyMemorials() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch(`${API_URL}/memorials/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Errore caricamento memoriali");
  }

  return res.json();
}

/* ======================================================
   READ — MEMORIALE BY ID (EDIT)
   ====================================================== */
export async function getMemorialById(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch(`${API_URL}/memorials/id/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMessage = "Errore caricamento memoriale";
    try {
      const error = await res.json();
      if (error?.error) errorMessage = error.error;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return res.json();
}

/* ======================================================
   UPDATE
   ====================================================== */
export async function updateMemorial(id, data) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch(`${API_URL}/memorials/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Errore aggiornamento memoriale";
    try {
      const error = await res.json();
      if (error?.error) errorMessage = error.error;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return res.json();
}

/* ======================================================
   DELETE
   ====================================================== */
export async function deleteMemorial(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch(`${API_URL}/memorials/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMessage = "Errore eliminazione memoriale";
    try {
      const error = await res.json();
      if (error?.error) errorMessage = error.error;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return res.json();
}

/* ======================================================
   READ — MEMORIALI PUBBLICI (HOME + SEARCH)
   ====================================================== */
export async function getPublicMemorials(
  page = 1,
  limit = 6,
  search = ""
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.append("search", search);
  }

  const res = await fetch(
    `${API_URL}/memorials/public?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Errore caricamento memoriali pubblici");
  }

  return res.json();
}
