package com.rigoplace;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        UserDAO userDAO = new InMemoryUserDAO();
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/register", new RegistrationHandler(userDAO));
        server.createContext("/api/login", new LoginHandler(userDAO));

        server.setExecutor(null);
        server.start();
        System.out.println("Servidor iniciado en el puerto 8080");
    }
}
