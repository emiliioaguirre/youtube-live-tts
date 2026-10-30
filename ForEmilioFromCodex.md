# YouTube Live TTS, explicado desde el código

Este proyecto convierte mensajes de un directo de YouTube en voz, y reproduce el audio en la computadora que ejecuta el backend. El navegador sirve como panel de control; Python escucha el chat, llama a ElevenLabs y maneja las bocinas.

## El recorrido de un mensaje

```text
YouTube Live
  -> pytchat
  -> listener_loop: prefijo, longitud y cooldown
  -> asyncio.Queue
  -> speaker_loop
  -> ElevenLabs: texto a bytes de audio
  -> soundfile: decodificación
  -> sounddevice: reproducción local

FastAPI -> WebSocket -> dashboard: mensajes, estado y cola
```

La cola funciona como una fila frente a un micrófono. Varios mensajes pueden llegar casi al mismo tiempo, pero un solo `speaker_loop` los procesa en orden. Así se evita que las voces se encimen. Su capacidad depende de `MAX_QUEUE_SIZE`, importado desde la configuración local.

`listener_loop`, en `backend/services/youtube.py`, obtiene mensajes con `pytchat`, filtra los que pueden leerse y construye el texto con `tts_template`. El historial recibe también mensajes que no pasaron los filtros. Eso explica por qué el panel puede mostrar más actividad que la que se escucha.

`speaker_loop` toma un elemento de la cola, solicita el audio y espera a que termine la reproducción. Las llamadas bloqueantes de TTS y audio se ejecutan mediante `asyncio.to_thread()`: el trabajo sale del hilo del bucle asíncrono mientras este sigue atendiendo otras tareas.

## Qué vive en cada carpeta

| Ruta | Responsabilidad |
| --- | --- |
| `backend/main.py` | Crea FastAPI, expone rutas HTTP, acepta WebSockets y controla las tareas del bot. |
| `backend/models.py` | Define configuración, estado, mensajes y filtros con Pydantic. |
| `backend/services/youtube.py` | Escucha el chat, filtra mensajes y coordina la cola y la lectura. |
| `backend/services/tts.py` | Convierte texto con ElevenLabs y reproduce el resultado. |
| `backend/services/websocket.py` | Distribuye eventos a los navegadores conectados. |
| `frontend/src/app/` | Entrada de Next.js, layout y estilos globales. |
| `frontend/src/components/dashboard/` | Panel, configuración, estadísticas y mensajes. |
| `frontend/src/store/dashboard-store.ts` | Estado compartido de Zustand y llamadas HTTP al backend. |
| `frontend/src/components/dashboard/dashboard-layout.tsx` | Conexión WebSocket y reintentos con espera creciente. |
| `frontend/src/components/ui/` | Componentes reutilizables basados en Radix y shadcn/ui. |
| `frontend/src/components/onboarding/` | Bienvenida y recorrido guiado. |
| `frontend/src/lib/i18n/` | Idiomas y traducciones. |
| `dev.ts` | Arranca frontend y backend con Bun. |
| `.github/workflows/ci.yml` | Verificaciones automáticas de frontend y Python. |
| `.github/dependabot.yml` | Propuestas periódicas de actualización de dependencias. |

## Dos programas y dos formas de comunicarse

El frontend usa Next.js con React, TypeScript y Tailwind. El backend usa FastAPI, Pydantic y bibliotecas de Python para chat y audio. Esta separación permite que el panel permanezca en el navegador y que la reproducción use el dispositivo de audio del sistema donde corre Python.

HTTP se usa para operaciones puntuales: guardar configuración, iniciar o detener el bot y consultar voces. El WebSocket lleva los cambios que llegan mientras el panel está abierto: nuevos mensajes, estado de conexión, tamaño de la cola y lecturas realizadas. Así el navegador no necesita consultar continuamente para descubrir cada cambio.

Zustand concentra la configuración y el estado visibles para los componentes. `dashboard-layout.tsx` recibe eventos del WebSocket y llama a las acciones del store. Las tarjetas del dashboard consumen ese mismo estado.

La configuración del frontend se guarda en `localStorage`, incluida la clave de ElevenLabs. El backend conserva su configuración y el historial en memoria. No hay una base de datos en la implementación revisada; reiniciar Python pierde ese estado. Esto importa si algún día el proyecto se convierte en un servicio para varias personas: hoy las variables globales representan un solo bot por proceso.

## El mantenimiento y las ramas

```text
feat/*, fix/*, chore/*
  -> PR revisado hacia development
  -> verificaciones de CI
  -> PR de promoción hacia main
```

`development` reúne el trabajo en curso. `main` conserva los cambios promovidos después de revisión. Las dos ramas ejecutan las mismas verificaciones. Tener una segunda rama solo ayuda si el equipo realmente usa ese recorrido.

