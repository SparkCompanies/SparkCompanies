
document.getElementById('yr').textContent=new Date().getFullYear();
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal').forEach(function(el){reduce?el.classList.add('in'):io.observe(el);});
function ac(el){var t=+el.getAttribute('data-count'),s=el.getAttribute('data-suffix')||'';if(reduce){el.textContent=t.toLocaleString()+s;return;}var d=1400,s0=null;function st(ts){if(!s0)s0=ts;var p=Math.min((ts-s0)/d,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(t*e).toLocaleString()+s;if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);}
var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){ac(e.target);co.unobserve(e.target);}});},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(function(el){co.observe(el);});
var wm=document.getElementById('wm'), prog=document.getElementById('progress'), totop=document.getElementById('totop');
function onScroll(){
  var st=document.documentElement.scrollTop||document.body.scrollTop;
  var h=document.documentElement.scrollHeight-window.innerHeight;
  prog.style.width=(h>0?st/h*100:0)+'%';
  totop.classList.toggle('show', st>700);
  if(!reduce && wm) wm.style.transform='translate(-50%,-50%) translateY('+(st*0.12)+'px)';
}
document.addEventListener('scroll',onScroll,{passive:true}); onScroll();

/* ============================================================
   PRICING CONFIG — ALL PLACEHOLDER VALUES
   Every number below is a stand-in. Replace with Spark's real
   rates before launch; the whole configurator reads from here.
   ============================================================ */
var PRICING = {
  aso: {
    label: 'Administrative Services (ASO)',
    lead: 'Payroll, benefits and compliance administration — you keep full control of your workforce. Priced per team member, per month.',
    term: 'Billed monthly · Cancel anytime',
    plans: [
      {id:'core', nm:'Core', rate:18, ds:'Payroll processing and tax administration handled end to end.', tags:['Payroll','Tax Filing','Direct Deposit']},
      {id:'complete', nm:'Complete', rate:32, ds:'Everything in Core, plus full benefits administration and enrollment support.', tags:['+ Benefits Admin','Open Enrollment','COBRA']},
      {id:'full', nm:'Full Service', rate:47, ds:'Everything in Complete, plus HR compliance, risk management and a dedicated advisor.', tags:['+ HR Compliance','Risk Mgmt','Dedicated Advisor']}
    ],
    addons: [
      {id:'wc', nm:"Workers' comp administration", rate:4, per:'pepm'},
      {id:'k401', nm:'401(k) administration', rate:5, per:'pepm'},
      {id:'aca', nm:'ACA tracking &amp; reporting', rate:3, per:'pepm'},
      {id:'desk', nm:'HR helpdesk for team members', rate:450, per:'flat'}
    ]
  },
  bpo: {
    label: 'Business Process Outsourcing (BPO)',
    lead: 'Recruiting and workforce operations run as a managed service. Priced as a flat monthly retainer that scales with your team size.',
    term: 'Billed monthly · 30-day notice',
    plans: [
      {id:'support', nm:'Recruiting Support', rate:2500, scale:0.35, ds:'Sourcing and screening support that plugs into your existing hiring team.', tags:['Sourcing','Screening','Pipeline Reporting']},
      {id:'managed', nm:'Managed Recruiting', rate:4800, scale:0.55, ds:'We run the full recruiting cycle — intake through offer — as your team.', tags:['Full Cycle','Interview Coordination','Offer Mgmt']},
      {id:'rpo', nm:'Full RPO', rate:8200, scale:0.8, ds:'End-to-end recruiting plus onboarding and workforce administration.', tags:['+ Onboarding','Workforce Admin','Analytics']}
    ],
    addons: [
      {id:'onb', nm:'Onboarding administration', rate:900, per:'flat'},
      {id:'msp', nm:'MSP / VMS program management', rate:1600, per:'flat'},
      {id:'brand', nm:'Employer branding support', rate:1200, per:'flat'},
      {id:'anly', nm:'Advanced workforce analytics', rate:750, per:'flat'}
    ]
  }
};

