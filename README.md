# ngFollow
Repositorio de código fuente para mi proyecto personal de Red Social. Desarrollo con MEAN Stack (MongoDB, Express.js, Angular, y Node.js).

Mi objetivo con este proyecto ha sido desarrollar mis conocimientos con las tecnologías mencionadas anteriormente. Es un proyecto totalmente personal con el cual decidí practicar mis habilidades, sin embargo, eres libre de utilizar este proyecto como base para cualquier proyecto que quieras llevar a cabo, con o sin fines comerciales. 

Si quieres hacer mejoras en el proyecto y te gustaría regalarme tu feedback para corregir errores o mejorar funcionalidades, te agradecería mucho y te invitaría a realizar un Pull request sobre este repositorio.

## Requerimientos previos.
Antes de poner en funcionamiento este proyecto, debes asegurarte de tener instalado en tu equipo lo siguiente:

* **MongoDB Community Server**, ***versión 4.0 o superior***. Puedes descargarlo desde aquí: <https://www.mongodb.com/download-center?jmp=nav#community>.
* **Node.js**, ***versión 10.6.0 o superior***. Puedes descargarlo desde aquí: <https://nodejs.org/es/>.
* **Git**, ***versión 2.17.1 o superior***. Puedes descargarlo desde aquí: <https://git-scm.com/>
* Una carpeta para contener el repositorio del código fuente, por ejemplo ***"ngFollowApp"*** en cualquier ruta de directorio de tu equipo.

## Descarga código fuente
En la carpeta que hayas creado para contener el proyecto, abre un nuevo terminal y ejecuta el siguiente comando: 
    
    git https://github.com/RogerOrdonez/ngFollow.git

## Instalación del proyecto Back-End
Una vez descargado el repositorio del código fuente, ingresa a la carpeta Back-End que se creó en tu directorio, abre un nuevo terminal ubicado en esa ruta y ejecuta el siguiente comando: 

    npm install
    
Cuando se termine la instalación de todas las dependencias, siempre ubicado en la carpeta Back-End que se creó en tu directorio, ejecuta el siguiente comando:
    
    npm start
    
Si el proyecto inicia correctamente, deberás ver en el terminal los siguientes mensajes:

*La conexión a la BD MySocialNetwork ha sido exitosa...*

*Servidor Express.js corriendo correctamente.*

## Instalación del proyecto Front-End
Ingresa a la carpeta Front-End que se creó en tu directorio, abre un nuevo terminal ubicado en esa ruta y ejecuta el siguiente comando: 

    npm install
    
Cuando se termine la instalación de todas las dependencias, siempre ubicado en la carpeta Front-End que se creó en tu directorio, ejecuta el siguiente comando:
    
    ng serve   
    
Una vez completada la compilación, si el proyecto inicia correctamente, deberás poder acceder a *http://localhost:4200* desde tu navegador y poder visualizar la aplicación ngFollow.
