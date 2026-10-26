package edu.mit.mba;

public class WaterMonster extends Monster {
    public WaterMonster() { super("Aquarion", "Water", 110, 22); }
    @Override public int specialAttack() { return attack() + 12; }
}