(function(){
  var svc='aso', planId=null, size=50, chosen={aso:{},bpo:{}};
  var $plans=document.getElementById('plans'), $add=document.getElementById('addons'),
      $lines=document.getElementById('qLines'), $total=document.getElementById('qTotal'),
      $size=document.getElementById('teamSize'), $sizeOut=document.getElementById('sizeOut'),
      $lead=document.getElementById('svcLead'), $qsvc=document.getElementById('qSvc'),
      $term=document.getElementById('qTerm');
  if(!$plans) return;
  function money(n){ return '$'+Math.round(n).toLocaleString(); }
  function planCost(p){
    if(svc==='aso') return p.rate*size;
    return p.rate + (p.rate*p.scale*(size/50-1));
  }
  function addCost(a){ return a.per==='pepm' ? a.rate*size : a.rate; }

  function render(){
    var cfg=PRICING[svc];
    $lead.textContent=cfg.lead; $qsvc.textContent=cfg.label; $term.textContent=cfg.term;
    $plans.innerHTML=cfg.plans.map(function(p){
      return '<label class="plan"><input type="radio" name="plan" value="'+p.id+'"'+(p.id===planId?' checked':'')+'>'
        +'<span class="dot"></span><span class="top"><span class="nm">'+p.nm+'</span>'
        +'<span class="pr">'+money(svc==='aso'?p.rate:planCost(p))+'<small>'+(svc==='aso'?'per member / mo':'per month')+'</small></span></span>'
        +'<span class="ds">'+p.ds+'</span><ul>'+p.tags.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></label>';
    }).join('');
    $add.innerHTML=cfg.addons.map(function(a){
      return '<label class="add"><input type="checkbox" value="'+a.id+'"'+(chosen[svc][a.id]?' checked':'')+'>'
        +'<span class="box"></span><span class="tx">'+a.nm+'</span>'
        +'<span class="amt">+'+money(addCost(a))+'/mo</span></label>';
    }).join('');
    calc();
  }
  function calc(){
    var cfg=PRICING[svc], plan=null;
    cfg.plans.forEach(function(p){ if(p.id===planId) plan=p; });
    var rows=[], total=0;
    if(plan){ var c=planCost(plan); total+=c; rows.push([plan.nm+(svc==='aso'?' &times; '+size+' members':''), money(c)]); }
    else rows.push(['Select a plan to see your estimate','&mdash;']);
    cfg.addons.forEach(function(a){
      if(chosen[svc][a.id]){ var c=addCost(a); total+=c; rows.push([a.nm, money(c)]); }
    });
    $lines.innerHTML=rows.map(function(r){return '<div class="qline"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>';}).join('');
    $total.textContent= plan ? money(total) : '$0';
  }
  window.__sparkQuote=function(){
    var cfg=PRICING[svc], plan=null;
    cfg.plans.forEach(function(p){ if(p.id===planId) plan=p; });
    if(!plan) return null;
    var adds=[], total=planCost(plan);
    cfg.addons.forEach(function(a){ if(chosen[svc][a.id]){ adds.push({nm:a.nm,cost:addCost(a)}); total+=addCost(a); } });
    return {svc:svc, svcLabel:cfg.label, plan:plan.nm, planCost:planCost(plan), size:size, addons:adds, total:total, term:cfg.term};
  };
  $plans.addEventListener('change',function(e){ planId=e.target.value; render(); });
  $add.addEventListener('change',function(e){ chosen[svc][e.target.value]=e.target.checked; calc(); });
  $size.addEventListener('input',function(){ size=+$size.value; $sizeOut.textContent=(size>=500?'500+':size); render(); });
  Array.prototype.forEach.call(document.querySelectorAll('.seg button'),function(b){
    b.addEventListener('click',function(){
      Array.prototype.forEach.call(document.querySelectorAll('.seg button'),function(x){
        x.setAttribute('aria-selected', x===b?'true':'false');
      });
      svc=b.getAttribute('data-svc'); planId=null; render();
    });
  });
  render();
})();

var links=[].slice.call(document.querySelectorAll('#spy a.lnk'));
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id);});}});},{rootMargin:'-35% 0px -55% 0px'});
links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)so.observe(s);});

