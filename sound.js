// Original, synthesized ambient score. No external music request or copyrighted recording.
const tools=document.querySelector('.tools');
const button=document.createElement('button');button.className='paper-button';button.id='sound-toggle';button.textContent='♫';button.setAttribute('aria-label','开启背景音乐');button.setAttribute('aria-pressed','false');tools?.prepend(button);
const caption=document.createElement('div');caption.id='voice-caption';caption.hidden=true;caption.textContent='嗨，欢迎来到 fancy 的设计世界，请你展开探索吧。';document.body.append(caption);
const style=document.createElement('style');style.textContent='#sound-toggle{font-size:21px}#sound-toggle[aria-pressed=true]{background:#e5eadb}#voice-caption{position:fixed;bottom:126px;left:50%;transform:translateX(-50%);z-index:6;max-width:88vw;width:max-content;background:#f7f6efe8;border:1px solid #c7c8ba;padding:12px 20px;border-radius:4px;font:14px/1.7 system-ui;text-align:center;pointer-events:none}';document.head.append(style);
let ctx,master,timer,enabled=false,step=0,spoken=false,duck=false;
const voice=new Audio('assets/fancy-greeting.wav');voice.preload='none';voice.volume=.9;
function level(){if(ctx&&master)master.gain.setTargetAtTime(enabled&&!document.hidden?(duck?.035:.11):0,ctx.currentTime,.3);}
function note(hz,t,duration){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=hz;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.22,t+.045);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+duration+.1);}
function schedule(){if(!enabled||document.hidden)return;const chords=[[261.63,329.63,392,523.25],[220,261.63,329.63,440],[174.61,220,261.63,349.23],[196,246.94,293.66,392]];const chord=chords[Math.floor(step/8)%4];note(chord[step%4],ctx.currentTime+.03,2.6);if(step%8===0)note(chord[0]/2,ctx.currentTime+.03,4);step++;}
async function toggle(on){enabled=on;button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'关闭背景音乐':'开启背景音乐');try{if(on){const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error('unsupported');ctx??=new C();if(!master){master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);}await ctx.resume();if(!timer){schedule();timer=setInterval(schedule,650);}}else{clearInterval(timer);timer=null;voice.pause();caption.hidden=true;duck=false;}level();}catch{enabled=false;button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','声音暂不可用，点击重试');}}
button.addEventListener('click',()=>toggle(!enabled));
// An explicit user gesture is required by mobile browsers for sound.
document.addEventListener('click',e=>{if(e.target.closest('#enter')&&!spoken){toggle(true);voice.load();}},{capture:true});
window.addEventListener('fancy-greet',()=>{if(spoken)return;spoken=true;duck=true;level();caption.hidden=false;voice.play().catch(()=>{caption.hidden=true;duck=false;level();});});
voice.addEventListener('ended',()=>{duck=false;caption.hidden=true;level();});voice.addEventListener('error',()=>{duck=false;caption.hidden=true;level();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){voice.pause();caption.hidden=true;duck=false;}level();});
