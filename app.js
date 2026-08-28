
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
