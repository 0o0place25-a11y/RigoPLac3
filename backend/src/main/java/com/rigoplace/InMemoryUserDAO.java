package com.rigoplace;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryUserDAO implements UserDAO {
    private final Map<String, User> users = new ConcurrentHashMap<>();

    @Override
    public void addUser(User user) {
        users.put(user.getUsername(), user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(users.get(username));
    }
}
