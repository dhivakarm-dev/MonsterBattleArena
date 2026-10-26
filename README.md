# Monster Battle Arena

A Java-based monster battle game developed as a college project. The game combines monster battles, puzzles, monster collection, and player progress with a web-based interface.

## Project Overview

Monster Battle Arena is a game where players can explore monsters, participate in battles, solve puzzles, and collect rewards. The project combines frontend technologies with Java Servlets, JDBC, and MySQL for backend functionality.

## Features

- Player login and account handling
- Monster collection and monster details
- AI Battle mode
- Local Player vs Player (PvP) mode
- Puzzle and challenge gameplay
- Coins and XP rewards
- Player progress saving
- MySQL database integration

## Technologies Used

| Technology | Purpose |
|---|---|
| Java | Backend programming |
| Jakarta Servlet | Server-side request handling |
| JDBC | Java–MySQL connectivity |
| MySQL | Database management |
| HTML | Web page structure |
| CSS | User interface styling |
| JavaScript | Gameplay and frontend interactions |
| Maven | Project build management |
| Apache Tomcat | Web application server |

## Project Structure

```text
MonsterBattleArena/
├── src/
│   └── main/
│       ├── java/
│       │   └── edu/mit/mba/
│       └── webapp/
├── database/
│   └── schema.sql
├── pom.xml
├── README.md
└── .gitignore
```

## Database

Database name: `monster_arena`

The project uses MySQL to store player and game-related information.

Database tables include:

- `players` – player account and progress information
- `monsters` – monster details and attributes
- `player_monsters` – monsters associated with players
- `battle_history` – battle records
- `puzzles` – puzzle-related information

Java connects to MySQL using JDBC.

## Installation and Setup

### Requirements

- JDK 17 or later
- Apache Maven
- MySQL 8 or later
- Apache Tomcat 10.1 or compatible Jakarta Servlet container

### Steps

1. Clone or download this repository.
2. Create the MySQL database `monster_arena`.
3. Execute the SQL setup script from the `database` folder.
4. Configure the local MySQL connection in `Database.java`.
5. Open a terminal in the project root directory.
6. Build the project:

   ```bash
   mvn clean package
   ```

7. Copy the generated WAR file from the `target` folder into the Tomcat `webapps` directory.
8. Start Tomcat.
9. Open the application in your browser:

   ```text
   http://localhost:8080/MonsterBattleArena/
   ```

## Testing

The following tests have been performed:

- Login with a correct password – successful
- Login with an incorrect password – rejected
- Player progress – saved and restored after logging in again

Other gameplay features should be tested separately before being considered fully verified.

## Team Project

Developed as part of the Bachelor of Engineering in Computer Science and Engineering.

**Team Members**
- Dhivakar M
- Vetrivel S

**College:** Madras Institute of Technology
**Department:** Computer Science and Engineering  
**Academic Year:** 2026

## Future Enhancements

- Complete server-side authentication and authorization
- Improve server-side game progress persistence
- Server-authoritative PvP
- Additional monsters and battle abilities
- Improved security and deployment

## Security Note

This project is intended for local development and academic demonstration.

Do not publish actual database passwords, credentials, or other secrets in the repository. Configure your own local database connection before running the application.


