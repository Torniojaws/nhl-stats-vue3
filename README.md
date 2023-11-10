# NHL Statistics

Show the daily NHL statistics in a user-friendly format

## APIs

The data is collected from two public APIs provided by https://www.nhl.com

First we get the info which games were played "last night" (Finnish timezone) from:
https://api-web.nhle.com/v1/schedule/2023-11-09
Where the games are in an array: `gameWeek[0].games[i]`. Each date array has an object with
various pieces of data.
The game ID is in `gameWeek[0].games[i].id`. The ID is then used below.

Using the game IDs (the number in the url), we retrieve the game results from:
https://api-web.nhle.com/v1/gamecenter/2023020193/boxscore
Where the number is in format:
YYYY = Season, eg. 2023 means season 2023-24
NN = Season type, where 01 = Preseason, 02 = Regular season, 03 = Playoffs
NNNN = Game number, starting from 0001

So 2023020500 means the 2023-24 regular season game number 500.

## What is shown

There are multiple sites that show all kinds of data from the games, but we are only interested in
particular pieces of data:

- The teams and the game result (obviously)
- Who scored in the game
- Goalie statistics for both teams

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
