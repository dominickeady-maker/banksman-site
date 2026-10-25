// Mobile menu toggle
(function(){
  var btn=document.querySelector('.menu-btn'), menu=document.getElementById('mobile-menu');
  if(!btn||!menu) return;
  btn.addEventListener('click',function(){
    var open=menu.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  menu.addEventListener('click',function(e){ if(e.target.tagName==='A'){ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } });
})();

// A few key moments animate as they scroll into view; everything else stays still.
(function(){
  var root=document.documentElement;
  if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches){ root.classList.remove('js'); return; }
  // [selector, style, stagger children?]
  var moments=[
    ['.price-grid','up',true],         // pricing: plans arrive in turn
    ['.wl-visual','right',false],      // white label: phone slides in
    ['.dmai-card','zoom',false],       // DM.AI 4U: box settles into place
    ['.team-grid','up',true],          // meet the team
    ['.post-featured','up',false],     // blog: featured post
    ['.post-grid-img','up',true],      // blog: cards
    ['.related-grid','up',true],       // blog posts: more from the blog
    ['.pain-list','up',true],          // trade pages: problem → fix cards
    ['.feature-list','up',true],       // feature lists: items arrive row by row
    ['.site-toasts','right',true],     // trade pages: notifications slide in
    ['.trade-links','up',false],       // trade pages: other trades
    ['.compare-scroll','up',false],    // compare: the table
    ['.compare-note','zoom',false]     // compare: closing note
  ];
  var items=[];
  moments.forEach(function(m){
    document.querySelectorAll(m[0]).forEach(function(el){
      var targets=m[2]?Array.prototype.slice.call(el.children):[el];
      targets.forEach(function(t,i){ t.classList.add('reveal','reveal-'+m[1]); if(m[2]) t.style.setProperty('--d',((i%3)*110)+'ms'); items.push(t); });
    });
  });
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var t=e.target; t.classList.add('in'); io.unobserve(t);
      // Tidy up afterwards so hover effects work as normal.
      setTimeout(function(){ t.classList.remove('reveal','reveal-up','reveal-right','reveal-zoom','in'); t.style.removeProperty('--d'); }, 1400);
    });
  },{rootMargin:'0px 0px -12% 0px', threshold:0.15});
  items.forEach(function(el){ io.observe(el); });
})();

// "What's inside": the grid settles in as one piece, then each card's icon draws itself on as it comes into view.
// On a mouse, a soft glow follows the pointer across the cards.
(function(){
  var root=document.documentElement, g=document.querySelector('#features .feat-grid');
  if(!g || !root.classList.contains('js')) return;
  var cards=g.querySelectorAll('.feat:not(.feat-cta)');
  Array.prototype.forEach.call(cards,function(c,i){ c.style.setProperty('--d',(150+(i%3)*140)+'ms'); });
  var gio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ g.classList.add('feat-on'); gio.disconnect(); } }); },{threshold:.1});
  gio.observe(g);
  var cio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('drawn'); cio.unobserve(e.target); } }); },{threshold:.3});
  Array.prototype.forEach.call(cards,function(c){ cio.observe(c); });
  if(window.matchMedia('(hover:hover)').matches){
    g.addEventListener('mousemove',function(e){ var c=e.target.closest('.feat'); if(!c) return; var r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px'); });
  }
})();
