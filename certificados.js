const filters = document.getElementById("catalog-filters");
const results = document.getElementById("catalog-results");
const status = document.getElementById("catalog-status");
const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
const formatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });
const order = ["Certificação profissional", "Bootcamp", "Formação", "Projeto", "Módulo", "Curso", "Mentoria", "Comprovante"];
const normalize = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

function createCard(certificate) {
  const card = document.createElement("li");
  card.className = "course-card catalog-card";

  const title = document.createElement("h2");
  title.textContent = certificate.title;
  const category = document.createElement("span");
  category.textContent = [certificate.issuer, certificate.kind, certificate.theme].join(" · ");
  const metadata = document.createElement("span");
  const date = certificate.date ? formatter.format(new Date(certificate.date)) : "Data indisponível";
  metadata.textContent = certificate.hours ? date + " · " + certificate.hours + " h" : date;
  const proof = document.createElement(certificate.url ? "a" : "span");
  proof.textContent = certificate.url ? "Ver comprovante" : "Comprovante não publicado";
  if (certificate.url) {
    proof.className = "certificate-btn catalog-proof";
    proof.href = certificate.url;
    const icon = document.createElement("span");
    icon.textContent = "↗";
    icon.setAttribute("aria-hidden", "true");
    proof.append(icon);
    proof.target = "_blank";
    proof.rel = "noopener noreferrer";
    proof.setAttribute("aria-label", "Ver comprovante de " + certificate.title);
  }
  if (certificate.preview) {
    const preview = document.createElement("img");
    preview.className = "catalog-preview";
    preview.src = certificate.preview;
    preview.alt = "Prévia do comprovante de " + certificate.title;
    preview.loading = "lazy";
    preview.decoding = "async";
    card.append(preview);
  }
  card.append(title, category, metadata, proof);
  return card;
}

try {
  const response = await fetch("certificados-data.json");
  if (!response.ok) throw new Error("Catálogo indisponível");
  const certificates = await response.json();
  const fields = ["issuer", "theme", "kind"];
  for (const field of fields) {
    const options = [...new Set(certificates.map((item) => item[field]))];
    for (const value of options.sort(collator.compare)) {
      filters.elements[field].add(new Option(value, value));
    }
  }

  const byTitle = (a, b) => collator.compare(a.title, b.title);
  const compare = {
    title: byTitle,
    date: (a, b) => b.date.localeCompare(a.date) || byTitle(a, b),
    hours: (a, b) => (b.hours ?? -1) - (a.hours ?? -1) || byTitle(a, b),
    weight: (a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || compare.date(a, b),
  };

  function render() {
    const values = new FormData(filters);
    const query = normalize(values.get("query").trim());
    const matching = certificates.filter((item) =>
      fields.every((field) => !values.get(field) || values.get(field) === item[field]) &&
      normalize([item.title, item.issuer, item.theme, item.kind].join(" ")).includes(query)
    );
    matching.sort(compare[values.get("sort")]);
    results.replaceChildren(...matching.map(createCard));
    status.textContent = matching.length
      ? matching.length + " de " + certificates.length + " credenciais"
      : "Nenhum certificado encontrado.";
  }

  filters.addEventListener("input", render);
  filters.addEventListener("reset", () => requestAnimationFrame(render));
  filters.addEventListener("submit", (event) => event.preventDefault());
  filters.hidden = false;
  render();
} catch {
  status.textContent = "Não foi possível carregar o catálogo.";
}
