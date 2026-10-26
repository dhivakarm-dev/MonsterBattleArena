CREATE DATABASE IF NOT EXISTS monster_arena;
USE monster_arena;

CREATE TABLE IF NOT EXISTS players (
  player_id INT PRIMARY KEY AUTO_INCREMENT,
  player_name VARCHAR(50) NOT NULL UNIQUE,
  coins INT NOT NULL DEFAULT 100,
  xp INT NOT NULL DEFAULT 0,
  player_level INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS monsters (
  monster_id INT PRIMARY KEY AUTO_INCREMENT,
  monster_name VARCHAR(50) NOT NULL UNIQUE,
  monster_type VARCHAR(20) NOT NULL,
  max_hp INT NOT NULL,
  attack_power INT NOT NULL
);

CREATE TABLE IF NOT EXISTS battle_history (
  battle_id INT PRIMARY KEY AUTO_INCREMENT,
  player_name VARCHAR(50) NOT NULL,
  monster_name VARCHAR(50) NOT NULL,
  result VARCHAR(20) NOT NULL,
  turns INT NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO monsters(monster_name,monster_type,max_hp,attack_power) VALUES
('Blazion','Fire',100,25),
('Aquarion','Water',110,22),
('Floragon','Grass',105,24),
('Voltix','Electric',95,28);


CREATE TABLE IF NOT EXISTS puzzles (
  puzzle_id INT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(500) NOT NULL,
  answer VARCHAR(100) NOT NULL,
  reward_energy INT NOT NULL DEFAULT 20
);

INSERT IGNORE INTO puzzles(puzzle_id, question, answer, reward_energy) VALUES
(1, 'What is 6 multiplied by 7?', '42', 20),
(2, 'What is 15 plus 9?', '24', 20),
(3, 'What is 100 minus 35?', '65', 20),
(4, 'What is 8 multiplied by 8?', '64', 20),
(5, 'What is 50 divided by 5?', '10', 20);
