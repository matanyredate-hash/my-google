const KEY="money-manager-v1";let transactions=JSON.parse(localStorage.getItem(KEY)||"[]");let type="deposit";
const $=id=>document.getElementById(id), modal=$("modal");
function money(n){return new Intl.NumberFormat("he-IL",{style:"currency",currency:"ILS"}).format(n)}
function saveData(){localStorage.setItem(KEY,JSON.stringify(transactions))}
function render(){
  const income=transactions.filter(x=>x.type==="deposit").reduce((s,x)=>s+x.amount,0);
  const expense=transactions.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0);
  $("balance").textContent=money(income-expense);$("income").textContent=money(income);$("expenses").textContent=money(expense);
  $("count").textContent=transactions.length+" פעולות";$("empty").style.display=transactions.length?"none":"block";
  $("list").innerHTML=[...transactions].sort((a,b)=>new Date(b.dateCreated)-new Date(a.dateCreated)).map(x=>`<div class="item">
    <div class="item-main"><strong>${escapeHtml(x.description|| (x.type==="deposit"?"הפקדה":"הוצאה"))}</strong><small>${formatDate(x.date)}</small></div>
    <div class="item-right"><b class="${x.type==="deposit"?"plus":"minus"}">${x.type==="deposit"?"+":"−"}${money(x.amount)}</b><button class="delete" onclick="removeTx('${x.id}')">🗑️</button></div>
  </div>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function formatDate(d){return new Intl.DateTimeFormat("he-IL",{dateStyle:"medium"}).format(new Date(d+"T12:00:00"))}
function openModal(t){type=t;$("modalTitle").textContent=t==="deposit"?"הפקדה חדשה":"הוצאה חדשה";$("amount").value="";$("description").value="";$("date").value=new Date().toISOString().slice(0,10);modal.classList.remove("hidden");$("amount").focus()}
function closeModal(){modal.classList.add("hidden")}
document.querySelectorAll(".action").forEach(b=>b.onclick=()=>openModal(b.dataset.type));
$("close").onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
$("save").onclick=()=>{const amount=Number($("amount").value),description=$("description").value.trim(),date=$("date").value;if(!amount||amount<=0||!date){alert("נא למלא סכום ותאריך");return}transactions.push({id:crypto.randomUUID(),type,amount,description,date,dateCreated:new Date().toISOString()});saveData();render();closeModal()};
function removeTx(id){if(confirm("למחוק את הפעולה?")){transactions=transactions.filter(x=>x.id!==id);saveData();render()}}
$("clearAll").onclick=()=>{if(transactions.length&&confirm("למחוק את כל ההיסטוריה והיתרה?")){transactions=[];saveData();render()}}
render();