
package edu.mit.mba;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.*;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

@WebServlet("/player")
public class PlayerServlet extends HttpServlet {

    private static final int ITERATIONS = 120000;
    private static final int KEY_LENGTH = 256;

    // =========================
    // LOGIN / LOAD PLAYER
    // =========================

    @Override
    protected void doGet(HttpServletRequest request,
                        HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String username = request.getParameter("username");

        if (username == null || username.trim().isEmpty()) {
            sendError(response, 400, "Username required");
            return;
        }

        username = username.trim();

        try (Connection con = Database.getConnection()) {

            // Check whether player exists
            String sql =
                "SELECT coins, xp, player_level, puzzle_energy " +
                "FROM players WHERE player_name=?";

            int coins;
            int xp;
            int level;
            int energy;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setString(1, username);

                try (ResultSet rs = ps.executeQuery()) {

                    if (!rs.next()) {
                        sendError(response, 404, "Player not found");
                        return;
                    }

                    coins = rs.getInt("coins");
                    xp = rs.getInt("xp");
                    level = rs.getInt("player_level");
                    energy = rs.getInt("puzzle_energy");
                }
            }

            // Load owned monsters
            StringBuilder monsters = new StringBuilder();

            String monsterSql =
                "SELECT m.monster_name " +
                "FROM player_monsters pm " +
                "JOIN players p ON pm.player_id=p.player_id " +
                "JOIN monsters m ON pm.monster_id=m.monster_id " +
                "WHERE p.player_name=?";

            try (PreparedStatement ps =
                 con.prepareStatement(monsterSql)) {

                ps.setString(1, username);

                try (ResultSet rs = ps.executeQuery()) {

                    while (rs.next()) {

                        if (monsters.length() > 0) {
                            monsters.append(",");
                        }

                        monsters.append("\"")
                                .append(escapeJson(
                                    rs.getString("monster_name")))
                                .append("\"");
                    }
                }
            }

            String json =
                "{\"success\":true," +
                "\"username\":\"" + escapeJson(username) + "\"," +
                "\"coins\":" + coins + "," +
                "\"xp\":" + xp + "," +
                "\"level\":" + level + "," +
                "\"energy\":" + energy + "," +
                "\"monsters\":[" + monsters + "]}";

            response.getWriter().write(json);

        } catch (SQLException e) {

            e.printStackTrace();

            sendError(response, 500, "Database error");
        }
    }

    // =========================
    // LOGIN / REGISTER / SAVE
    // =========================

    @Override
    protected void doPost(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");

        // Login or registration
        if ("login".equals(action)) {
            loginPlayer(request, response);
            return;
        }

        // Existing game progress saving
        savePlayer(request, response);
    }

    // =========================
    // LOGIN
    // =========================

    private void loginPlayer(HttpServletRequest request,
                            HttpServletResponse response)
            throws IOException {

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        if (username == null || username.trim().isEmpty()
                || password == null || password.isEmpty()) {

            sendError(response, 400,
                "Username and password required");
            return;
        }

        username = username.trim();

        if (username.length() > 50 || password.length() > 200) {
            sendError(response, 400,
                "Username or password is too long");
            return;
        }

        try (Connection con = Database.getConnection()) {

            String sql =
                "SELECT player_id, password_hash " +
                "FROM players WHERE player_name=?";

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setString(1, username);

                try (ResultSet rs = ps.executeQuery()) {

                    if (rs.next()) {

                        String storedHash =
                            rs.getString("password_hash");

                        // Existing account without password:
                        // Set its first password.
                        if (storedHash == null) {

                            String newHash =
                                hashPassword(password);

                            String update =
                                "UPDATE players SET password_hash=? " +
                                "WHERE player_id=? AND password_hash IS NULL";

                            try (PreparedStatement updatePs =
                                 con.prepareStatement(update)) {

                                updatePs.setString(1, newHash);
                                updatePs.setInt(
                                    2, rs.getInt("player_id"));

                                updatePs.executeUpdate();
                            }

                        } else {

                            // Verify existing password
                            if (!verifyPassword(
                                    password, storedHash)) {

                                sendError(response, 401,
                                    "Incorrect password");
                                return;
                            }
                        }

                    } else {

                        // New player registration
                        String newHash = hashPassword(password);

                        String insert =
                            "INSERT INTO players " +
                            "(player_name, password_hash) " +
                            "VALUES (?, ?)";

                        try (PreparedStatement insertPs =
                             con.prepareStatement(insert)) {

                            insertPs.setString(1, username);
                            insertPs.setString(2, newHash);

                            insertPs.executeUpdate();
                        }
                    }
                }
            }

            // Give starter monster if not already owned
            String starterSql =
                "INSERT IGNORE INTO player_monsters " +
                "(player_id, monster_id) " +
                "SELECT p.player_id, m.monster_id " +
                "FROM players p, monsters m " +
                "WHERE p.player_name=? " +
                "AND m.monster_name='Blazion'";

            try (PreparedStatement ps =
                 con.prepareStatement(starterSql)) {

                ps.setString(1, username);
                ps.executeUpdate();
            }

            // Login successful
            response.getWriter().write(
                "{\"success\":true,\"message\":\"Login successful\"}"
            );

        } catch (SQLException e) {

            e.printStackTrace();

            sendError(response, 500,
                "Unable to login or register");
        } catch (Exception e) {

            e.printStackTrace();

            sendError(response, 500,
                "Password processing error");
        }
    }

    // =========================
    // SAVE PLAYER PROGRESS
    // =========================

    private void savePlayer(HttpServletRequest request,
                           HttpServletResponse response)
            throws IOException {

        String username = request.getParameter("username");

        if (username == null || username.trim().isEmpty()) {
            sendError(response, 400, "Username required");
            return;
        }

        username = username.trim();

        try {

            int coins = Integer.parseInt(
                request.getParameter("coins"));

            int xp = Integer.parseInt(
                request.getParameter("xp"));

            int level = Integer.parseInt(
                request.getParameter("level"));

            int energy = Integer.parseInt(
                request.getParameter("energy"));

            String monsterList =
                request.getParameter("monsters");

            if (coins < 0 || xp < 0
                    || level < 1 || energy < 0) {

                sendError(response, 400,
                    "Invalid player values");
                return;
            }

            try (Connection con = Database.getConnection()) {

                con.setAutoCommit(false);

                try {

                    // Update player statistics
                    String sql =
                        "UPDATE players SET coins=?, xp=?, " +
                        "player_level=?, puzzle_energy=? " +
                        "WHERE player_name=?";

                    try (PreparedStatement ps =
                         con.prepareStatement(sql)) {

                        ps.setInt(1, coins);
                        ps.setInt(2, xp);
                        ps.setInt(3, level);
                        ps.setInt(4, energy);
                        ps.setString(5, username);

                        int updated = ps.executeUpdate();

                        if (updated == 0) {
                            throw new SQLException(
                                "Player not found");
                        }
                    }

                    // Delete previous monster ownership
                    String deleteSql =
                        "DELETE FROM player_monsters " +
                        "WHERE player_id=(SELECT player_id " +
                        "FROM players WHERE player_name=?)";

                    try (PreparedStatement ps =
                         con.prepareStatement(deleteSql)) {

                        ps.setString(1, username);
                        ps.executeUpdate();
                    }

                    // Save current owned monsters
                    if (monsterList != null
                            && !monsterList.isEmpty()) {

                        String[] monsters =
                            monsterList.split(",");

                        for (String monster : monsters) {

                            String monsterSql =
                                "INSERT IGNORE INTO player_monsters " +
                                "(player_id, monster_id) " +
                                "SELECT p.player_id, m.monster_id " +
                                "FROM players p, monsters m " +
                                "WHERE p.player_name=? " +
                                "AND m.monster_name=?";

                            try (PreparedStatement ps =
                                 con.prepareStatement(monsterSql)) {

                                ps.setString(1, username);
                                ps.setString(
                                    2, monster.trim());

                                ps.executeUpdate();
                            }
                        }
                    }

                    con.commit();

                    response.getWriter().write(
                        "{\"success\":true," +
                        "\"message\":\"Player saved\"}"
                    );

                } catch (Exception e) {

                    con.rollback();
                    throw e;

                } finally {

                    con.setAutoCommit(true);
                }
            }

        } catch (Exception e) {

            e.printStackTrace();

            sendError(response, 500,
                "Unable to save player");
        }
    }

    // =========================
    // PASSWORD HASHING
    // =========================

    private String hashPassword(String password)
            throws Exception {

        byte[] salt = new byte[16];

        SecureRandom random = new SecureRandom();
        random.nextBytes(salt);

        KeySpec spec = new PBEKeySpec(
            password.toCharArray(),
            salt,
            ITERATIONS,
            KEY_LENGTH
        );

        SecretKeyFactory factory =
            SecretKeyFactory.getInstance(
                "PBKDF2WithHmacSHA256");

        byte[] hash = factory.generateSecret(spec)
                              .getEncoded();

        return ITERATIONS + ":" +
               Base64.getEncoder().encodeToString(salt) + ":" +
               Base64.getEncoder().encodeToString(hash);
    }

    private boolean verifyPassword(String password,
                                  String storedHash)
            throws Exception {

        String[] parts = storedHash.split(":");

        if (parts.length != 3) {
            return false;
        }

        int iterations = Integer.parseInt(parts[0]);

        byte[] salt =
            Base64.getDecoder().decode(parts[1]);

        byte[] expectedHash =
            Base64.getDecoder().decode(parts[2]);

        KeySpec spec = new PBEKeySpec(
            password.toCharArray(),
            salt,
            iterations,
            expectedHash.length * 8
        );

        SecretKeyFactory factory =
            SecretKeyFactory.getInstance(
                "PBKDF2WithHmacSHA256");

        byte[] actualHash =
            factory.generateSecret(spec).getEncoded();

        return java.security.MessageDigest.isEqual(
            expectedHash, actualHash);
    }

    // =========================
    // JSON HELPERS
    // =========================

    private String escapeJson(String value) {

        return value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r");
    }

    private void sendError(HttpServletResponse response,
                          int status,
                          String message)
            throws IOException {

        response.setStatus(status);

        response.getWriter().write(
            "{\"success\":false,\"message\":\"" +
            escapeJson(message) + "\"}"
        );
    }
}
