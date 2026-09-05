const SUPABASE_URL = "https://akmkoptopznnvhnlbfdd.supabase.co";
const SUPABASE_KEY = "sb_publishable_-QaGxbzu9CzeShlSDNPGRg_MzEsZsi4";

const thoughts = [
  { 
    date: "September 5, 2026"
    text: "astral blacksmith wont u give me a fix,. i promise i can keep it a secret. WATER. FIRE. wATER FIRE. WATER,. FUIRE. CLOUDS AND ICEEEEEEEE. i wanna add a music section nedt TBH."
  },
  {
    date: "September 5, 2026"
    text: "so im editing this late again its already tmr which is weird because my edits yesterday were like late the 3rd so technically it was the 4th,,, and today is like late the 4th so technically the 5th but now my dates are shot so oh well."
  },
  {
    date: "September 4, 2026",
    text: "ok i just made a new repo for ts cuz the other one was pmoing and i didnt wanna bug fix so i copy and pasted the important stuff. but then i screwed over my entire js file cuz i accidentally put it in discord with markdown to copy paste and kept in the ''' things and had to redo ts AHHH"
  },
  {
    date: "September 4, 2026",
    text: "its liek 2 am but i lowk can't sleep so im just making this still. follow the twt while ur at it @pan_psych and if ur reading this and can draw PLEASE lemme get a commision dm me rn."
  },
  {
    date: "September 4, 2026",
    text: "hey guys i hope u like my website i just made it today. i was planning on having it be liek my old site but i couldnt find motan to steal from and lost access to my old github... so here we are. new site. new me. feeling good"
  },
  {
    date: "September 4, 2026",
    text: "welcum to the site"
  }
];


/* =========================
   CLOCK
========================= */

function updateClock() {
  const clock = document.getElementById("clock");

  if (!clock) {
    return;
  }

  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 1000);


/* =========================
   WINDOW MANAGEMENT
========================= */

let highestZ = 20;

function bringToFront(windowElement) {
  if (!windowElement) {
    return;
  }

  highestZ += 1;
  windowElement.style.zIndex = highestZ;
}


/* =========================
   DOM ELEMENTS
========================= */

const taskbarItems = document.getElementById("taskbar-items");
const messagesList = document.getElementById("messages-list");
const guestbookForm = document.getElementById("guestbook-form");
const guestbookStatus = document.getElementById("guestbook-status");
const signButton = document.getElementById("sign-button");

const welcomeWindow = document.getElementById("welcome-window");
const welcomeOk = document.getElementById("welcome-ok");

const thoughtsList = document.getElementById("thoughts-list");
const thoughtsWindow = document.getElementById("thoughts-window");

const badgesWindow = document.getElementById("badges-window");
const copyBadgeButton = document.getElementById("copy-badge-button");
const badgeEmbedCode = document.getElementById("badge-embed-code");
const copyBadgeStatus = document.getElementById("copy-badge-status");


/* =========================
   TASKBAR
========================= */

function updateTaskbar() {
  if (!taskbarItems) {
    return;
  }

  taskbarItems.innerHTML = "";

  document.querySelectorAll(".app-window").forEach((windowElement) => {
    if (!windowElement.classList.contains("active")) {
      return;
    }

    const title =
      windowElement.querySelector(".title-bar span")?.textContent || "Window";

    const taskbarButton = document.createElement("button");

    taskbarButton.className = "taskbar-window";
    taskbarButton.type = "button";
    taskbarButton.textContent = title;

    taskbarButton.addEventListener("click", () => {
      windowElement.classList.add("active");
      bringToFront(windowElement);
    });

    taskbarItems.appendChild(taskbarButton);
  });
}


/* =========================
   WELCOME WINDOW
========================= */

if (welcomeOk && welcomeWindow) {
  welcomeOk.addEventListener("click", () => {
    welcomeWindow.style.display = "none";
  });
}


/* =========================
   DESKTOP ICONS
========================= */

const desktopIcons = document.querySelectorAll(".desktop-icon");

desktopIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const windowId = icon.dataset.window;
    const appWindow = document.getElementById(windowId);

    if (!appWindow) {
      return;
    }

    appWindow.classList.add("active");
    bringToFront(appWindow);
    updateTaskbar();

    if (windowId === "guestbook-window") {
      loadGuestbook();
    }

    if (windowId === "thoughts-window") {
      renderThoughts();
    }
  });
});


/* =========================
   CLOSE BUTTONS
========================= */

const closeButtons = document.querySelectorAll(".close-button");

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const windowElement = button.closest(".window");

    if (!windowElement) {
      return;
    }

    if (windowElement.id === "welcome-window") {
      windowElement.style.display = "none";
      return;
    }

    windowElement.classList.remove("active");
    updateTaskbar();
  });
});


/* =========================
   WINDOW FOCUS
========================= */

document.querySelectorAll(".window").forEach((windowElement) => {
  windowElement.addEventListener("mousedown", () => {
    bringToFront(windowElement);
  });
});


/* =========================
   WINDOW DRAGGING
========================= */

