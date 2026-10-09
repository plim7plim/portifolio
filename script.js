import { initI18n, t } from "./i18n.js";

initI18n();

const button = document.getElementById("themeButton");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

try { document.body.classList.toggle("light", localStorage.getItem("portfolio-theme") === "light"); } catch {}
iconSun.setAttribute("aria-hidden", document.body.classList.contains("light"));
iconMoon.setAttribute("aria-hidden", !document.body.classList.contains("light"));

button.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    iconSun.setAttribute("aria-hidden", isLight);
    iconMoon.setAttribute("aria-hidden", !isLight);
    try { localStorage.setItem("portfolio-theme", isLight ? "light" : "dark"); } catch {}
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
}

menuToggle.addEventListener("click", () => {
    setMenuOpen(!menu.classList.contains("active"));
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.classList.contains("active")) {
        setMenuOpen(false);
        menuToggle.focus();
    }
});
document.addEventListener("click", event => {
    if (!event.target.closest("header")) setMenuOpen(false);
});

document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", () => {
        setMenuOpen(false);
    });
});

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".course-card");

filters.forEach(filter => {
    filter.setAttribute("aria-pressed", String(filter.classList.contains("active")));
    filter.addEventListener("click", () => {
        filters.forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        });
        filter.classList.add("active");
        filter.setAttribute("aria-pressed", "true");

        const category = filter.dataset.filter;

        cards.forEach(card => {
            if (category === "all" || card.dataset.category === category) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
        document.querySelector(".education-grid").hidden = category !== "all" && category !== "escolaridade";
    });
});

const carousel = document.querySelector(".carousel");

if (carousel) {
    const viewport = carousel.querySelector(".carousel-viewport");
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dot");
    let currentSlide = 0;

    // O card acompanha a altura do slide visível, sem deixar vão embaixo do menor
    function updateHeight() {
        viewport.style.height = `${slides[currentSlide].offsetHeight}px`;
    }

    new ResizeObserver(updateHeight).observe(track);
    slides.forEach(slide => new ResizeObserver(updateHeight).observe(slide));

    function goToSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateHeight();

        slides.forEach((slide, i) => {
            // inert tira o slide escondido do Tab e dos leitores de tela
            slide.inert = i !== currentSlide;
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
            dot.setAttribute("aria-current", i === currentSlide);
        });
    }

    carousel.querySelectorAll(".carousel-arrow").forEach(arrow => {
        arrow.addEventListener("click", () => {
            goToSlide(currentSlide + Number(arrow.dataset.dir));
        });
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => goToSlide(i));
    });

    carousel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
        if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
    });

    // Arrastar para o lado no celular
    let touchStartX = null;
    let touchStartY = null;

    track.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        if (touchStartX === null) return;

        const distance = e.changedTouches[0].clientX - touchStartX;
        const verticalDistance = e.changedTouches[0].clientY - touchStartY;
        touchStartX = null;
        touchStartY = null;

        if (Math.abs(distance) > 50 && Math.abs(distance) > Math.abs(verticalDistance)) {
            goToSlide(currentSlide + (distance < 0 ? 1 : -1));
        }
    });

    goToSlide(0);
}

// Os nomes das habilidades ficam no i18n.js (chart.labels), na mesma ordem dos valores
const skillsEvidence = [
    [
        "project-lpPulse",
        "project-lpTim",
        "project-portalUEG",
        "project-brillare2",
        "project-jogo.numero.secreto",
        "project-landingPageBlu",
        "project-appUEG",
        "project-ueg2",
        "project-aulasUEG",
        "project-botIA"
    ],
    [
        "project-grafnaLoki",
        "evidence-course-3",
        "evidence-course-4",
        "evidence-course-7",
        "evidence-course-13"
    ],
    [
        "project-metasDiarias"
    ],
    [
        "project-projeto_go_alura"
    ],
    [
        "evidence-course-9",
        "evidence-course-15",
        "evidence-course-19"
    ],
    [
        "project-grafnaLoki",
        "evidence-course-10",
        "evidence-course-11",
        "evidence-course-12"
    ],
    [
        "project-projeto_go_alura",
        "project-appUEG",
        "evidence-course-5"
    ],
    [
        "evidence-course-6",
        "evidence-course-12"
    ],
    [
        "evidence-course-14"
    ]
];
const skillsValues = skillsEvidence.map(items => items.length);

const skillsColors = [
    "#7B2CF3",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#06B6D4",
    "#A3E635",
    "#FB923C"
];

const skillsCanvas = document.getElementById("skillsChart");

