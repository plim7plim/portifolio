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

const skillsData = {
    labels: [
        "JavaScript",
        "HTML & CSS",
        "Java & Spring Boot",
        "AWS & Cloud",
        "DevOps (Docker, K8s, Linux, CI/CD)",
        "Banco de Dados",
        "Inglês"
    ],
    values: [85, 85, 65, 70, 60, 55, 80]
};

const skillsColors = [
    "#7B2CF3",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#06B6D4"
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

        currentChart = new Chart(skillsCanvas, {
            type,
            data: {
                labels: skillsData.labels,
                datasets: [{
                    label: "Nível de conhecimento",
                    data: skillsData.values,
                    backgroundColor: skillsColors,
                    borderColor: type === "bar" ? skillsColors : getSurfaceColor(),
                    borderWidth: type === "bar" ? 0 : 3,
                    borderRadius: type === "bar" ? 8 : 0,
                    hoverOffset: type === "bar" ? 0 : 12
                }]
            },
            options: {
                responsive: true,
                scales: type === "bar" ? {
                    x: {
                        max: 100,
                        ticks: { color: textColor },
                        grid: { color: "rgba(123, 44, 243, .1)" }
                    },
                    y: {
                        ticks: { color: textColor },
                        grid: { display: false }
                    }
                } : {},
                indexAxis: type === "bar" ? "y" : "x",
                plugins: {
                    legend: {
                        display: type !== "bar",
                        position: "bottom",
                        labels: { color: textColor }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.raw}%`
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
}

const btn = document.getElementById("enviar");

btn.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (nome === "" || mensagem === "") {
        alert("Preencha todos os campos.");
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

        container.innerHTML += `
            <div class="comentario">
                <h3>${comentario.nome}</h3>
                <p>${comentario.mensagem}</p>
            </div>
        `;
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
    ".chart-toggle",
    ".chart-wrapper",
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
