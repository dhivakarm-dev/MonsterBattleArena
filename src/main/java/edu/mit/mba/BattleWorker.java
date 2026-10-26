package edu.mit.mba;

// Demonstrates Runnable and synchronized access for Unit III.
public class BattleWorker implements Runnable {
    private final BattleService service;
    private final Monster playerMonster;
    private final Monster opponentMonster;
    private volatile String message = "Battle ready";

    public BattleWorker(BattleService service, Monster playerMonster, Monster opponentMonster) {
        this.service = service;
        this.playerMonster = playerMonster;
        this.opponentMonster = opponentMonster;
    }

    @Override public void run() {
        try {
            message = service.runBattle(playerMonster, opponentMonster, false);
        } catch (InvalidBattleActionException e) {
            message = e.getMessage();
        }
    }

    public String getMessage() { return message; }
}
