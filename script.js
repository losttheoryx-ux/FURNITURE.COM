/* ============================================
   CRAFTED LIVING — APP.JS
   ============================================ */
(function(){
var OWNER_PW="owner123";
var FB_CONFIG=null;
var OWNER_EMAIL="owner@example.com";
var OWNER_PHONE="9999999999";
var CLOUD=false,fdb=null,fauth=null;

if(FB_CONFIG&&window.firebase){
  try{
    firebase.initializeApp(FB_CONFIG);
    fdb=firebase.firestore();
    fauth=firebase.auth();
    CLOUD=true;
  }catch(e){}
}

var $=function(i){return document.getElementById(i)};
var mem={};

function load(k,d){
  try{
    var v=localStorage.getItem("cl_"+k);
    return v?JSON.parse(v):d;
  }catch(e){
    return k in mem?mem[k]:d;
  }
}

function save(k,v){
  mem[k]=v;
  try{
    localStorage.setItem("cl_"+k,JSON.stringify(v));
  }catch(e){
    toast("Storage is full or blocked. Changes last until you close the page.");
  }
}

var users=load("users",[]),
    prods=load("prods",null),
    reqs=load("reqs",[]),
    sales=load("sales",[]),
    exps=load("exps",[]),
    role=load("role",null),
    cur=load("cur",null),
    filter="All";

if(CLOUD) prods=[];
else if(!prods){
  prods=[
    {id:1,name:"Walnut Lounge Chair",qty:4,price:18500,cat:"Living Room",type:"stock",mat:"Walnut, linen",dim:"70 x 80 x 85 cm",img:"",c:"#7a5a3c"},
    {id:2,name:"Sheesham Dining Table",qty:2,price:42000,cat:"Dining Room",type:"pre",mat:"Sheesham",dim:"180 x 90 cm",img:"",c:"#5a3e2b"},
    {id:3,name:"Oak Platform Bed",qty:3,price:36000,cat:"Bedroom",type:"stock",mat:"Oak",dim:"King size",img:"",c:"#a8825a"}
  ];
  save("prods",prods);
}

var cats=["All","In stock","Pre-order","Living Room","Bedroom","Dining Room","Outdoor","Decor"];

var money=function(n){return "\u20B9"+Number(n||0).toLocaleString("en-IN")};
var esc=function(s){
  return String(s==null?"":s).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
};

function toast(t){
  var e=$("toast");
  e.textContent=t;
  e.classList.remove("hidden");
  clearTimeout(toast.t);
  toast.t=setTimeout(function(){e.classList.add("hidden")},2600);
}

function readImg(file,cb){
  if(!file){cb("");return}
  var r=new FileReader();
  r.onload=function(){
    var im=new Image();
    im.onload=function(){
      var s=Math.min(1,900/im.width),
          c=document.createElement("canvas");
      c.width=im.width*s;
      c.height=im.height*s;
      c.getContext("2d").drawImage(im,0,0,c.width,c.height);
      cb(c.toDataURL("image/jpeg",.78));
    };
    im.onerror=function(){cb("")};
    im.src=r.result;
  };
  r.readAsDataURL(file);
}

/* ================= AUTH ================= */
var tabs=document.querySelectorAll(".tabs button");
tabs.forEach(function(b){
  b.onclick=function(){
    tabs.forEach(function(x){x.setAttribute("aria-selected",x===b)});
    ["login","register","owner"].forEach(function(t){
      $("t-"+t).classList.toggle("hidden",t!==b.dataset.tab);
    });
    $("auth-msg").textContent="";
  };
});

function err(m){$("auth-msg").textContent=m}

$("b-login").onclick=function(){
  var id=$("l-id").value.trim().toLowerCase(),
      pw=$("l-pw").value;
  var u=users.find(function(u){
    return (u.email.toLowerCase()===id||u.phone===id)&&u.pw===pw;
  });
  if(!u) return err("No account matches those details. Check them or register.");
  role="customer";cur=u.email;
  save("cur",cur);save("role",role);
  enter();
};

$("b-register").onclick=function(){
  var n=$("r-name").value.trim(),
      p=$("r-phone").value.trim(),
      e=$("r-email").value.trim(),
      w=$("r-pw").value;
  if(!n||!p||!e||w.length<6) return err("Fill every field. Password needs 6 or more characters.");
  if(users.some(function(u){return u.email.toLowerCase()===e.toLowerCase()}))
    return err("That email is already registered. Sign in instead.");
  users.push({name:n,phone:p,email:e,pw:w,fav:[]});
  save("users",users);
  role="customer";cur=e;
  save("cur",cur);save("role",role);
  enter();
};

function ownerIn(){
  role="owner";cur=null;
  save("cur",null);save("role",role);
  enter();
}

var oMode="in", owners=load("owners",[]);

$("o-mode").onclick=function(e){
  var b=e.target.closest("[data-om]");
  if(!b) return;
  oMode=b.dataset.om;
  var r=oMode==="reg";
  $("o-mode").querySelectorAll(".chip").forEach(function(c){
    c.setAttribute("aria-pressed",c.dataset.om===oMode);
  });
  $("o-regf").classList.toggle("hidden",!r);
  $("o-id").classList.toggle("hidden",r);
  $("o-idl").classList.toggle("hidden",r);
  $("b-owner").textContent=r?"Create owner account":"Open dashboard";
  err("");
};

function ownerReg(){
  var n=$("o-name").value.trim(),
      e=$("o-email").value.trim().toLowerCase(),
      p=$("o-phone").value.trim(),
      w=$("o-pw").value;
  if(!n||!e||!p||w.length<6)
    return err("Fill every field. Password needs 6 or more characters.");
  if(CLOUD){
    if(e!==OWNER_EMAIL.toLowerCase())
      return err("This email is not allowed to register as owner.");
    fauth.createUserWithEmailAndPassword(e,w).then(function(){ownerIn()})
      .catch(function(x){
        err(x&&x.code==="auth/email-already-in-use"
          ?"That email is already registered. Sign in instead."
          :"Could not register. Try a stronger password.");
      });
    return;
  }
  if(owners.length) return err("An owner account already exists. Sign in instead.");
  owners.push({name:n,email:e,phone:p,pw:w});
  save("owners",owners);
  toast("Owner account created.");
  ownerIn();
}

$("b-owner").onclick=function(){
  if(oMode==="reg") return ownerReg();
  var pw=$("o-pw").value,
      oid=$("o-id").value.trim().toLowerCase();
  if(CLOUD){
    if(oid.indexOf("@")<0) return err("Use your owner email to sign in.");
    fauth.signInWithEmailAndPassword(oid,pw)
      .then(ownerIn)
      .catch(function(){err("Wrong email or password.")});
    return;
  }
  var ok=owners.length
    ? owners.some(function(o){return (o.email===oid||o.phone===oid)&&o.pw===pw})
    : ((oid===OWNER_EMAIL.toLowerCase()||oid===OWNER_PHONE)&&pw===OWNER_PW);
  if(!ok) return err("Wrong email, phone number or password.");
  ownerIn();
};

$("logout").onclick=function(){
  role=null;cur=null;
  save("cur",null);save("role",null);
  $("app").classList.add("hidden");
  $("auth").classList.remove("hidden");
  window.scrollTo(0,0);
};

function enter(){
  $("auth").classList.add("hidden");
  $("app").classList.remove("hidden");
  var o=role==="owner";
  document.body.classList.toggle("is-owner",o);
  $("badge").textContent=o?"Owner":(me()?me().name.split(" ")[0]:"Customer");
  $("admin").classList.toggle("hidden",!o);
  $("nav-admin").classList.toggle("hidden",!o);
  render();
}

/* ================= SHOP ================= */
function pst(p){
  return p.type==="stock"&&p.qty!=null&&p.qty<=0?"wait":p.type;
}

function tagText(p){
  var s=pst(p);
  return s==="wait"?"Waiting for stock":s==="pre"?"Pre-order":"In stock";
}

function leftLine(p){
  var s=pst(p);
  if(s==="wait") return '<small class="note">Currently not in stock</small>';
  if(s!=="stock"||p.qty==null) return "";
  return '<small style="font-weight:700;color:'+(p.qty<=3?"var(--danger)":"var(--muted)")+'">'+
    (p.qty<=3?"Only "+p.qty+" left":p.qty+" in stock")+'</small>';
}

function renderShop(){
  $("chips").innerHTML=cats.map(function(c){
    return '<button class="chip" aria-pressed="'+(c===filter)+'" data-c="'+c+'">'+c+'</button>';
  }).join("");
  $("chips").querySelectorAll(".chip").forEach(function(b){
    b.onclick=function(){filter=b.dataset.c;renderShop()};
  });

  var l=prods.filter(function(p){
    return filter==="All"
      ||(filter==="In stock"&&pst(p)==="stock")
      ||(filter==="Pre-order"&&p.type==="pre")
      ||p.cat===filter;
  });

  $("grid").innerHTML=l.length?l.map(function(p){
    var bg=p.img
      ?'background-image:url('+p.img+')'
      :'background:linear-gradient(150deg,'+(p.c||"#4a6b60")+',#1c2c26)';
    return '<article class="item"><div class="thumb" style="'+bg+'">'+
      (p.img?"":esc(p.name[0]))+
      '<span class="tag '+pst(p)+'">'+tagText(p)+'</span>'+
      '<button class="fav cust-only" data-f="'+p.id+'" aria-pressed="'+isFav(p.id)+'" aria-label="Save to my list">\u2665</button>'+
      '</div><div class="body"><h3>'+esc(p.name)+'</h3><small>'+esc(p.cat)+
      (p.mat?" \u2022 "+esc(p.mat):"")+
      (p.dim?" \u2022 "+esc(p.dim):"")+
      '</small>'+leftLine(p)+'<div class="price">'+money(p.price)+
      '<button class="btn sm" data-o="'+p.id+'"'+(pst(p)==="wait"?" disabled":"")+'>'+
      (pst(p)==="wait"?"Waiting":p.type==="pre"?"Pre-order":"Order")+
      '</button></div></div></article>';
  }).join(""):'<div class="empty">No products in this collection yet.</div>';

  $("grid").querySelectorAll("[data-o]").forEach(function(b){
    b.onclick=function(){
      var p=prods.find(function(x){return x.id==b.dataset.o});
      window.open("https://wa.me/?text="+encodeURIComponent(
        "Hi, I want to "+(p.type==="pre"?"pre-order":"order")+": "+p.name+" ("+money(p.price)+")"
      ),"_blank","noopener");
    };
  });
}

/* ================= CUSTOM REQUEST ================= */
var cImg="";
$("c-file").onchange=function(e){
  readImg(e.target.files[0],function(d){
    cImg=d;
    var p=$("c-prev");
    if(d){p.src=d;p.classList.remove("hidden")}
    else p.classList.add("hidden");
  });
};

$("c-send").onclick=function(){
  var n=$("c-name").value.trim(),
      p=$("c-phone").value.trim();
  if(!cImg||!n||!p)
    return toast("Add a reference image, your name and WhatsApp number.");
  reqs.unshift({
    id:Date.now(),
    img:cImg,
    name:n,
    phone:p,
    by:cur,
    status:"New",
    spec:$("c-size").value+" | "+$("c-wood").value+
      (($("c-notes").value)?" | "+$("c-notes").value:""),
    budget:$("c-budget").value
  });
  save("reqs",reqs);
  ["c-name","c-phone","c-size","c-budget","c-notes","c-file"].forEach(function(i){$(i).value=""});
  cImg="";
  $("c-prev").classList.add("hidden");
  toast("Request sent. We will message you on WhatsApp.");
  render();
};

/* ================= ADMIN ================= */
$("p-add").onclick=function(){
  var n=$("p-name").value.trim(),
      pr=$("p-price").value;
  if(!n||!pr) return toast("Product name and price are required.");
  readImg($("p-file").files[0],function(d){
    var p={
      name:n,
      price:+pr,
      cat:$("p-cat").value,
      type:$("p-type").value,
      mat:$("p-mat").value,
      dim:$("p-dim").value,
      img:d,
      qty:Math.max(0,Math.floor(+$("p-qty").value||0)),
      t:Date.now()
    };
    function done(){
      ["p-name","p-price","p-mat","p-dim","p-file"].forEach(function(i){$(i).value=""});
      toast("Published to shop.");
    }
    if(CLOUD){
      if(d.length>900000) return toast("Photo is too large. Use a smaller image.");
      fdb.collection("products").add(p).then(done)
        .catch(function(){toast("Could not publish. Sign in as owner again.")});
      return;
    }
    p.id=p.t;
    prods.unshift(p);
    save("prods",prods);
    done();
    render();
  });
};

function renderAdmin(){
  var r=sales.reduce(function(s,x){return s+x.a},0),
      e=exps.reduce(function(s,x){return s+x.a},0),
      n=r-e;
  $("s-rev").textContent=money(r);
  $("s-exp").textContent=money(e);
  $("s-nl").textContent=n>=0?"Profit":"Loss";
  $("s-net").textContent=money(Math.abs(n));
  $("s-net").className=n>=0?"pos":"neg";
  $("s-cnt").textContent=prods.length+" ("+prods.reduce(function(s,p){return s+(p.qty||0)},0)+" units)";
  renderWhole();

  $("reqs").innerHTML=reqs.length?reqs.map(function(q){
    return '<tr><td><img src="'+q.img+'" alt=""></td><td>'+esc(q.name)+
      '</td><td><a href="https://wa.me/'+esc(q.phone.replace(/\D/g,""))+'" target="_blank" rel="noopener">'+esc(q.phone)+
      '</a></td><td>'+esc(q.spec)+'</td><td>'+esc(q.budget)+
      '</td><td><select class="st" data-st="'+q.id+'">'+
      ["New","Quoted","In progress","Done"].map(function(s){
        return '<option'+((q.status||"New")===s?" selected":"")+'>'+s+'</option>';
      }).join("")+
      '</select></td><td><button class="btn danger sm" data-dr="'+q.id+'">Delete</button></td></tr>';
  }).join(""):'<tr><td colspan="7" style="color:var(--muted)">No requests yet. They appear here when customers send a design.</td></tr>';

  $("plist").innerHTML=prods.map(function(p){
    var s=pst(p);
    return '<tr><td>'+(p.img?'<img src="'+p.img+'" alt="">':'')+
      '</td><td><b>'+esc(p.name)+'</b><br><small class="note">'+esc(p.cat)+' \u2022 '+money(p.price)+
      '</small></td><td><span class="qty"><button data-qm="'+p.id+'" aria-label="Less">\u2212</button><b>'+
      (p.qty==null?"-":p.qty)+
      '</b><button data-qp="'+p.id+'" aria-label="More">+</button></span></td><td><select class="st" data-ps="'+p.id+'">'+
      '<option value="stock"'+(s==="stock"?" selected":"")+'>In stock</option>'+
      '<option value="wait"'+(s==="wait"?" selected":"")+'>Waiting (not in stock)</option>'+
      '<option value="pre"'+(s==="pre"?" selected":"")+'>Pre-order</option>'+
      '</select></td><td style="text-align:right"><button class="btn danger sm" data-dp="'+p.id+'">Delete</button></td></tr>';
  }).join("")||'<tr><td style="color:var(--muted)">No products yet. Upload your first one above.</td></tr>';

  document.querySelectorAll("[data-dr]").forEach(function(b){
    b.onclick=function(){
      reqs=reqs.filter(function(x){return x.id!=b.dataset.dr});
      save("reqs",reqs);
      render();
    };
  });
  document.querySelectorAll("[data-dp]").forEach(function(b){
    b.onclick=function(){
      if(CLOUD){
        fdb.collection("products").doc(b.dataset.dp).delete()
          .catch(function(){toast("Could not remove. Sign in as owner again.")});
        return;
      }
      prods=prods.filter(function(x){return x.id!=b.dataset.dp});
      save("prods",prods);
      render();
    };
  });
}

function me(){
  return users.find(function(u){return u.email===cur})||null;
}

function isFav(id){
  var u=me();
  return !!(u&&u.fav&&u.fav.map(String).indexOf(String(id))>-1);
}

document.addEventListener("click",function(e){
  var f=e.target.closest&&e.target.closest("[data-f]");
  if(f){
    var u=me();
    if(!u) return toast("Sign in again to save items.");
    u.fav=u.fav||[];
    var id=String(f.dataset.f),
        i=u.fav.map(String).indexOf(id);
    if(i>-1){u.fav.splice(i,1);toast("Removed from saved items.")}
    else{u.fav.push(id);toast("Saved to your account.")}
    save("users",users);
    renderShop();
    renderMe();
    return;
  }
  var s=e.target.closest&&e.target.closest("[data-sd]");
  if(s){
    var k=s.dataset.sd.split(":"),
        arr=k[0]==="s"?sales:exps;
    arr.splice(+k[1],1);
    save(k[0]==="s"?"sales":"exps",arr);
    render();
  }
});

document.addEventListener("change",function(e){
  var t=e.target;
  if(t.dataset&&t.dataset.st){
    var q=reqs.find(function(x){return x.id==t.dataset.st});
    if(q){q.status=t.value;save("reqs",reqs);toast("Status updated.")}
  }
});

function renderMe(){
  if(role==="owner") return;
  var u=me();
  $("me-title").textContent=u?"Hi, "+u.name.split(" ")[0]:"My account";
  var fv=prods.filter(function(p){return isFav(p.id)});
  $("favs").innerHTML=fv.length?fv.map(function(p){
    return '<div class="mini"><span>'+esc(p.name)+'</span><b>'+money(p.price)+
      '</b><button class="btn ghost sm" data-f="'+p.id+'">Remove</button></div>';
  }).join(""):'<p class="note">Tap the heart on any product to save it here.</p>';
  var mine=reqs.filter(function(q){return q.by&&q.by===cur});
  $("myreqs").innerHTML=mine.length?mine.map(function(q){
    return '<div class="mini"><img src="'+q.img+'" alt=""><span>'+esc(q.spec)+
      '</span><b class="pill">'+esc(q.status||"New")+'</b></div>';
  }).join(""):'<p class="note">Design requests you send will show here with their progress.</p>';
  if(u){
    if(!$("c-name").value)$("c-name").value=u.name;
    if(!$("c-phone").value)$("c-phone").value=u.phone;
  }
}

/* ================= P&L ================= */
var plP="week";
sales.concat(exps).forEach(function(x){if(!x.t)x.t=Date.now()});
var _n=new Date();
_n.setMinutes(_n.getMinutes()-_n.getTimezoneOffset());
$("pl-date").value=_n.toISOString().slice(0,10);

function dayKey(t){
  var d=new Date(t);
  return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
}

function short(v){
  var a=Math.abs(v),
      s=a>=100000?(a/100000).toFixed(1).replace(".0","")+"L"
        :a>=1000?(a/1000).toFixed(1).replace(".0","")+"k"
        :String(Math.round(a));
  return (v<0?"-":"")+s;
}

function buckets(){
  var out=[],now=new Date(),i,b;
  function mk(label,test){
    b={l:label,s:0,e:0};
    sales.forEach(function(x){if(test(x.t))b.s+=x.a});
    exps.forEach(function(x){if(test(x.t))b.e+=x.a});
    out.push(b);
  }
  if(plP==="year"){
    for(i=11;i>=0;i--){
      var md=new Date(now.getFullYear(),now.getMonth()-i,1);
      (function(y,m){
        mk(new Date(y,m,1).toLocaleString("en",{month:"short"}),function(t){
          var q=new Date(t);
          return q.getFullYear()===y&&q.getMonth()===m;
        });
      })(md.getFullYear(),md.getMonth());
    }
  } else {
    var n=plP==="week"?7:30;
    for(i=n-1;i>=0;i--){
      var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);
      (function(k,dd,idx){
        mk(plP==="week"
          ? dd.toLocaleString("en",{weekday:"short"})
          : (idx%5===0||idx===n-1?String(dd.getDate()):""),
          function(t){return dayKey(t)===k});
      })(dayKey(d),d,i);
    }
  }
  return out;
}

function pStart(){
  var n=new Date();
  return plP==="year"
    ? new Date(n.getFullYear(),n.getMonth()-11,1).getTime()
    : new Date(n.getFullYear(),n.getMonth(),n.getDate()-(plP==="week"?6:29)).getTime();
}

var TYPES=["Living Room","Bedroom","Dining Room","Outdoor","Decor","General"];

function renderTypes(){
  var st=pStart(),
      rows=TYPES.map(function(c){
        var s=0,e=0;
        sales.forEach(function(x){if(x.t>=st&&(x.c||"General")===c)s+=x.a});
        exps.forEach(function(x){if(x.t>=st&&(x.c||"General")===c)e+=x.a});
        return {c:c,s:s,e:e,n:s-e,p:prods.filter(function(p){return p.cat===c}).length};
      });
  var tot=rows.reduce(function(a,r){return a+r.s},0),
      best=rows.reduce(function(a,r){return r.n>a.n?r:a},{n:0});
  $("pl-types").innerHTML=rows.map(function(r){
    var w=tot?Math.round(r.s/tot*100):0;
    return '<div class="tp"><h4>'+r.c+(best.c===r.c&&r.n>0?" \u2605":"")+
      '</h4><small>'+r.p+(r.p===1?" product":" products")+
      '</small><div class="r"><span>Sales</span><b>'+money(r.s)+
      '</b></div><div class="r"><span>Expenses</span><b>'+money(r.e)+
      '</b></div><div class="r"><span>'+(r.n>=0?"Profit":"Loss")+
      '</span><b class="'+(r.n>=0?"pos":"neg")+'">'+money(Math.abs(r.n))+
      '</b></div><div class="bar" title="Share of sales"><i style="width:'+w+'%"></i></div></div>';
  }).join("");
}

/* layout reflow */
var plCard=$("pl-tabs").closest(".card"),
    topStats=document.querySelector("#admin .wrap>.stats");
var dashCard=document.createElement("div");
dashCard.className="card";
dashCard.style.cssText="width:100%;margin-top:20px";
dashCard.innerHTML='<h3 style="font-size:26px;margin-bottom:12px">Dashboard: total sales and purchases</h3>';
dashCard.appendChild(topStats);
topStats.style.marginBottom="0";
plCard.before(dashCard);

var tyCard=document.createElement("div");
tyCard.className="card";
tyCard.style.cssText="width:100%;margin-top:20px";
tyCard.innerHTML='<h3 style="font-size:26px">Furniture types</h3><p class="note" style="margin:6px 0 0">Products, sales and profit for each type, for the period chosen in the dashboard above. The star marks the most profitable type.</p>';
tyCard.appendChild($("pl-types"));
plCard.after(tyCard);

var wr=$("admin").querySelector(".wrap");
wr.style.display="flex";
wr.style.flexDirection="column";

/* wholesale */
var whCard=document.createElement("div");
whCard.className="card";
whCard.style.cssText="width:100%;margin-top:20px";
whCard.innerHTML='<h3 style="font-size:26px">Wholesale purchases</h3><p class="note" style="margin:6px 0 0">Record furniture you buy in bulk from wholesalers. The cost is added to your total purchases, and you can add the quantity to a product in your shop.</p><div class="row2"><div><label for="w-sup">Wholesaler name</label><input id="w-sup"></div><div><label for="w-item">Item bought</label><input id="w-item"></div><div><label for="w-qty">Quantity</label><input id="w-qty" type="number" min="1"></div><div><label for="w-cost">Cost per piece</label><input id="w-cost" type="number" min="0"></div><div><label for="w-date">Date</label><input id="w-date" type="date"></div><div><label for="w-prod">Add stock to product</label><select id="w-prod"></select></div></div><div id="w-total" class="note" style="margin-top:10px"></div><button class="btn" id="w-add" style="width:auto">Save purchase</button><h3 style="font-size:20px;margin:22px 0 0">Recent bulk purchases</h3><div id="w-list"></div>';
wr.appendChild(whCard);
$("w-date").value=$("pl-date").value;

["w-qty","w-cost"].forEach(function(i){
  $(i).oninput=function(){
    var t=(+$("w-qty").value||0)*(+$("w-cost").value||0);
    $("w-total").textContent=t?"Total cost: "+money(t):"";
  };
});

function patchProd(id,o){
  if(CLOUD){
    fdb.collection("products").doc(String(id)).update(o)
      .catch(function(){toast("Could not update. Sign in as owner again.")});
    return;
  }
  var p=prods.find(function(x){return x.id==id});
  if(p){Object.assign(p,o);save("prods",prods);render()}
}

document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-qm],[data-qp]");
  if(!b) return;
  var id=b.dataset.qm||b.dataset.qp,
      p=prods.find(function(x){return x.id==id});
  if(p) patchProd(id,{qty:Math.max(0,(p.qty||0)+(b.dataset.qp?1:-1))});
});

