
#  HuellitasVet

Sistema de gestión veterinaria desarrollado con Angular.

##  Descripción

HuellitasVet permite gestionar la información de las mascotas, organizar citas veterinarias y consultar el historial médico.

##  Funcionalidades

- Registro de mascotas.
- Edición y eliminación de mascotas.
- Agendamiento de citas veterinarias.
- Edición y eliminación de citas.
- Control de horarios ocupados.
- Gestión del historial médico.

##  Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- Bootstrap
- CSS

##  Instalación y ejecución

1. Clona o descarga este repositorio.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Ejecuta el proyecto:

   ```bash
   ng serve
   ```

5. Abre en tu navegador:

   http://localhost:4200

## Registro de propietarios y atención

Registra primero al propietario con DNI único de 8 dígitos, nombre y teléfono de 9 dígitos. Luego registra la mascota vinculada a ese DNI, incluyendo peso en kg y fecha de nacimiento.

Horario: lunes a sábado, 09:00 a 18:00; citas de 30 minutos (última cita: 17:30). Domingos cerrado. No se permiten horarios ocupados ni fechas pasadas.

Los registros se mantienen en memoria durante la sesión; al recargar la página se eliminan.

Ejecuta `npm start` para iniciar, `npm run build` para compilar y `npm test` para verificar.

##  Autores

Cordova Hamilton Andre.
Cornejo Lot Sebastian
