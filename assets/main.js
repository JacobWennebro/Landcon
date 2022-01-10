window.addEventListener("load", async () => {

    const el = {
        counter: document.getElementById("counter") || {},
        countdownShowcase: document.querySelector(".countdown-showcase"),
        location: document.getElementById("location") || {},
        attendants: document.getElementById("attendants") || {},
        date: document.getElementById("date") || {}
    }

    const config = await (await fetch('/site-config.json')).json();

    // Make attendants alphabetical order
    const attendants = config.attendants.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    })

    // Attendants element
    for(const attendee of attendants) {
        const li = document.createElement("li");
        li.innerText = attendee;
        el.attendants.appendChild(li);
    }

    // Location element
    el.location.innerHTML = `${config.location}, ${config.country.toUpperCase()}`;

    const date = moment(config.date, "YYYY-MM-DD");

    // Date element
    el.date.innerHTML = `${date.format("MMMM D[th,] YYYY")}`

    const timer = () => {
        const current = moment();
        const diff = moment.duration(date.diff(current));
        const string = diff.format("D [day], H [hour], m [minutes and] s [seconds left]");
        
        el.counter.innerText = string;

        if(el.countdownShowcase.style.visibility !== "visible") {
            el.countdownShowcase.style.visibility = "visible";
        }
    }

    // Dispatch the timer to run once every second.
    setInterval(timer, 1000);

});