document.addEventListener("change",function(e){
  var t=e.target;
  if(t.dataset&&t.dataset.ps){
    var p=prods.find(function(x){return x.id==t.dataset.ps}),
        o={type:t.value};
    if(p&&t.value==="stock"&&(p.qty||0)<=0)o.qty=1;
    patchProd(t.dataset.ps,o);
  }
});

$("w-add").onclick=function(){
  var sup=$("w-sup").value.trim(),
      item=$("w-item").value.trim(),
      q=Math.floor(+$("w-qty").value),
      c=+$("w-cost").value;
  if(!sup||!item||!(q>0)||$("w-cost").value===""||c<0)
    return toast("Fill wholesaler, item, quantity and cost.");
  var dv=$("w-date").value,
      pid=$("w-prod").value,
      pr=prods.find(function(x){return x.id==pid});
  exps.push({
    d:item+" from "+sup,
    a:q*c,
    c:pr?pr.cat:"General",
    t:dv?new Date(dv+"T12:00:00").getTime():Date.now(),
    w:1,sup:sup,item:item,q:q,u:c
  });
  save("exps",exps);
  if(pr)patchProd(pr.id,{qty:(pr.qty||0)+q,type:"stock"});
  ["w-sup","w-item","w-qty","w-cost"].forEach(function(i){$(i).value=""});
  $("w-total").textContent="";
  toast("Purchase saved.");
  render();
};

