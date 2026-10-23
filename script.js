
const paletteGrid = document.getElementById("paletteGrid");
const generateBtn = document.getElementById("generateBtn");
const toast = document.getElementById("toast");

const TOTAL_COLORS = 7;
let toastTimer;

// Generate a random HEX color
function generateRandomColor() {
    const characters = "0123456789ABCDEF";
    let hex = "#";

    for (let i = 0; i < 6; i++) {
        hex += characters[Math.floor(Math.random() * 16)];
    }

    return hex;
}

// Get readable text color for each background
function getTextColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 150 ? "#222222" : "#FFFFFF";
}

// Generate a new palette
function generatePalette() {
    paletteGrid.innerHTML = "";

    for (let i = 0; i < TOTAL_COLORS; i++) {
        const color = generateRandomColor();

        const card = document.createElement("div");
        card.className = "color-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Copy color ${color}`);

        card.innerHTML = `
            <div class="color-preview" style="background-color: ${color}">
                <span class="copy-icon" aria-hidden="true">⧉</span>
            </div>
            <div class="color-info">
                <p class="hex-code">${color}</p>
                <p class="color-label">Click to copy</p>
            </div>
        `;

        // Copy color when clicking the card
        card.addEventListener("click", () => {
            copyColor(color);
        });

        // Keyboard accessibility
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                copyColor(color);
            }
        });

        paletteGrid.appendChild(card);
    }
}

// Copy HEX code to clipboard
async function copyColor(color) {
    try {
        await navigator.clipboard.writeText(color);
        showToast(`${color} copied to clipboard!`);
    } catch (error) {
        // Fallback for browsers without Clipboard API access
        const textArea = document.createElement("textarea");

        textArea.value = color;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.select();

        try {
            const copied = document.execCommand("copy");

            if (!copied) {
                throw new Error("Copy failed");
            }

            showToast(`${color} copied to clipboard!`);
        } catch (fallbackError) {
            showToast("Copy failed. Please copy the HEX code manually.");
        } finally {
            textArea.remove();
        }
    }
}

// Show copy notification
function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;

    toastTimer = setTimeout(() => {
        toast.textContent = "";
    }, 2500);
}

// Generate a palette on button click
generateBtn.addEventListener("click", generatePalette);

// Generate a palette using the Space key
document.addEventListener("keydown", (event) => {
    const target = event.target;

    if (
        event.code === "Space" &&
        !event.repeat &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        !["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(target.tagName) &&
        !target.isContentEditable
    ) {
        event.preventDefault();
        generatePalette();
    }
});

// Show the first palette when the page loads
generatePalette();
