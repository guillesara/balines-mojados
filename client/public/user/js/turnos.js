//Calendario
const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        if (i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear())
        {
            liTag += `<li class="active">${i}</li>`;
        }
        else if ((currYear < new Date().getFullYear()) || (currYear === new Date().getFullYear() && currMonth < new Date().getMonth()) || (currYear === new Date().getFullYear() && currMonth === new Date().getMonth() && i < date.getDate()))
        {
            liTag += `<li class="inactive">${i}</li>`;
        }
        else
        {
            liTag += `<li>${i}</li>`;
        }
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
};
renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});


//Selc cancha
document.querySelectorAll(".cancha").forEach((e) => {
    e.addEventListener("click", (e2) => {
        document.querySelectorAll(".cancha").forEach((e3) => {
            e3.classList.remove("selected");
        })

        e.classList.add("selected");
    })
})