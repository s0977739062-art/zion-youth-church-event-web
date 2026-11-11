const currentMonth = new Date().getMonth();
const isWinterSeason = currentMonth === 10 || currentMonth === 11;

if (isWinterSeason) {
    document.documentElement.classList.add("winter-season");

    const winterStyles = document.createElement("link");
    winterStyles.rel = "stylesheet";
    winterStyles.href = "./winter-season.css";
    document.head.append(winterStyles);

    document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("winter-season");

        const snowLayer = document.createElement("div");
        snowLayer.className = "winter-snow";
        snowLayer.setAttribute("aria-hidden", "true");

        for (let index = 0; index < 30; index += 1) {
            const flake = document.createElement("span");
            const duration = 10 + Math.random() * 14;
            flake.className = "winter-snowflake";
            flake.textContent = "❄";
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDuration = `${duration}s`;
            flake.style.animationDelay = `${-Math.random() * duration}s`;
            flake.style.setProperty("--snow-drift", `${Math.random() * 100 - 50}px`);
            flake.style.fontSize = `${10 + Math.random() * 12}px`;
            snowLayer.append(flake);
        }

        document.body.append(snowLayer);
    }, { once: true });
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .catch((error) => {
                console.error("Unable to register the service worker.", error);
            });
    });
}
