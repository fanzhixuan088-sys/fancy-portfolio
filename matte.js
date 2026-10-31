// Keep enclosed white paper inside the silhouette; key the outer white background.
// At the feet remove enclosed white regions as well, so the floor remains visible.
export function createLineArtMatte(w,h){
 const n=w*h,queue=new Int32Array(n),outside=new Uint8Array(n),barrier=new Uint8Array(n);
 return pixels=>{
  outside.fill(0);barrier.fill(0);
  for(let j=0;j<n;j++)if(Math.min(pixels[j*4],pixels[j*4+1],pixels[j*4+2])<212){barrier[j]=1;if(j%w)barrier[j-1]=1;if(j%w<w-1)barrier[j+1]=1;if(j>=w)barrier[j-w]=1;if(j<n-w)barrier[j+w]=1;}
  let head=0,tail=0;
  function add(j){if(j<0||j>=n||outside[j]||barrier[j])return;outside[j]=1;queue[tail++]=j;}
  for(let x=0;x<w;x++){add(x);add(n-w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
  while(head<tail){const j=queue[head++];if(j%w)add(j-1);if(j%w<w-1)add(j+1);add(j-w);add(j+w);}
  for(let j=0;j<n;j++){const i=j*4,shade=Math.min(pixels[i],pixels[i+1],pixels[i+2]),y=Math.floor(j/w)/h;
   const ink=Math.max(0,Math.min(1,(250-shade)/65));
   const footBlend=Math.max(0,Math.min(1,(y-.79)/.055));
   let alpha=outside[j]?0:255*(1-footBlend+footBlend*ink);
   // Remove faint isolated watermark far outside the moving figure.
   if(j%w>w*.82&&y>.89)alpha=0;
   pixels[i+3]=alpha;
  }
  return pixels;
 };
}
