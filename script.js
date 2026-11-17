import { initPreviewMotion } from "./preview-motion.js";
import { initProjectGalleries } from "./project-gallery.js";
import { initI18n, t } from "./i18n.js";

initI18n();
initProjectGalleries(t);
initPreviewMotion();

const certificateSearch = document.getElementById("cyber-search");
const certificateResults = document.getElementById("cyber-results");
const certificateEmpty = document.getElementById("cyber-empty");
const certificateGroups = document.querySelectorAll("#course-dio-cybersecurity .cyber-group");
const certificateItems = [...document.querySelectorAll(".cyber-group .cyber-certificates > li")];
const normalizeCertificateText = (text) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

certificateSearch.parentElement.hidden = false;
certificateSearch.addEventListener("input", () => {
  const query = normalizeCertificateText(certificateSearch.value.trim());
  const matches = query
    ? certificateItems.filter((item) => normalizeCertificateText(item.textContent).includes(query))
    : [];

  certificateGroups.forEach((group) => { group.hidden = Boolean(query); });
  certificateResults.replaceChildren(...matches.map((item) => item.cloneNode(true)));
  certificateResults.hidden = matches.length === 0;
  certificateEmpty.hidden = !query || matches.length > 0;
});

const button = document.getElementById("themeButton");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

try {
  document.body.classList.toggle(
    "light",
    localStorage.getItem("portfolio-theme") !== "dark",
  );
} catch {}
iconSun.setAttribute("aria-hidden", document.body.classList.contains("light"));
iconMoon.setAttribute(
  "aria-hidden",
  !document.body.classList.contains("light"),
);

button.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  iconSun.setAttribute("aria-hidden", isLight);
  iconMoon.setAttribute("aria-hidden", !isLight);
  try {
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  } catch {}
});

// Keep anchor targets below the visible header, including wrapped translations.
const header = document.querySelector("header");
new ResizeObserver(() => {
  document.documentElement.style.setProperty(
    "--header-height",
    header.getBoundingClientRect().height + "px",
  );
}).observe(header);

// The visitor wall is always visible and loads with the page.
import("./guestbook.js")
  .then(({ initGuestbook }) => initGuestbook(t))
  .catch(() => {
    document.getElementById("commentStatus").textContent = t("form.loadError");
  });

const revealGroups = [
  ".about-text",
  ".about-card",
  "section > h2",
  ".timeline-item",
  ".project-card",
  ".course-card",
  ".social-card",
  ".comment-form",
  ".skills-list li",
  ".project-route",
  ".bootcamp-section > h3",
];

revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, index) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(index % 3) * 0.06}s`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: "0px 0px -32px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// Keep long descriptions available without making every project card oversized.
const descriptionControls = [];
document
  .querySelectorAll(".other-projects .project-info > p")
  .forEach((description, index) => {
    description.classList.add("is-collapsible");
    description.id = `project-description-${index}`;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "description-toggle";
    toggle.setAttribute("aria-controls", description.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", () => {
      const expanded = description.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = t(expanded ? "design.less" : "design.more");
    });
    description.after(toggle);
    descriptionControls.push({ description, toggle });
  });
function refreshDescriptionControls() {
  descriptionControls.forEach(({ description, toggle }) => {
    const expanded = description.classList.contains("is-expanded");
    toggle.hidden =
      !expanded && description.scrollHeight <= description.clientHeight + 1;
    toggle.textContent = t(expanded ? "design.less" : "design.more");
  });
}
document
  .querySelectorAll(".projects-grid")
  .forEach((grid) =>
    new ResizeObserver(refreshDescriptionControls).observe(grid),
  );
document
  .querySelectorAll(".other-projects")
  .forEach((details) =>
    details.addEventListener("toggle", refreshDescriptionControls),
  );
document.addEventListener("i18n:change", refreshDescriptionControls);
document.fonts.ready.then(refreshDescriptionControls);

// Mark the section currently being read, while preserving native anchor navigation.
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll("#menu a").forEach((link) => {
        if (link.hash === `#${entry.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-10% 0px -65% 0px", threshold: 0 },
);
document
  .querySelectorAll("main > section[id]")
  .forEach((section) => navObserver.observe(section));

