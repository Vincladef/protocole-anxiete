# Protocole Anxiété

Application web mobile-first pour suivre un protocole court contre l’anxiété : respiration guidée, ancrage sensoriel, journal rapide et suivi de l’évolution avant/après.

## Objectif

L’application sert de support personnel pour traverser un pic d’anxiété et garder une trace de ce qui aide réellement.

Elle ne remplace pas un professionnel de santé. En cas de danger immédiat : appelez le **15**, le **112**, ou le **3114** en cas d’idées suicidaires en France.

## Fonctionnalités MVP

- Protocole “crise maintenant” en plusieurs étapes
- Respiration guidée 4/6
- Ancrage 5-4-3-2-1
- Défusion cognitive courte
- Journal avant/après
- Historique local
- Données stockées dans le navigateur via `localStorage`

## Stack

- React
- TypeScript
- Vite
- CSS simple, sans framework

## Installation locale

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Déploiement Netlify

Le fichier `netlify.toml` est déjà inclus. Build command :

```bash
npm run build
```

Publish directory :

```bash
dist
```
