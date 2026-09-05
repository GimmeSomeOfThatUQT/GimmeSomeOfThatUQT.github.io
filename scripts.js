/* =========================
   SUPABASE
   ========================= */

const SUPABASE_URL = "https://akmkoptopznnvhnlbfdd.supabase.co";
const SUPABASE_KEY = "sb_publishable_-QaGxbzu9CzeShlSDNPGRg_MzEsZsi4";


/* =========================
   THOUGHTS
   ========================= */

const thoughts = [
  {
    date: "2025-01-01",
    text: "Welcome to my website!"
  },
  {
    date: "2025-01-05",
    text: "I really like making little websites."
  },
  {
    date: "2025-01-12",
    text: "The internet felt so much more fun when everyone had their own little corner."
  },
  {
    date: "2025-02-01",
    text: "I should probably update this more often."
  },
  {
    date: "2025-02-15",
    text: "Thanks for visiting!"
  }
];


/* =========================
   CURRENT MUSIC
   ========================= */

const latestSong = {
  title: "Uqt",
  artist: "King Gizzard & the Lizard Wizard",
  album: "Alien Metal",
  youtubeMusic:
    "https://music.youtube.com/watch?v=MUx4plyc4Bg&si=HuDu_-cNsQfFlN1f"
};


/* =========================
   WINDOW STATE
   ========================= */

let highestZ = 20;


/* =========================
   DOM ELEMENTS
   ========================= */

const welcomeWindow = document.getElementById("welcome-window");
const welcomeOk = document.getElementById("welcome-ok");

const desktopIcons = document.querySelectorAll(".desktop-icon");
const appWindows = document.querySelectorAll(".app-window");
const closeButtons = document.querySelectorAll(".close-button");

const taskbarItems = document.getElementById("taskbar-items");
const clock = document.getElementById("clock");

const thoughtsList = document.getElementById("thoughts-list");

const musicTitle = document.getElementById("music-title");
const musicArtist = document.getElementById("music-artist");
const musicAlbum = document.getElementById("music-album");
const musicLink = document.getElementById("music-link");

const guestbookForm = document.getElementById("guestbook-form");
const guestName = document.getElementById("guest-name");
const guestMessage = document.getElementById("guest-message");
const guestbookMessages = document.getElementById("guestbook-messages");

const badgeEmbedCode = document.getElementById("badge-embed-code");
const copyBadgeButton = document.getElementById("copy-badge-button");
const copyStatus = document.getElementById("copy-status");


/* =========================
   CLOCK
   ========================= */

function updateClock() {
  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 1000);


/* =========================
   WINDOW FOCUS
   ========================= */

function bringToFront(windowElement) {
  if (!windowElement) {
    return;
  }

  highestZ += 1;
  windowElement.style.zIndex = highestZ;
}


/* =========================
   TASKBAR
   ========================= */

function updateTaskbar() {
  taskbarItems.innerHTML = "";

  appWindows.forEach((windowElement) => {
    if (!windowElement.classList.contains("active")) {
      return;
    }

    const titleBarText =
      windowElement.querySelector(".title-bar span")?.textContent ||
      "Window";

    const button = document.createElement("button");

    button.type = "button";
    button.className = "taskbar-item";
    button.textContent = titleBarText;

    button.addEventListener("click", () => {
      bringToFront(windowElement);
    });

    taskbarItems.appendChild(button);
  });
}


/* =========================
   WELCOME WINDOW
   ========================= */

welcomeOk.addEventListener("click", () => {
  welcomeWindow.style.display = "none";
});

welcomeWindow.addEventListener("mousedown", () => {
  bringToFront(welcomeWindow);
});


/* =========================
   DESKTOP ICONS
   ========================= */

desktopIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const windowId = icon.dataset.window;
    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
      return;
    }

    windowElement.classList.add("active");
    bringToFront(windowElement);

    updateTaskbar();

    if (windowId === "guestbook-window") {
      loadGuestbook();
    }

    if (windowId === "thoughts-window") {
      renderThoughts();
    }

    if (windowId === "music-window") {
      renderMusic();
    }
  });
});


/* =========================
   CLOSE BUTTONS
   ========================= */

closeButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const windowElement = button.closest(".window");

    if (!windowElement) {
      return;
    }

    if (windowElement.id === "welcome-window") {
      windowElement.style.display = "none";
    } else {
      windowElement.classList.remove("active");
    }

    updateTaskbar();
  });
});


/* =========================
   WINDOW CLICK / FOCUS
   ========================= */

document.querySelectorAll(".window").forEach((windowElement) => {
  windowElement.addEventListener("mousedown", () => {
    bringToFront(windowElement);
  });
});


/* =========================
   WINDOW DRAGGING
   ========================= */