// Reveal a project before native anchor navigation scrolls to it.
document.querySelectorAll('.project-route a').forEach((link) => {
  link.addEventListener('click', () => {
    const project = document.getElementById(link.hash.slice(1));
    const disclosure = project?.closest('details');
    if (disclosure) disclosure.open = true;
  });
});
const portrait = document.querySelector('.hero-image');
const oikawaParty = document.querySelector('.oikawa-party');
let oikawaRevealed = false;

function updatePortraitLabel() {
  portrait.setAttribute('aria-label', t(oikawaRevealed ? 'oikawa.more' : 'oikawa.show'));
}
portrait.addEventListener('click', () => {
  if (oikawaRevealed) {
    closeOikawaPhotos();
    return;
  }
  oikawaRevealed = true;
  portrait.classList.add('oikawa-revealed');
  portrait.setAttribute('aria-pressed', 'true');
  updatePortraitLabel();
  document.body.classList.add('oikawa-scattered');
  if (!document.querySelector('.oikawa-scatter')) {
    // Cycle through distinct scenes before reusing one. Images 2 and 6 depict the same panel.
    const available = [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24];
    const photoOrder = [];
    let previousPhoto;
    function nextPhoto() {
      if (!photoOrder.length) {
        const shuffled = available.map((id) => ({ id, order: Math.random() }))
          .sort((a, b) => a.order - b.order).map(({ id }) => id);
        if (shuffled[0] === previousPhoto) shuffled.push(shuffled.shift());
        photoOrder.push(...shuffled);
      }
      const photo = photoOrder.shift();
      previousPhoto = photo;
      return photo;
    }
    document.querySelectorAll('main > section').forEach((section) => {
      const scatter = document.createElement('div');
      scatter.className = 'oikawa-scatter';
      scatter.setAttribute('aria-hidden', 'true');
      const pictures = Array.from({ length: 3 }, (_, index) => {
        const image = document.createElement('img');
        const photo = nextPhoto();
        image.src = 'assets/oikawa/' + photo + '.webp';
        image.dataset.format = photo >= 10 && photo <= 22 ? 'manga' : 'portrait';
        image.alt = '';
        image.decoding = 'async';
        image.loading = 'lazy';
        image.style.setProperty('--photo-angle', (Math.random() * 26 - 13).toFixed(1) + 'deg');
        image.dataset.side = index % 2 ? 'right' : 'left';
        image.style.setProperty('--photo-edge', Math.round(4 + Math.random() * 12) + 'px');
        image.style.setProperty('--photo-top', (12 + index * 29 + Math.random() * 12).toFixed(1) + '%');
        image.style.setProperty('--photo-delay', index * 45 + 'ms');
        image.style.setProperty('--photo-size', Math.round((photo >= 10 && photo <= 22 ? 210 : 120) + Math.random() * 35) + 'px');
        image.dataset.shape = ['soft', 'portrait', 'arch'][Math.floor(Math.random() * 3)];
        scatter.append(image);
      });
      section.append(scatter);
    });
  }
  oikawaParty.hidden = false;
});
function closeOikawaPhotos() {
  document.body.classList.remove("oikawa-scattered");
  oikawaParty.hidden = true;
  document.querySelectorAll('.oikawa-scatter').forEach((scatter) => scatter.remove());
  oikawaRevealed = false;
  portrait.classList.remove('oikawa-revealed');
  portrait.setAttribute('aria-pressed', 'false');
  updatePortraitLabel();
  portrait.focus({ preventScroll: true });
}
oikawaParty.querySelector('.oikawa-close').addEventListener('click', closeOikawaPhotos);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !oikawaParty.hidden) closeOikawaPhotos();
});
document.addEventListener('i18n:change', updatePortraitLabel);
