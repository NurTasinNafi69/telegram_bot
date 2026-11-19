
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

// Your MAIN Monetag Zone ID
const ZONE_ID = "YOUR_MAIN_ZONE_ID";

const showAd = window["show_" + ZONE_ID];

const button = document.getElementById("watchAd");
const status = document.getElementById("status");

let adReady = false;

// Preload advertisement
async function preloadAd() {
    if (typeof showAd !== "function") {
        status.textContent = "Monetag SDK not loaded.";
        button.disabled = true;
        return;
    }

    try {
        await showAd({
            type: "preload",
            requestVar: "reward_button"
        });

        adReady = true;
        button.disabled = false;
        button.textContent = "🎬 Watch Advertisement";

        status.textContent = "Advertisement ready.";

    } catch (error) {
        console.error(error);
        status.textContent = "Advertisement unavailable.";
        button.disabled = true;
    }
}

// Show advertisement
button.addEventListener("click", async () => {

    if (!adReady) return;

    button.disabled = true;
    status.textContent = "Opening advertisement...";

    // Unique event identifier
    const ymid = crypto.randomUUID();

    try {

        const result = await showAd({
            ymid: ymid,
            requestVar: "reward_button"
        });

        if (result?.reward_event_type === "valued") {

            status.textContent = "Verified reward event!";

            // Final reward must be confirmed
            // by your backend postback.

        } else {

            status.textContent =
                "Advertisement closed. No verified reward.";
        }

    } catch (error) {

        console.error("Ad error:", error);
        status.textContent =
            "Advertisement could not be completed.";

    } finally {

        adReady = false;
        button.disabled = true;
        button.textContent = "Preparing Advertisement...";

        preloadAd();
    }
});

preloadAd();