/* ---------- drawer ---------- */
(function(){
  var burger=document.querySelector('.burger'), drawer=document.getElementById('drawer'),
      scrim=document.getElementById('scrim'), closeBtn=document.querySelector('.dclose');
  if(!burger||!drawer) return;
  var lastFocus=null;
  function focusables(){ return drawer.querySelectorAll('a[href],button'); }
  function open(){
    lastFocus=document.activeElement;
    drawer.classList.add('on'); scrim.classList.add('on');
    burger.setAttribute('aria-expanded','true'); document.body.classList.add('locked');
    var f=focusables(); if(f.length) f[0].focus();
  }
  function close(){
    drawer.classList.remove('on'); scrim.classList.remove('on');
    burger.setAttribute('aria-expanded','false'); document.body.classList.remove('locked');
    if(lastFocus) lastFocus.focus();
  }
  burger.addEventListener('click',function(){ drawer.classList.contains('on')?close():open(); });
  scrim.addEventListener('click',close);
  if(closeBtn) closeBtn.addEventListener('click',close);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&drawer.classList.contains('on')) close();
    if(e.key==='Tab'&&drawer.classList.contains('on')){
      var f=focusables(); if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  drawer.addEventListener('click',function(e){ if(e.target.closest('a')) close(); });
})();


