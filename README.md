# Mon pont chaban

Mon pont chaban est une application web qui permet de visualiser les prochaines ouvertures du pont Chaban-Delmas à Bordeaux.

Le code source est publié sous licence MIT et accessible publiquement.

## Soutien

Mon Pont Chaban est développé et maintenu sans financement. Les coûts d'hébergement sont pris en charge par l'éditeur du projet.

Si vous souhaitez soutenir le projet, vous pouvez faire un don ici :

[Faire un don](https://donate.stripe.com/5kA7t5eVFeogauk000)

## Présentation de l'application

L'application est accessible à l'adresse suivante : https://pont-chaban-delmas.com

Elle permet de visualiser les prochaines ouvertures du pont Chaban-Delmas à Bordeaux. Les données sont récupérées depuis l'api de la métropole de Bordeaux et sont mises à jour toutes les heures.

La solution est constituée de deux parties :

- Une web app full stack développée avec le framework [Remix](https://remix.run) et hébergée sur [Fly.io](https://fly.io).
- Une application mobile développée avec [React Native](https://reactnative.dev) et déplyée à l'aide d'[Expo](https://expo.dev).

Une partie du code source est partagée entre les deux applications nottament la logique de tri et de filtrage des prochaine dates d'ouverture du pont et de mise à jour du statut du pont.

L'api utilise trpc pour la gestion des requêtes et des réponses ce qui permet de typer toutes les données échangées entre le client et le serveur et de générer automatiquement un client utilisable dans l'application mobile et dans l'application web.

## Design

Le design système de l'application est basé sur [Tailwind CSS](https://tailwindcss.com) et [Tailwind UI](https://tailwindui.com) pour la partie web et sur [Tamagui](https://tamagui.dev/) pour la partie mobile. La logique de gestion des thèmes est partagée entre les deux applications.

## Monorepo

Le code source de l'application est organisé dans un monorepo. Les deux applications sont dans le dossier `apps` et le code partagé est dans le dossier `packages`.

## Contribution

Toute contribution est la bienvenue. N'hésitez pas à ouvrir une issue ou à proposer une pull request.

## Merci

J'espère que cette application vous sera utile. N'hésitez pas à me faire un retour.
