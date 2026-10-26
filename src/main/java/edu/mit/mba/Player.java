package edu.mit.mba;

public class Player {
    private final String name;
    private int coins = 100;
    private int xp = 0;
    private int level = 1;

    public Player(String name) { this.name = name; }
    public String getName() { return name; }
    public int getCoins() { return coins; }
    public int getXp() { return xp; }
    public int getLevel() { return level; }

    public void winBattle() {
        coins += 25;
        xp += 20;
        if (xp >= level * 100) level++;
    }
}
