import { initI18n, t } from "./i18n.js";

initI18n();

const button = document.getElementById("themeButton");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

try {
  document.body.classList.toggle(
    "light",
    localStorage.getItem("portfolio-theme") === "light",
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

const menuToggle = document.getElementById("menuToggle");
const menuIcon = menuToggle.querySelector("i");
const menu = document.getElementById("menu");

function setMenuOpen(isOpen) {
  menu.classList.toggle("active", isOpen);
  menuToggle.classList.toggle("active", isOpen);
  menuIcon.classList.toggle("fa-bars", !isOpen);
  menuIcon.classList.toggle("fa-xmark", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    t(isOpen ? "a11y.menuClose" : "a11y.menuOpen"),
  );
}

document.addEventListener("i18n:change", () =>
  setMenuOpen(menu.classList.contains("active")),
);
window.matchMedia("(min-width: 961px)").addEventListener("change", (event) => {
  if (event.matches) setMenuOpen(false);
});

menuToggle.addEventListener("click", () => {
  setMenuOpen(!menu.classList.contains("active"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("active")) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest("header")) setMenuOpen(false);
});

document.querySelectorAll("#menu a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenuOpen(false);
  });
});

// Load comments only when the visitor opens the guestbook.
const guestbook = document.querySelector(".guestbook-disclosure");
let guestbookLoaded = false;
guestbook.addEventListener("toggle", () => {
  if (!guestbook.open || guestbookLoaded) return;
  guestbookLoaded = true;
  import("./guestbook.js")
    .then(({ initGuestbook }) => initGuestbook(t))
    .catch(() => {
      guestbookLoaded = false;
      document.getElementById("commentStatus").textContent =
        t("form.loadError");
    });
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
];

revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, index) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
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
  { threshold: 0.15 },
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
