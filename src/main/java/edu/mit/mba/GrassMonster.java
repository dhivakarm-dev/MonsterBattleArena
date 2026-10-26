package edu.mit.mba;

public class GrassMonster extends Monster {
    public GrassMonster() { super("Floragon", "Grass", 105, 24); }
    @Override public int specialAttack() { return attack() + 13; }
}
