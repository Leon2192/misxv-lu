# Mis XV LU · React + Vite

Invitación digital local en JSX, adaptada a partir de los archivos HTML y recursos guardados como referencia.

## Ejecutar

```bash
npm install
npm run dev -- --port 5173 --strictPort
```

Abrí http://127.0.0.1:5173.

## Editar

- `src/data/invitation.js`: nombre, fecha, salón, ubicación, vestimenta, alias y CVU.
- `src/template/`: secciones de la invitación.
- `src/components/Gallery.jsx`: fotos de la galería y vista ampliada.
- `src/components/Countdown.jsx`: cuenta regresiva.
- `src/components/Modal.jsx`: cuadros de ubicación y regalos.
- `src/styles.css`: ajustes visuales de la versión React.
- `src/styles/`: estilos recuperados de la referencia.
- `public/assets/portadalu.jpeg`: portada.
- `public/images/`: fotografías de la galería.
- `index.html`: título y descripción del navegador.

La fecha del evento es el 12 de febrero de 2027 a las 21:00, hora argentina. La portada muestra solo la imagen; la cuenta regresiva aparece debajo. La galería permite ampliar las cinco fotos. El botón de asistencia queda preparado sin acción para agregar un enlace más adelante. No se reproduce música ni se muestra una pantalla de ingreso.

Los componentes retirados de la página permanecen en el código como referencia, pero no se importan en la aplicación. Los archivos HTML originales guardados también se conservan como referencia y no se ejecutan.

## Recursos locales

Para descargar las fuentes Montserrat y la imagen original usada en el cierre:

```bash
npm run assets:download
```

Se guardan en `public/assets/`. Hasta completar la descarga se usan los enlaces originales como respaldo. El mapa interactivo requiere Internet.

## Compilar

```bash
npm run build
npm run preview
```

La compilación queda en `dist/`. Volvé a compilar después de descargar nuevos recursos para incluirlos. El proyecto no se publicó.
