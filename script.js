(function(){
var OWNER_PW="owner123"; // change this
var $=function(i){return document.getElementById(i)};
var mem={};
function load(k,d){try{var v=localStorage.getItem("cl_"+k);return v?JSON.parse(v):d}catch(e){return k in mem?mem[k]:d}}
function save(k,v){mem[k]=v;try{localStorage.setItem("cl_"+k,JSON.stringify(v))}catch(e){toast("Storage is full or blocked. Changes last until you close the page.")}}
var users=load("users",[]),prods=load("prods",null),reqs=load("reqs",[]),sales=load("sales",[]),exps=load("exps",[]),role=load("role",null),filter="All";
if(!prods){prods=[
 {id:1,name:"Walnut Lounge Chair",price:18500,cat:"Living Room",type:"stock",mat:"Walnut, linen",dim:"70 x 80 x 85 cm",img:"",c:"#7a5a3c"},
 {id:2,name:"Sheesham Dining Table",price:42000,cat:"Dining Room",type:"pre",mat:"Sheesham",dim:"180 x 90 cm",img:"",c:"#5a3e2b"},
 {id:3,name:"Oak Platform Bed",price:36000,cat:"Bedroom",type:"stock",mat:"Oak",dim:"King size",img:"",c:"#a8825a"}];save("prods",prods)}
var cats=["All","In stock","Pre-order","Living Room","Bedroom","Dining Room","Outdoor","Decor"];
var money=function(n){return "\u20B9"+Number(n||0).toLocaleString("en-IN")};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
function toast(t){var e=$("toast");e.textContent=t;e.classList.remove("hidden");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.add("hidden")},2600)}
function readImg(file,cb){ // downscale to keep storage small
 if(!file){cb("");return}
 var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,900/im.width),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.78))};im.onerror=function(){cb("")};im.src=r.result};r.readAsDataURL(file)}

// auth
var tabs=document.querySelectorAll(".tabs button");
tabs.forEach(function(b){b.onclick=function(){tabs.forEach(function(x){x.setAttribute("aria-selected",x===b)});["login","register","owner"].forEach(function(t){$("t-"+t).classList.toggle("hidden",t!==b.dataset.tab)});$("auth-msg").textContent=""}});
function err(m){$("auth-msg").textContent=m}
$("b-login").onclick=function(){var id=$("l-id").value.trim().toLowerCase(),pw=$("l-pw").value;
 var u=users.find(function(u){return (u.email.toLowerCase()===id||u.phone===id)&&u.pw===pw});
 if(!u)return err("No account matches those details. Check them or register.");role="customer";save("role",role);enter()};
$("b-register").onclick=function(){var n=$("r-name").value.trim(),p=$("r-phone").value.trim(),e=$("r-email").value.trim(),w=$("r-pw").value;
 if(!n||!p||!e||w.length<6)return err("Fill every field. Password needs 6 or more characters.");
 if(users.some(function(u){return u.email.toLowerCase()===e.toLowerCase()}))return err("That email is already registered. Sign in instead.");
 users.push({name:n,phone:p,email:e,pw:w});save("users",users);role="customer";save("role",role);enter()};
$("b-owner").onclick=function(){if($("o-pw").value!==OWNER_PW)return err("Wrong owner password.");role="owner";save("role",role);enter()};
$("logout").onclick=function(){role=null;save("role",null);$("app").classList.add("hidden");$("auth").classList.remove("hidden");window.scrollTo(0,0)};
function enter(){$("auth").classList.add("hidden");$("app").classList.remove("hidden");var o=role==="owner";$("admin").classList.toggle("hidden",!o);$("nav-admin").classList.toggle("hidden",!o);render()}

// shop
function renderShop(){
 $("chips").innerHTML=cats.map(function(c){return '<button class="chip" aria-pressed="'+(c===filter)+'" data-c="'+c+'">'+c+'</button>'}).join("");
 $("chips").querySelectorAll(".chip").forEach(function(b){b.onclick=function(){filter=b.dataset.c;renderShop()}});
 var l=prods.filter(function(p){return filter==="All"||(filter==="In stock"&&p.type==="stock")||(filter==="Pre-order"&&p.type==="pre")||p.cat===filter});
 $("grid").innerHTML=l.length?l.map(function(p){
  var bg=p.img?'background-image:url('+p.img+')':'background:linear-gradient(150deg,'+(p.c||"#4a6b60")+',#1c2c26)';
  return '<article class="item"><div class="thumb" style="'+bg+'">'+(p.img?"":esc(p.name[0]))+'<span class="tag">'+(p.type==="pre"?"Pre-order":"In stock")+'</span></div><div class="body"><h3>'+esc(p.name)+'</h3><small>'+esc(p.cat)+(p.mat?" \u2022 "+esc(p.mat):"")+(p.dim?" \u2022 "+esc(p.dim):"")+'</small><div class="price">'+money(p.price)+'<button class="btn sm" data-o="'+p.id+'">'+(p.type==="pre"?"Pre-order":"Order")+'</button></div></div></article>'}).join(""):'<div class="empty">No products in this collection yet.</div>';
 $("grid").querySelectorAll("[data-o]").forEach(function(b){b.onclick=function(){var p=prods.find(function(x){return x.id==b.dataset.o});window.open("https://wa.me/?text="+encodeURIComponent("Hi, I want to "+(p.type==="pre"?"pre-order":"order")+": "+p.name+" ("+money(p.price)+")"),"_blank","noopener")}})}

