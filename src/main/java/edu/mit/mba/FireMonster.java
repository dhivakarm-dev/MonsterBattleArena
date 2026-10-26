package edu.mit.mba;

public class FireMonster extends Monster {
    public FireMonster() { super("Blazion", "Fire", 100, 25); }
    @Override public int specialAttack() { return attack() + 15; }
}
