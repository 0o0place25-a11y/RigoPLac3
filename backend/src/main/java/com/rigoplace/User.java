package com.rigoplace;

public class User {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String credentialType; // "password" or "pin"

    public User(String username, String password, String firstName, String lastName, String credentialType) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.credentialType = credentialType;
    }

    // Getters
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getCredentialType() { return credentialType; }
}
