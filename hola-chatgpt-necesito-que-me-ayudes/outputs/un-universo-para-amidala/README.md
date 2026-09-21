# Un universo para Amidala

Un regalo de flores amarillas para el 21 de septiembre de 2026, dedicado a Luisa (Amidala). Una carta de bienvenida abre una galaxia con un ramo central y cinco ramos flotantes, cada uno con una dedicatoria original de amistad.

## Abrir el regalo

1. Descomprime el ZIP completo. No abras el index dentro del ZIP.
2. En Visual Studio Code, elige **Archivo > Abrir carpeta** y selecciona `un-universo-para-amidala`.
3. Para verlo, abre `index.html` con tu navegador, o usa la extensión Live Server de VS Code si ya la tienes instalada.

No necesita instalar paquetes, compilar ni tener conexión a Internet. Usa HTML, CSS y JavaScript, con ilustraciones incluidas. Funciona en navegadores actuales como Chrome, Edge, Firefox y Safari.

## Archivos

```text
un-universo-para-amidala/
├── index.html             # Bienvenida, jardín y ventana de mensajes
├── css/
│   └── styles.css         # Colores, diseño, animaciones y versión móvil
├── js/
│   ├── dedicatorias.js    # Nombres, firma y todos los mensajes editables
│   └── app.js             # Navegación, ramos interactivos y estrellas
├── assets/
│   └── ramos.png          # Seis ilustraciones originales en una sola imagen
├── .nojekyll              # Configuración para GitHub Pages
├── .gitignore
└── README.md
```

## Personalizar

Abre `js/dedicatorias.js`. Puedes cambiar:

- `recipient`: el nombre o apodo de tu amiga. Ahora dice Amidala.
- `signature`: la firma al final de cada dedicatoria. Ahora dice «Con mucho cariño, de mí para ti.»; pon aquí tu nombre si quieres.
- `intro`: la carta inicial.
- `finalMessage`: la frase que aparece al descubrir los seis mensajes.
- `label`, `subtitle`, `kind`, `title`, `meaning` y `message`: los textos de cada ramo.

Conserva las comillas, comas y llaves; no cambies los identificadores `id` ni `art`. Para cambiar la fecha visible arriba o la descripción del enlace, edita también `index.html`. Guarda y recarga el navegador. No hay nombres ni datos enviados a ningún servicio.

Los significados de las flores son personales e inventados para este regalo. Puedes reescribirlos con anécdotas que solo ustedes entiendan.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub. Si usas GitHub Free, elige **Public**. Puedes llamarlo `un-universo-para-amidala`.
2. En **Add file > Upload files**, sube el contenido de esta carpeta: `index.html`, `README.md`, las carpetas `css`, `js`, `assets` y los archivos que empiezan por punto. Confirma los cambios en la rama `main`.
3. Entra en **Settings > Pages**. En **Build and deployment**, elige **Deploy from a branch**. Selecciona **main** y **/(root)**, y pulsa **Save**.
4. Espera la publicación. Puede tardar hasta 10 minutos. En **Settings > Pages**, pulsa **Visit site** y copia ese enlace para compartirlo con Amidala.

**Sube los archivos, no el ZIP ni la carpeta que los contiene.** `index.html` debe verse directamente al abrir el repositorio. Conserva las carpetas tal como están para que las imágenes y estilos se encuentren correctamente. El sitio de GitHub Pages será público, al igual que el código si eliges un repositorio público.

Documentación oficial:

- [Crear un sitio de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Subir archivos a un repositorio](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Configurar la publicación desde una rama](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Cómo se usa

- Pulsa **Descubre tus flores** y toca cualquiera de los seis ramos.
- Cierra la dedicatoria con la X, la tecla Escape o tocando fuera de ella.
- **Otro poquito de cariño** recorre los mensajes sin volver al jardín.
- Las pequeñas estrellas marcan los mensajes descubiertos durante la visita. Al recargar, la cuenta empieza de nuevo.
- **La primera carta** regresa a la bienvenida. También funcionan Atrás y Adelante del navegador.
- El botón de la parte superior pausa las animaciones. Si tu dispositivo tiene activada la opción de reducir movimiento, el regalo la respeta automáticamente.
- También se puede navegar con Tab y abrir los botones con Enter o Espacio.

## Ilustraciones y funcionamiento

Las seis ilustraciones fueron generadas para este regalo mediante IA. Están incluidas localmente en `assets/ramos.png`, ordenadas en tres columnas y dos filas. El CSS muestra la parte correspondiente a cada ramo y suaviza sus bordes. El cielo usa un lienzo de estrellas y las flores se animan con CSS.

No usa fuentes externas, rastreadores, cuentas, formularios ni servicios de terceros. La fecha de la dedicatoria está fijada intencionalmente en el 21 de septiembre de 2026.