function renderWhole(){
  var ws=[];
  exps.forEach(function(x,i){if(x.w)ws.push({x:x,i:i})});
  ws.sort(function(a,b){return b.x.t-a.x.t});
  var tot=ws.reduce(function(s,r){return s+r.x.a},0),
      sel=$("w-prod"),v=sel.value;
  sel.innerHTML='<option value="">Do not add to a product</option>'+
    prods.map(function(p){return '<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>'}).join("");
  if(v)sel.value=v;
  $("w-list").innerHTML=ws.length
    ?'<p class="note">Total bought in bulk: <b>'+money(tot)+'</b> from '+
     new Set(ws.map(function(r){return r.x.sup})).size+' wholesaler(s)</p>'+
     ws.slice(0,8).map(function(r){
       var x=r.x;
       return '<div class="mini"><span><b>'+esc(x.item)+'</b><br><small class="note">'+
         esc(x.sup)+' \u2022 '+x.q+' \u00D7 '+money(x.u)+' \u2022 '+
         new Date(x.t).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+
         '</small></span><b>'+money(x.a)+'</b><button class="btn danger sm" data-sd="e:'+r.i+'">Delete</button></div>';
     }).join("")
    :'<p class="note">No bulk purchases yet.</p>';
}

wr.querySelector(":scope>.sec-head").style.order=0;
$("p-add").closest(".card").style.order=1;
$("plist").closest(".card").style.order=2;
$("reqs").closest(".card").style.order=3;
dashCard.style.order=4;
plCard.style.order=5;
tyCard.style.order=6;
whCard.style.order=7;

