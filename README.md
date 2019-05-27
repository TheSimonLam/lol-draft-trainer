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