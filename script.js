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

button.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        button.innerHTML = "🌙";
    } else {
        button.innerHTML = "☀️";
    }

});


const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});

document.querySelectorAll("#menu a").forEach(link => {

    link.addEventListener("click", () => {
        menu.classList.remove("active");
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

const btn = document.getElementById("enviar");

btn.addEventListener("click", async () => {

    const nome = document.getElementById("nome").value.trim();

    const mensagem = document.getElementById("mensagem").value.trim();

    if(nome === "" || mensagem === ""){

        alert("Preencha todos os campos.");

        return;

    }

    await addDoc(collection(db,"comentarios"),{

        nome,

        mensagem,

        data: serverTimestamp()

    });

    document.getElementById("nome").value="";

    document.getElementById("mensagem").value="";

    carregarComentarios();

});

async function carregarComentarios(){

    const container = document.getElementById("comentarios");

    container.innerHTML="";

    const q = query(
        collection(db,"comentarios"),
        orderBy("data","desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc=>{

        const comentario = doc.data();

        container.innerHTML += `

            <div class="comentario">

                <h3>${comentario.nome}</h3>

                <p>${comentario.mensagem}</p>

            </div>

        `;

    });

}

carregarComentarios();