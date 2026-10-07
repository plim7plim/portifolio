/* =========================================================
   Troca de idioma (Português / Français)
   - Os textos em português são lidos do próprio HTML (data-i18n)
   - Os textos em francês ficam no objeto "fr" abaixo
   - A escolha fica salva no navegador (localStorage)
   - Ao trocar, dispara o evento "i18n:change" no document
   ========================================================= */

const STORAGE_KEY = "idioma";

const textos = {
    // Textos em português que não estão no HTML (usados pelo script.js)
    pt: {
        "page.title": "Plínio Peixoto | Full Stack Developer",
        "chart.labels": ["JavaScript / HTML & CSS", "Java & Spring Boot", "TypeScript & React", "Go & APIs", "AWS & Cloud", "DevOps & Observabilidade", "SQL / NoSQL", "Git & GitHub", "Inglês"],
        "chart.datasetLabel": "Projetos e certificados selecionados",
        "chart.evidence": "evidência",
        "chart.evidences": "evidências",
        "chart.legend": "Áreas e contagens",
        "chart.sources": "Ver projetos e certificados por área <i class='fa-solid fa-arrow-right' aria-hidden='true'></i>",
        "form.fillAll": "Preencha todos os campos."
    },

    fr: {
        "chart.legend": "Domaines et chiffres",
        "chart.sources": "Voir les projets et certificats par domaine <i class='fa-solid fa-arrow-right' aria-hidden='true'></i>",
        "nav.skills": "Compétences",
        "education.status": "En cours",
        "education.software.desc": "Formation axée sur la création de logiciels, de l'analyse des besoins à l'architecture, la qualité et la maintenance des applications. Une base pour développer des solutions structurées et durables.",
        "education.internet.desc": "Formation centrée sur le développement d'applications web, associant programmation, interfaces et données. Les projets universitaires permettent de mettre les concepts en pratique.",
        "education.internet.institution": "Université de l’État de Goiás · UEG",
        "education.software.period": "6e semestre",
        "education.internet.period": "2e semestre",
        "chart.a11y": "Projets et certificats par domaine ; consultez les sources dans la section Compétences.",
        "update.0": "Compétences",
        "update.1": "Projets et certificats sélectionnés illustrant mon expérience dans chaque domaine",
        "update.2": "Sélection d’applications et de projets d’étude. Dépôts GitHub consultés le 07/10/2026.",
        "update.3": "Consulter les sources et les chiffres du graphique",
        "update.4": "Le graphique compte les références sélectionnées ci-dessous et ne mesure pas le niveau de maîtrise. Un projet peut figurer dans plusieurs domaines ; les cours et les modules peuvent partager du contenu.",
        "update.5": "Exercices de programmation UEG",
        "update.6": "API de gestion d’étudiants en Go",
        "update.7": "Observabilité avec Java",
        "update.8": "Page de présentation d’une entreprise de campagnes WhatsApp, avec contact direct et animation de fond sur canvas.",
        "update.9": "Page de présentation d’offres Internet, avec onglets pour particuliers et entreprises, détails des offres dans des fenêtres modales et parcours de souscription.",
        "update.10": "Exercices universitaires : calculatrice, calcul de l’IMC et modélisation de patients et d’employés avec des classes et des diagrammes UML.",
        "update.11": "Projet d’étude Alura : API en Go avec Gin, persistance via GORM et PostgreSQL, tests et workflow GitHub Actions.",
        "update.12": "Projet d’étude d’une API de cours avec Spring Boot, logs structurés pour Loki et métriques avec Actuator et Prometheus.",
        "update.13": "Programmation orientée objet",
        "update.14": "Certificats DIO",
        "update.15": "31 certificats de cours, modules, projets et mentorat suivis en 2024 et 2025, regroupés dans un seul PDF.",
        "update.16": "DIO • 31 certificats",
        "update.19": "Java : bases et langage",
        "update.20": "Syntaxe, conditions et boucles, environnement de développement et gestion des exceptions.",
        "update.21": "Java : programmation orientée objet et UML",
        "update.22": "Abstraction, principes de la programmation orientée objet, Collections, Stream API et modélisation d’un iPhone avec UML.",
        "update.23": "Bases de données : SQL et NoSQL",
        "update.24": "Introduction aux bases relationnelles et non relationnelles et module Premiers pas en SQL et NoSQL.",
        "update.25": "Git, GitHub et développement logiciel",
        "update.26": "Gestion de versions, contribution à un projet open source et principes du développement logiciel.",
        "update.27": "Logique et défis de programmation",
        "update.28": "Défis de code, simulation d’un compte bancaire, validation d’un processus de recrutement et abstraction du domaine bancaire.",
        "update.29": "Carrière et organisation des études",
        "update.30": "Parcours d’étude avec Notion, création de portfolio, intégration et introduction aux bootcamps DIO.",
        "update.repository": "Voir le dépôt",
        "chart.evidence": "référence",
        "chart.evidences": "références",
        "page.title": "Plínio Peixoto | Développeur Full Stack",
        "chart.labels": ["JavaScript / HTML & CSS", "Java & Spring Boot", "TypeScript & React", "Go & API", "AWS & Cloud", "DevOps & Observabilité", "SQL / NoSQL", "Git & GitHub", "Anglais"],
        "chart.datasetLabel": "Projets et certificats sélectionnés",
        "form.fillAll": "Veuillez remplir tous les champs.",

        "a11y.menu": "Ouvrir le menu",
        "a11y.language": "Choisir la langue",
        "a11y.theme": "Changer de thème",
        "carousel.prev": "Précédent",
        "carousel.next": "Suivant",

        "nav.home": "Accueil",
        "nav.about": "À propos",
        "nav.experience": "Expérience",
        "nav.projects": "Projets",
        "nav.courses": "Formations",
        "nav.socials": "Réseaux",
        "nav.guestbook": "Commentaires",

        "hero.greeting": "Bonjour !",
        "hero.role": "Développeur Full Stack Jr.",
        "hero.tagline": "Une simple idée peut devenir quelque chose d'incroyable.",
        "hero.ctaProjects": "Voir mes projets",
        "hero.ctaCv": "Voir mon CV ici :",
        "hero.photoAlt": "Photo",

        "about.title": "À propos de moi",
        "about.p1": "Bonjour ! Je m'appelle <strong>Plínio Peixoto dos Santos</strong>, j'ai 20 ans et je suis passionné de technologie. J'étudie la programmation depuis l'âge de 17 ans et, depuis, je me consacre chaque jour au développement de logiciels.",
        "about.p2": "J'étudie actuellement le <strong>Génie logiciel</strong> et les <strong>Systèmes pour Internet</strong>, et je travaille comme <strong>Développeur Full Stack Jr.</strong>",
        "about.p3": "N'hésitez pas à explorer ce projet !",

        "summary.title": "Résumé",
        "summary.status": "Ouvert aux propositions",
        "summary.roleLabel": "Poste",
        "summary.roleValue": "Développeur Full Stack Jr.",
        "summary.eduLabel": "Formation",
        "summary.edu1": "Génie logiciel",
        "summary.edu2": "Systèmes pour Internet",
        "summary.locLabel": "Localisation",
        "summary.locValue": "Goiás, Brésil",
        "summary.focusLabel": "Spécialités",
        "summary.tagCloud": "Cloud Computing",

        "experience.title": "Mon parcours",
        "exp1.title": "Jeune apprenti",
        "exp1.desc": "Premier contact avec le monde du travail, en développant l'organisation, l'accueil du public et les tâches administratives.",
        "exp2.role": "Assistant administratif | Facturation",
        "exp2.desc": "Émission de factures, SAP, contrôle des chargements et processus logistiques, administratifs et de facturation.",
        "exp3.period": "2026 - Aujourd'hui",
        "exp3.desc": "Refactorisation et documentation de code, création de sites web pour l'entreprise et modifications d'écrans spécifiques.",

        "projects.title": "Projets",
        "tech.htmlCssJs": "HTML, CSS et JavaScript",
        "tech.githubPages": "Hébergement sur GitHub Pages",
        "tech.vercel": "Hébergement sur Vercel",

        "p1.desc": "Projet développé lors du programme d'extension en Algorithmique et Logique de Programmation, dans le but de créer un portail présentant tous les projets d'extension du campus, afin d'acquérir des connaissances en développement web.",

        "p2.title": "Cours de l'UEG",
        "p2.desc": "Dépôt contenant les travaux pratiques de programmation de l'université.",
        "p2.tech2": "Variables, fonctions, opérateurs, tableaux",
        "p2.tech3": "Logique de programmation, pensée computationnelle.",

        "p3.desc": "Projet développé pour mettre mes connaissances en pratique, en créant un catalogue en ligne pour une connaissance qui vend des bijoux et de la bijouterie fantaisie. Pendant le développement, j'ai appris des concepts comme la manipulation de tableaux (Arrays) et les événements en JavaScript, et j'ai hébergé l'application sur la plateforme Vercel.",
        "p3.tech2": "Arrays et événements (OnClick)",

        "p4.desc": "Projet développé lors du programme d'extension en Algorithmique et Logique de Programmation. L'application permet à l'utilisateur d'envoyer un fichier PDF et de poser des questions sur son contenu. Les réponses sont générées par un modèle d'IA via une API REST, en tenant compte uniquement des informations présentes dans le document envoyé.",
        "p4.tech2": "API REST et JSON",
        "p4.tech3": "Intégration avec l'IA",

        "p5.title": "Jeu du Nombre Secret",
        "p5.desc": "Le Jeu du Nombre Secret est un projet réalisé pendant le cours de JavaScript d'Alura : le système génère un nombre aléatoire et le joueur essaie de le deviner. À chaque tentative, le jeu indique si le nombre est plus grand ou plus petit, jusqu'à trouver la bonne réponse. Il utilise des fonctions, des listes, des comparaisons et des événements, et propose un système de narration pour l'accessibilité des personnes en situation de handicap.",
        "p5.tech2": "Événements",

        "p6.desc": "Projet développé pour Blu Promotora, comprenant la refactorisation et la documentation du code, la création de pages pour l'entreprise et des ajustements sur des écrans spécifiques.",
        "p6.tech2": "Refactorisation et documentation",

        "p7.desc": "Tableau d'annonces pour les classes du campus d'Itaberaí de l'UEG. Les professeurs créent des classes et publient des annonces, tandis que les étudiants suivent tout au même endroit, avec une intégration aux communautés Discord et WhatsApp.",

        "p8.title": "Objectifs",
        "p8.desc": "Site simple de suivi d'objectifs quotidiens, pour aider à rester régulier au jour le jour. Projet « vibe codé », développé avec l'aide de l'IA.",
        "p8.tech2": "Développé avec l'IA",
        "p8.tech3": "Suivi d'objectifs quotidiens",

        "courses.title": "Cours et formation",
        "filter.all": "Tous",
        "filter.school": "Études",
        "filter.certificates": "Certifications",
        "filter.courses": "Cours",
        "course.cta": "Voir ici",

        "c1.title": "Génie logiciel",
        "c1.desc": "UniCesumar - 6e semestre",
        "c1.tag": "Licence",

        "c2.title": "Systèmes pour Internet",
        "c2.desc": "Université d'État de Goiás - UEG | 2e semestre",
        "c2.tag": "Diplôme technologique",

        "c3.desc": "Certification AWS axée sur les fondamentaux du cloud computing",
        "c4.desc": "Certification financière délivrée par l'ANBIMA",

        "c5.title": "Fondamentaux du Cloud Computing",
        "c5.desc": "Connaissances en cloud, abordant les concepts et les fondamentaux du cloud computing.",
        "c5.tag": "FIAP • 80 heures",

        "c6.title": "Immersion Digitale - Parcours d'approfondissement : DevOps",
        "c6.desc": "Pratiques DevOps incluant Linux, l'automatisation, Git, CI/CD, Docker, Kubernetes, la supervision et l'infrastructure cloud.",
        "c6.tag": "Alura • 126 heures",

        "c7.desc": "DevOps, Linux, réseaux informatiques, SLF4J, Docker, Kubernetes et API REST.",
        "c7.tag": "Alura • 69 heures",

        "c8.title": "Certifications Alura",
        "c8.desc": "Ensemble de cours suivis sur la plateforme Alura, couvrant des formations en DevOps, Linux, Git, Docker, Kubernetes, CI/CD, GitHub Actions et Observabilité.",
        "c8.tag": "Alura • 200 heures",

        "c9.title": "Bootcamp Back-end ADATECH",
        "c9.desc": "Bootcamp de développement Back-end axé sur Java et Spring Boot, proposé par Adatech.",
        "c9.tag": "Adatech • 19 heures",

        "c10.title": "Anglais britannique",
        "c10.desc": "Formation en anglais britannique axée sur la communication, la lecture, l'écriture et la compréhension en milieu professionnel.",
        "c10.tag": "British Council • 216 heures",

        "c11.title": "AWS Lambda Foundations (Portugais)",
        "c11.desc": "Cours sur les fondamentaux d'AWS Lambda, couvrant l'informatique serverless, la création et la configuration de fonctions et l'intégration avec d'autres services AWS.",

        "c12.desc": "Introduction à la plateforme Claude, abordant les bases de l'utilisation des modèles d'IA et les bonnes pratiques d'intégration dans les applications.",

        "c13.title": "Nano Course : Génie logiciel",
        "c13.desc": "Cours rapide sur les fondamentaux et les pratiques du génie logiciel.",
        "c13.tag": "FIAP • 100 heures",

        "c14.title": "Sensibilisation à la sécurité numérique",
        "c14.desc": "Cours d'introduction aux concepts et aux bonnes pratiques de la sécurité numérique.",

        "skills.title": "Compétences",
        "skills.pie": "Secteurs",
        "skills.bar": "Barres",

        "socials.title": "On reste en contact ?",
        "socials.subtitle": "Découvrez mon travail, mes playlists et un peu plus sur qui je suis",
        "socials.github": "Projets et dépôts",
        "socials.linkedin": "Connectons-nous !",
        "socials.spotify": "Ma playlist préférée pour coder",
        "socials.letterboxd": "Je juge tout ce que je regarde !",
        "socials.email": "Contactez-moi",
        "socials.whatsapp": "Discutons",
        "socials.discord": "On se fait un appel ?",
        "socials.valorant": "Découvrez le meilleur Platine de Valorant",

        "guestbook.title": "Commentaires",
        "guestbook.subtitle": "Laissez votre avis sur mon portfolio !",
        "guestbook.name": "Votre nom",
        "guestbook.message": "Écrivez un commentaire",
        "guestbook.send": "Envoyer le commentaire",

        "footer.text": "Développé par Plínio Peixoto © 2026"
    }
};

