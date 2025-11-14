package com.rigoplace;

import java.util.Optional;

public interface UserDAO {
    void addUser(User user);
    Optional<User> findByUsername(String username);
}
