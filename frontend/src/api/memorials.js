const API_URL = "/api";

/**
 * Crea un nuovo memoriale
 */
export async function createMemorial(data, token) {
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

/**
 * Recupera memoriale pubblico tramite slug
 */
export async function getMemorialBySlug(slug) {
  const res = await fetch(`${API_URL}/memorials/${slug}`);

  if (res.status === 404) {
    throw new Error("Memoriale non trovato");
  }

  if (res.status === 403) {
    throw new Error("Memoriale privato");
  }

  if (!res.ok) {
    throw new Error("Errore caricamento memoriale");
  }

  return res.json();
}
/**
 * Recupera i memoriali dell'utente loggato
 */
export async function getMyMemorials() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch("/api/memorials/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Errore caricamento memoriali");
  }

  return res.json();
}
/**
 * Elimina un memoriale dell'utente
 */
export async function deleteMemorial(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch(`/api/memorials/${id}`, {
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
/**
 * Aggiorna un memoriale
 */
export async function updateMemorial(id, data) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utente non autenticato");
  }

  const res = await fetch(`/api/memorials/${id}`, {
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
