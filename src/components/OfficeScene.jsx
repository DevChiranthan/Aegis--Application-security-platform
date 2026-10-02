import { useEffect, useRef } from 'react';
import { TEAM } from '../data/team';

// A lightweight game renderer: all room geometry and sprites are drawn locally.
// No game assets, external images, physics engine or backend are required.
const W=960,H=570;
export function drawPerson(ctx,p,x,y,t=0,walking=false,back=false,scale=1){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)};
 ctx.fillStyle='#07100d66';ctx.beginPath();ctx.ellipse(0,3,12,4,0,0,Math.PI*2);ctx.fill();
 const step=walking?Math.sin(t*12)*3:0;
 r(-7,-7,6,9+step,'#202a30');r(2,-7,6,9-step,'#202a30');
 r(-9,0+step,8,4,'#141b20');r(2,0-step,8,4,'#141b20');
 r(-10,-22,20,16,p.color);r(-7,-20,13,9,p.color);r(-12,-19,4,12+step,p.color);r(9,-19,4,12-step,p.color);
 r(-12,-9+step,4,4,p.skin);r(9,-9-step,4,4,p.skin);
 r(-3,-23,6,5,p.skin);r(-8,-36,16,15,p.skin);r(-10,-33,3,8,p.skin);r(8,-33,3,8,p.skin);
 r(-8,-38,16,6,p.hair);r(-10,-35,4,7,p.hair);r(6,-35,4,8,p.hair);
 if(back)r(-8,-34,16,12,p.hair);else{r(-5,-29,2,2,'#24262b');r(4,-29,2,2,'#24262b');r(-1,-24,4,1,'#8f624e');}
 if(p.id==='atlas'){r(-6,-30,5,4,'#303f42');r(2,-30,5,4,'#303f42');r(-1,-29,3,1,'#303f42');r(-2,-17,3,10,'#3b4548');}
 if(p.id==='nova'){r(-11,-33,3,20,p.hair);r(9,-33,3,18,p.hair);r(-4,-16,8,2,'#d2e8db');}
 ctx.restore();
}
export function Avatar({person,size=42}){
 const ref=useRef(null);
 useEffect(()=>{const c=ref.current,cx=c.getContext('2d');cx.clearRect(0,0,64,64);drawPerson(cx,person,32,53,0,false,false,1.3)},[person]);
 return <canvas ref={ref} width="64" height="64" style={{width:size,height:size,imageRendering:'pixelated'}} aria-hidden="true"/>;
}
export default function OfficeScene({selected,onSelect,paused,speed,labels,mission}){
 const ref=useRef(null), live=useRef({selected,onSelect,paused,speed,labels,mission}), agents=useRef([]);
 live.current={selected,onSelect,paused,speed,labels,mission};
 useEffect(()=>{
 const canvas=ref.current,ctx=canvas.getContext('2d');let raf,last=0,clock=0;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 agents.current=TEAM.map((p,i)=>({...p,x:p.home[0],y:p.home[1],wait:7+i*3+Math.random()*3,route:[],walking:false}));
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};
 const text=(s,x,y,c='#c5d1c4',size=12)=>{ctx.font=`${size}px "IBM Plex Mono", monospace`;ctx.fillStyle=c;ctx.fillText(s,x,y)};
 const plant=(x,y)=>{r(x-9,y+3,18,12,'#2b3533');r(x-7,y+5,14,9,'#8c7355');r(x-2,y-15,4,20,'#61735b');r(x-15,y-16,13,9,'#547b59');r(x+1,y-22,12,10,'#789668');r(x-12,y-28,13,11,'#6d8c61');r(x+4,y-9,12,9,'#47694e');r(x-3,y-19,9,9,'#86a375');};
 const monitor=(x,y,col,t)=>{r(x+3,y+5,44,27,'#25333055');r(x,y,44,27,'#1d292d');r(x+3,y+3,38,20,'#29433e');r(x+5,y+5,34,2,'#3e5c4f');for(let j=0;j<4;j++)r(x+6,y+9+j*3,10+((j*7+Math.floor(t))%21),1,j%2?col:'#577167');r(x+18,y+27,8,5,'#2c3636');r(x+10,y+32,25,3,'#283332');};
 const desk=(x,y,col,t,dual=false)=>{r(x+5,y+8,108,58,'#1b282955');r(x+3,y+46,7,17,'#574d42');r(x+98,y+46,7,17,'#574d42');r(x,y,110,47,'#8e795a');r(x+2,y+2,106,40,'#b5a07a');r(x+3,y+5,104,1,'#c2ae88');r(x+3,y+41,103,5,'#786950');monitor(x+12,y-14,col,t);if(dual)monitor(x+60,y-14,col,t+3);else{r(x+75,y+8,14,18,'#d1c8a5');r(x+78,y+10,9,2,'#8b927e');r(x+78,y+14,8,1,'#8b927e')}
 r(x+24,y+26,39,11,'#4e5851');for(let k=0;k<3;k++)for(let j=0;j<9;j++)r(x+27+j*4,y+28+k*3,2,1,'#a7b1a0');r(x+69,y+29,6,8,'#515d58');r(x+93,y+22,7,9,'#e1d7b8');r(x+99,y+24,3,5,'#e1d7b8');r(x+94,y+22,5,2,'#655447');
 // chair, behind its occupant
 r(x+43,y+52,27,18,'#233436');r(x+45,y+53,23,12,'#465955');r(x+46,y+67,22,7,'#2b3f3d');r(x+54,y+73,4,5,'#26312f');r(x+44,y+77,25,3,'#25322f');};
 const wall=(x,y,w,h=9)=>{r(x+4,y+5,w,h+7,'#0c181b55');r(x,y,w,h,'#90a398');r(x,y,w,3,'#bdc9b5');r(x,y+h,w,5,'#4d655f')};
 function room(t){
 r(0,0,W,H,'#131f22');
 // Raised cutaway shell and fine tiled floors.
 r(22,39,918,511,'#091316');r(24,31,910,511,'#72877b');r(31,41,894,491,'#60766b');
 for(let y=44;y<531;y+=32)for(let x=32;x<925;x+=32){r(x,y,31,31,((x+y)/32|0)%2?'#63796d':'#667c70');r(x+1,y+30,29,1,'#5b7267');}
 // carpeted offices and operations room
 r(40,53,280,171,'#536963');r(331,53,288,171,'#586d65');r(637,53,279,171,'#60766c');
 r(40,266,452,254,'#536b62');for(let y=270;y<520;y+=8)r(40,y,452,1,'#576f66');
 r(638,273,278,247,'#786e5b');for(let y=275;y<520;y+=18){r(639,y,276,1,'#665f50');for(let x=640+(y%36?0:44);x<915;x+=88)r(x,y,1,17,'#6a6252')}
 // back wall, windows, office doors and openings
 wall(25,31,909,15);wall(25,48,9,482);wall(925,48,9,482);
 for(const x of [77,373,720]){r(x,33,112,23,'#233d41');r(x+3,35,106,17,'#7c9e98');r(x+5,37,49,13,'#608b86');r(x+58,37,49,13,'#608b86');r(x+53,35,4,19,'#bdc9b5');r(x+8,37,3,12,'#b2c6b4');r(x,55,112,4,'#b2bfaa')}
 wall(320,48,8,130);wall(320,204,8,29);wall(620,48,8,132);wall(620,206,8,27);
 wall(33,229,96);wall(190,229,230);wall(484,229,440);
 wall(627,268,8,146);wall(627,479,8,47);wall(33,529,598);wall(633,529,292);
 // doorway thresholds, warm ceiling strips
 r(130,231,60,4,'#b6bc9f');r(421,231,62,4,'#b6bc9f');r(630,419,4,59,'#b6bc9f');
 text('MANAGER',53,80,'#bfccb8',12);text('RISK & INTELLIGENCE',344,80,'#bfccb8',12);text('BRIEFING ROOM',653,80,'#bfccb8',12);
 text('SECURITY OPERATIONS',54,286,'#c8d1bc',12);text('THE COMMONS',650,293,'#d6c9a8',12);
 // manager and analyst stations
 desk(100,126,'#dcb576',t,true);desk(410,126,'#83c9ad',t,true);
 plant(56,197);plant(591,198);plant(894,201);
 // Bookshelves and noticeboard.
 r(244,94,53,84,'#3c5048');for(let k=0;k<3;k++){r(244,116+k*25,53,4,'#94a18a');for(let j=0;j<7;j++)r(248+j*6,99+k*25,4,17-j%3*3,['#bc9a69','#758d83','#b7b99a','#a67d65'][j%4])}
 r(348,105,38,44,'#9a9475');r(351,108,32,38,'#b9b597');r(355,114,12,10,'#e2d7ae');r(370,117,9,17,'#789b8c');
 // meeting table and six chairs
 for(const x of [699,741,783]){r(x,107,25,22,'#324e4c');r(x+2,106,21,7,'#7e9b87');r(x,181,25,22,'#324e4c');r(x+2,199,21,6,'#7e9b87')}
 r(685,136,148,48,'#3c443955');r(682,128,148,49,'#a89570');r(686,130,140,41,'#c2ad82');r(707,142,30,17,'#d8d7b9');r(744,140,22,15,'#3b5853');r(746,142,18,10,'#82a495');r(789,144,10,12,'#e4d9af');
 // four specialist workstations
 desk(90,306,'#9abb82',t);desk(298,306,'#86b8d5',t+2);desk(90,432,'#da9b84',t+4);desk(298,432,'#d3ca83',t+6);
 // central server / telemetry wall
 r(522,277,65,103,'#233334');r(528,281,53,91,'#1a292b');for(let i=0;i<6;i++){r(532,285+i*14,45,10,'#3b4c49');r(536,288+i*14,25,2,'#192d2e');r(570,288+i*14,3,3,(Math.floor(t*2)+i)%3?'#a0c08e':'#d3ad69');}
 text('TELEMETRY',517,398,'#becaba',10);plant(551,476);
 // communal sofa, rug, coffee table, coffee counter and water cooler
 r(682,376,198,120,'#978d7055');r(686,379,190,111,'#8b8f74');for(let x=690;x<876;x+=10)r(x,379,1,111,'#969779');
 r(705,329,153,43,'#273e38');r(708,330,147,13,'#688673');r(709,344,145,26,'#50715e');r(712,346,43,20,'#60816a');r(759,346,43,20,'#60816a');r(806,346,43,20,'#60816a');r(703,340,9,34,'#76907a');r(851,340,9,34,'#76907a');
 r(728,408,100,45,'#66583e');r(725,403,100,44,'#bc9f6d');r(729,405,92,2,'#ccb585');r(740,413,24,18,'#d7c7a0');r(743,416,18,2,'#7b866b');r(784,415,10,11,'#e7dec0');r(786,415,6,3,'#5f4d3e');
 r(659,493,108,26,'#3e5148');r(656,487,114,9,'#c3b190');r(663,468,24,22,'#283e3c');r(666,471,18,12,'#62776b');r(670,484,9,6,'#d2c9ae');r(704,476,7,10,'#e4d4b1');r(719,476,7,10,'#e4d4b1');r(885,465,22,49,'#c1c9b6');r(888,451,17,23,'#719c9a');r(891,452,11,4,'#a0bbb0');r(890,483,11,9,'#344e4b');plant(885,320);
 // security wall display
 r(844,94,58,59,'#304b46');r(848,98,50,46,'#203c36');for(let i=0;i<4;i++)r(854,106+i*8,8+(i*11)%35,3,'#90b697');
 // entrance mat and floor markings
 r(491,527,90,15,'#293d37');text('AEGIS HQ',502,538,'#9caf97',10);
 }
 function walk(a,dt){
 if(a.wait>0){a.wait-=dt;return;}
 if(!a.route.length){
 const [x,y]=a.home;
 // Rectilinear paths use open doorways and the shared corridor. Workers return to their own station.
 if(a.id==='atlas')a.route=[[154,249],[450,249],[464,199],[450,249],[154,249],[x,y]];
 else if(a.id==='nova')a.route=[[450,249],[553,249],[553,414],[553,249],[450,249],[x,y]];
 else {const aisle=a.id==='sage'||a.id==='cipher'?230:453;a.route=Math.random()>.45?[[aisle,y],[aisle,414],[606,414],[606,449],[661,449],[606,449],[606,414],[aisle,414],[aisle,y],[x,y]]:[[aisle,y],[aisle,249],[450,249],[aisle,249],[aisle,y],[x,y]];}
 }
 const [tx,ty]=a.route[0],dx=tx-a.x,dy=ty-a.y,dist=Math.hypot(dx,dy);a.walking=true;a.back=dy<0;
 const amount=dt*31;if(dist<=amount){a.x=tx;a.y=ty;a.route.shift();if(!a.route.length){a.wait=12+Math.random()*18;a.walking=false;}}else{a.x+=dx/dist*amount;a.y+=dy/dist*amount;}
 }
 function frame(now){
 const dt=Math.min((now-last)/1000||0,.05);last=now;
 const state=live.current;if(!state.paused&&!reduced){clock+=dt*state.speed;agents.current.forEach(a=>walk(a,dt*state.speed));}
 ctx.clearRect(0,0,W,H);room(clock);
 agents.current.slice().sort((a,b)=>a.y-b.y).forEach(a=>{
 if(state.selected===a.id){ctx.strokeStyle=a.color;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(a.x,a.y+4,20,8,0,0,Math.PI*2);ctx.stroke();}
 drawPerson(ctx,a,a.x,a.y,clock,a.walking&&!state.paused,a.back&&a.walking,1.03);
 if(state.labels){const width=a.name.length*8+18;r(a.x-width/2,a.y+12,width,20,'#122224ed');text(a.name,a.x-width/2+8,a.y+26,a.color,12);}
 if(state.selected===a.id||(!a.walking&&Math.floor(clock/5)%6===TEAM.indexOf(TEAM.find(p=>p.id===a.id)))){r(a.x-14,a.y-58,28,15,'#e3dfc4');for(let j=0;j<3;j++)r(a.x-8+j*6,a.y-52,3,3,'#426358');r(a.x-2,a.y-43,4,4,'#e3dfc4');}
 });
 raf=requestAnimationFrame(frame);
 }
 raf=requestAnimationFrame(frame);
 const click=e=>{const b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)*W/b.width,y=(e.clientY-b.top)*H/b.height;const found=agents.current.find(a=>Math.abs(a.x-x)<26&&y>a.y-46&&y<a.y+35);if(found)live.current.onSelect(found.id)};
 canvas.addEventListener('click',click);return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('click',click)};
 },[]);
 return <canvas className="office-canvas" ref={ref} width={W} height={H} role="img" aria-label="Animated pixel office with Atlas, Nova and four security workers. Select a team member using the cards below."/>;
}
