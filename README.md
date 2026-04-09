# Para Emi 🌷

Una experiencia web interactiva, romántica y personalizada creada para una persona especial ("Emi"). Esta página no es solo una declaración, sino una pequeña obra de arte digital diseñada "con calma y sin afán".

## 📖 Descripción del Proyecto

El proyecto es una "carta de amor digital" interactiva (Single-Page Application) que combina diseño elegante, animaciones suaves y elementos muy personales. Está pensado para verse principalmente en dispositivos móviles (responsive web design).

Incluye un perrito animado llamado "Loki" (el "hijo de los dos"), un ramo de tulipanes dibujado matemáticamente, una galería de fotos en formato Polaroid y una carta secreta interactiva que el usuario puede abrir y hojear. Además, cuenta con un pequeño cortometraje animado personalizado renderizado directamente en el canvas del navegador.

## 🚀 Tecnologías y Herramientas Utilizadas

Esta web fue desarrollada desde cero, utilizando tecnologías fundamentales de la web **sin frameworks o librerías externas** dependientes (completamente Vanilla), garantizando una carga rápida y una larga vida útil del proyecto.

*   **HTML5:**
    *   Uso de Canvas `<canvas>` para la renderización de la animación principal de los personajes.
    *   Gráficos vectoriales escalables (`<svg>`) nativos para diseñar y animar matemáticamente un ramo de tulipanes en código.
*   **CSS3 (Vanilla CSS):**
    *   Sistema de diseño robusto usando Variables Nativas (Custom Properties) para paletas de colores (Rosas, Dorados y fondos oscuros elegantes).
    *   Animaciones complejas con `@keyframes` (respiración de elementos, destellos, parpadeo de ojos de Loki, etc.).
    *   Modos de mezcla y filtros (`blur`, `backdrop-filter` tipo *glassmorphism*).
    *   CSS Grid y Flexbox para layouts responsivos.
*   **JavaScript (Vanilla JS):**
    *   Manejo de estados para la navegación de la carta oculta (manejo del DOM, modal, paso de páginas).
    *   **Motor de Animación Custom:** Un bucle de animación con `requestAnimationFrame` que maneja físicas básicas (partículas de corazones), estados de personajes (caminar, entregar flores, cargar al perro) e interpolación lineal, todo dibujado a base de primitivas de Canvas API.

## ✨ Características Principales

1.  **Ramo de Tulipanes Vectorial**: Creado usando trayectorias SVG y con animación de balanceo suave.
2.  **Loki en CSS**: Un modelo completo de un cachorro creado únicamente apilando cajas y curvas de CSS, con cabeza animada, patas y cola.
3.  **Animación "Cinemática" (Canvas)**: Una mini historia o escena programada en JavaScript donde "Reydel" (autor) camina hacia "Emi", le entrega las flores y se lleva a pasear a "Loki".
4.  **Galería de Fotos**: Estilo polaroid con inclinaciones asimétricas (`rotación`) y efectos al pasar el cursor por encima (hover).
5.  **Carta Interactiva Modal**: Interfaz inmersiva con fondo desenfocado, barra de progreso superior y paginación con diferentes mensajes emocionales curados cuidadosamente.
6.  **Optimización**: Diseño de pantalla completa con soporte de "notch" (viewport-fit=cover) para asegurar que parezca una app nativa en dispositivos iOS/Android.

## ⚙️ Cómo Ejecutar el Proyecto

Dado que solo requiere tecnologías cliente (Frontend), es sumamente fácil de iniciar:
1. Clona o descarga el archivo en tu equipo.
2. Abre el archivo `index.html` en el navegador de tu preferencia (Google Chrome, Safari, Firefox).
3. ¡No requiere instalación de dependencias con NPM, Node.js ni servidores!.

---
*Hecho por Reydel ✨ - "Las cosas bonitas no necesitan afán"*
