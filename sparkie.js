/* ============================================================
   Sparkie — the Spark site guide.
   A button-only router. No free-text input, so it never has to
   answer something it can't. Every branch ends on a real
   destination: a form, a phone number, or a page.
   Builds its own DOM. One <script src="sparkie.js" defer> per page.
   ============================================================ */
(function () {
  'use strict';

  var FORM = 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=KlQG6PZt7kaExywD5iXjkbZhd9dnA6hJkxYTtRK_9zJUMTNINEVUU1VPTTQ1SE1OVElSNkZRTktYNC4u';
  var JOBS = 'https://spark-companies.my.site.com/jobs/s/';
  var HUB  = 'https://sparkcompanies.github.io/External-TeamMemberSite/';

  /* Each node: q = the question, a = answers.
     An answer either goes to another node (go) or ends on a card (end). */
  var T = {
    start: {
      q: 'What brings you to Spark today?',
      a: [
        { t: 'I need to hire people',        go: 'hire' },
        { t: 'I’m looking for a job',   go: 'job' },
        { t: 'I’m a journeyman electrician', go: 'elec', hot: true },
        { t: 'I just have a question',       go: 'faq' }
      ]
    },

    /* ---------- employers ---------- */
    hire: {
      q: 'What are you hiring for?',
      a: [
        { t: 'Engineering, industrial or skilled trades', end: 'f_talent' },
        { t: 'A data center electrical crew',             end: 'f_crew', hot: true },
        { t: 'Packaging, printing or food &amp; bev',     end: 'f_pkg' },
        { t: 'IT, MSP, cybersecurity or AI',              end: 'f_jjp' },
        { t: 'Automation &amp; controls',                 end: 'f_flex' },
        { t: 'An executive or senior leader',             end: 'f_ignite' },
        { t: 'Not a hire — payroll, HR or outsourcing', end: 'f_aso' }
      ]
    },

    /* ---------- job seekers ---------- */
    job: {
      q: 'What kind of work are you after?',
      a: [
        { t: 'Electrical — data center or industrial', go: 'elec', hot: true },
        { t: 'Skilled trades or manufacturing',  end: 'j_board' },
        { t: 'Engineering or automation',        end: 'j_board' },
        { t: 'IT, cybersecurity or AI',          end: 'j_board' },
        { t: 'Office, admin or professional',    end: 'j_board' },
        { t: 'A job at Spark itself',            end: 'j_spark' }
      ]
    },

    /* ---------- common questions ---------- */
    faq: {
      q: 'Pick the closest one.',
      a: [
        { t: 'Which of your companies do I need?', end: 'q_which' },
        { t: 'Contract, temp-to-hire or direct?',  end: 'q_types' },
        { t: 'Do you handle payroll and HR?',      end: 'q_aso' },
        { t: 'What does it cost?',                 end: 'q_cost' },
        { t: 'Where do you work?',                 end: 'q_where' },
        { t: 'I already work for Spark',           end: 'q_hub' }
      ]
    }
  };

  /* Ending cards. b = buttons. primary ones first. */
  var E = {
    f_talent: {
      k: 'Spark Talent Acquisition',
      p: 'Engineering, industrial and skilled-trades staffing nationwide, with deep benches in hyperscale data centers and electrical trades.',
      b: [{ t: 'Talk To Spark', h: 'contact.html', p: 1 }, { t: 'Visit Spark Talent', h: 'https://www.sparktalentinc.com/', x: 1 }]
    },
    f_crew: {
      k: 'Data Center Electrical Crews',
      p: 'Journeyman electricians on hyperscale and industrial builds — switchgear, feeders, tray, critical systems. Project, contract-to-hire or direct.',
      b: [{ t: 'Request A Crew', h: 'datacenter.html#contractors', p: 1 }, { t: 'See The Program', h: 'datacenter.html' }]
    },
    f_pkg: {
      k: 'Spark Packaging',
      p: 'The niche staffing partner for all things packaging — converting, printing, and food &amp; beverage — with training through The Packaging School.',
      b: [{ t: 'Talk To Spark', h: 'contact.html', p: 1 }, { t: 'Visit Spark Packaging', h: 'https://sparkpackaginginc.com/', x: 1 }]
    },
    f_jjp: {
      k: 'John Joseph Partners',
      p: 'Purpose-built recruiting for MSPs, cybersecurity vendors and high-growth AI-driven enterprises — contract roles through executive search.',
      b: [{ t: 'Talk To Spark', h: 'contact.html', p: 1 }, { t: 'Visit John Joseph Partners', h: 'https://johnjosephpartners.com/', x: 1 }]
    },
    f_flex: {
      k: 'Flex Workforce Solutions',
      p: 'Full-cycle staffing for the automation industry — engineers, programmers and project managers who fit from day one.',
      b: [{ t: 'Talk To Spark', h: 'contact.html', p: 1 }, { t: 'Visit Flex Workforce', h: 'https://www.flexworkforceco.com/', x: 1 }]
    },
    f_ignite: {
      k: 'Ignite Search',
      p: 'Executive search that is comprehensive, confidential and incisive — placing leaders who redefine the mold, not just fit it.',
      b: [{ t: 'Talk To Spark', h: 'contact.html', p: 1 }, { t: 'Visit Ignite Search', h: 'https://www.ignitesearch.com/', x: 1 }]
    },
    f_aso: {
      k: 'ASO &amp; BPO',
      p: 'Payroll, benefits and HR compliance under ASO — or hand off recruiting and people ops entirely under BPO. Month to month, scale up or down.',
      b: [{ t: 'See Services', h: 'services.html', p: 1 }, { t: 'Talk To Spark', h: 'contact.html' }]
    },

    j_board: {
      k: 'Every Open Role, One Place',
      p: 'Search and filter openings across all five Spark companies and apply online. If nothing fits today, applying still puts you in front of a recruiter.',
      b: [{ t: 'Search Open Roles', h: JOBS, p: 1, x: 1 }, { t: 'Careers At Spark', h: 'careers.html' }]
    },
    j_spark: {
      k: 'Work At Spark',
      p: 'We hire recruiters, account managers and operators across all five companies, and we promote from inside first.',
      b: [{ t: 'See Careers', h: 'careers.html', p: 1 }, { t: 'Search Open Roles', h: JOBS, x: 1 }]
    },

    elec_end: {
      k: '$55/Hr To Start, Nationwide',
      p: 'Journeyman electricians on hyperscale data center and industrial projects. Travel work, real crews, and three recruiters who run the program nationally.',
      b: [{ t: 'Start The Application', h: FORM, p: 1, x: 1 }, { t: 'See The Work', h: 'datacenter.html' }],
      recs: 1
    },

    q_which: {
      k: 'Five Firms, One Standard',
      p: 'Each firm owns its own market. Tell me what you’re hiring for and I’ll name the right one — or see all five side by side.',
      b: [{ t: 'Tell Me What You’re Hiring For', go: 'hire', p: 1 }, { t: 'See All Five', h: 'companies.html' }]
    },
    q_types: {
      k: 'All Of The Above',
      p: 'Direct-hire and permanent placement, contract and temp-to-hire, and executive or leadership search — across every industry the group serves.',
      b: [{ t: 'See Services', h: 'services.html', p: 1 }, { t: 'Talk To Spark', h: 'contact.html' }]
    },
    q_aso: {
      k: 'Yes — ASO And BPO',
      p: 'ASO keeps payroll, benefits and HR compliance running clean while you keep control of your workforce. BPO hands off recruiting and people ops as one managed service.',
      b: [{ t: 'See Services', h: 'services.html', p: 1 }, { t: 'Talk To Spark', h: 'contact.html' }]
    },
    q_cost: {
      k: 'It Depends On Scope',
      p: 'ASO and BPO are month to month with no long-term contract — you can build a plan online and see an estimate. Final pricing is confirmed on a 15-minute scoping call.',
      b: [{ t: 'Build Your Plan', h: 'services.html#enroll', p: 1 }, { t: 'Book The Call', h: 'contact.html' }]
    },
    q_where: {
      k: 'Nationwide',
      p: 'We place people across the country. Offices are in Troy, Michigan and Franklin, Tennessee, and the data center crews travel to project sites anywhere in the US.',
      b: [{ t: 'Contact Us', h: 'contact.html', p: 1 }, { t: 'Call 586.930.5000', h: 'tel:5869305000' }]
    },
    q_hub: {
      k: 'Spark Hub',
      p: 'Payroll, benefits, onboarding and safety resources all live in the team member portal.',
      b: [{ t: 'Open Spark Hub', h: HUB, p: 1, x: 1 }, { t: 'Swag Store', h: 'https://shopsparkcompanies.com/', x: 1 }]
    }
  };

  /* elec is a node that goes straight to its card */
  T.elec = { skipTo: 'elec_end' };

  var RECS = [
    ['Jake Roux', '(248) 924-1919', '2489241919'],
    ['Brandon Shrewsberry', '(586) 850-9801', '5868509801'],
    ['Austyn Sylva', '(248) 974-7569', '2489747569']
  ];

  var BOLT = '<svg class="sk-bolt" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.6 1 4 13.2h6.1L9.3 23 20 10.3h-6.6z"/></svg>';

  var root, panel, bodyEl, backBtn, tabBtn, stack = [], open = false, lastFocus = null, guard = 0;

  /* A card we can always fall back to, so the panel is never blank. */
  var SAFE = {
    k: 'Let’s Get You To The Right Person',
    p: 'Tell us what you need and the right person on our team will reach out.',
    b: [{ t: 'Contact Spark', h: 'contact.html', p: 1 }, { t: 'Call 586.930.5000', h: 'tel:5869305000' }]
  };

  function build() {
    root = document.createElement('div');
    root.className = 'sk';
    root.innerHTML =
      '<button class="sk-tab" type="button" aria-expanded="false" aria-controls="sk-panel">' +
        BOLT + '<span>Need A Hand?</span>' +
      '</button>' +
      '<div class="sk-panel" id="sk-panel" role="dialog" aria-label="Sparkie, the Spark site guide" hidden>' +
        '<div class="sk-head">' +
          '<div class="sk-id">' + BOLT + '<div><b>Sparkie</b><span>Your Spark guide</span></div></div>' +
          '<button class="sk-x" type="button" aria-label="Close the guide">&times;</button>' +
        '</div>' +
        '<div class="sk-body" tabindex="-1" aria-live="polite"></div>' +
        '<div class="sk-foot">' +
          '<button class="sk-back" type="button" hidden>&larr; Back</button>' +
          '<a class="sk-skip" href="contact.html">Talk to a person</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    panel  = root.querySelector('.sk-panel');
    bodyEl = root.querySelector('.sk-body');
    backBtn= root.querySelector('.sk-back');
    tabBtn = root.querySelector('.sk-tab');

    tabBtn.addEventListener('click', function () { open ? close() : show(); });
    root.querySelector('.sk-x').addEventListener('click', close);
    backBtn.addEventListener('click', function () {
      stack.pop();
      draw(stack.length ? stack[stack.length - 1] : 'start', true);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { close(); tabBtn.focus(); }
    });
  }

  /* One entry point. Decides question vs card, can never recurse. */
  function draw(id, popped) {
    if (++guard > 40) { card(SAFE); return; }
    if (!popped && stack[stack.length - 1] !== id) stack.push(id);
    var n = T[id];
    if (n && n.skipTo) { id = n.skipTo; n = null;
      if (stack[stack.length - 1] !== id) stack.push(id); }
    if (n && n.a && n.a.length) return question(n);
    var e = E[id];
    return card(e || SAFE);
  }

  function question(n) {
    var h = '<p class="sk-q">' + n.q + '</p><div class="sk-opts">';
    for (var i = 0; i < n.a.length; i++) {
      h += '<button class="sk-o' + (n.a[i].hot ? ' hot' : '') + '" type="button" data-i="' + i + '">' +
           '<span>' + n.a[i].t + '</span><i aria-hidden="true">&rarr;</i></button>';
    }
    paint(h + '</div>');
    var b = bodyEl.querySelectorAll('.sk-o');
    for (var j = 0; j < b.length; j++) {
      (function (a) {
        b[j].addEventListener('click', function () { guard = 0; draw(a.go || a.end); });
      })(n.a[j]);
    }
  }

  function card(e) {
    var h = '<div class="sk-end"><div class="sk-k">' + e.k + '</div><p>' + e.p + '</p>';
    if (e.recs) {
      h += '<div class="sk-recs"><div class="sk-rl">Or call one of them directly</div>';
      for (var r = 0; r < RECS.length; r++) {
        h += '<a class="sk-rec" href="tel:' + RECS[r][2] + '"><b>' + RECS[r][0] + '</b><span>' + RECS[r][1] + '</span></a>';
      }
      h += '</div>';
    }
    h += '<div class="sk-acts">';
    for (var i = 0; i < e.b.length; i++) {
      var b = e.b[i], cls = 'sk-b' + (b.p ? ' pri' : '');
      h += b.go
        ? '<button class="' + cls + '" type="button" data-go="' + b.go + '">' + b.t + '</button>'
        : '<a class="' + cls + '" href="' + b.h + '"' + (b.x ? ' target="_blank" rel="noopener"' : '') + '>' + b.t + '</a>';
    }
    h += '</div><button class="sk-restart" type="button">Start over</button></div>';
    paint(h);
    var g = bodyEl.querySelector('[data-go]');
    if (g) g.addEventListener('click', function () { guard = 0; draw(this.getAttribute('data-go')); });
    bodyEl.querySelector('.sk-restart').addEventListener('click', function () {
      guard = 0; stack = []; draw('start');
    });
  }

  function paint(h) {
    bodyEl.innerHTML = h;
    bodyEl.scrollTop = 0;
    backBtn.hidden = stack.length < 2;
    if (open) { var f = bodyEl.querySelector('button,a'); if (f) f.focus(); }
  }

  function show() {
    lastFocus = document.activeElement;
    panel.hidden = false;
    open = true;
    tabBtn.setAttribute('aria-expanded', 'true');
    root.classList.add('on');
    root.classList.remove('nudge');
    if (!bodyEl.innerHTML || !stack.length) { guard = 0; stack = []; draw('start'); }
    var f = bodyEl.querySelector('button,a');
    (f || bodyEl).focus();
    try { sessionStorage.setItem('sparkieSeen', '1'); } catch (err) {}
  }

  function close() {
    open = false;
    panel.hidden = true;
    root.classList.remove('on');
    tabBtn.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    if (document.querySelector('div.sk')) return;
    try {
      build();
      guard = 0; stack = []; draw('start');      // content exists before it is ever opened
      try { if (!sessionStorage.getItem('sparkieSeen')) root.classList.add('nudge'); }
      catch (err) { root.classList.add('nudge'); }
    } catch (err) {
      if (root && bodyEl) { try { card(SAFE); } catch (e2) {} }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