$("pl-tabs").onclick=function(e){
  var t=e.target.closest("[data-p]");
  if(t){plP=t.dataset.p;renderPL()}
};

$("pl-add").onclick=function(){
  var a=+$("pl-amt").value;
  if(!a||a<0) return toast("Enter an amount.");
  var dv=$("pl-date").value,
      r={
        d:$("pl-desc").value.trim(),
        a:a,
        c:$("pl-cat").value,
        t:dv?new Date(dv+"T12:00:00").getTime():Date.now()
      };
  if($("pl-type").value==="sale"){sales.push(r);save("sales",sales)}
  else{exps.push(r);save("exps",exps)}
  $("pl-amt").value=$("pl-desc").value="";
  toast("Entry added.");
  render();
};

function renderPL(){
  var bs=buckets(),S=0,E=0;
  bs.forEach(function(b){S+=b.s;E+=b.e;b.n=b.s-b.e});
  var N=S-E;
  document.querySelectorAll("#pl-tabs .chip").forEach(function(c){
    c.setAttribute("aria-pressed",c.dataset.p===plP);
  });
  $("pl-cap").textContent=({week:"Last 7 days",month:"Last 30 days",year:"Last 12 months"})[plP]+
    ": sales "+money(S)+", purchases "+money(E)+", "+(N>=0?"profit ":"loss ")+money(Math.abs(N))+".";
  var W=720,H=280,L=52,R=12,T=14,B=30,hi=0,lo=0;
  bs.forEach(function(b){hi=Math.max(hi,b.s,b.e,b.n);lo=Math.min(lo,b.n)});
  if(hi===lo)hi=lo+1;
  var y=function(v){return T+(hi-v)/(hi-lo)*(H-T-B)},
      cw=(W-L-R)/bs.length,
      bw=Math.max(2,Math.min(22,cw*.34)),
      g="",pts=[],
      txt="text-anchor:middle;fill:var(--muted);font-size:11px";
  for(var k=0;k<=4;k++){
    var v=lo+(hi-lo)*k/4;
    g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(v)+'" y2="'+y(v)+'" style="stroke:var(--line)"/><text x="'+(L-8)+'" y="'+(y(v)+4)+'" style="text-anchor:end;fill:var(--muted);font-size:11px">'+short(v)+'</text>';
  }
  g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(0)+'" y2="'+y(0)+'" style="stroke:var(--muted)"/>';
  bs.forEach(function(b,i){
    var cx=L+cw*i+cw/2;
    g+='<rect x="'+(cx-bw-1)+'" y="'+Math.min(y(b.s),y(0))+'" width="'+bw+'" height="'+Math.abs(y(0)-y(b.s))+'" rx="3" fill="#2a9d6a"/><rect x="'+(cx+1)+'" y="'+Math.min(y(b.e),y(0))+'" width="'+bw+'" height="'+Math.abs(y(0)-y(b.e))+'" rx="3" fill="#e0553d"/><text x="'+cx+'" y="'+(H-10)+'" style="'+txt+'">'+b.l+'</text>';
    pts.push(cx+","+y(b.n));
  });
  g+='<polyline points="'+pts.join(" ")+'" fill="none" stroke-width="2.5" stroke-linejoin="round" style="stroke:var(--ink)"/>';
  pts.forEach(function(p){
    var c=p.split(",");
    g+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="3" style="fill:var(--ink)"/>';
  });
  if(!S&&!E)g+='<text x="'+W/2+'" y="'+H/2+'" style="text-anchor:middle;fill:var(--muted);font-size:14px">No entries in this period</text>';
  $("pl-chart").innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Profit and loss chart">'+g+'</svg>';
  var all=[];
  sales.forEach(function(x,i){all.push({k:"s",i:i,x:x})});
  exps.forEach(function(x,i){all.push({k:"e",i:i,x:x})});
  all.sort(function(a,b){return b.x.t-a.x.t});
  $("pl-list").innerHTML=all.slice(0,8).map(function(r){
    return '<div class="mini"><b class="kind k-'+r.k+'">'+(r.k==="s"?"Sale":"Expense")+
      '</b><span>'+esc(r.x.d||"No note")+' <small class="note">'+esc(r.x.c||"General")+
      " \u2022 "+new Date(r.x.t).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+
      '</small></span><b>'+money(r.x.a)+'</b><button class="btn danger sm" data-sd="'+r.k+':'+r.i+'">Delete</button></div>';
  }).join("")||'<p class="note">No entries yet. Add a sale or expense to see your chart.</p>';
  renderTypes();
}

