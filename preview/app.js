const menu=document.querySelector('[data-menu]'),nav=document.querySelector('[data-nav]');menu?.addEventListener('click',()=>{const o=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!o));nav?.classList.toggle('is-open',!o)});
const canvas=document.querySelector('.preview-canvas');
if(canvas){
  const c=canvas.getContext('2d');
  let w=0,h=0;
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';c.setTransform(dpr,0,0,dpr,0,0)};
  resize();addEventListener('resize',resize);
  const round=(x,y,bw,bh,r)=>{c.beginPath();if(c.roundRect){c.roundRect(x,y,bw,bh,r);return}const rad=Math.min(r,bw/2,bh/2);c.moveTo(x+rad,y);c.arcTo(x+bw,y,x+bw,y+bh,rad);c.arcTo(x+bw,y+bh,x,y+bh,rad);c.arcTo(x,y+bh,x,y,rad);c.arcTo(x,y,x+bw,y,rad);c.closePath()};
  const fill=(x,y,bw,bh,r,col)=>{round(x,y,bw,bh,r);c.fillStyle=col;c.fill()};
  // Bildschirm, Tablet, Handy: dasselbe Layout in drei Formaten
  const device=(cx,cy,dw,dh,cols,rows)=>{
    const x=cx-dw/2,y=cy-dh/2,r=Math.max(6,dw*.035);
    c.save();c.shadowColor='rgba(18,20,24,.18)';c.shadowBlur=dw*.18;c.shadowOffsetY=dw*.05;
    fill(x,y,dw,dh,r,'#24272d');c.restore();
    const b=Math.max(4,dw*.022),sx=x+b,sy=y+b,sw=dw-b*2,sh=dh-b*2;
    fill(sx,sy,sw,sh,r*.7,'#fbfaf8');
    const bar=Math.max(8,sh*.09);
    fill(sx,sy,sw,bar,r*.7,'#ffffff');
    fill(sx+bar*.35,sy+bar*.3,bar*.4,bar*.4,bar*.12,'#e8532a');
    const pad=sw*.05,gap=sw*.035,cw=(sw-pad*2-gap*(cols-1))/cols,top=sy+bar+pad,ch=(sh-bar-pad*2-gap*(rows-1))/rows;
    for(let rr=0;rr<rows;rr++)for(let cc=0;cc<cols;cc++){
      fill(sx+pad+cc*(cw+gap),top+rr*(ch+gap),cw,ch,Math.max(3,cw*.07),rr===0&&cc===0?'#e8532a':'#eeebe5')
    }
  };
  (function draw(t){
    c.clearRect(0,0,w,h);
    const g=c.createRadialGradient(w*.72,h*.44,0,w*.72,h*.44,w*.5);
    g.addColorStop(0,'rgba(232,83,42,.10)');g.addColorStop(1,'rgba(232,83,42,0)');
    c.fillStyle=g;c.fillRect(0,0,w,h);
    const s=Math.min(Math.min(w,h)/900,1.25),ox=w*.72,oy=h*.5;
    device(ox,oy-58*s+Math.sin(t/1400)*5*s,430*s,266*s,3,2);
    device(ox-248*s,oy+118*s+Math.sin(t/1100+2)*7*s,146*s,200*s,2,3);
    device(ox+216*s,oy+138*s+Math.sin(t/1250+4)*7*s,84*s,166*s,1,4);
    requestAnimationFrame(draw)
  })(0)
}
const story=document.querySelector('[data-story]'),cards=[...document.querySelectorAll('[data-story-card]')],bar=document.querySelector('[data-story-progress]');addEventListener('scroll',()=>{if(!story||!cards.length)return;const r=story.getBoundingClientRect(),max=story.offsetHeight-innerHeight,p=Math.max(0,Math.min(1,-r.top/max)),idx=Math.min(cards.length-1,Math.floor(p*cards.length));cards.forEach((el,i)=>{el.style.opacity=i===idx?'1':'.06';el.style.transform=`translateY(-50%) translate3d(0,${(i-idx)*90}px,${i===idx?0:-160}px) rotateX(${(i-idx)*5}deg)`});if(bar)bar.style.transform=`scaleX(${Math.max(.02,p)})`},{passive:true});
const idea=document.querySelector('[data-idea]'),count=document.querySelector('[data-char-count]');idea?.addEventListener('input',()=>count.textContent=idea.value.length);document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{idea.value=b.dataset.example||'';count.textContent=idea.value.length;idea.focus()}));
const analyze=document.querySelector('[data-analyze]');analyze?.addEventListener('click',()=>{const t=idea.value.trim();if(t.length<25){document.querySelector('[data-estimator-status]').textContent='Beschreiben Sie die Idee bitte mit mindestens einem kurzen Satz.';return}document.querySelector('[data-estimator-status]').textContent='';let type='Webapp',title='Ein zentraler Ablauf im Browser',features=['Benutzerkonten','Dashboard','Datenverwaltung','Datei-Upload','Status & Benachrichtigungen'];const l=t.toLowerCase();if(/app|ios|android|push|mobil/.test(l)){type='App';title='Eine mobile Anwendung für den direkten Zugriff';features=['Benutzerkonto','Mobile Navigation','Push-Benachrichtigungen','Synchronisierte Daten']}else if(/website|homepage|landingpage/.test(l)){type='Website';title='Ein klarer digitaler Auftritt';features=['Leistungsseiten','Kontaktanfrage','SEO-Basis','Responsive Darstellung']}else if(/excel|mitarbeiter|intern|freigabe/.test(l)){type='Internes Tool';title='Ein Werkzeug für Ihren eigenen Ablauf';features=['Mitarbeiter-Login','Aufgaben','Rollen & Freigaben','Dokumente','Historie']}if(/qr/.test(l))features.unshift('QR-Code / Schnellzugang');if(/foto|bild/.test(l))features.unshift('Foto-Upload & Galerie');const result=document.querySelector('[data-result]');document.querySelector('[data-result-empty]').hidden=true;result.hidden=false;document.querySelector('[data-result-type]').textContent=type;document.querySelector('[data-result-title]').textContent=title;document.querySelector('[data-result-size]').textContent=t.length>220?'Umfangreich':t.length>100?'Mittel':'Klein';document.querySelector('[data-result-time]').textContent=t.length>220?'ca. 8–16 Wochen':t.length>100?'ca. 4–8 Wochen':'ca. 2–5 Wochen';document.querySelector('[data-result-budget]').textContent='nach kurzer Rücksprache';document.querySelector('[data-result-features]').innerHTML=features.slice(0,7).map(x=>`<li>${x}</li>`).join('')});
const reel=document.querySelector('[data-reel]'),reelCard=document.querySelector('[data-reel-card]');addEventListener('scroll',()=>{if(!reel||!reelCard)return;const r=reel.getBoundingClientRect(),max=reel.offsetHeight-innerHeight,p=Math.max(0,Math.min(1,-r.top/max));let rot,scale,y,op=1;if(p<.52){const q=p/.52;rot=-10*(1-q);scale=.72+.28*q;y=7*(1-q)}else{const q=(p-.52)/.48;rot=4*q;scale=1-.18*q;y=-10*q;op=1-.65*q}reelCard.style.transform=`rotate(${rot}deg) scale(${scale}) translateY(${y}%)`;reelCard.style.opacity=op},{passive:true});
