/* Stream from NetEase's official external link; no recording is bundled. */
(() => {
 const audio=document.getElementById('background-music'),toggle=document.getElementById('music-toggle');
 const menu=document.getElementById('music-menu'),settings=document.getElementById('music-settings');
 const status=document.getElementById('music-status'),track=document.getElementById('music-track');
 const input=document.getElementById('music-file'),volume=document.getElementById('music-volume');
 const frame=document.getElementById('music-embed'),volumeLabel=document.getElementById('music-volume-label');
 const defaultTrack={src:'https://music.163.com/song/media/outer/url?id=730631.mp3',title:'碎月 · 八音盒与钢琴'};
 const embedUrl='https://music.163.com/outchain/player?type=2&id=730631&auto=1&height=66';
 let objectUrl=null,wanted=true,attempt=0,autoplayBlocked=false,embedded=false,online=true,playingConfirmed=false;
 audio.volume=.18;
 function showMenu(open){menu.hidden=!open;settings.setAttribute('aria-expanded',String(open));}
 function render(){
  const playing=!embedded&&!audio.paused&&!audio.ended;
  toggle.classList.toggle('playing',playing);
  if(embedded)toggle.removeAttribute('aria-pressed');else toggle.setAttribute('aria-pressed',String(playing));
  toggle.setAttribute('aria-label',embedded?'打开网易云播放器':playing?'暂停背景音乐':'播放背景音乐');
  toggle.title=embedded?'网易云播放器':status.textContent;
  volumeLabel.hidden=embedded;
 }
 async function play(){
  if(embedded||!audio.getAttribute('src'))return;
  const current=++attempt;
  try{
   const playback=audio.play(),hasPromise=playback&&typeof playback.then==='function';
   if(hasPromise)await playback;
   if(current!==attempt||!wanted){if(!wanted)audio.pause();return;}
   // Chrome 49's play() may return undefined even when autoplay was refused.
   // Keep the first tap as a retry, and let the playing event confirm playback.
   if(!hasPromise){
    autoplayBlocked=audio.paused;
    if(autoplayBlocked)status.textContent='轻触音符或开始按钮播放。';
    else if(!playingConfirmed)status.textContent='正在载入';
    render();return;
   }
   autoplayBlocked=false;status.textContent='循环播放';render();
  }catch(error){
   if(current!==attempt)return;
   if(error.name==='NotAllowedError'){autoplayBlocked=true;status.textContent='轻触音符或开始按钮播放。';}
   else if(error.name==='AbortError')status.textContent='已暂停';
   else{wanted=false;status.textContent=online?'网易云暂时无法播放，可重试或打开下方播放器。':'这份音频未能播放，请重新选取。';}
   render();
  }
 }
 function clearSource(){
  attempt++;audio.pause();frame.removeAttribute('src');frame.hidden=true;embedded=false;
  if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
  autoplayBlocked=false;playingConfirmed=false;
 }
 function useOnline(){
  clearSource();online=true;audio.src=defaultTrack.src;track.textContent=defaultTrack.title;
  wanted=true;status.textContent='正在连接网易云';render();play();
 }
 toggle.addEventListener('click',()=>{
  if(embedded){showMenu(true);return;}
  wanted=autoplayBlocked?true:!wanted;autoplayBlocked=false;
  if(wanted)play();else{attempt++;audio.pause();status.textContent='已暂停';render();}
 });
 settings.addEventListener('click',()=>showMenu(menu.hidden));
 document.getElementById('music-close').addEventListener('click',()=>showMenu(false));
 document.getElementById('music-online').addEventListener('click',useOnline);
 document.getElementById('music-use-embed').addEventListener('click',()=>{
  clearSource();embedded=true;online=true;wanted=false;audio.removeAttribute('src');audio.load();
  frame.src=embedUrl;frame.hidden=false;track.textContent=defaultTrack.title;
  status.textContent='在下方网易云播放器播放或暂停。';showMenu(true);render();
 });
 input.addEventListener('change',()=>{
  if(!input.files.length)return;
  clearSource();online=false;
  const file=input.files[0];objectUrl=URL.createObjectURL(file);audio.src=objectUrl;
  track.textContent=file.name;wanted=true;status.textContent='正在载入';render();play();showMenu(false);
 });
 volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;});
 audio.addEventListener('playing',()=>{if(!wanted||embedded){audio.pause();return;}playingConfirmed=true;autoplayBlocked=false;status.textContent='循环播放';render();});
 audio.addEventListener('pause',()=>{playingConfirmed=false;render();});
 audio.addEventListener('error',()=>{
  wanted=false;playingConfirmed=false;
  status.textContent=online?'网易云暂时无法播放，可重试或打开下方播放器。':'这份音频未能播放，请重新选取。';render();
 });
 document.querySelector('.music-control').addEventListener('keydown',event=>{if(event.key==='Escape'){showMenu(false);settings.focus();}});
 document.getElementById('start').addEventListener('click',()=>{if(wanted&&audio.paused)play();});
 useOnline();
})();