document.querySelectorAll(".window .title-bar").forEach((titleBar) => {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const windowElement = titleBar.closest(".window");

  titleBar.addEventListener("mousedown", (event) => {
    if (event.target.closest(".close-button")) {
      return;
    }

    isDragging = true;

    bringToFront(windowElement);

    const rect = windowElement.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    event.preventDefault();
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) {
      return;
    }

    const newLeft = event.clientX - offsetX;
    const newTop = event.clientY - offsetY;

    windowElement.style.left = `${newLeft}px`;
    windowElement.style.top = `${newTop}px`;

    windowElement.style.transform = "none";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
});


/* =========================
   THOUGHTS
   ========================= */

function renderThoughts() {
  if (!thoughtsList) {
    return;
  }

  thoughtsList.innerHTML = "";

  thoughts.forEach((thought) => {
    const thoughtElement = document.createElement("article");

    thoughtElement.className = "thought";

    const dateElement = document.createElement("div");
    dateElement.className = "thought-date";
    dateElement.textContent = thought.date;

    const textElement = document.createElement("div");
    textElement.className = "thought-text";
    textElement.textContent = thought.text;

    thoughtElement.appendChild(dateElement);
    thoughtElement.appendChild(textElement);

    thoughtsList.appendChild(thoughtElement);
  });
}


/* =========================
   MUSIC
   ========================= */

function renderMusic() {
  if (!musicTitle || !musicArtist || !musicAlbum || !musicLink) {
    return;
  }

  musicTitle.textContent = latestSong.title;
  musicArtist.textContent = `Artist: ${latestSong.artist}`;
  musicAlbum.textContent = `Album: ${latestSong.album}`;
  musicLink.href = latestSong.youtubeMusic;
}


/* =========================
   BADGE EMBED
   ========================= */

function setupBadgeEmbed() {
  if (!badgeEmbedCode) {
    return;
  }

  const badgeImage =
    document.querySelector(".badge-image");

  if (!badgeImage) {
    return;
  }

  const imageUrl = badgeImage.src;

  badgeEmbedCode.value =
    `<a href="https://tornadocookie.neocities.org" target="_blank" rel="noopener noreferrer">` +
    `<img src="${imageUrl}" alt="My web badge">` +
    `</a>`;
}

setupBadgeEmbed();


/* =========================
   COPY BADGE
   ========================= */

copyBadgeButton.addEventListener("click", async () => {
  if (!badgeEmbedCode) {
    return;
  }

  const text = badgeEmbedCode.value;

  try {
    await navigator.clipboard.writeText(text);

    copyStatus.textContent = "Copied!";
  } catch (error) {
    badgeEmbedCode.focus();
    badgeEmbedCode.select();

    copyStatus.textContent =
      "Select the text and press Ctrl+C to copy.";
  }

  setTimeout(() => {
    copyStatus.textContent = "";
  }, 3000);
});


/* =========================
   SUPABASE REQUEST
   ========================= */

async function supabaseRequest(endpoint, options = {}) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${endpoint}`,
    {
      ...options,

      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Supabase request failed: ${response.status} ${errorText}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}


/* =========================
   LOAD GUESTBOOK
   ========================= */

async function loadGuestbook() {
  if (!guestbookMessages) {
    return;
  }

  guestbookMessages.innerHTML =
    "<p>Loading messages...</p>";

  try {
    const messages = await supabaseRequest(
      "guestbook?select=*&order=created_at.desc"
    );

    renderMessages(messages);
  } catch (error) {
    console.error("Guestbook loading failed:", error);

    guestbookMessages.innerHTML =
      "<p>Could not load guestbook messages.</p>";
  }
}


/* =========================
   RENDER GUESTBOOK
   ========================= */

function renderMessages(messages) {
  guestbookMessages.innerHTML = "";

  if (!messages || messages.length === 0) {
    guestbookMessages.innerHTML =
      "<p>No messages yet. Be the first!</p>";

    return;
  }

  messages.forEach((message) => {
    const messageElement =
      document.createElement("article");

    messageElement.className =
      "guestbook-message";

    const nameElement =
      document.createElement("div");

    nameElement.className =
      "message-name";

    nameElement.textContent =
      message.name || "Anonymous";

    const dateElement =
      document.createElement("div");

    dateElement.className =
      "message-date";

    dateElement.textContent =
      formatDate(message.created_at);

    const textElement =
      document.createElement("div");

    textElement.className =
      "message-text";

    textElement.textContent =
      message.message || "";

    messageElement.appendChild(nameElement);
    messageElement.appendChild(dateElement);
    messageElement.appendChild(textElement);

    guestbookMessages.appendChild(messageElement);
  });
}


/* =========================
   FORMAT DATE
   ========================= */

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString();
}


/* =========================
   GUESTBOOK FORM
   ========================= */

guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = guestName.value.trim();
  const message = guestMessage.value.trim();

  if (!name || !message) {
    alert("Please enter both your name and a message.");
    return;
  }

  if (name.length > 40) {
    alert("Your name is too long.");
    return;
  }

  if (message.length > 300) {
    alert("Your message is too long.");
    return;
  }

  const signButton =
    document.getElementById("sign-button");

  signButton.disabled = true;
  signButton.textContent = "Signing...";

  try {
    await supabaseRequest("guestbook", {
      method: "POST",

      headers: {
        Prefer: "return=minimal"
      },

      body: JSON.stringify({
        name,
        message
      })
    });

    guestName.value = "";
    guestMessage.value = "";

    await loadGuestbook();

  } catch (error) {
    console.error("Guestbook submission failed:", error);

    alert(
      "There was a problem signing the guestbook. Please try again."
    );

  } finally {
    signButton.disabled = false;
    signButton.textContent = "Sign Guestbook";
  }
});


/* =========================
   INITIALIZATION
   ========================= */

// Show welcome window.
welcomeWindow.style.display = "block";
bringToFront(welcomeWindow);

// Open badges and thoughts by default.
document
  .getElementById("badges-window")
  .classList.add("active");

document
  .getElementById("thoughts-window")
  .classList.add("active");

bringToFront(
  document.getElementById("badges-window")
);

bringToFront(
  document.getElementById("thoughts-window")
);

renderThoughts();
renderMusic();
updateTaskbar();

// Load the guestbook in the background.
loadGuestbook().catch((error) => {
  console.error(
    "Initial Guestbook load failed:",
    error
  );
});


/* =========================
   START BUTTON
   ========================= */

// Intentionally left non-functional for now.
// We will add the Start menu later.
