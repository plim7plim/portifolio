const galleries = {
  appUEG: ["mural-ueg.webp", "mural-cadastro.jpg"],
  "soumaisblu-cadastro": [
    "soumaisblu-cadastro-atual.jpg",
    "soumaisblu-formulario.jpg",
  ],
  lpTim: ["tim.webp", "tim-detalhes.jpg"],
  portalUEG: ["portal-ueg.webp", "portal-detalhes.jpg"],
  brillare2: ["brillare.webp", "brillare-aneis.jpg"],
};

export function initProjectGalleries(t) {
  Object.entries(galleries).forEach(([project, files]) => {
    const card = document.getElementById(`project-${project}`);
    const preview = card?.querySelector(".project-preview");
    const screen = preview?.querySelector(".project-screen");
    const firstImage = screen?.querySelector("img");
    if (!firstImage || files.length < 2) return;

    const name = card.querySelector("h3").textContent.trim();
    const gallery = document.createElement("div");
    gallery.className = "project-gallery";
    gallery.setAttribute("role", "group");
    preview.before(gallery);
    gallery.append(preview);
    screen.id = `${card.id}-images`;

    const images = files.map((file, index) => {
      const image = index === 0 ? firstImage : firstImage.cloneNode();
      image.removeAttribute("data-i18n-alt");
      image.src = `assets/projects/${file}`;
      image.hidden = index !== 0;
      // The frame keeps a fixed aspect ratio even while a new image loads.
      image.removeAttribute("width");
      image.removeAttribute("height");
      if (index !== 0) screen.append(image);
      return image;
    });

    const controls = document.createElement("div");
    controls.className = "gallery-controls";
    const previous = document.createElement("button");
    const next = document.createElement("button");
    [previous, next].forEach((button) => {
      button.type = "button";
      button.className = "gallery-arrow";
      button.setAttribute("aria-controls", screen.id);
    });
    previous.textContent = "←";
    next.textContent = "→";

    const dots = document.createElement("div");
    dots.className = "gallery-dots";
    const selectors = images.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot";
      dot.setAttribute("aria-controls", screen.id);
      dot.addEventListener("click", () => show(index));
      dots.append(dot);
      return dot;
    });
    const status = document.createElement("p");
    status.className = "gallery-status";
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    controls.append(previous, dots, next);
    gallery.append(controls, status);

    let current = 0;
    let displayed = 0;
    let transitionId = 0;
    let animations = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    async function show(index) {
      const direction = index < current ? -1 : 1;
      current = (index + images.length) % images.length;
      const requestId = ++transitionId;
      const incoming = images[current];
      incoming.loading = "eager";
      // Keep the previous capture visible until the next one is ready.
      try {
        await incoming.decode();
      } catch {
        return;
      }
      if (requestId !== transitionId) return;

      animations.forEach((animation) => animation.cancel());
      animations = [];
      const outgoing = images[displayed];
      const shouldAnimate = displayed !== current && !reducedMotion.matches;
      images.forEach((image, i) => {
        image.hidden = i !== current;
        image.setAttribute("aria-hidden", String(i !== current));
        image.alt = `${name}: ${t(`gallery.${project}.${i}`)}`;
        selectors[i].setAttribute(
          "aria-label",
          `${t("gallery.show")} ${i + 1}: ${t(`gallery.${project}.${i}`)}`,
        );
        selectors[i].setAttribute("aria-current", String(i === current));
      });
      status.textContent = `${current + 1} / ${images.length} · ${t(`gallery.${project}.${current}`)}`;
      gallery.setAttribute("aria-label", `${t("gallery.title")}: ${name}`);
      gallery.setAttribute("aria-roledescription", t("gallery.role"));
      previous.setAttribute("aria-label", `${t("gallery.previous")}: ${name}`);
      next.setAttribute("aria-label", `${t("gallery.next")}: ${name}`);

      displayed = current;
      if (!shouldAnimate) return;

      outgoing.hidden = false;
      const options = {
        duration: 380,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      };
      animations = [
        outgoing.animate(
          [
            { opacity: 1, transform: "translateX(0)" },
            { opacity: 0, transform: `translateX(${-direction * 24}px)` },
          ],
          options,
        ),
        incoming.animate(
          [
            { opacity: 0, transform: `translateX(${direction * 24}px)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          options,
        ),
      ];
      Promise.all(animations.map((animation) => animation.finished))
        .then(() => {
          if (requestId !== transitionId) return;
          outgoing.hidden = true;
          animations.forEach((animation) => animation.cancel());
          animations = [];
        })
        .catch(() => {}); // A newer interaction can interrupt the transition.
    }

    previous.addEventListener("click", () => show(current - 1));
    next.addEventListener("click", () => show(current + 1));
    gallery.addEventListener("keydown", (event) => {
      const destinations = {
        ArrowLeft: current - 1,
        ArrowRight: current + 1,
        Home: 0,
        End: images.length - 1,
      };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      show(destinations[event.key]);
    });

    let touchStart;
    screen.addEventListener(
      "touchstart",
      (event) => {
        touchStart = event.touches.length === 1 ? event.touches[0] : undefined;
      },
      { passive: true },
    );
    screen.addEventListener(
      "touchend",
      (event) => {
        if (!touchStart || event.changedTouches.length !== 1) return;
        const dx = event.changedTouches[0].clientX - touchStart.clientX;
        const dy = event.changedTouches[0].clientY - touchStart.clientY;
        touchStart = undefined;
        if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;
        event.preventDefault();
        show(current + (dx < 0 ? 1 : -1));
      },
      { passive: false },
    );
    screen.addEventListener("touchcancel", () => {
      touchStart = undefined;
    });

    document.addEventListener("i18n:change", () => show(current));
    reducedMotion.addEventListener("change", () => show(current));
    show(0);
  });
}