document.querySelectorAll(".window").forEach((windowElement) => {
  const titleBar = windowElement.querySelector(".title-bar");

  if (!titleBar) {
    return;
  }

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener("mousedown", (event) => {
    if (event.target.closest(".close-button")) {
      return;
    }

    isDragging = true;
    bringToFront(windowElement);

    const rect = windowElement.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    windowElement.style.transform = "none";
    windowElement.style.left = `${rect.left}px`;
    windowElement.style.top = `${rect.top}px`;

    event.preventDefault();
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) {
      return;
    }

    let newLeft = event.clientX - offsetX;
    let newTop = event.clientY - offsetY;

    const maxLeft = window.innerWidth - 40;
    const maxTop = window.innerHeight - 45;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    windowElement.style.left = `${newLeft}px`;
    windowElement.style.top = `${newTop}px`;
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

  if (!thoughts || thoughts.length === 0) {
    const emptyMessage = document.createElement("div");

    emptyMessage.className = "no-thoughts";
    emptyMessage.textContent = "No thoughts here yet.";

    thoughtsList.appendChild(emptyMessage);

    return;
  }

  thoughts.forEach((thought) => {
    const thoughtElement = document.createElement("div");
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
   BADGE EMBED COPY
========================= */

if (copyBadgeButton && badgeEmbedCode && copyBadgeStatus) {
  copyBadgeButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(badgeEmbedCode.value);

      copyBadgeStatus.textContent = "Copied!";
      copyBadgeStatus.className = "copy-success";

      setTimeout(() => {
        copyBadgeStatus.textContent = "";
      }, 2000);

    } catch (error) {
      console.error("Could not copy badge embed:", error);

      badgeEmbedCode.focus();
      badgeEmbedCode.select();

      copyBadgeStatus.textContent =
        "Copy failed — press Ctrl+C.";
      copyBadgeStatus.className = "error";
    }
  });
}


/* =========================
   SUPABASE
========================= */

async function supabaseRequest(endpoint, options = {}) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${endpoint}`,
    {
      ...options,
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  if (!response.ok) {
    let errorMessage = "Something went wrong.";

    try {
      const error = await response.json();

      errorMessage =
        error.message ||
        error.details ||
        error.hint ||
        error.code ||
        errorMessage;
    } catch {
      errorMessage = `Request failed with status ${response.status}.`;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}


/* =========================
   GUESTBOOK
========================= */

async function loadGuestbook() {
  if (!messagesList) {
    return;
  }

  messagesList.textContent = "Loading messages...";

  try {
    const messages = await supabaseRequest(
      "guestbook?select=id,name,message,created_at&order=created_at.desc"
    );

    renderMessages(messages || []);
  } catch (error) {
    console.error("Guestbook loading error:", error);

    messagesList.textContent =
      "Unable to load Guestbook messages.";
  }
}


function renderMessages(messages) {
  if (!messagesList) {
    return;
  }

  messagesList.innerHTML = "";

  if (!messages || messages.length === 0) {
    const emptyMessage = document.createElement("div");

    emptyMessage.className = "no-messages";
    emptyMessage.textContent =
      "No messages yet. Be the first to sign the Guestbook!";

    messagesList.appendChild(emptyMessage);

    return;
  }

  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.className = "guestbook-message";

    const header = document.createElement("div");
    header.className = "message-header";

    const name = document.createElement("span");
    name.className = "message-name";
    name.textContent = message.name || "Anonymous";

    const date = document.createElement("span");
    date.className = "message-date";
    date.textContent = formatDate(message.created_at);

    const text = document.createElement("div");
    text.className = "message-text";
    text.textContent = message.message || "";

    header.appendChild(name);
    header.appendChild(date);

    messageElement.appendChild(header);
    messageElement.appendChild(text);

    messagesList.appendChild(messageElement);
  });
}


function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}


/* =========================
   GUESTBOOK FORM
========================= */

if (guestbookForm) {
  guestbookForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!guestbookStatus || !signButton) {
      return;
    }

    guestbookStatus.textContent = "";
    guestbookStatus.className = "";

    const formData = new FormData(guestbookForm);

    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name) {
      guestbookStatus.textContent = "Please enter your name.";
      guestbookStatus.className = "error";
      return;
    }

    if (!message) {
      guestbookStatus.textContent = "Please enter a message.";
      guestbookStatus.className = "error";
      return;
    }

    if (name.length > 30) {
      guestbookStatus.textContent =
        "Name must be 30 characters or less.";
      guestbookStatus.className = "error";
      return;
    }

    if (message.length > 300) {
      guestbookStatus.textContent =
        "Message must be 300 characters or less.";
      guestbookStatus.className = "error";
      return;
    }

    signButton.disabled = true;
    guestbookStatus.textContent = "Signing...";

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

      guestbookForm.reset();

      guestbookStatus.textContent = "Message added!";
      guestbookStatus.className = "";

      loadGuestbook().catch((refreshError) => {
        console.error(
          "Message saved, but refresh failed:",
          refreshError
        );
      });

      setTimeout(() => {
        guestbookStatus.textContent = "";
      }, 2500);

    } catch (error) {
      console.error("Could not sign guestbook:", error);

      guestbookStatus.textContent =
        error.message || "Could not sign Guestbook.";

      guestbookStatus.className = "error";

    } finally {
      signButton.disabled = false;
    }
  });
}


/* =========================
   INITIALIZE
========================= */

/*
  Open Welcome, Badges, and Thoughts automatically.
*/

if (welcomeWindow) {
  welcomeWindow.style.display = "block";
  bringToFront(welcomeWindow);
}

if (badgesWindow) {
  badgesWindow.classList.add("active");
  bringToFront(badgesWindow);
}

if (thoughtsWindow) {
  thoughtsWindow.classList.add("active");
  bringToFront(thoughtsWindow);
  renderThoughts();
}

updateTaskbar();


/*
  Load the Guestbook in the background.
*/

loadGuestbook().catch((error) => {
  console.error("Initial Guestbook load failed:", error);
});
