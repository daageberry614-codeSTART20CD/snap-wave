const $ = s => document.querySelector(s);
const auth = $("#auth"), main = $("#main-app"), form = $("#auth-form");
let authMode = "login", activePerson = "Jamie";
document.querySelectorAll("[data-auth]").forEach(btn => btn.addEventListener("click", () => {
  authMode = btn.dataset.auth;
  document.querySelectorAll("[data-auth]").forEach(b => b.classList.toggle("active", b === btn));
  $("#name-wrap").classList.toggle("hidden", authMode === "login");
  $("#auth-submit").textContent = authMode === "login" ? "Log in" : "Create account";
  $("#password").autocomplete = authMode === "login" ? "current-password" : "new-password";
  $("#auth-error").textContent = "";
}));
form.addEventListener("submit", e => {
  e.preventDefault();
  const identity = $("#identity").value.trim(), password = $("#password").value;
  if (!identity || password.length < 6) { $("#auth-error").textContent = "Enter a username/email and a password with at least 6 characters."; return; }
  const display = $("#display-name").value.trim() || identity.split("@")[0];
  // This is deliberately a local demo session, not secure account authentication.
  sessionStorage.setItem("snapwave-demo-user", JSON.stringify({identity, display}));
  showApp({identity, display});
});
function showApp(user) {
  auth.classList.add("hidden"); main.classList.remove("hidden");
  $("#profile-name").textContent = user.display || "Snap Wave user";
  $("#profile-identity").textContent = user.identity || "";
  $("#profile-shortcut").textContent = (user.display || "SW").slice(0,2).toUpperCase();
}
$("#logout").addEventListener("click", () => { sessionStorage.removeItem("snapwave-demo-user"); main.classList.add("hidden"); auth.classList.remove("hidden"); $("#password").value = ""; });
document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => {
  const view = btn.dataset.view;
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  $("#view-" + view).classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b === btn));
}));
$("#profile-shortcut").addEventListener("click", () => document.querySelector('[data-view="profile"]').click());
$("#search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".chat-item").forEach(item => item.classList.toggle("hidden", !item.innerText.toLowerCase().includes(q)));
});
function toast(message) { const el=$("#toast"); el.textContent=message; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2200); }
$("#new-chat").addEventListener("click",()=>toast("Online friend search will be added with the backend."));
$("#add-story").addEventListener("click",()=>{ document.querySelector('[data-view="camera"]').click(); toast("Choose a photo to preview your story."); });
document.querySelectorAll(".chat-item").forEach(item=>item.addEventListener("click",()=>{
  activePerson=item.dataset.person; $("#chat-title").textContent=activePerson; $("#chat-messages").innerHTML='<p class="bubble received">Hey! Welcome to Snap Wave 👋</p>';
  $("#chat-dialog").showModal();
}));
$("#message-form").addEventListener("submit",e=>{e.preventDefault();const input=$("#message-input");const p=document.createElement("p");p.className="bubble sent";p.textContent=input.value;$("#chat-messages").appendChild(p);input.value="";$("#chat-messages").scrollTop=$("#chat-messages").scrollHeight;});
$("#photo-input").addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;const img=$("#photo-preview");img.src=URL.createObjectURL(file);img.classList.remove("hidden");toast("Photo preview loaded on this device.");});
try { const user=JSON.parse(sessionStorage.getItem("snapwave-demo-user")); if(user) showApp(user); } catch {}
