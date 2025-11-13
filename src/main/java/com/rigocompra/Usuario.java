package com.rigocompra;

/**
 * Clase Usuario - Sistema de autenticación
 * Basada en conceptos de herencia y encapsulamiento
 * 
 * @author Tu nombre
 * @version 1.0
 */
public class Usuario {
    // Atributos privados
    private int id;
    private String nombreCompleto;
    private String nombreUsuario;
    private String descripcion;
    private String direccion;
    private String ciudad;
    private String telefono;
    private String correo;
    private String contraseña; // En producción debe estar encriptada
    private String fechaCreacion;
    
    // Constructor principal
    public Usuario(int id, String nombreCompleto, String nombreUsuario, 
                   String correo, String contraseña) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.contraseña = contraseña; // En producción: hash de contraseña
        this.fechaCreacion = new java.util.Date().toString();
        this.descripcion = "";
        this.direccion = "";
        this.ciudad = "";
        this.telefono = "";
    }
    
    // Constructor sobrecargado
    public Usuario(int id, String nombreCompleto, String nombreUsuario, 
                   String descripcion, String direccion, String ciudad, 
                   String telefono, String correo, String contraseña) {
        this(id, nombreCompleto, nombreUsuario, correo, contraseña);
        this.descripcion = descripcion;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.telefono = telefono;
    }
    
    // Getters y Setters
    public int getId() { 
        return id; 
    }
    
    public String getNombreCompleto() { 
        return nombreCompleto; 
    }
    
    public void setNombreCompleto(String nombreCompleto) { 
        this.nombreCompleto = nombreCompleto; 
    }
    
    public String getNombreUsuario() { 
        return nombreUsuario; 
    }
    
    public void setNombreUsuario(String nombreUsuario) { 
        this.nombreUsuario = nombreUsuario; 
    }
    
    public String getDescripcion() { 
        return descripcion; 
    }
    
    public void setDescripcion(String descripcion) { 
        this.descripcion = descripcion; 
    }
    
    public String getDireccion() { 
        return direccion; 
    }
    
    public void setDireccion(String direccion) { 
        this.direccion = direccion; 
    }
    
    public String getCiudad() { 
        return ciudad; 
    }
    
    public void setCiudad(String ciudad) { 
        this.ciudad = ciudad; 
    }
    
    public String getTelefono() { 
        return telefono; 
    }
    
    public void setTelefono(String telefono) { 
        this.telefono = telefono; 
    }
    
    public String getCorreo() { 
        return correo; 
    }
    
    public void setCorreo(String correo) { 
        this.correo = correo; 
    }
    
    public String getFechaCreacion() { 
        return fechaCreacion; 
    }
    
    // Métodos de autenticación
    public boolean verificarContraseña(String contraseña) {
        // En producción: comparar hashes en lugar de texto plano
        return this.contraseña.equals(contraseña);
    }
    
    public boolean cambiarContraseña(String contraseñaActual, String nuevaContraseña) {
        if (verificarContraseña(contraseñaActual)) {
            this.contraseña = nuevaContraseña; // En producción: hash de nueva contraseña
            return true;
        }
        return false;
    }
    
    // Método para validar formato de correo
    public static boolean esCorreoValido(String correo) {
        if (correo == null || correo.isEmpty()) {
            return false;
        }
        return correo.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    }
    
    // Método toString sobrescrito (Polimorfismo)
    @Override
    public String toString() {
        return "Usuario: " + nombreUsuario + "\n" +
               "Nombre completo: " + nombreCompleto + "\n" +
               "Correo: " + correo + "\n" +
               "Ciudad: " + ciudad + "\n" +
               "Teléfono: " + telefono + "\n" +
               "Miembro desde: " + fechaCreacion;
    }
    
    // Método para obtener información básica (sin datos sensibles)
    public String getInfoPublica() {
        return "Usuario: " + nombreUsuario + " (" + nombreCompleto + ")";
    }
}