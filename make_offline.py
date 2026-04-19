import urllib.request
import base64
import os

html_path = r"C:\Users\RIGLESIA\Documents\APP\PROGRAMACION\universo_emi.html"

# URLs to fetch
threejs_url = "https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.min.js"
bg_url = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/space/px.jpg"

print("Downloading Three.js...")
req = urllib.request.Request(threejs_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    threejs_code = response.read().decode('utf-8')

print("Downloading Background Texture...")
req2 = urllib.request.Request(bg_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req2) as response:
    bg_data = response.read()
bg_b64 = "data:image/jpeg;base64," + base64.b64encode(bg_data).decode('utf-8')

html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Tu Universo 🌌</title>
    
    <script>
    {threejs_code}
    </script>
    
    <style>
        body, html {{ margin: 0; padding: 0; height: 100%; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-tap-highlight-color: transparent; }}
        canvas {{ display: block; width: 100%; height: 100%; outline: none; touch-action: none; }}
    </style>
</head>
<body>

<canvas id="c"></canvas>

<script>
// --- THREE.JS SCENE ---
const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({{ canvas, antialias: true, alpha: false }});
// Optimizado para Retina Display del iPhone 12 Pro (limitado a 2 para 60fps estables)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);

// CONTROLES DE CÁMARA (Propios, con inercia, mejorados y seguros)
let targetRotX = 0.2, targetRotY = 0;
let currentRotX = 0.2, currentRotY = 0;
let targetDist = 420, currentDist = 420;

let dragging = false;
let lastX = 0, lastY = 0;

function onDown(e) {{
    dragging = true;
    const t = e.touches ? e.touches[0] : e;
    lastX = t.clientX;
    lastY = t.clientY;
}}
function onMove(e) {{
    if (!dragging) return;
    const t = e.touches ? e.touches[0] : e;
    const dx = (t.clientX - lastX) / window.innerWidth;
    const dy = (t.clientY - lastY) / window.innerHeight;
    targetRotY -= dx * 3;
    targetRotX = Math.max(-1.5, Math.min(1.5, targetRotX - dy * 3));
    lastX = t.clientX;
    lastY = t.clientY;
}}
function onUp() {{ dragging = false; }}

window.addEventListener("mousedown", onDown);
window.addEventListener("mousemove", onMove);
window.addEventListener("mouseup", onUp);
window.addEventListener("touchstart", onDown, {{passive: true}});
window.addEventListener("touchmove", onMove, {{passive: true}});
window.addEventListener("touchend", onUp, {{passive: true}});

// Zoom
window.addEventListener("wheel", (e) => {{
    targetDist += e.deltaY * 0.25;
    targetDist = Math.max(160, Math.min(800, targetDist));
}}, {{passive: true}});

let pinchDist = 0;
window.addEventListener("touchmove", (e) => {{
    if(e.touches && e.touches.length === 2) {{
        e.preventDefault(); 
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if(pinchDist) {{
            targetDist += (pinchDist - dist) * 0.8;
            targetDist = Math.max(160, Math.min(800, targetDist));
        }}
        pinchDist = dist;
    }}
}}, {{passive: false}});
window.addEventListener("touchend", () => {{ pinchDist = 0; }}, {{passive: true}});


// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const pointLight = new THREE.PointLight(0xff007f, 2, 800);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Textura de firmamento (100% offline con base64)
const loader = new THREE.TextureLoader();
loader.load("{bg_b64}", (tex) => {{
    scene.background = tex;
}});

// Estrellas (BufferGeometry para alto rendimiento)
const particleCount = 2000;
const particleGeo = new THREE.BufferGeometry();
const particlePos = new Float32Array(particleCount * 3);
for(let i=0; i<particleCount; i++){{
    const radius = 3000 * (0.3 + 0.7 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePos[i*3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePos[i*3+1] = radius * Math.cos(phi);
    particlePos[i*3+2] = radius * Math.sin(phi) * Math.sin(theta);
}}
particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
const particleMat = new THREE.PointsMaterial({{ size: 2.0, color: 0xffffff, transparent: true, opacity: 0.8 }});
const starField = new THREE.Points(particleGeo, particleMat);
scene.add(starField);

// Esfera Central (Core)
const coreMat = new THREE.MeshPhongMaterial({{ color: 0x111111, emissive: 0x220011, transparent: true, opacity: 0.9, shininess: 200 }});
const core = new THREE.Mesh(new THREE.SphereGeometry(40, 64, 64), coreMat);
scene.add(core);

// Texto central en sprite
function makeCenterTextTexture(text) {{
    const t = document.createElement("canvas");
    t.width = 1024; t.height = 512;
    const ctx = t.getContext("2d");
    ctx.font = "bold 90px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#ff0033";
    ctx.shadowColor = "#ff66aa"; ctx.shadowBlur = 50;
    ctx.fillText(text, t.width/2, t.height/2);
    return new THREE.CanvasTexture(t);
}}
const centerTex = makeCenterTextTexture("TE AMO ❤️");
const centerSprite = new THREE.Sprite(new THREE.SpriteMaterial({{ map: centerTex, transparent: true, depthTest: false }}));
centerSprite.scale.set(100, 50, 1);
centerSprite.position.set(0, 0, 0);
centerSprite.renderOrder = 999;
scene.add(centerSprite);

// Resplandor (Glow)
function makeGlow(size=1024, cOut="255,160,0", cIn="255,60,0") {{
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(size/2, size/2, size*0.05, size/2, size/2, size/2);
    grad.addColorStop(0, `rgba(${{cIn}},0.9)`);
    grad.addColorStop(0.5, `rgba(${{cOut}},0.5)`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,size,size);
    return new THREE.CanvasTexture(c);
}}
const glow = new THREE.Sprite(new THREE.SpriteMaterial({{ map: makeGlow("1024", "255,0,127", "255,100,200"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }}));
glow.scale.set(500, 500, 1);
scene.add(glow);

// Anillos
function ringTexture(size=1024) {{
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.translate(size/2, size/2);
    const inner = 0.34 * size, outer = 0.49 * size;
    const g = ctx.createRadialGradient(0,0,inner*0.3, 0,0,outer);
    g.addColorStop(0, "rgba(255,255,200,0)");
    g.addColorStop(0.3, "rgba(255,0,127,0.9)");
    g.addColorStop(0.65, "rgba(255,100,200,0.6)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0,0,outer,0,Math.PI*2); ctx.arc(0,0,inner,0,Math.PI*2,true); ctx.fill();
    return new THREE.CanvasTexture(c);
}}
const ringTex = ringTexture();
const ring1 = new THREE.Mesh(new THREE.RingGeometry(60, 80, 128), new THREE.MeshBasicMaterial({{ map: ringTex, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }}));
const ring2 = new THREE.Mesh(new THREE.RingGeometry(85, 100, 128), new THREE.MeshBasicMaterial({{ map: ringTex, transparent: true, side: THREE.DoubleSide, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }}));
ring1.rotation.x = ring2.rotation.x = Math.PI / 2;
scene.add(ring1); scene.add(ring2);

// Palabras flotantes
const baseWords = ["💖 Mi amor","🌞 Mi sol","🌎 Mi mundo","✨ Brillas","❤️ Te amo","🌌 Universo","👑 Reina","🌠 Estrella","💫 Mi cielo","🔥 Siempre tú","🎶 Tu risa","🦋 Libertad","💎 Eres todo","🙏 Gracias","💕 Cariño","🌹 Amor eterno","🤗 Abrazos","🌸 Esperanza","🌈 Alegría","🌟 Contigo","🧸 Ternura","🎁 Mi razón","🌙 Mi destino","💌 Recuerdos","🕊️ Mi paz","🪐 Mi universo","🌊 Mi calma","💡 Mi luz","🍒 Dulzura","🥰 Mi vida","🎇 Felicidad","🌻 Alegría","🌺 Mi flor","💜 Eternidad","🌟 Sueños","✨ Magia","🎵 Canción","🔥 Pasión","⭐ Mi estrella","🌴 Mi paraíso","🌄 Amanecer","🌃 Noche contigo","🎉 Mi fiesta","💫 Inspiración","🌷 Siempre juntos","🎀 Mi ternura","🍀 Mi fortuna","🪞 Mi reflejo"];
const WORDS = [];
for(let i=0; i<6; i++) WORDS.push(...baseWords);

function makeTextTexture(text, color) {{
    const c = document.createElement("canvas");
    c.width = 512; c.height = 128;
    const ctx = c.getContext("2d");
    ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = color; ctx.shadowBlur = 30;
    ctx.fillText(text, c.width/2, c.height/2);
    return new THREE.CanvasTexture(c);
}}

const COLORS = ["#ff66ff","#66ccff","#ffd36b","#ff9966","#8df59a","#ffa0f8","#c6a7ff","#ff4444","#44ff99","#99ccff"];
const textGroup = new THREE.Group();
scene.add(textGroup);

WORDS.forEach((word, i) => {{
    const spriteMat = new THREE.SpriteMaterial({{ map: makeTextTexture(word, COLORS[i % COLORS.length]), transparent: true }});
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(60, 15, 1);
    
    // Distribución esférica
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 160 + 140 * Math.random();
    sprite.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    sprite.userData = {{ phi, theta, radius: r, speed: 0.001 + 0.0015 * Math.random(), offset: Math.random() * Math.PI * 2 }};
    textGroup.add(sprite);
}});

// Resize window handler
window.addEventListener("resize", () => {{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}});

// Animation Loop
const clock = new THREE.Clock();
function tick() {{
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    
    // Aplicar inercia a la cámara (Smooth damping factor = 0.05)
    currentRotX += (targetRotX - currentRotX) * 0.05;
    currentRotY += (targetRotY - currentRotY) * 0.05;
    currentDist += (targetDist - currentDist) * 0.05;

    // Movimiento pasivo para que el universo siga girando solo (lento)
    if (!dragging) {{
        targetRotY += 0.0005; 
    }}

    // Calcular posición de la cámara (Coordenadas esféricas puras)
    const cx = Math.cos(currentRotX), sx = Math.sin(currentRotX);
    const cy = Math.cos(currentRotY), sy = Math.sin(currentRotY);
    camera.position.set(currentDist * sy * cx, currentDist * sx, currentDist * cy * cx);
    camera.lookAt(0,0,0);
    
    // Animaciones
    ring1.rotation.z += 0.002;
    ring2.rotation.z -= 0.0015;
    
    const pulse = 1 + 0.03 * Math.sin(t * 1.5);
    glow.scale.set(500 * pulse, 500 * pulse, 1);
    
    const corePulse = 1 + 0.05 * Math.sin(t * 3);
    core.scale.set(corePulse, corePulse, corePulse);
    
    textGroup.position.y = Math.sin(t) * 10;
    
    textGroup.children.forEach(sp => {{
        sp.material.opacity = 0.7 + 0.3 * Math.sin(t * 2 + sp.userData.offset);
        sp.userData.theta += sp.userData.speed;
        sp.position.x = sp.userData.radius * Math.sin(sp.userData.phi) * Math.cos(sp.userData.theta);
        sp.position.z = sp.userData.radius * Math.sin(sp.userData.phi) * Math.sin(sp.userData.theta);
    }});
    
    renderer.render(scene, camera);
}}
tick();
</script>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print("universo_emi.html generated successfully with ALL dependencies embedded!")
