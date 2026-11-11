# Instrucciones del proyecto

## Contexto

Sitio web estático. Revisa los archivos y la configuración del proyecto antes de asumir qué framework, gestor de paquetes o flujo de publicación utiliza.

## Estructura

- Los archivos HTML de la raíz: páginas fuente y estructura semántica.
- `data/`: contenido editable en JSON. Conserva las claves que usan los atributos `data-site` y `data-site-list` del HTML.
- `designs/`: código fuente en css; estilos de la página.
- `resources/`: recursos gráficos fuente.
- `test-local.js` y `test-local.bat`: validan y ensamblan el sitio en `_site/`, y luego lo sirven localmente por HTTP sin dependencias externas.
- `_site/`: salida generada, no edites sus archivos directamente.

## Convenciones de trabajo

- Respeta el idioma y el tono definidos por el proyecto, y reutiliza las convenciones existentes de HTML, CSS y JavaScript sin introducir dependencias innecesarias.
- Conserva la accesibilidad: HTML semántico, etiquetas y nombres accesibles, texto alternativo útil y estados como `aria-current`.
- Al agregar o renombrar claves de contenido, actualiza tanto el JSON correspondiente como las referencias en HTML o JavaScript.
- Usa `textContent` para insertar contenido dinámico; no conviertas texto editable en HTML ejecutable.
- No inventes comandos de compilación o publicación: comprueba primero qué herramientas y scripts están configurados en el proyecto.

## Verificación

- Valida los archivos JSON modificados.
- Ejecuta `test-local.bat` en Windows o `node test-local.js` para regenerar `_site/` y servir el sitio en `http://localhost:8000`; presiona Ctrl+C para detener el servidor.
