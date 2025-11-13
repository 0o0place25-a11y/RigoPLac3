package com.rigocompra;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Clase GestorProductos - Implementación de GestorDatos
 * Maneja la lógica de negocio de productos usando ArrayList
 * 
 * @author Tu nombre
 * @version 1.0
 */
public class GestorProductos implements GestorDatos {
    private List<Producto> productos;
    private int siguienteId;
    
    /**
     * Constructor - Inicializa la lista de productos y carga datos de ejemplo
     */
    public GestorProductos() {
        this.productos = new ArrayList<>();
        this.siguienteId = 1;
        cargarProductosIniciales();
    }
    
    /**
     * Carga productos de ejemplo (equivalente a los de tu app.js)
     */
    private void cargarProductosIniciales() {
        // Productos tecnología
        productos.add(new Producto(siguienteId++, "LAP001", "Laptop Gaming HP Pavilion", 
            "Laptop de alto rendimiento para gaming con RTX 3060, 16GB RAM, perfecto estado", 
            8500.0, 5, "Tecnología", "laptop.jpg"));
        
        productos.add(new Producto(siguienteId++, "PHN002", "Smartphone Samsung Galaxy S23", 
            "Teléfono inteligente de última generación con cámara de 108MP", 
            3200.0, 10, "Tecnología", "phone.jpg"));
        
        productos.add(new Producto(siguienteId++, "TAB003", "iPad Pro 12.9", 
            "Tablet profesional con pantalla Liquid Retina XDR", 
            4800.0, 8, "Tecnología", "tablet.jpg"));
        
        // Productos ropa
        productos.add(new Producto(siguienteId++, "CLT004", "Chaqueta de Cuero Genuino", 
            "Chaqueta elegante de cuero genuino, perfecta para invierno", 
            450.0, 15, "Ropa", "jacket.jpg"));
        
        productos.add(new Producto(siguienteId++, "SHO005", "Zapatos Nike Air Max", 
            "Calzado deportivo cómodo y resistente", 
            180.0, 25, "Ropa", "shoes.jpg"));
        
        // Productos hogar
        productos.add(new Producto(siguienteId++, "FUR006", "Sofá de 3 Plazas", 
            "Sofá cómodo de tela en excelente estado", 
            1200.0, 3, "Hogar", "sofa.jpg"));
        
        productos.add(new Producto(siguienteId++, "LIG007", "Lámpara de Pie LED", 
            "Lámpara moderna con control de brillo", 
            85.0, 12, "Hogar", "lamp.jpg"));
        
        // Productos comida
        productos.add(new Producto(siguienteId++, "COF008", "Café Especialidad Guatemala", 
            "Café de alta calidad de las montañas guatemaltecas", 
            25.0, 50, "Comida", "coffee.jpg"));
        
        productos.add(new Producto(siguienteId++, "CHO009", "Chocolate Artesanal", 
            "Chocolate orgánico de cacao guatemalteco", 
            15.0, 30, "Comida", "chocolate.jpg"));
        
        // Servicios
        productos.add(new Producto(siguienteId++, "WEB010", "Desarrollo Web Personalizado", 
            "Servicio de desarrollo de sitios web a medida", 
            1500.0, 100, "Servicios", "web.jpg"));
    }
    
    @Override
    public void guardarProducto(Producto producto) {
        if (producto == null) {
            throw new IllegalArgumentException("El producto no puede ser null");
        }
        producto.setId(siguienteId++);
        productos.add(producto);
    }
    
    @Override
    public Producto buscarProducto(int id) {
        return productos.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);
    }
    
    @Override
    public List<Producto> listarProductos() {
        return new ArrayList<>(productos);
    }
    
    @Override
    public void actualizarProducto(Producto producto) {
        if (producto == null) {
            throw new IllegalArgumentException("El producto no puede ser null");
        }
        
        for (int i = 0; i < productos.size(); i++) {
            if (productos.get(i).getId() == producto.getId()) {
                productos.set(i, producto);
                return;
            }
        }
        throw new IllegalArgumentException("Producto no encontrado con ID: " + producto.getId());
    }
    
    @Override
    public void eliminarProducto(int id) {
        boolean eliminado = productos.removeIf(p -> p.getId() == id);
        if (!eliminado) {
            throw new IllegalArgumentException("Producto no encontrado con ID: " + id);
        }
    }
    
    @Override
    public List<Producto> buscarPorCategoria(String categoria) {
        if (categoria == null || categoria.isEmpty()) {
            return new ArrayList<>();
        }
        
        return productos.stream()
                .filter(p -> p.getCategoria().equalsIgnoreCase(categoria))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Producto> buscarPorNombre(String nombre) {
        if (nombre == null || nombre.isEmpty()) {
            return new ArrayList<>();
        }
        
        return productos.stream()
                .filter(p -> p.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .collect(Collectors.toList());
    }
    
    @Override
    public int contarProductos() {
        return productos.size();
    }
    
    @Override
    public boolean existeProducto(int id) {
        return productos.stream().anyMatch(p -> p.getId() == id);
    }
    
    // Métodos adicionales útiles
    
    /**
     * Obtiene productos con bajo stock
     * @param umbral cantidad mínima considerada como bajo stock
     * @return Lista de productos con stock bajo
     */
    public List<Producto> getProductosConBajoStock(int umbral) {
        return productos.stream()
                .filter(p -> p.getCantidad() <= umbral)
                .collect(Collectors.toList());
    }
    
    /**
     * Calcula el valor total del inventario
     * @return Suma de precio * cantidad de todos los productos
     */
    public double calcularValorInventario() {
        return productos.stream()
                .mapToDouble(p -> p.getPrecioUnitario() * p.getCantidad())
                .sum();
    }
    
    /**
     * Obtiene las categorías disponibles
     * @return Lista de nombres de categorías únicas
     */
    public List<String> getCategorias() {
        return productos.stream()
                .map(Producto::getCategoria)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}