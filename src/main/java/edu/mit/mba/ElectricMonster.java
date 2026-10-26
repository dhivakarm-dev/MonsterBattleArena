package edu.mit.mba;

public class ElectricMonster extends Monster {
    public ElectricMonster() { super("Voltix", "Electric", 95, 28); }
    @Override public int specialAttack() { return attack() + 18; }
}