/* ================= MAIN RENDER ================= */
function render(){
  renderShop();
  if(role==="owner"){renderAdmin();renderPL()}
  else renderMe();
  reveal();
}

/* ================= SCROLL ================= */
var navEl=document.querySelector("nav"),tick=false;
window.addEventListener("scroll",function(){
  if(tick)return;
  tick=true;
  requestAnimationFrame(function(){
    var h=document.documentElement.scrollHeight-innerHeight;
    document.getElementById("prog").style.transform="scaleX("+(h>0?scrollY/h:0)+")";
    navEl.classList.toggle("scrolled",scrollY>10);
    tick=false;
  });
},{passive:true});

/* ================= REVEAL ================= */
var io=null,
    calm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if("IntersectionObserver" in window&&!calm){
  io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var t=e.target;
      if(e.isIntersecting){t.classList.remove("up");t.classList.add("in")}
      else{t.classList.remove("in");t.classList.toggle("up",e.boundingClientRect.top<0)}
    });
  },{threshold:.08,rootMargin:"-4% 0px -6% 0px"});
}

function reveal(){
  if(!io)return;
  var groups=[".hero2 h1",".hero2 .sub",".bento div",".sec-head",".item","#custom .split>*",".stat","#admin .card"];
  groups.forEach(function(g){
    document.querySelectorAll(g).forEach(function(el,i){
      if(el.dataset.rv)return;
      el.dataset.rv=1;
      el.classList.add("rv");
      el.style.setProperty("--d",Math.min(i%6,5)*90+"ms");
      io.observe(el);
    });
  });
}

