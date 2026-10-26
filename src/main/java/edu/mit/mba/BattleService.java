package edu.mit.mba;

import java.util.Random;

public class BattleService {
    private final Random random = new Random();

    public synchronized String runBattle(Monster player, Monster opponent, boolean special)
            throws InvalidBattleActionException {
        if (player == null || opponent == null)
            throw new InvalidBattleActionException("Choose both monsters before battle.");
        if (!player.isAlive() || !opponent.isAlive())
            throw new InvalidBattleActionException("A monster has no HP left.");

        int damage = special ? player.specialAttack() : player.attack();
        opponent.takeDamage(damage);

        if (opponent.isAlive()) {
            player.takeDamage(opponent.attack() + random.nextInt(6));
        }
        return opponent.isAlive() ? "Battle continues!" : "Victory!";
    }
}
