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
    ['.feat-grid','up',true],          // features: cards arrive one after another
    ['.price-grid','up',true],         // pricing: plans arrive in turn
    ['.wl-visual','right',false],      // white label: phone slides in
    ['.dmai-card','zoom',false],       // DM.AI 4U: box settles into place
    ['.team-grid','up',true],          // meet the team
    ['.post-featured','up',false],     // blog: featured post
    ['.post-grid-img','up',true],      // blog: cards
    ['.related-grid','up',true],       // blog posts: more from the blog
    ['.pain-list','up',true],          // trade pages: problem → fix cards
    ['.compare-scroll','up',false],    // compare: the table
    ['.compare-note','zoom',false]     // compare: closing note
  ];
  var items=[];
  moments.forEach(function(m){
    document.querySelectorAll(m[0]).forEach(function(el){
      var targets=m[2]?Array.prototype.slice.call(el.children):[el];
      targets.forEach(function(t,i){ t.classList.add('reveal','reveal-'+m[1]); if(m[2]) t.style.setProperty('--d',(i*110)+'ms'); items.push(t); });
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
