const button = document.getElementById("themeButton");

button.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        button.innerHTML="🌙";

    }else{

        button.innerHTML="☀️";

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


filters.forEach(button => {

    button.addEventListener("click", () => {


        filters.forEach(btn => {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        const category = button.dataset.filter;


        cards.forEach(card => {


            if(category === "all" || card.dataset.category === category){

                card.style.display="block";

            }else{

                card.style.display="none";

            }


        });


    });


});