if (skillsCanvas && typeof Chart !== "undefined") {
    const chartButtons = document.querySelectorAll(".chart-toggle .chart-btn");
    let currentChart = null;

    function getTextColor() {
        return getComputedStyle(document.body).getPropertyValue("--text").trim();
    }

    function getSurfaceColor() {
        return getComputedStyle(document.body).getPropertyValue("--surface").trim();
    }

    function renderChart(type) {
        if (currentChart) {
            currentChart.destroy();
        }

        const textColor = getTextColor();
        const wrapper = skillsCanvas.closest(".chart-wrapper");
        wrapper.dataset.chartType = type;
        const legend = document.getElementById("skillsLegend");
        legend.replaceChildren();
        legend.hidden = false;
        {
            t("chart.labels").forEach((label, index) => {
                const item = document.createElement("li");
                const dot = document.createElement("span");
                dot.className = "chart-legend-dot";
                dot.style.backgroundColor = skillsColors[index];
                dot.setAttribute("aria-hidden", "true");
                const name = document.createElement("span");
                name.textContent = label;
                const count = document.createElement("strong");
                count.textContent = skillsValues[index];
                item.append(dot, name, count);
                legend.append(item);
            });
        }

        const sources = document.getElementById("skillsSources");
        sources.replaceChildren();
        skillsEvidence.forEach((ids, index) => {
            const title = document.createElement("h4");
            title.textContent = t("chart.labels")[index];
            const list = document.createElement("ul");
            ids.forEach(id => {
                const card = document.getElementById(id);
                const item = document.createElement("li");
                const link = document.createElement("a");
                link.href = `#${id}`;
                link.textContent = card.querySelector("h3").textContent.trim();
                link.addEventListener("click", () => {
                    const disclosure = card.closest("details");
                    if (disclosure) disclosure.open = true;
                    if (card.classList.contains("course-card")) document.querySelector('[data-filter="all"]').click();
                });
                item.append(link);
                list.append(item);
            });
            sources.append(title, list);
        });

        currentChart = new Chart(skillsCanvas, {
            type,
            data: {
                labels: t("chart.labels"),
                datasets: [{
                    label: t("chart.datasetLabel"),
                    data: skillsValues,
                    backgroundColor: skillsColors,
                    borderColor: type === "bar" ? skillsColors : getSurfaceColor(),
                    borderWidth: type === "bar" ? 0 : 3,
                    borderRadius: type === "bar" ? 8 : 0,
                    hoverOffset: type === "bar" ? 0 : 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: type === "bar" ? {
                    x: {
                        beginAtZero: true,
                        ticks: { color: textColor, precision: 0 },
                        grid: { color: "rgba(123, 44, 243, .1)" }
                    },
                    y: {
                        ticks: {
                            color: textColor,
                            font: { size: 11 },
                            callback(value) {
                                const words = this.getLabelForValue(value).split(" ");
                                const lines = [""];
                                words.forEach(word => {
                                    const line = lines.length - 1;
                                    if ((lines[line] + " " + word).trim().length > 20 && lines[line]) lines.push(word);
                                    else lines[line] = (lines[line] + " " + word).trim();
                                });
                                return lines;
                            }
                        },
                        grid: { display: false }
                    }
                } : {},
                indexAxis: type === "bar" ? "y" : "x",
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        labels: { color: textColor }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.raw} ${t(ctx.raw === 1 ? "chart.evidence" : "chart.evidences")}`
                        }
                    }
                }
            }
        });
    }

    chartButtons.forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.chart === "pie")));
    renderChart("pie");

    chartButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            chartButtons.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");
            renderChart(btn.dataset.chart);
        });
    });

    button.addEventListener("click", () => {
        if (currentChart) {
            renderChart(currentChart.config.type);
        }
    });

    // Redesenha o gráfico com os rótulos no novo idioma
    document.addEventListener("i18n:change", () => {
        if (currentChart) {
            renderChart(currentChart.config.type);
        }
    });
}

// Load the existing Firebase integration independently from navigation and charts.
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
    ".filter-buttons",
    ".social-card",
    ".comment-form"
];

revealGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add("reveal");
        el.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
    });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Keep long descriptions available without making every project card oversized.
const descriptionControls = [];
document.querySelectorAll(".project-info > p").forEach((description, index) => {
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
        toggle.hidden = !expanded && description.scrollHeight <= description.clientHeight + 1;
        toggle.textContent = t(expanded ? "design.less" : "design.more");
    });
}
document.querySelectorAll(".projects-grid").forEach(grid => new ResizeObserver(refreshDescriptionControls).observe(grid));
document.querySelectorAll(".other-projects").forEach(details => details.addEventListener("toggle", refreshDescriptionControls));
document.addEventListener("i18n:change", refreshDescriptionControls);
document.fonts.ready.then(refreshDescriptionControls);

// Mark the section currently being read, while preserving native anchor navigation.
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll("#menu a").forEach(link => {
            if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    });
}, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
document.querySelectorAll("main > section[id]").forEach(section => navObserver.observe(section));