/* ---------- enrollment wizard ---------- */
(function(){
  var scrim=document.getElementById('wzscrim'); if(!scrim) return;
  var wz=document.getElementById('wz'), step=0, lastFocus=null, data={};
  var STEPS=['Your Plan','Company','Contact & Timing','Review'];
  var money=function(n){return '$'+Math.round(n).toLocaleString();};

  function quoteBlock(q){
    if(!q) return '<div class="wz-note">No plan selected yet. Close this, choose ASO or BPO and a plan, then start enrollment.</div>';
    var rows='<div class="row"><span>Service</span><b>'+q.svcLabel+'</b></div>'
      +'<div class="row"><span>Plan</span><b>'+q.plan+'</b></div>'
      +'<div class="row"><span>Team size</span><b>'+q.size+' members</b></div>'
      +'<div class="row"><span>Base</span><b>'+money(q.planCost)+'/mo</b></div>';
    q.addons.forEach(function(a){ rows+='<div class="row"><span>'+a.nm+'</span><b>'+money(a.cost)+'/mo</b></div>'; });
    return '<div class="wz-plan">'+rows+'<div class="tot"><span class="k">Est. Monthly</span><span class="v">'+money(q.total)+'</span></div></div>';
  }

  var STATES='AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' ');
  function stateOpts(sel){ return '<option value="">Select…</option>'+STATES.map(function(s){return '<option'+(sel===s?' selected':'')+'>'+s+'</option>';}).join(''); }
  function v(k){ return data[k]?String(data[k]).replace(/"/g,'&quot;'):''; }

  function body(){
    var q=window.__sparkQuote?window.__sparkQuote():null;
    if(step===0) return '<h4>Confirm your plan</h4><p class="hint">This carries over what you built. You can go back and change it any time.</p>'
      +quoteBlock(q)
      +'<div class="wz-note"><b>Pricing shown is an estimate.</b> Final rates are confirmed on a short scoping call, and a service agreement is signed before any billing begins. Nothing is charged today.</div>';

    if(step===1) return '<h4>Company details</h4><p class="hint">So we can scope correctly and prepare your agreement.</p>'
      +'<div class="frow one"><div class="fld" data-k="company"><label>Legal company name <span class="req">*</span></label><input value="'+v('company')+'" placeholder="Acme Manufacturing, LLC"><div class="err">Required</div></div></div>'
      +'<div class="frow"><div class="fld" data-k="industry"><label>Industry <span class="req">*</span></label><select><option value="">Select…</option>'
        +['Manufacturing','Engineering','IT / MSP / Cybersecurity','Data Centers','Packaging &amp; Converting','Automation','Skilled Trades','Food &amp; Beverage','Professional Services','Other']
          .map(function(o){return '<option'+(data.industry===o?' selected':'')+'>'+o+'</option>';}).join('')
      +'</select><div class="err">Required</div></div>'
      +'<div class="fld" data-k="hq"><label>HQ state <span class="req">*</span></label><select>'+stateOpts(data.hq)+'</select><div class="err">Required</div></div></div>'
      +'<div class="frow"><div class="fld" data-k="headcount"><label>Team members <span class="req">*</span></label><input type="number" min="1" value="'+(v('headcount')|| (q?q.size:''))+'"><div class="err">Enter a number</div></div>'
      +'<div class="fld" data-k="multistate"><label>Operating in multiple states?</label><select>'
        +['No','Yes — 2–5 states','Yes — 6+ states'].map(function(o){return '<option'+(data.multistate===o?' selected':'')+'>'+o+'</option>';}).join('')
      +'</select><div class="err"></div></div></div>'
      +'<div class="frow one"><div class="fld" data-k="current"><label>Current provider (if any)</label><input value="'+v('current')+'" placeholder="ADP, Paychex, in-house, none…"><div class="err"></div></div></div>';

    if(step===2) return '<h4>Contact &amp; timing</h4><p class="hint">Who should we talk to, and when do you want to be live?</p>'
      +'<div class="frow"><div class="fld" data-k="name"><label>Full name <span class="req">*</span></label><input value="'+v('name')+'" placeholder="Jane Doe"><div class="err">Required</div></div>'
      +'<div class="fld" data-k="title"><label>Title <span class="req">*</span></label><input value="'+v('title')+'" placeholder="Director of Operations"><div class="err">Required</div></div></div>'
      +'<div class="frow"><div class="fld" data-k="email"><label>Work email <span class="req">*</span></label><input type="email" value="'+v('email')+'" placeholder="jane@acme.com"><div class="err">Enter a valid email</div></div>'
      +'<div class="fld" data-k="phone"><label>Phone <span class="req">*</span></label><input type="tel" value="'+v('phone')+'" placeholder="(586) 555-0100"><div class="err">Enter a valid phone number</div></div></div>'
      +'<div class="frow"><div class="fld" data-k="start"><label>Target start date <span class="req">*</span></label><input type="date" value="'+v('start')+'"><div class="err">Required</div></div>'
      +'<div class="fld" data-k="payfreq"><label>Payroll frequency</label><select>'
        +['Weekly','Bi-weekly','Semi-monthly','Monthly','Not sure yet'].map(function(o){return '<option'+(data.payfreq===o?' selected':'')+'>'+o+'</option>';}).join('')
      +'</select><div class="err"></div></div></div>'
      +'<div class="frow one"><div class="fld" data-k="notes"><label>Anything else we should know?</label><textarea placeholder="Union workforce, multi-EIN, upcoming open enrollment, specific compliance needs…">'+v('notes')+'</textarea><div class="err"></div></div></div>';

    // review
    var rows=[['Service',q?q.svcLabel:'—'],['Plan',q?q.plan:'—'],['Team size',(data.headcount||'—')+' members'],
      ['Company',data.company||'—'],['Industry',data.industry||'—'],['HQ state',data.hq||'—'],
      ['Multi-state',data.multistate||'—'],['Current provider',data.current||'None given'],
      ['Contact',(data.name||'—')+(data.title?', '+data.title:'')],['Email',data.email||'—'],['Phone',data.phone||'—'],
      ['Target start',data.start||'—'],['Payroll frequency',data.payfreq||'—']];
    var html='<h4>Review &amp; submit</h4><p class="hint">Check everything, then send it over.</p><div class="wz-plan">'
      +rows.map(function(r){return '<div class="row"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>';}).join('');
    if(q) html+='<div class="tot"><span class="k">Est. Monthly</span><span class="v">'+money(q.total)+'</span></div>';
    html+='</div>';
    if(data.notes) html+='<div class="wz-note"><b>Your notes:</b> '+data.notes.replace(/</g,'&lt;')+'</div>';
    html+='<label class="consent" id="consentBox"><input type="checkbox" id="consent"'+(data.consent?' checked':'')+'>'
      +'<span>I understand this is an enrollment request, not a purchase. Pricing is an estimate until confirmed, '
      +'and no payment is collected until a service agreement is signed. Spark may contact me about this request.</span></label>'
      +'<div class="fld" id="consentErr" style="display:none"><div class="err" style="display:block">Please confirm to continue</div></div>';
    return html;
  }

  function collect(){
    wz.querySelectorAll('.fld[data-k]').forEach(function(f){
      var el=f.querySelector('input,select,textarea'); if(el) data[f.getAttribute('data-k')]=el.value.trim();
    });
    var c=document.getElementById('consent'); if(c) data.consent=c.checked;
  }

  function validate(){
    if(step===0) return !!(window.__sparkQuote&&window.__sparkQuote());
    var need = step===1 ? ['company','industry','hq','headcount'] : step===2 ? ['name','title','email','phone','start'] : [];
    var ok=true;
    need.forEach(function(k){
      var f=wz.querySelector('.fld[data-k="'+k+'"]'); if(!f) return;
      var val=(f.querySelector('input,select,textarea')||{}).value||''; val=val.trim();
      var bad=!val;
      if(!bad&&k==='email') bad=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      if(!bad&&k==='phone') bad=(val.replace(/\D/g,'').length<10);
      if(!bad&&k==='headcount') bad=!(parseInt(val,10)>0);
      f.classList.toggle('bad',bad); if(bad) ok=false;
    });
    if(step===3){
      var c=document.getElementById('consent');
      if(c&&!c.checked){ document.getElementById('consentBox').classList.add('bad');
        document.getElementById('consentErr').style.display='block'; ok=false; }
    }
    return ok;
  }

  function render(){
    var last=step===3;
    wz.innerHTML='<div class="wz-head"><div><div class="t">Start Enrollment</div>'
      +'<div class="s">Step '+(step+1)+' of 4 &middot; '+STEPS[step]+'</div></div>'
      +'<button class="wz-x" id="wzX" aria-label="Close">&times;</button></div>'
      +'<div class="wz-steps">'+[0,1,2,3].map(function(i){return '<div class="'+(i<=step?'done':'')+'"></div>';}).join('')+'</div>'
      +'<div class="wz-body">'+body()+'</div>'
      +'<div class="wz-foot"><span class="lft">No payment collected</span><span class="rgt">'
      +(step>0?'<button class="btn btn-o" id="wzBack">Back</button>':'')
      +'<button class="btn btn-y" id="wzNext">'+(last?'Submit Request':'Continue')+' <span class="ar">&rarr;</span></button>'
      +'</span></div>';
    document.getElementById('wzX').onclick=close;
    var bk=document.getElementById('wzBack'); if(bk) bk.onclick=function(){ collect(); step--; render(); };
    document.getElementById('wzNext').onclick=function(){
      collect();
      if(!validate()){ var b=wz.querySelector('.fld.bad input,.fld.bad select'); if(b) b.focus(); return; }
      if(step<3){ step++; render(); } else submit();
    };
    var f=wz.querySelector('input,select,textarea'); if(f) f.focus();
  }

  function submit(){
    var q=window.__sparkQuote?window.__sparkQuote():null;
    var payload={submittedAt:new Date().toISOString(), quote:q, company:data};
    /* WIRE THIS UP: POST `payload` to your CRM / form endpoint.
       e.g. fetch('/api/enroll',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}) */
    console.log('ENROLLMENT REQUEST (not yet sent anywhere — wire an endpoint):', payload);
    var ref='SPK-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
    wz.innerHTML='<div class="wz-head"><div><div class="t">Request Received</div>'
      +'<div class="s">Enrollment &middot; '+(q?q.plan:'')+'</div></div>'
      +'<button class="wz-x" id="wzX" aria-label="Close">&times;</button></div>'
      +'<div class="wz-done"><div class="tick"></div><h4>Thanks, '+(data.name||'').split(' ')[0]+'.</h4>'
      +'<p>Your enrollment request is in. A Spark specialist will reach out within one business day to confirm scope and pricing.</p>'
      +'<div class="wz-ref">Reference '+ref+'</div>'
      +'<div class="wz-next"><div class="k">What happens next</div><ol>'
      +'<li>15-minute scoping call to confirm headcount, states, and service fit.</li>'
      +'<li>We send final pricing and your service agreement for e-signature.</li>'
      +'<li>Onboarding begins — first billing cycle starts only after the agreement is signed.</li>'
      +'</ol></div>'
      +'<a class="btn btn-y" href="index.html">Back To Home</a></div>';
    document.getElementById('wzX').onclick=close;
  }

  function open(){
    lastFocus=document.activeElement; step=0; scrim.classList.add('on');
    document.body.classList.add('locked'); render();
  }
  function close(){
    scrim.classList.remove('on'); document.body.classList.remove('locked');
    if(lastFocus) lastFocus.focus();
  }
  scrim.addEventListener('click',function(e){ if(e.target===scrim) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&scrim.classList.contains('on')) close(); });
  var trigger=document.getElementById('startEnroll');
  if(trigger) trigger.addEventListener('click',function(e){ e.preventDefault(); open(); });
})();
