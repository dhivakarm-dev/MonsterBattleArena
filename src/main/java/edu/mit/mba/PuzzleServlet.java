
package edu.mit.mba;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/puzzle")
public class PuzzleServlet extends HttpServlet {

    // GET: Fetch puzzles from database
    @Override
    protected void doGet(HttpServletRequest request,
                        HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String sql = "SELECT puzzle_id, question, reward_energy FROM puzzles";

        try (Connection con = Database.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery();
             PrintWriter out = response.getWriter()) {

            out.print("[");

            boolean first = true;

            while (rs.next()) {

                if (!first) {
                    out.print(",");
                }

                out.print("{");

                out.print("\"puzzle_id\":"
                        + rs.getInt("puzzle_id") + ",");

                out.print("\"question\":\""
                        + escape(rs.getString("question")) + "\",");

                out.print("\"reward_energy\":"
                        + rs.getInt("reward_energy"));

                out.print("}");

                first = false;
            }

            out.print("]");

        } catch (SQLException e) {

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            response.getWriter().print(
                    "{\"error\":\"Database error\"}");

            e.printStackTrace();
        }
    }


    // POST: Check answer
    @Override
    protected void doPost(HttpServletRequest request,
                        HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String puzzleId = request.getParameter("puzzle_id");
        String userAnswer = request.getParameter("answer");

        if (puzzleId == null || userAnswer == null) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST);

            response.getWriter().print(
                    "{\"error\":\"Missing puzzle_id or answer\"}");

            return;
        }

        String sql =
                "SELECT answer, reward_energy FROM puzzles WHERE puzzle_id = ?";

        try (Connection con = Database.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, Integer.parseInt(puzzleId));

            try (ResultSet rs = ps.executeQuery();
                 PrintWriter out = response.getWriter()) {

                if (rs.next()) {

                    String correctAnswer =
                            rs.getString("answer").trim();

                    int reward =
                            rs.getInt("reward_energy");

                    if (userAnswer.trim().equalsIgnoreCase(
                            correctAnswer)) {

                        out.print("{");
                        out.print("\"correct\":true,");
                        out.print("\"reward_energy\":" + reward);
                        out.print("}");

                    } else {

                        out.print("{");
                        out.print("\"correct\":false,");
                        out.print("\"reward_energy\":0");
                        out.print("}");
                    }

                } else {

                    response.setStatus(
                            HttpServletResponse.SC_NOT_FOUND);

                    out.print(
                            "{\"error\":\"Puzzle not found\"}");
                }
            }

        } catch (NumberFormatException e) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST);

            response.getWriter().print(
                    "{\"error\":\"Invalid puzzle_id\"}");

        } catch (SQLException e) {

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            response.getWriter().print(
                    "{\"error\":\"Database error\"}");

            e.printStackTrace();
        }
    }


    // Escape special characters for JSON
    private String escape(String text) {

        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r");
    }
}
