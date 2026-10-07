import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { initI18n, t } from "./i18n.js";

initI18n();

const firebaseConfig = {
    apiKey: "AIzaSyDSfhfv6ZKtkDTJi-bIaFInPQD4tojvKl0",
    authDomain: "portifolioplinio.firebaseapp.com",
    projectId: "portifolioplinio",
    storageBucket: "portifolioplinio.firebasestorage.app",
    messagingSenderId: "971642836528",
    appId: "1:971642836528:web:c4c1f6b2dafb2573ddfff5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const button = document.getElementById("themeButton");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

button.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    iconSun.setAttribute("aria-hidden", isLight);
    iconMoon.setAttribute("aria-hidden", !isLight);
});

const menuToggle = document.getElementById("menuToggle");
const menuIcon = menuToggle.querySelector("i");
const menu = document.getElementById("menu");

function setMenuOpen(isOpen) {
    menu.classList.toggle("active", isOpen);
    menuToggle.classList.toggle("active", isOpen);
    menuIcon.classList.toggle("fa-bars", !isOpen);
    menuIcon.classList.toggle("fa-xmark", isOpen);
}

menuToggle.addEventListener("click", () => {
    setMenuOpen(!menu.classList.contains("active"));
});

document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", () => {
        setMenuOpen(false);
    });
});

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".course-card");

filters.forEach(filter => {
    filter.addEventListener("click", () => {
        filters.forEach(btn => btn.classList.remove("active"));
        filter.classList.add("active");

        const category = filter.dataset.filter;

        cards.forEach(card => {
            if (category === "all" || card.dataset.category === category) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
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

    track.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        if (touchStartX === null) return;

        const distance = e.changedTouches[0].clientX - touchStartX;
        touchStartX = null;

        if (Math.abs(distance) > 50) {
            goToSlide(currentSlide + (distance < 0 ? 1 : -1));
        }
    });

    goToSlide(0);
}

// Os nomes das habilidades ficam no i18n.js (chart.labels), na mesma ordem dos valores
const skillsValues = [8, 8, 1, 1, 3, 5, 5, 3, 1];

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

if (skillsCanvas) {
    const chartButtons = document.querySelectorAll(".chart-toggle .chart-btn");
    let currentChart = null;

    function getTextColor() {
        return document.body.classList.contains("light") ? "#1B1B1B" : "#ffffff";
    }

    function getSurfaceColor() {
        return document.body.classList.contains("light") ? "#ffffff" : "#161616";
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
        legend.hidden = type === "bar";
        if (type !== "bar") {
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

    renderChart("pie");

    chartButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            chartButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
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

const btn = document.getElementById("enviar");

btn.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (nome === "" || mensagem === "") {
        alert(t("form.fillAll"));
        return;
    }

    await addDoc(collection(db, "comentarios"), {
        nome,
        mensagem,
        data: serverTimestamp()
    });

    document.getElementById("nome").value = "";
    document.getElementById("mensagem").value = "";

    carregarComentarios();
});

async function carregarComentarios() {
    const container = document.getElementById("comentarios");
    container.innerHTML = "";

    const q = query(
        collection(db, "comentarios"),
        orderBy("data", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const comentario = doc.data();

        // textContent evita que HTML/scripts enviados no comentário sejam executados
        const div = document.createElement("div");
        div.className = "comentario";

        const nome = document.createElement("h3");
        nome.textContent = comentario.nome;

        const mensagem = document.createElement("p");
        mensagem.textContent = comentario.mensagem;

        div.append(nome, mensagem);
        container.appendChild(div);
    });

    container.querySelectorAll(".comentario").forEach((el, index) => {
        el.classList.add("reveal");
        el.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
        requestAnimationFrame(() => el.classList.add("visible"));
    });
}

carregarComentarios();

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
