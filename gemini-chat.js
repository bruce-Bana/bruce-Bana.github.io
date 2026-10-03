(() => {
const MODEL = "gemini-3.8-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent";
const SYSTEM = "You are the Gemini assistant for Bruce Bana's personal developer website at bruce-bana.github.io. Be helpful, concise, technically accurate, and friendly. You can discuss Bruce's public website content, software development, AI assistants, Python, Rust, JavaScript, local AI, CLI tools, and general questions. Do not invent private facts about Bruce. If asked about something not present on the site, say you don't have that information.";
const keyEl=document.getElementById("geminiKey"), rememberEl=document.getElementById("rememberKey"), statusEl=document.getElementById("keyStatus"), form=document.getElementById("chatForm"), promptEl=document.getElementById("prompt"), messages=document.getElementById("messages"), connect=document.getElementById("connectBtn"), clear=document.getElementById("clearChat"), mic=document.getElementById("micBtn");
let key="", history=[];
const saved=localStorage.getItem("bruce_gemini_key");
if(saved){keyEl.value=saved; rememberEl.checked=true; setStatus("Key loaded locally","ok");}
function setStatus(t,c=""){statusEl.textContent=t;statusEl.className="status "+c;}
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function add(role,text){const el=document.createElement("div");el.className="msg "+role;el.innerHTML='<div class="msg-label">'+(role==="user"?"YOU":"GEMINI")+'</div><div class="msg-text">'+esc(text).replace(/\n/g,"<br>")+'</div>';messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el;}
connect.onclick=()=>{key=keyEl.value.trim();if(!key)return setStatus("Enter an API key","bad");if(rememberEl.checked)localStorage.setItem("bruce_gemini_key",key);else localStorage.removeItem("bruce_gemini_key");setStatus("Connected","ok");};
rememberEl.onchange=()=>{if(!rememberEl.checked)localStorage.removeItem("bruce_gemini_key");else if(keyEl.value.trim())localStorage.setItem("bruce_gemini_key",keyEl.value.trim());};
async function ask(text){
 key=keyEl.value.trim()||localStorage.getItem("bruce_gemini_key")||"";
 if(!key){setStatus("Connect Gemini first","bad");add("assistant","Please enter your Gemini API key in the connection panel.");return;}
 add("user",text); history.push({role:"user",parts:[{text}]});
 const pending=add("assistant","Thinking…");
 try{
  const contents=[{role:"user",parts:[{text:SYSTEM}]},...history];
  const res=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({contents, generationConfig:{temperature:0.7,maxOutputTokens:1200}})});
  const data=await res.json();
  if(!res.ok) throw new Error(data?.error?.message||("Gemini request failed ("+res.status+")"));
  const answer=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"I received an empty response.";
  pending.querySelector(".msg-text").innerHTML=esc(answer).replace(/\n/g,"<br>");
  history.push({role:"model",parts:[{text:answer}]});
  setStatus("Connected","ok");
 }catch(err){pending.querySelector(".msg-text").textContent="Error: "+err.message;setStatus("Request failed","bad");}
 messages.scrollTop=messages.scrollHeight;
}
form.onsubmit=e=>{e.preventDefault();const t=promptEl.value.trim();if(!t)return;promptEl.value="";ask(t);};
promptEl.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit();}};
document.querySelectorAll(".quick").forEach(b=>b.onclick=()=>ask(b.dataset.prompt));
clear.onclick=()=>{history=[];messages.innerHTML='<div class="msg assistant"><div class="msg-label">GEMINI</div><div>Chat cleared. What would you like to explore?</div></div>';};
if("SpeechRecognition" in window || "webkitSpeechRecognition" in window){mic.onclick=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition,r=new R();r.lang="en-US";r.onstart=()=>mic.classList.add("listening");r.onend=()=>mic.classList.remove("listening");r.onresult=e=>{promptEl.value=e.results[0][0].transcript;promptEl.focus();};r.start();};}else mic.style.display="none";
})();