# APPLICATION IMAINTER (Angular2)
==================================================================

## Vérifier l'installation de node.js ( > v7.6.0 )

> node --version

## Vérifier le fonctionnement de IMAInterService

Ouvrir le fichier data/imainter.json, et vérifier que l'URL imainter:{"server"} est fonctionnelle.

## Lancer l'application

> npm start

## Compiler l'application

> npm run tsc

Cependant c'est fait automatiquement lorsque `npm start` est en cours d'exécution.

## Créer une publication de l'application

> npm run bundle

L'application est générée dans le dossier bundle.


## Copier la publication sur le serveur de recette:

> npm run publish

L'application est copiée sur le serveur `//svtlsre01-pic/web/ImaInter`, mis à part le fichier data/imainter.json.


## Ajouter des libraries

Vérifier la configuration proxy du gestionnaire de package npm:

> npm config get proxy -g
null 

Si elle est à null:
> npm config set proxy http://ep.threatpulse.net:80  -g

Ajouter une librairie (exemple lodash):
> npm install lodash --save

Ajouter un outil de développement, ou des types typescript (exemple @types/lodash):
> npm install @types/lodash --save-dev

Ajouter la librairie dans la configuration system.config.js. system.config est l'outil de chargement dynamique des modules nodejs. 

```json
    map : { 'lodash': 'npm:lodash/lodash.js' }
```

Ajouter la librairie dans la configuration rollup-config.js. rollup est l'outil de création d'un package javascript. 
Il faut lui dire où se trouve les fichiers du package :

```json
    { include: [ ... , 'node_modules/lodash/lodash.js'] }.
```

Dans le cas où une fonction appelée n'est pas exportée par la librairie (requis par norme ES2015), ajouter un export nommé:

```json
    { namedExports: [ 'node_modules/lodash/lodash.js': ['merge'] }.
```

## Ajouter fichiers à empaqueter dans la publication

> fichier resources_files.json

Ce sont les fichiers de ressources copiés avec la commande bundle. Ajouter le fichier/dossier dans le fichier resources_files.json.