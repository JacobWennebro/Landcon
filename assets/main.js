window.addEventListener("load", async () => {

    const md = new MobileDetect(window.navigator.userAgent);

    const el = {
        counter: document.getElementById("counter") || {},
        countdownShowcase: document.querySelector(".countdown-showcase"),
        location: document.getElementById("location") || {},
        attendants: document.getElementById("attendants") || {},
        date: document.getElementById("date") || {}
    }

    const config = await (await fetch('/site-config.json')).json();

    // Attendants element
    for(const attendee of config.attendants) {
        const li = document.createElement("li");
        li.innerHTML = `<img class="flag" src="https://countryflagsapi.com/svg/${attendee.nationality}"/> <span>${attendee.name}</span>`;
        if(attendee.picture) li.setAttribute("data-picture", attendee.picture);
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

    // Run once before timer executes
    timer();

    // Dispatch the timer to run once every second.
    setInterval(timer, 1000);

    if(!md.mobile()) for(const li of el.attendants.children) {

        li.addEventListener("mousemove", e => {
            const t = e.target;
            if(t.getAttribute("data-picture")) {
                let pic;
    
                if(!document.getElementById("attendeePicture")) {
                    pic = document.createElement("img");
                    pic.src = t.getAttribute("data-picture");
                    pic.id = "attendeePicture";
                    document.body.appendChild(pic);
                } else pic = document.getElementById("attendeePicture");
    
                pic.style.top = e.clientY+"px";
                pic.style.left = e.clientX+"px";
    
            }
        });

        li.addEventListener("mouseleave", e => {
            const pic = document.getElementById("attendeePicture");
            if(pic) pic.remove(); 
        });
    }

});