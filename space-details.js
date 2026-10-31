import * as T from './vendor/three.module.js';
import * as A from './art.js';
const v=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export function pencilMaterial(map,{paper='#f5f4f0',ink='#53564b',cutoff=.02,strength=1,colorRetention=0}={}){
 return new T.ShaderMaterial({transparent:true,depthWrite:true,side:T.DoubleSide,uniforms:{drawing:{value:map},paperTone:{value:new T.Color(paper)},inkTone:{value:new T.Color(ink)},cutoff:{value:cutoff},strength:{value:strength},colorRetention:{value:colorRetention}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D drawing;uniform vec3 paperTone;uniform vec3 inkTone;uniform float cutoff;uniform float strength;uniform float colorRetention;varying vec2 vUv;
 void main(){vec4 c=texture2D(drawing,vUv);float a=smoothstep(cutoff,min(.999,cutoff+.035),c.a);if(a<.02)discard;float shade=clamp((1.-dot(c.rgb,vec3(.2126,.7152,.0722)))*strength,0.,1.);gl_FragColor=vec4(mix(mix(paperTone,inkTone,shade),c.rgb,colorRetention),a);
 #include <colorspace_fragment>
 }`});
}
export function addGinkgo(group,{plane,imageTexture,tree,cat}){
 const treeMap=imageTexture(tree);treeMap.userData.preserveAspect=true;
 const treeMesh=plane(group,8.3,8.3,treeMap,-5.85,4.08,7.2);treeMesh.name='ginkgo-tree';treeMesh.material=uniformTreeMaterial(treeMap);
 const catMap=imageTexture(cat);catMap.userData.preserveAspect=true;const catMesh=plane(group,1.75,1.75,catMap,-2.95,.82,5.95);catMesh.name='crouching-ragdoll';catMesh.material=pencilMaterial(catMap,{strength:.85,ink:'#68695f',paper:'#f1f0e9',colorRetention:.3});
 const leaves=[];
 const mouse=new T.Group();mouse.name='hanging-computer-mouse';mouse.position.set(-3.6,5.3,7.45);group.add(mouse);
 const cablePoints=[];for(let i=0;i<=40;i++){const t=i/40;cablePoints.push(v(Math.sin(t*Math.PI*2)*.035,-t*2.68,0));}mouse.add(new T.Line(new T.BufferGeometry().setFromPoints(cablePoints),new T.LineBasicMaterial({color:'#747c6c'})));
 const body=new T.Mesh(new T.SphereGeometry(.3,20,16),new T.MeshBasicMaterial({color:'#eeede4'}));body.scale.set(.68,1.13,.32);body.position.set(0,-3,0);mouse.add(body);
 const outline=[];for(let i=0;i<=60;i++){const a=i/60*Math.PI*2;outline.push(v(Math.sin(a)*.204,-3+Math.cos(a)*.339,.008));}mouse.add(new T.Line(new T.BufferGeometry().setFromPoints(outline),new T.LineBasicMaterial({color:'#747c6c'})));
 const split=new T.Line(new T.BufferGeometry().setFromPoints([v(0,-2.68,.06),v(0,-2.91,.105)]),new T.LineBasicMaterial({color:'#8a907e'}));mouse.add(split);const wheel=new T.Mesh(new T.BoxGeometry(.035,.09,.018),new T.MeshBasicMaterial({color:'#b0b5a4'}));wheel.position.set(0,-2.86,.1);mouse.add(wheel);
 const rootBed=new T.Group();rootBed.name='tree-ground-contact';group.add(rootBed);for(let j=0;j<3;j++){const pts=[];for(let k=0;k<=45;k++){const a=k/45*Math.PI*2;pts.push(v(-6.2+Math.cos(a)*(.65+j*.12),-.03+j*.008,7.3+Math.sin(a)*(.28+j*.05)));}rootBed.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:'#b7b9ab',transparent:true,opacity:.55})));}
 return {treeMesh,catMesh,leaves,mouse,rootBed};
}
export function animateLeaves(leaves,seconds){for(const leaf of leaves){const phase=(seconds*.065+leaf.phase)%1;leaf.mesh.position.set(leaf.origin+Math.sin(seconds*.55+leaf.seed)*.42+phase*.5,8.6-phase*8.55,7.4+Math.cos(leaf.seed)*.7+Math.sin(phase*6.28)*.35);leaf.mesh.rotation.set(Math.sin(seconds+leaf.seed)*.7,Math.sin(seconds*.7+leaf.seed)*.9,seconds*.35+leaf.seed);leaf.mesh.material.opacity=Math.min(1,phase*18,(1-phase)*12);}}
export function createPaperPlane(group){
 const root=new T.Group();root.name='orbiting-paper-airplane';group.add(root);
 const triangles=[[-1.2,0,.55,0,.09,-1.7,0,-.23,.42],[0,-.23,.42,0,.09,-1.7,1.2,0,.55],[-1.2,0,.55,-.23,-.08,.28,0,.09,-1.7],[0,.09,-1.7,.23,-.08,.28,1.2,0,.55]];
 for(let i=0;i<triangles.length;i++){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(triangles[i],3));geo.computeVertexNormals();const m=new T.Mesh(geo,new T.MeshBasicMaterial({color:i%2?'#e5e3d9':'#f5f2e9',side:T.DoubleSide}));m.add(new T.LineSegments(new T.EdgesGeometry(geo),new T.LineBasicMaterial({color:'#898c7c'})));root.add(m);}
 root.scale.setScalar(.27);return root;
}
export function animateAbout(figure,paper,seconds){
 if(figure){figure.position.set(Math.sin(seconds*.38)*.09,Math.sin(seconds*.61)*.09,Math.cos(seconds*.35)*.045);figure.rotation.z=Math.sin(seconds*.32)*.009;}
 if(paper){const a=seconds*.24,x=Math.cos(a)*3.55,z=Math.sin(a)*1.7,y=2.95+Math.sin(a*2)*.32;paper.position.set(x,y,z);const tangent=v(-Math.sin(a)*3.55,Math.cos(a*2)*.64,Math.cos(a)*1.7).normalize();paper.quaternion.setFromUnitVectors(v(0,0,-1),tangent);paper.rotateZ(Math.sin(a)*.16);}
}
export function buildStudio(parent,{plane,box,path,wood,wall,tree,imageTexture}){
 const g=new T.Group();g.name='window-design-studio';parent.add(g);
 const treeMap=imageTexture(tree);treeMap.userData.preserveAspect=true;
 for(const[x,size,z]of[[-2.65,6.4,-79.5],[.8,7.5,-80.5],[3.7,5.6,-79]]){const m=plane(g,size*.67,size,treeMap,x,size/2,z);m.material=pencilMaterial(treeMap,{cutoff:.965,strength:.55});}
 // Real mullions and a deep sill, with the garden physically behind the window.
 for(const x of[-4.25,-1.42,1.42,4.25])box(g,.11,5.8,.22,x,3.25,-75,wood);
 for(const y of[.35,3.4,6.15])box(g,8.6,.11,.25,0,y,-75,wood);
 box(g,8.8,.18,.65,0,.34,-74.9,wood);const glass=new T.Mesh(new T.PlaneGeometry(8.4,5.65),new T.MeshBasicMaterial({color:'#dce3d4',transparent:true,opacity:.045,depthWrite:false,side:T.DoubleSide}));glass.position.set(0,3.25,-74.97);g.add(glass);
 for(const x of[-3.2,-.4,2.4])path(g,[[x,4.8,-74.88],[x+.7,5.75,-74.88]],'#c2c7bb');
 const desk=box(g,6.7,.15,1.65,0,1.32,-71,wood);desk.name='studio-desk';
 for(const x of[-2.85,2.85])for(const z of[-70.45,-71.55])box(g,.14,1.25,.14,x,.64,z,wood);
 box(g,1.25,.32,1.3,-2.5,1.06,-71,wood);box(g,.35,.05,.03,-2.5,1.06,-70.33,null);
 const monitor=box(g,1.75,1.12,.12,-.6,2.26,-71.48,wall);monitor.name='studio-computer';
 plane(g,1.58,.93,A.studioScreen(),-.6,2.27,-71.405);box(g,.13,.38,.15,-.6,1.56,-71.45,wood);box(g,.8,.05,.46,-.6,1.42,-71.35,wall);
 const keyboard=box(g,1.3,.055,.48,-.6,1.44,-70.72,wall);for(let i=0;i<11;i++)path(g,[[-1.17+i*.11,1.472,-70.91],[-1.17+i*.11,1.472,-70.56]],'#b4b5a6');
 for(let i=0;i<5;i++){const book=box(g,.85+i%2*.1,.095,.64,-2.3,1.45+i*.095,-71,wall);book.rotation.y=(i%2?-.06:.03);}
 const notebook=plane(g,.92,.63,A.notebook(),1.05,1.42,-70.65);notebook.rotation.x=-Math.PI/2;
 const tablet=box(g,1.08,.065,.78,.98,1.47,-71.42,wall);tablet.name='studio-drawing-tablet';const screen=plane(g,.95,.65,A.studioScreen(),.98,1.508,-71.42);screen.rotation.x=-Math.PI/2;
 const pencil=box(g,.025,.025,.56,1.72,1.43,-71,wood);pencil.rotation.y=.35;
 // A small teddy toy sits on the worktop.
 const teddy=new T.Group();teddy.name='studio-toy';teddy.position.set(2.35,1.62,-71.25);g.add(teddy);
 function ball(x,y,z,r,sx=1,sy=1){const m=new T.Mesh(new T.SphereGeometry(r,12,9),new T.MeshBasicMaterial({map:wall,color:'#e5e1d4'}));m.position.set(x,y,z);m.scale.set(sx,sy,1);teddy.add(m);return m;}
 ball(0,0,0,.19,1,1.2);ball(0,.28,0,.18);for(const side of[-1,1]){ball(side*.14,.42,0,.07);ball(side*.2,.06,0,.07,1,1.6);ball(side*.11,-.18,.08,.08);const eye=ball(side*.065,.3,.16,.018);eye.material.color.set('#555b4e');}const nose=ball(0,.24,.18,.025);nose.material.color.set('#555b4e');
 box(g,.55,.05,.45,2.8,1.42,-70.65,wall);box(g,.06,.9,.06,2.8,1.9,-70.65,wood);const shade=new T.Mesh(new T.ConeGeometry(.3,.33,16,1,true),new T.MeshBasicMaterial({map:wall,side:T.DoubleSide}));shade.position.set(2.65,2.42,-70.65);shade.rotation.z=.3;g.add(shade);
 const chair=box(g,1.05,.12,.9,0,.75,-69.2,wood);box(g,1.05,1,.12,0,1.15,-68.8,wood);for(const x of[-.4,.4])for(const z of[-68.9,-69.5])box(g,.08,.72,.08,x,.36,z,wood);
 // The floor and baseboards now meet the rear wall instead of ending in midair.
 box(g,9,.16,.12,0,.08,-81.7,wood);return g;
}

export function addPlanterGarden(parent,{plane}){const g=new T.Group();g.name='flowerbed-plants';parent.add(g);const maps=[A.botanical(0),A.botanical(1),A.botanical(2)];for(let i=0;i<17;i++){const h=.7+(i%5)*.17,w=h*480/900,x=2.86+(i%9)*.4,z=5.12+(i>8?.34:0);const m=plane(g,w,h,maps[i%3],x,.56+h/2,z);m.rotation.y=Math.sin(i*3)*.2;m.rotation.z=Math.sin(i*1.5)*.12;m.name=i%3===2?'planter-daisy':'planter-foliage';}return g;}

function uniformTreeMaterial(map){return new T.ShaderMaterial({transparent:true,depthWrite:true,side:T.DoubleSide,uniforms:{drawing:{value:map},lineColor:{value:new T.Color('#62685c')},paperColor:{value:new T.Color('#f1f0e9')}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform sampler2D drawing;uniform vec3 lineColor;uniform vec3 paperColor;varying vec2 vUv;void main(){vec4 c=texture2D(drawing,vUv);float a=smoothstep(.965,.999,c.a);if(a<.02)discard;vec3 inkSource=pow(max(c.rgb,vec3(0.)),vec3(1./2.2));float ink=smoothstep(.08,.17,1.-dot(inkSource,vec3(.2126,.7152,.0722)));gl_FragColor=vec4(mix(paperColor,lineColor,ink),a);\n#include <colorspace_fragment>\n}'});}