Los PRs de funcionalidades pueden integrarse con squash. Para promover `development` a `main` conviene conservar un merge commit: ambas ramas son permanentes y necesitan compartir la historia de las promociones. Borrar `development` después de una promoción rompería el flujo esperado.

Dependabot está configurado para revisar cada lunes a las 09:00, hora de Ciudad de México, tres ecosistemas: Bun en `/frontend`, pip en `/backend` y GitHub Actions. Los PRs de nuevas versiones apuntan a `development`. Los cambios minor y patch se agrupan por ecosistema; los major quedan separados para revisar sus requisitos de migración.

Hay una condición de activación: GitHub lee `.github/dependabot.yml` desde la rama predeterminada, `main`. La configuración debe integrarse ahí para que las revisiones programadas comiencen. Los PRs siguen requiriendo revisión e integración; programar una búsqueda de versiones no equivale a aprobarlas automáticamente.

Las actualizaciones de seguridad de Dependabot, si se habilitan en GitHub, se dirigen a la rama predeterminada. Esas correcciones deben sincronizarse también con `development`.

## Qué significa actualizar una dependencia

`frontend/package.json` declara versiones o rangos aceptados. `frontend/bun.lock` registra la resolución concreta. `bun install --frozen-lockfile`, usado por CI, reproduce esa resolución y falla si necesita cambiar el lockfile.

Por ejemplo, permitir `^4.2.2` no hace que cada instalación congelada busque la versión 4 más reciente. Hace falta actualizar el lockfile, guardar el resultado y verificarlo. Es la diferencia entre una lista de ingredientes permitidos y el recibo de lo que realmente se compró.

En este mantenimiento se actualizaron dependencias del frontend dentro de sus versiones mayores actuales. Next.js y `eslint-config-next` quedaron en 16.4.3; React y React DOM, en 19.3.1. Framer Motion, ESLint y TypeScript conservaron sus versiones mayores existentes. Que una versión sea reciente no demuestra compatibilidad: lint, tipos y build aportan evidencia antes de integrarla.

Python utiliza rangos en `backend/requirements.txt` y todavía no tiene un lockfile. Por eso dos instalaciones realizadas en fechas distintas pueden resolver versiones distintas. Dependabot usa `versioning-strategy: increase` para proponer aumentos del requisito mínimo; aun así, los rangos no equivalen a una resolución completamente fijada.

## Cómo verificar cambios

```bash
# Desde la raíz
ruff check backend/
ruff format --check backend/

# Desde frontend/
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run build
```

Estos comandos comprueban reglas estáticas, tipos y compilación. No prueban que un directo de YouTube siga disponible, que una clave de ElevenLabs tenga crédito, que Python arranque o que las bocinas reproduzcan audio. La prueba completa necesita un directo activo, una clave válida y un dispositivo de salida.

## Detalles que conviene tener presentes

- **Falta una configuración importada por el backend.** `main.py`, `tts.py` y `youtube.py` importan constantes de `config`, pero `backend/config.py` no está versionado y `.gitignore` lo excluye. El `.env.example` actual tampoco define todas esas constantes ni existe un cargador de `.env` en los archivos revisados. Un clon limpio necesita resolver ese faltante antes de arrancar el bot. Este mantenimiento no modifica esa configuración.
- **El arranque depende de Python 3.12.** Los scripts de `package.json` y `dev.ts` invocan `python3.12`; el job de CI usa Python 3.11. La instalación y el lint de CI no demuestran que el comando local de arranque esté disponible.
- **El script de desarrollo termina procesos por puerto.** `dev.ts` usa `lsof` y `kill -9` sobre los puertos 8000 y 3000. Puede afectar otro programa que esté usando esos puertos, y esos comandos requieren un entorno compatible. Conviene revisar este comportamiento antes de ejecutar el proyecto en una máquina con otros servicios locales.
- **La marca de lectura tiene dos momentos.** `listener_loop` asigna `was_read` al encolar, mientras que `messages_read` aumenta después de obtener audio y completar la llamada de reproducción. No representan exactamente el mismo evento.
- **La configuración de CI también necesita mantenimiento.** Se corrigió `cache-dependency-path` para señalar `backend/requirements.txt`, porque los requisitos no viven en la raíz. La caché debe depender del archivo que realmente define la instalación.

La lección práctica es comprobar el recorrido que interesa. Una actualización puede compilar correctamente y todavía necesitar una prueba con audio. Una automatización puede tener YAML válido y todavía necesitar que su configuración llegue a la rama que GitHub utiliza para activarla.

Durante la verificación aparecieron dos problemas concretos. Las carpetas `.nosync` estaban entrando al análisis de TypeScript y ESLint como si fueran código de la aplicación; se excluyeron de ambos y de Git. También el linter actualizado detectó un `setApiKeyValid(null)` síncrono dentro de un efecto: se retiró esa llamada duplicada porque el `onChange` del campo ya reinicia el indicador. La corrección conserva el guardado diferido y las llamadas de validación existentes.
