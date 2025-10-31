# IG: Entregable semana 6-7: sistema planetario

## Introducción

Nos han pedido hacer un sistema planetario en THREE.js, básicamente un sistema que tenga una estrella en el centro y los planetas vayan girando alrededor de esta, también que algunos planetas tengan satélites, como es el caso de la Tierra con la Luna.

En este caso, para hacer este trabajo, decidí hacer una composición realista de nuestro Sistema Solar, incluí todos los planetas conocidos y satélites en la Tierra y Marte, e intenté ser lo más realista con las rotaciones.

## Cámaras

### Modo vuelo

El modo vuelo usa **FlyControls** para los controles de teclado y ratón, también se añadió la funcionalidad de que cuando seleccionas un planeta, la cámara haga zoom y muestre información.

[Vista previa del modo vuelo](https://github.com/jerofd-02/IG-S6-7-Sistema-Solar/blob/main/Videocaptura%20de%20pantalla_20251031_101757.mp4)

### Modo órbita

El modo órbita usa **OrbitControls** y básicamente puede hacer zoom y rotar la órbita para ver los planetas desde otra prespectiva.

[Vista previa del modo órbita](https://github.com/jerofd-02/IG-S6-7-Sistema-Solar/blob/main/Videocaptura%20de%20pantalla_20251031_101757.mp4)

### Modo creación

Aunque este modo no es específicamente una cámara el modo creación consiste en darle a la estrella, en este caso, el Sol, para crear planetas aleatorios. Cada uno tienes sus características si los seleccionas, con alguno de los modos que describí arriba. En este caso, **solo se pueden crear 3 planetas como máximo**.

[Vista previa del modo creación](https://github.com/jerofd-02/IG-S6-7-Sistema-Solar/blob/main/Videocaptura%20de%20pantalla_20251031_102926.mp4)

## Barras laterales

La barra de la derecha sirve para cambiar los modos descritos arriba, también da una descipción breve de los controles y además, puse mi nombre para que fuera fácil comprobar la auditoría.

La de la izquierda solo se muestra cuando haces clic en un planeta y sirve para visualizar las descipciones y la información de estos. Esta barra no está fija y se puede cerrar con un botón.

## Planetas, sátelites y estrellas

Cada planeta y estrella predefinido tiene su textura descargada de [Solar System Scope](https://www.solarsystemscope.com/textures/), **los planetas generados aleatoriamente no tienen textura**, aunque si color aleatorio. Y el único sátelite que tiene textura es la Luna, al no haber de Fobos y Deimos. También cada planeta tiene su órbita dibujada para ver la trayectoria que seguirá el planeta.

## Iluminación

Se utiliza la iluminación **MeshPhongMaterial** para los materiales, el Sol se representa mediante una **DirectionalLight**, que actúa como foco principal de iluminación. Además, se incluye una **AmbientLight** para proporcionar una iluminación ambiental suave que evita zonas oscuras, mientras que la luz direccional es la que genera las sombras sobre los planetas.
