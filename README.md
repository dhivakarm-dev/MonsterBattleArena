# Monster Battle Arena — prototype frontend package

This package combines the original HTML/CSS/JavaScript prototype with the existing Java Servlet/JDBC project.

## Included
- Original prototype UI and JavaScript gameplay (AI battle, local PvP, puzzle, monster collection/details, profile)
- Existing Java Servlet and JDBC classes
- MySQL schema

## Run locally
1. Install JDK 17+ and Maven, MySQL 8+, and Tomcat 10.1+ (Jakarta Servlet).
2. Run `database/schema.sql` in MySQL Workbench.
3. Open `src/main/java/edu/mit/mba/Database.java` and set your local MySQL password in `PASSWORD`. Do not publish this file with your real password.
4. From the project root, run `mvn clean package`.
5. Copy `target/MonsterBattleArena.war` to Tomcat's `webapps` folder and start Tomcat.
6. Open `http://localhost:8080/MonsterBattleArena/`.

## Important current limitation
The original prototype's gameplay and progress are still primarily client-side JavaScript state. The included Java Servlet/JDBC project supports saving battle history, but the prototype has not yet been fully migrated to server-side account authentication, persistent coins/XP/monster ownership/upgrades, or server-authoritative PvP. Do not treat the prototype login as secure authentication.
