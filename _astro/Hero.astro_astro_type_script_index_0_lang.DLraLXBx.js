function e(e){if(matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let t=e.querySelector(`[data-gl]`),n=JSON.parse(e.querySelector(`[data-slides]`).textContent),r=t.getContext(`webgl`,{antialias:!1,alpha:!1,powerPreference:`high-performance`});if(!r)return;let i=r.getExtension(`WEBGL_debug_renderer_info`),a=i?String(r.getParameter(i.UNMASKED_RENDERER_WEBGL)):``;if(/swiftshader|llvmpipe|software|basic render/i.test(a)||navigator.connection?.saveData)return;let o=(e,t)=>{let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n},s=r.createProgram();if(r.attachShader(s,o(r.VERTEX_SHADER,`attribute vec2 p; varying vec2 v; void main(){ v = p*.5+.5; gl_Position = vec4(p,0.,1.); }`)),r.attachShader(s,o(r.FRAGMENT_SHADER,`
precision highp float;
varying vec2 v;
uniform sampler2D tA, tB;
uniform vec2 res, sA, sB, mouse;
uniform float time, mix_, hover;

vec2 cover(vec2 uv, vec2 s){ float ra = res.x/res.y, ri = s.x/s.y;
  vec2 k = ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.);
  return (uv - .5) * k + .5; }
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n(p); p*=2.03; a*=.5; } return s; }

void main(){
  vec2 uv = v; uv.y = 1. - uv.y;
  float t = time * .06;
  vec2 q = vec2(fbm(uv*2.2 + t), fbm(uv*2.2 - t + 3.1));
  vec2 r = vec2(fbm(uv*3. + q*1.6 + t*1.3), fbm(uv*3. + q*1.6 - t + 7.7));
  vec2 m = mouse; m.y = 1. - m.y;
  float md = smoothstep(.45, 0., distance(uv*vec2(res.x/res.y,1.), m*vec2(res.x/res.y,1.)));
  vec2 flow = (r - .5) * (.018 + md*.05*hover);
  // transition: noisy threshold sweeping across, with extra swirl mid-way
  float edge = fbm(uv*3.5 + t*2.) ;
  float k = smoothstep(mix_*1.35 - .35, mix_*1.35 - .05, edge*.9 + uv.x*.1);
  float swirl = sin(mix_*3.14159);
  vec2 dA = flow + (r-.5)*swirl*.12*(1.-k);
  vec2 dB = flow - (r-.5)*swirl*.12*k;
  vec2 ua = cover(uv*.96 + .02 + dA, sA);
  vec2 ub = cover(uv*.96 + .02 + dB, sB);
  float ca = .0025 + md*.004*hover;
  vec3 a = vec3(texture2D(tA, ua+vec2(ca,0)).r, texture2D(tA, ua).g, texture2D(tA, ua-vec2(ca,0)).b);
  vec3 b = vec3(texture2D(tB, ub+vec2(ca,0)).r, texture2D(tB, ub).g, texture2D(tB, ub-vec2(ca,0)).b);
  vec3 col = mix(a, b, 1.-k);
  col += (h(uv*res + time) - .5) * .045;             // film grain
  col *= 1. - .35*pow(distance(v, vec2(.5)), 2.);     // vignette
  gl_FragColor = vec4(col, 1.);
}`)),r.linkProgram(s),!r.getProgramParameter(s,r.LINK_STATUS))return;r.useProgram(s);let c=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,c),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),r.STATIC_DRAW);let l=r.getAttribLocation(s,`p`);r.enableVertexAttribArray(l),r.vertexAttribPointer(l,2,r.FLOAT,!1,0,0);let u=e=>r.getUniformLocation(s,e),d={tA:u(`tA`),tB:u(`tB`),res:u(`res`),sA:u(`sA`),sB:u(`sB`),mouse:u(`mouse`),time:u(`time`),mix:u(`mix_`),hover:u(`hover`)};r.uniform1i(d.tA,0),r.uniform1i(d.tB,1);let f=n.map(()=>null),p=e=>new Promise(t=>{if(f[e])return t();let i=new Image;i.crossOrigin=`anonymous`,i.src=n[e].tex,i.onload=()=>{let a=r.createTexture();r.bindTexture(r.TEXTURE_2D,a),r.texImage2D(r.TEXTURE_2D,0,r.RGB,r.RGB,r.UNSIGNED_BYTE,i),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),f[e]=a,n[e].w=i.naturalWidth,n[e].h=i.naturalHeight,t()},i.onerror=()=>t()}),m=()=>{let e=Math.min(devicePixelRatio,1.25)*(innerWidth<760?.6:.8);t.width=t.clientWidth*e,t.height=t.clientHeight*e,r.viewport(0,0,t.width,t.height),r.uniform2f(d.res,t.width,t.height)};m(),addEventListener(`resize`,m);let h=.5,g=.5,_=.5,v=.5,y=0,b=0;e.addEventListener(`pointermove`,e=>{let n=t.getBoundingClientRect();_=(e.clientX-n.left)/n.width,v=(e.clientY-n.top)/n.height,b=1}),e.addEventListener(`pointerleave`,()=>b=0);let x=e.querySelector(`[data-cap]`),S=e.querySelector(`[data-idx]`),C=0,w=1,T=0,E=!1,D=performance.now(),O=!0;new IntersectionObserver(([e])=>O=e.isIntersecting).observe(e);let k=()=>{r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,f[C]),r.activeTexture(r.TEXTURE1),r.bindTexture(r.TEXTURE_2D,f[w]??f[C]),r.uniform2f(d.sA,n[C].w,n[C].h);let e=f[w]?n[w]:n[C];r.uniform2f(d.sB,e.w,e.h)},A=performance.now(),j=e=>{requestAnimationFrame(j),O&&!document.hidden&&(h+=(_-h)*.06,g+=(v-g)*.06,y+=(b-y)*.04,!E&&e-D>6500&&f[w]&&(E=!0,D=e,k()),E&&(T=Math.min(1,(e-D)/2400),T>=.5&&x.dataset.i!==String(w)&&(x.dataset.i=String(w),x.textContent=n[w].title,x.href=`works/${n[w].slug}/`,S.textContent=String(w+1).padStart(2,`0`)),T>=1&&(C=w,w=(w+1)%n.length,T=0,E=!1,D=e,p(w),k())),r.uniform1f(d.mix,T),r.uniform1f(d.time,(e-A)/1e3),r.uniform2f(d.mouse,h,g),r.uniform1f(d.hover,y),r.drawArrays(r.TRIANGLE_STRIP,0,4))};Promise.all([p(0),p(1)]).then(()=>{k(),requestAnimationFrame(j),requestAnimationFrame(()=>t.classList.add(`on`))})}var t=()=>e(document.querySelector(`[data-hero]`));`requestIdleCallback`in window?window.requestIdleCallback(t,{timeout:1200}):setTimeout(t,300);