/* ================= APP ENTRANCE ================= */
var _enter=enter;
enter=function(){
  _enter();
  var a=$("app");
  a.classList.remove("app-in");
  void a.offsetWidth;
  a.classList.add("app-in");
  window.scrollTo(0,0);
};

/* ================= 3D TILT ================= */
if(window.matchMedia&&matchMedia("(hover:hover)").matches&&!calm){
  var TS=".item,.bento div,.stat";
  document.addEventListener("pointermove",function(e){
    var el=e.target.closest&&e.target.closest(TS);
    if(!el)return;
    var r=el.getBoundingClientRect(),
        x=(e.clientX-r.left)/r.width,
        y=(e.clientY-r.top)/r.height;
    el.style.setProperty("--ry",((x-.5)*14).toFixed(2)+"deg");
    el.style.setProperty("--rx",((.5-y)*14).toFixed(2)+"deg");
    el.style.setProperty("--mx",(x*100).toFixed(1)+"%");
    el.style.setProperty("--my",(y*100).toFixed(1)+"%");
  });
  document.addEventListener("pointerout",function(e){
    var el=e.target.closest&&e.target.closest(TS);
    if(el&&!el.contains(e.relatedTarget)){
      el.style.setProperty("--rx","0deg");
      el.style.setProperty("--ry","0deg");
    }
  });
}

/* ================= CLOUD PRODUCTS ================= */
if(CLOUD){
  fdb.collection("products").orderBy("t","desc").onSnapshot(function(s){
    prods=s.docs.map(function(d){var o=d.data();o.id=d.id;return o});
    renderShop();
    if(role==="owner")renderAdmin();
    else renderMe();
    reveal();
  },function(){toast("Could not load products.")});
}

if(role)enter();

})();