// Atributos traduzíveis: [atributo data-*, atributo real do elemento]
const atributos = [
    ["data-i18n-placeholder", "placeholder"],
    ["data-i18n-aria", "aria-label"],
    ["data-i18n-alt", "alt"]
];

let idiomaAtual = "pt";

// Guarda os textos originais (português) direto do HTML
function capturarPortugues() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const chave = el.dataset.i18n;
        if (!(chave in textos.pt)) {
            textos.pt[chave] = el.innerHTML.trim();
        }
    });

    atributos.forEach(([dataAttr, attr]) => {
        document.querySelectorAll(`[${dataAttr}]`).forEach(el => {
            const chave = el.getAttribute(dataAttr);
            if (!(chave in textos.pt)) {
                textos.pt[chave] = el.getAttribute(attr) || "";
            }
        });
    });
}

export function t(chave) {
    const valor = textos[idiomaAtual]?.[chave] ?? textos.pt[chave] ?? chave;
    // Devolve uma cópia das listas para ninguém alterar o dicionário
    return Array.isArray(valor) ? [...valor] : valor;
}

function atualizarTextos() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.innerHTML = t(el.dataset.i18n);
    });

    atributos.forEach(([dataAttr, attr]) => {
        document.querySelectorAll(`[${dataAttr}]`).forEach(el => {
            el.setAttribute(attr, t(el.getAttribute(dataAttr)));
        });
    });

    document.title = t("page.title");
    document.documentElement.lang = idiomaAtual === "fr" ? "fr" : "pt-BR";

    document.querySelectorAll(".lang-btn").forEach(btn => {
        const ativo = btn.dataset.lang === idiomaAtual;
        btn.classList.toggle("active", ativo);
        btn.setAttribute("aria-pressed", ativo);
    });
}

function setIdioma(idioma, animar = true) {
    if (!textos[idioma] || idioma === idiomaAtual) return;

    idiomaAtual = idioma;

    try {
        localStorage.setItem(STORAGE_KEY, idioma);
    } catch (e) {
        // Navegador sem acesso ao localStorage: apenas não salva a preferência
    }

    const aplicar = () => {
        atualizarTextos();
        document.dispatchEvent(new CustomEvent("i18n:change", { detail: { idioma } }));
    };

    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!animar || reduzirMovimento) {
        aplicar();
        return;
    }

    // Pequeno fade para a troca não ser brusca
    document.body.classList.add("lang-switching");

    setTimeout(() => {
        aplicar();
        document.body.classList.remove("lang-switching");
    }, 200);
}

export function initI18n() {
    capturarPortugues();

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => setIdioma(btn.dataset.lang));
    });

    let salvo = "pt";
    try {
        salvo = localStorage.getItem(STORAGE_KEY) || "pt";
    } catch (e) {
        salvo = "pt";
    }

    // Aplica sem animação para o gráfico já nascer no idioma salvo
    setIdioma(salvo, false);
}
