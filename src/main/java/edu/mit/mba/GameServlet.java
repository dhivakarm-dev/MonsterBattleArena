
package edu.mit.mba;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/game")
public class GameServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        String player = request.getParameter("player");
        String monster = request.getParameter("monster");
        String result = request.getParameter("result");

        int turns = parseTurns(request.getParameter("turns"));

        if (player == null || player.isBlank())
            player = "Player";

        if (monster == null || monster.isBlank())
            monster = "Blazion";

        if (result == null || result.isBlank())
            result = "Played";

        try (Connection con = Database.getConnection()) {

            try (PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO players(player_name) VALUES (?) " +
                    "ON DUPLICATE KEY UPDATE player_name=VALUES(player_name)")) {

                ps.setString(1, player);
                ps.executeUpdate();
            }

            try (PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO battle_history " +
                    "(player_name, monster_name, result, turns) " +
                    "VALUES (?, ?, ?, ?)")) {

                ps.setString(1, player);
                ps.setString(2, monster);
                ps.setString(3, result);
                ps.setInt(4, turns);

                ps.executeUpdate();
            }

            response.setContentType("application/json");
            response.getWriter().write("{\"saved\":true}");

        } catch (SQLException e) {

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            response.setContentType("application/json");

            response.getWriter().write(
                    "{\"saved\":false," +
                    "\"message\":\"Database connection failed. " +
                    "Check Database.java and MySQL.\"}");

            e.printStackTrace();
        }
    }

    private int parseTurns(String value) {

        try {
            return Math.max(0, Integer.parseInt(value));
        } catch (Exception e) {
            return 0;
        }
    }
}
