# Otaki Factory — Landing page de producto

Landing de alta conversión para **Otaki Factory — Godzilla**, figuras de acción de coleccionista.
HTML, CSS y JavaScript puros, sin dependencias ni build.

## Ver en local

```bash
node server.js
```

Abre <http://127.0.0.1:4173/>

## Estructura

```
index.html      # Contenido y estructura semántica
styles.css      # Sistema de diseño + responsive
script.js       # Visor 360°, FAQ, menú, validación del formulario
server.js       # Servidor estático para desarrollo
assets/
  otaki-logo.png      # Logo a color, fondo transparente (usado en header/footer)
  otaki-logo-red.png  # Variante monocroma roja
  otaki-logo.jpg      # Original facilitado por el cliente
```

## Sistema de color

Extraído del logo (sello Otaki Factory):

| Token | Color | Origen |
| --- | --- | --- |
| `--red` | `#F24E27` | Naranja-rojo del texto Japanese-style |
| `--violet` | `#8B44C4` | Contorno del texto del sello |
| `--blue` | `#2E86DE` | Cielo del diamante |
| `--gold` | `#F7D774` | Rayos del sol |
| `--ink` | `#0A0710` | Base profunda con matiz violeta |

## Secciones

`#coleccion` · `#detalles` · `#galeria` · `#faq` · `#tienda-o-reserva`

## Notas

- Accesible: skip link, roles ARIA, `prefers-reduced-motion`, foco visible, estados `aria-invalid`.
- El formulario de reserva es una demo local: conectar a un CRM o proveedor de email para activar el envío real.
- Los testimonios son copy de muestra y deben sustituirse por reseñas verificadas antes de la apertura comercial.
- Godzilla y las marcas relacionadas pertenecen a sus titulares. Otaki Factory edita esta pieza como homenaje para coleccionistas.
