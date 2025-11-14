package com.rigoplace;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class RegistrationHandler implements HttpHandler {
    private final UserDAO userDAO;
    private final Gson gson = new Gson();

    public RegistrationHandler(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Add CORS headers
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("POST".equals(exchange.getRequestMethod())) {
            User user = gson.fromJson(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8), User.class);

            if (userDAO.findByUsername(user.getUsername()).isPresent()) {
                sendResponse(exchange, 409, "{\"message\":\"El usuario ya existe\"}");
            } else {
                userDAO.addUser(user);
                sendResponse(exchange, 201, "{\"message\":\"Usuario registrado con éxito\"}");
            }
        } else {
            sendResponse(exchange, 405, "{\"message\":\"Método no permitido\"}");
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
