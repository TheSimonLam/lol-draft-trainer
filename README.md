# LoL Draft Trainer for pblol.co.uk

Built using Node v10.14.1

1. On page load, get all champions and champion icons and store them
2. Select side
3. Select 5 champions for each role that the enemy will pick
4. Select 5 champions for each role that the you  will pick
5. Press Start
6. 1st ban phase: Blue ban, red ban
7. 1st pick phase: Blue first pick, red picks 2, blue picks 2, red last pick
8. 2nd ban phase: Blue ban, red ban
9. 2nd pick phase: Red first pick, blue picks 2, red last pick

Logic for enemy pick:
1. There will be a config that states which role will be picked for first depending on side
2. Pick timing is randomized
3. Champion picked is randomized depending out of the 5 for each role

Example of champ response (vanilla):
{
  "version": "9.10.1",
  "id": "Aatrox",
  "key": "266",
  "name": "Aatrox",
  "title": "the Darkin Blade",
  "blurb": ""
  "info": {},
  "image": {},
  "tags": [],
  "partype": "Blood Well",
  "stats": {}
}

Example of the response (Add attributes):
{
  "lanes": ["top", "jungle", "mid"],        // Denotes which lane they could be picked for
  "potentialEnemySide": "red",              // Denotes which side they will be picked for
  "picked": true,                           // Denotes if the champion has been picked
  "banned": true,                           // Detones if the champion has been banned
  "side": "blue",                           // Detones the side the champ has been picked for
  "version": "9.10.1",
  "id": "Aatrox",
  "key": "266",
  "name": "Aatrox",
  "title": "the Darkin Blade",
  "blurb": ""
  "info": {},
  "image": {},
  "tags": [],
  "partype": "Blood Well",
  "stats": {}
}

Example of full champion JSON res:

{
  "version": "9.10.1",
  "id": "Aatrox",
  "key": "266",
  "name": "Aatrox",
  "title": "the Darkin Blade",
  "blurb": "Once honored defenders of Shurima against the Void, Aatrox and his brethren would eventually become an even greater threat to Runeterra, and were defeated only by cunning mortal sorcery. But after centuries of imprisonment, Aatrox was the first to find...",
  "info": {
    "attack": 8,
    "defense": 4,
    "magic": 3,
    "difficulty": 4
  },
  "image": {
    "full": "Aatrox.png",
    "sprite": "champion0.png",
    "group": "champion",
    "x": 0,
    "y": 0,
    "w": 48,
    "h": 48
  },
  "tags": [
    "Fighter",
    "Tank"
  ],
  "partype": "Blood Well",
  "stats": {
    "hp": 580,
    "hpperlevel": 90,
    "mp": 0,
    "mpperlevel": 0,
    "movespeed": 345,
    "armor": 38,
    "armorperlevel": 3.25,
    "spellblock": 32.1,
    "spellblockperlevel": 1.25,
    "attackrange": 175,
    "hpregen": 3,
    "hpregenperlevel": 0.75,
    "mpregen": 0,
    "mpregenperlevel": 0,
    "crit": 0,
    "critperlevel": 0,
    "attackdamage": 60,
    "attackdamageperlevel": 5,
    "attackspeedperlevel": 2.5,
    "attackspeed": 0.651
  }
}