import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDSfhfv6ZKtkDTJi-bIaFInPQD4tojvKl0",
  authDomain: "portifolioplinio.firebaseapp.com",
  projectId: "portifolioplinio",
  storageBucket: "portifolioplinio.firebasestorage.app",
  messagingSenderId: "971642836528",
  appId: "1:971642836528:web:c4c1f6b2dafb2573ddfff5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function initGuestbook(t) {
  const send = document.getElementById("enviar");
  const status = document.getElementById("commentStatus");
  const container = document.getElementById("comentarios");
  const more = document.getElementById("loadMoreComments");
  const pageSize = 6;
  let cursor = null;
  let loading = false;
  let statusKey = "";
  function setStatus(key) {
    statusKey = key;
    status.textContent = key ? t(key) : "";
  }
  document.addEventListener("i18n:change", () => setStatus(statusKey));

  async function loadComments(reset = true) {
    if (loading) return;
    loading = true;
    more.disabled = true;
    try {
      const constraints = [orderBy("data", "desc")];
      if (!reset && cursor) constraints.push(startAfter(cursor));
      constraints.push(limit(pageSize));
      const snapshot = await getDocs(
        query(collection(db, "comentarios"), ...constraints),
      );
      const fragment = document.createDocumentFragment();
      snapshot.forEach((doc) => {
        const comment = doc.data();
        const card = document.createElement("div");
        card.className = "comentario";
        const name = document.createElement("h3");
        const message = document.createElement("p");
        name.textContent = comment.nome;
        message.textContent = comment.mensagem;
        card.append(name, message);
        fragment.append(card);
      });
      if (reset) container.replaceChildren(fragment);
      else container.append(fragment);
      cursor = snapshot.docs.at(-1) || cursor;
      more.hidden = snapshot.size < pageSize;
    } finally {
      loading = false;
      more.disabled = false;
    }
  }

  more.addEventListener("click", async () => {
    setStatus("form.loading");
    try {
      await loadComments(false);
      setStatus("");
    } catch {
      setStatus("form.loadError");
    }
  });

  send.addEventListener("click", async () => {
    const name = document.getElementById("nome");
    const message = document.getElementById("mensagem");
    if (!name.value.trim() || !message.value.trim()) {
      setStatus("form.fillAll");
      (!name.value.trim() ? name : message).focus();
      return;
    }
    if (name.value.trim().length > 80 || message.value.trim().length > 1200) {
      setStatus("form.tooLong");
      return;
    }
    send.disabled = true;
    setStatus("form.sending");
    try {
      await addDoc(collection(db, "comentarios"), {
        nome: name.value.trim(),
        mensagem: message.value.trim(),
        data: serverTimestamp(),
      });
      name.value = "";
      message.value = "";
      setStatus("form.sent");
      await loadComments().catch(() => {});
    } catch {
      setStatus("form.sendError");
    } finally {
      send.disabled = false;
    }
  });
  setStatus("form.loading");
  loadComments()
    .then(() => setStatus(""))
    .catch(() => setStatus("form.loadError"));
}
