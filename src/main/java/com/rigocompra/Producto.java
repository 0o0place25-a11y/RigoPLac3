package com.rigocompra;

/**
 * Clase Producto - Encapsulamiento de datos de productos
 * Basada en la estructura de Perro.java del repositorio de clase
 * 
 * @author Tu nombre
 * @version 1.0
 */
public class Producto {
    // Atributos privados (Encapsulamiento)
    private int id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private double precioUnitario;
    private int cantidad;
    private String categoria;
    private String imagen;
    
    // Constructor por defecto
    public Producto() {
        this.id = 0;
        this.codigo = "";
        this.nombre = "";
        this.descripcion = "";
        this.precioUnitario = 0.0;
        this.cantidad = 0;
        this.categoria = "";
        this.imagen = "";
    }
    
    // Constructor con parámetros
    public Producto(int id, String codigo, String nombre, String descripcion, 
                   double precioUnitario, int cantidad, String categoria, String imagen) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.categoria = categoria;
        this.imagen = imagen;
    }
    
    // Getters y Setters (Encapsulamiento)
    public int getId() { 
        return id; 
    }
    
    public void setId(int id) { 
        this.id = id; 
    }
    
    public String getCodigo() { 
        return codigo; 
    }
    
    public void setCodigo(String codigo) { 
        this.codigo = codigo; 
    }
    
    public String getNombre() { 
        return nombre; 
    }
    
    public void setNombre(String nombre) { 
        this.nombre = nombre; 
    }
    
    public String getDescripcion() { 
        return descripcion; 
    }
    
    public void setDescripcion(String descripcion) { 
        this.descripcion = descripcion; 
    }
    
    public double getPrecioUnitario() { 
        return precioUnitario; 
    }
    
    public void setPrecioUnitario(double precioUnitario) { 
        this.precioUnitario = precioUnitario; 
    }
    
    public int getCantidad() { 
        return cantidad; 
    }
    
    public void setCantidad(int cantidad) { 
        this.cantidad = cantidad; 
    }
    
    public String getCategoria() { 
        return categoria; 
    }
    
    public void setCategoria(String categoria) { 
        this.categoria = categoria; 
    }
    
    public String getImagen() { 
        return imagen; 
    }
    
    public void setImagen(String imagen) { 
        this.imagen = imagen; 
    }
    
    // Método toString personalizado (Polimorfismo)
    @Override
    public String toString() {
        return "Producto: " + nombre + "\n" +
               "Código: " + codigo + "\n" +
               "Precio: Q" + String.format("%.2f", precioUnitario) + "\n" +
               "Categoría: " + categoria + "\n" +
               "Cantidad disponible: " + cantidad + "\n" +
               "Descripción: " + descripcion;
    }
    
    // Método adicional para verificar disponibilidad
    public boolean estaDisponible() {
        return cantidad > 0;
    }
    
    // Método para calcular precio con descuento
    public double calcularPrecioConDescuento(double porcentajeDescuento) {
        if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
            return precioUnitario;
        }
        return precioUnitario * (1 - porcentajeDescuento / 100);
    }
}