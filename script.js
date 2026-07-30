const button = document.getElementById("themeButton");

button.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        button.innerHTML="🌙";

    }else{

        button.innerHTML="☀️";

    }

});