// custom request
var cImg="";
$("c-file").onchange=function(e){readImg(e.target.files[0],function(d){cImg=d;var p=$("c-prev");if(d){p.src=d;p.classList.remove("hidden")}else p.classList.add("hidden")})};
$("c-send").onclick=function(){var n=$("c-name").value.trim(),p=$("c-phone").value.trim();
 if(!cImg||!n||!p)return toast("Add a reference image, your name and WhatsApp number.");
 reqs.unshift({id:Date.now(),img:cImg,name:n,phone:p,spec:$("c-size").value+" | "+$("c-wood").value+(($("c-notes").value)?" | "+$("c-notes").value:""),budget:$("c-budget").value});
 save("reqs",reqs);["c-name","c-phone","c-size","c-budget","c-notes","c-file"].forEach(function(i){$(i).value=""});cImg="";$("c-prev").classList.add("hidden");toast("Request sent. We will message you on WhatsApp.");render()};

// admin
$("p-add").onclick=function(){var n=$("p-name").value.trim(),pr=$("p-price").value;
 if(!n||!pr)return toast("Product name and price are required.");
 readImg($("p-file").files[0],function(d){prods.unshift({id:Date.now(),name:n,price:+pr,cat:$("p-cat").value,type:$("p-type").value,mat:$("p-mat").value,dim:$("p-dim").value,img:d});save("prods",prods);["p-name","p-price","p-mat","p-dim","p-file"].forEach(function(i){$(i).value=""});toast("Published to shop.");render()})};
$("sa-add").onclick=function(){var a=+$("sa-a").value;if(!a)return toast("Enter a sale amount.");sales.push({d:$("sa-d").value,a:a});save("sales",sales);$("sa-d").value=$("sa-a").value="";toast("Sale added.");render()};
$("ex-add").onclick=function(){var a=+$("ex-a").value;if(!a)return toast("Enter an expense amount.");exps.push({d:$("ex-d").value,a:a});save("exps",exps);$("ex-d").value=$("ex-a").value="";toast("Expense added.");render()};
function renderAdmin(){
 var r=sales.reduce(function(s,x){return s+x.a},0),e=exps.reduce(function(s,x){return s+x.a},0),n=r-e;
 $("s-rev").textContent=money(r);$("s-exp").textContent=money(e);$("s-net").textContent=money(n);$("s-net").className=n>=0?"pos":"neg";$("s-cnt").textContent=prods.length;
 $("reqs").innerHTML=reqs.length?reqs.map(function(q){return '<tr><td><img src="'+q.img+'" alt=""></td><td>'+esc(q.name)+'</td><td><a href="https://wa.me/'+esc(q.phone.replace(/\D/g,""))+'" target="_blank" rel="noopener">'+esc(q.phone)+'</a></td><td>'+esc(q.spec)+'</td><td>'+esc(q.budget)+'</td><td><button class="btn danger sm" data-dr="'+q.id+'">Delete</button></td></tr>'}).join(""):'<tr><td colspan="6" style="color:var(--muted)">No requests yet. They appear here when customers send a design.</td></tr>';
 $("plist").innerHTML=prods.map(function(p){return '<tr><td>'+esc(p.name)+'</td><td>'+esc(p.cat)+'</td><td>'+money(p.price)+'</td><td style="text-align:right"><button class="btn danger sm" data-dp="'+p.id+'">Remove</button></td></tr>'}).join("");
 document.querySelectorAll("[data-dr]").forEach(function(b){b.onclick=function(){reqs=reqs.filter(function(x){return x.id!=b.dataset.dr});save("reqs",reqs);render()}});
 document.querySelectorAll("[data-dp]").forEach(function(b){b.onclick=function(){prods=prods.filter(function(x){return x.id!=b.dataset.dp});save("prods",prods);render()}})}
function render(){renderShop();if(role==="owner")renderAdmin();reveal()}

// smooth scroll effects (IntersectionObserver)
var prog=document.createElement("div");prog.id="prog";document.body.appendChild(prog);
var navEl=document.querySelector("nav"),tick=false;
window.addEventListener("scroll",function(){if(tick)return;tick=true;requestAnimationFrame(function(){var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform="scaleX("+(h>0?scrollY/h:0)+")";navEl.classList.toggle("scrolled",scrollY>10);tick=false})},{passive:true});
var io=null,calm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if("IntersectionObserver" in window&&!calm){io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;t.classList.add("in");io.unobserve(t);setTimeout(function(){t.classList.remove("rv","in");t.style.removeProperty("--d")},1100)})},{threshold:.12,rootMargin:"0px 0px -6% 0px"})}
function reveal(){if(!io)return;var groups=[".hero2 h1",".hero2 .sub",".bento div",".sec-head",".item","#custom .split>*",".stat","#admin .card"];
 groups.forEach(function(g){document.querySelectorAll(g).forEach(function(el,i){if(el.dataset.rv)return;el.dataset.rv=1;el.classList.add("rv");el.style.setProperty("--d",Math.min(i%6,5)*90+"ms");io.observe(el)})})}
var _enter=enter;enter=function(){_enter();var a=$("app");a.classList.remove("app-in");void a.offsetWidth;a.classList.add("app-in");window.scrollTo(0,0)};
if(role)enter();
})();
