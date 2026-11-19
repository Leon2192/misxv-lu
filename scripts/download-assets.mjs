import { mkdir, writeFile, access } from 'node:fs/promises';

const destination = new URL('../public/assets/', import.meta.url);
const assets = [
  ['new-york.jpeg', 'https://latarjetadigital.com.ar/wp-content/uploads/2025/03/New-York.jpeg', 'image/'],
  ['montserrat-regular.ttf', 'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.ttf', 'font'],
  ['montserrat-bold.ttf', 'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-.ttf', 'font'],
];
await mkdir(destination, { recursive: true });
let failed = false;
for (const [filename, url, kind] of assets) {
  const target = new URL(filename, destination);
  try { await access(target); console.log(`Ya existe: ${filename}`); continue; } catch {}
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (kind === 'image/' ? !type.startsWith('image/') : !/font|octet-stream|ttf/.test(type)) throw new Error(`Contenido inesperado: ${type}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length < 100) throw new Error('Archivo vacío o incompleto');
    await writeFile(target, bytes);
    console.log(`Guardado: ${filename} (${bytes.length} bytes)`);
  } catch (error) {
    failed = true;
    console.error(`No se pudo descargar ${filename}: ${error.message}`);
    console.error(`Podés guardarlo manualmente desde ${url} en public/assets/${filename}`);
  }
}
if (failed) process.exitCode = 1;
else console.log('Imagen y fuentes listas para usarse localmente.');
