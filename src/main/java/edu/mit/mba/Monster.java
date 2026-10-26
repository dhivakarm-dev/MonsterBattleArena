package edu.mit.mba;

public abstract class Monster implements MonsterAction {
    private final String name;
    private final String type;
    private final int maxHp;
    private final int attackPower;
    private int hp;

    public Monster(String name, String type, int maxHp, int attackPower) {
        this.name = name;
        this.type = type;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.attackPower = attackPower;
    }

    public String getName() { return name; }
    public String getType() { return type; }
    public int getMaxHp() { return maxHp; }
    public int getHp() { return hp; }
    public boolean isAlive() { return hp > 0; }

    public void takeDamage(int damage) {
        hp = Math.max(0, hp - Math.max(0, damage));
    }

    @Override public int attack() { return attackPower; }
    @Override public int specialAttack() { return attackPower + 10; }

    // Method overloading
    public void heal() { hp = maxHp; }
    public void heal(int amount) { hp = Math.min(maxHp, hp + amount); }
}
