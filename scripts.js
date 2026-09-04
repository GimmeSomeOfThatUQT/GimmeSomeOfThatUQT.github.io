const SUPABASE_URL = "https://akmkoptopznnvhnlbfdd.supabase.co";
const SUPABASE_KEY = "sb_publishable_-QaGxbzu9CzeShlSDNPGRg_MzEsZsi4";

const thoughts = [
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

function updateClock() {
const clock = document.getElementById("clock");
const now = new Date();
clock.textContent = now.toLocaleTimeString([], {
hour: "numeric",
minute: "2-digit"
});
}

updateClock();
setInterval(updateClock, 1000);

let highestZ = 20;

function bringToFront(windowElement) {
highestZ++;
windowElement.style.zIndex = highestZ;
}

const taskbarItems = document.getElementById("taskbar-items");
const messagesList = document.getElementById("messages-list");
const guestbookForm = document.getElementById("guestbook-form");
const guestbookStatus = document.getElementById("guestbook-status");
const signButton = document.getElementById("sign-button");

function updateTaskbar() {
taskbarItems.innerHTML = "";

document.querySelectorAll(".app-window").forEach((windowElement) => {
if (!windowElement.classList.contains("active")) {
return;
}

```
const title = windowElement.querySelector(".title-bar span")?.textContent || "Window";
const taskbarButton = document.createElement("button");

taskbarButton.className = "taskbar-window";
taskbarButton.textContent = title;

taskbarButton.addEventListener("click", () => {
  windowElement.classList.add("active");
  bringToFront(windowElement);
});

taskbarItems.appendChild(taskbarButton);
```

});
}

const welcomeWindow = document.getElementById("welcome-window");
const welcomeOk = document.getElementById("welcome-ok");

welcomeOk.addEventListener("click", () => {
welcomeWindow.style.display = "none";
});

const desktopIcons = document.querySelectorAll(".desktop-icon");

desktopIcons.forEach((icon) => {
icon.addEventListener("click", () => {
const windowId = icon.dataset.window;
const appWindow = document.getElementById(windowId);

```
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
```

});
});

const closeButtons = document.querySelectorAll(".close-button");

closeButtons.forEach((button) => {
button.addEventListener("click", () => {
const windowElement = button.closest(".window");

```
if (windowElement.id === "welcome-window") {
  windowElement.style.display = "none";
} else {
  windowElement.classList.remove("active");
  updateTaskbar();
}
```

});
});

document.querySelectorAll(".window").forEach((windowElement) => {
windowElement.addEventListener("mousedown", () => {
bringToFront(windowElement);
});
});

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

```
isDragging = true;
bringToFront(windowElement);

const rect = windowElement.getBoundingClientRect();

offsetX = event.clientX - rect.left;
offsetY = event.clientY - rect.top;

windowElement.style.transform = "none";
windowElement.style.left = `${rect.left}px`;
windowElement.style.top = `${rect.top}px`;

event.preventDefault();
```

});

document.addEventListener("mousemove", (event) => {
if (!isDragging) {
return;
}

```
let newLeft = event.clientX - offsetX;
let newTop = event.clientY - offsetY;

const maxLeft = window.innerWidth - 40;
const maxTop = window.innerHeight - 45;

newLeft = Math.max(0, Math.min(newLeft, maxLeft));
newTop = Math.max(0, Math.min(newTop, maxTop));

windowElement.style.left = `${newLeft}px`;
windowElement.style.top = `${newTop}px`;
```

});

document.addEventListener("mouseup", () => {
isDragging = false;
});
});

const thoughtsList = document.getElementById("thoughts-list");

function renderThoughts() {
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

```
const dateElement = document.createElement("div");
dateElement.className = "thought-date";
dateElement.textContent = thought.date;

const textElement = document.createElement("div");
textElement.className = "thought-text";
textElement.textContent = thought.text;

thoughtElement.appendChild(dateElement);
thoughtElement.appendChild(textElement);
thoughtsList.appendChild(thoughtElement);
```

});
}

async function supabaseRequest(endpoint, options = {}) {
const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
...options,
headers: {
apikey: SUPABASE_KEY,
"Content-Type": "application/json",
...(options.headers || {})
}
});

if (!response.ok) {
let errorMessage = "Something went wrong.";

```
try {
  const error = await response.json();
  errorMessage = error.message || error.details || error.hint || error.code || errorMessage;
} catch {
  errorMessage = `Request failed with status ${response.status}.`;
}

throw new Error(errorMessage);
```

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

async function loadGuestbook() {
messagesList.textContent = "Loading messages...";

try {
const messages = await supabaseRequest(
"guestbook?select=id,name,message,created_at&order=created_at.desc"
);

```
renderMessages(messages || []);
```

} catch (error) {
console.error("Guestbook loading error:", error);
messagesList.textContent = "Unable to load Guestbook messages.";
}
}

function renderMessages(messages) {
messagesList.innerHTML = "";

if (!messages || messages.length === 0) {
const emptyMessage = document.createElement("div");
emptyMessage.className = "no-messages";
emptyMessage.textContent = "No messages yet. Be the first to sign the Guestbook!";
messagesList.appendChild(emptyMessage);
return;
}

messages.forEach((message) => {
const messageElement = document.createElement("div");
messageElement.className = "guestbook-message";

```
const header = document.createElement("div");
header.className = "message-header";

const name = document.createElement("span");
name.className = "message-name";
name.textContent = message.name;

const date = document.createElement("span");
date.className = "message-date";
date.textContent = formatDate(message.created_at);

const text = document.createElement("div");
text.className = "message-text";
text.textContent = message.message;

header.appendChild(name);
header.appendChild(date);
messageElement.appendChild(header);
messageElement.appendChild(text);
messagesList.appendChild(messageElement);
```

});
}

function formatDate(dateString) {
if (!dateString) {
return "";
}

const date = new Date(dateString);

return date.toLocaleString([], {
year: "numeric",
month: "short",
day: "numeric",
hour: "numeric",
minute: "2-digit"
});
}

guestbookForm.addEventListener("submit", async (event) => {
event.preventDefault();

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
guestbookStatus.textContent = "Name must be 30 characters or less.";
guestbookStatus.className = "error";
return;
}

if (message.length > 300) {
guestbookStatus.textContent = "Message must be 300 characters or less.";
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
body: JSON.stringify({ name, message })
});

```
guestbookForm.reset();
guestbookStatus.textContent = "Message added!";

loadGuestbook().catch((refreshError) => {
  console.error("Message saved, but refresh failed:", refreshError);
});

setTimeout(() => {
  guestbookStatus.textContent = "";
}, 2500);
```

} catch (error) {
console.error("Could not sign guestbook:", error);
guestbookStatus.textContent = error.message || "Could not sign Guestbook.";
guestbookStatus.className = "error";
}

signButton.disabled = false;
});

const thoughtsWindow = document.getElementById("thoughts-window");

thoughtsWindow.classList.add("active");
bringToFront(thoughtsWindow);
renderThoughts();
updateTaskbar();
loadGuestbook();
