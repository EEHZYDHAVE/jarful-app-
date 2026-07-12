# Jarful

Your money, in jars.

Jarful is a personal budgeting app built around the classic jars system. Instead of one lump budget, every naira you earn gets automatically split across jars you define, like Necessities, Financial Freedom, Long-Term Savings, Play, Education, and Give, each with its own percentage. As you spend, each jar drains like a drum: full the moment income lands, emptying as you use it.

## Features

- **Custom jars**: add, remove, rename, recolor, and set your own percentage split for each one. Nothing is hardcoded.
- **Custom categories**: log expenses under categories you define, each mapped to a jar.
- **Income sources**: tag income as Employment, Business, or whatever sources you actually have, and see the breakdown.
- **Goals**: independent savings goals with a target amount, duration, and a month by month log of what you actually contributed.
- **Multi-currency logging**: log income or expenses in another currency (USD, GBP, etc.), converted to your base currency using a rate you set.
- **Charts**: spend by jar, spend by category within a jar, income by source, and monthly trends, all filterable.
- **Dark and light themes.**
- **Installable**: works as a proper installable app (PWA) on desktop, Android, and iOS, with offline support.
- **GitHub Sync**: push and pull your data to a private repo you control, so it follows you across devices.

## Getting started

Open the live app here: `<paste your GitHub Pages URL here>`

For hosting this yourself, or setting up GitHub Sync, see [SETUP.md](./SETUP.md).

## How your data is stored

Everything lives in your browser's local storage on each device by default. Nothing is sent anywhere unless you turn on GitHub Sync yourself, and even then, it only ever talks to the private repo you configure, using a token that stays on your device.

## Status

This is a personal project, actively evolving. Expect things to change as it grows.
