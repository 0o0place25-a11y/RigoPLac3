package com.rigocompra;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Clase DatabaseManager - Manejo de conexión y operaciones con MySQL
 * Implementa persistencia en base de datos
 * 
 * @author Tu nombre
 * @version 1.0
 */
public class DatabaseManager {
    private static final String URL = "jdbc:mysql://localhost:3306/rigocompra_java";
    private static final String USER = "root"; // Cambiar según tu configuración
    private static final String PASSWORD = ""; // Cambiar según tu configuración
    
    private Connection connection;
    
    /**
     * Constructor - Establece conexión con la base de datos
     */
    public DatabaseManager() {
        try {
            // Cargar el driver MySQL
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            System.err.println("Error: MySQL Driver no encontrado");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Error al conectar con la base de datos");
            e.printStackTrace();
        }
    }
    
    /**
     * Verifica si la conexión está activa
     */
    public boolean isConnected() {
        try {
            return connection != null && !connection.isClosed();
        } catch (SQLException e) {
            return false;
        }
    }
    
    /**
     * Cierra la conexión a la base de datos
     */
    public void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            System.err.println("Error al cerrar la conexión");
            e.printStackTrace();
        }
    }
    
    /**
     * Obtiene todos los productos de la base de datos
     */
    public List<Producto> obtenerProductos() {
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT p.*, c.nombre as categoria_nombre FROM productos p " +
                     "LEFT JOIN categorias c ON p.categoria_id = c.id";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Producto producto = new Producto(
                    rs.getInt("id"),
                    rs.getString("codigo"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getDouble("precio_unitario"),
                    rs.getInt("cantidad"),
                    rs.getString("categoria_nombre"),
                    rs.getString("imagen")
                );
                productos.add(producto);
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener productos");
            e.printStackTrace();
        }
        
        return productos;
    }
    
    /**
     * Inserta un nuevo producto en la base de datos
     */
    public boolean insertarProducto(Producto producto) {
        String sql = "INSERT INTO productos (codigo, nombre, descripcion, precio_unitario, cantidad, categoria_id, imagen) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, producto.getCodigo());
            pstmt.setString(2, producto.getNombre());
            pstmt.setString(3, producto.getDescripcion());
            pstmt.setDouble(4, producto.getPrecioUnitario());
            pstmt.setInt(5, producto.getCantidad());
            pstmt.setInt(6, obtenerIdCategoria(producto.getCategoria()));
            pstmt.setString(7, producto.getImagen());
            
            int filasAfectadas = pstmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                // Obtener el ID generado
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        producto.setId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Error al insertar producto");
            e.printStackTrace();
        }
        
        return false;
    }
    
    /**
     * Actualiza un producto existente
     */
    public boolean actualizarProducto(Producto producto) {
        String sql = "UPDATE productos SET codigo=?, nombre=?, descripcion=?, " +
                     "precio_unitario=?, cantidad=?, categoria_id=?, imagen=? WHERE id=?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, producto.getCodigo());
            pstmt.setString(2, producto.getNombre());
            pstmt.setString(3, producto.getDescripcion());
            pstmt.setDouble(4, producto.getPrecioUnitario());
            pstmt.setInt(5, producto.getCantidad());
            pstmt.setInt(6, obtenerIdCategoria(producto.getCategoria()));
            pstmt.setString(7, producto.getImagen());
            pstmt.setInt(8, producto.getId());
            
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error al actualizar producto");
            e.printStackTrace();
        }
        
        return false;
    }
    
    /**
     * Elimina un producto por ID
     */
    public boolean eliminarProducto(int id) {
        String sql = "DELETE FROM productos WHERE id=?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error al eliminar producto");
            e.printStackTrace();
        }
        
        return false;
    }
    
    /**
     * Busca productos por nombre
     */
    public List<Producto> buscarPorNombre(String nombre) {
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT p.*, c.nombre as categoria_nombre FROM productos p " +
                     "LEFT JOIN categorias c ON p.categoria_id = c.id " +
                     "WHERE p.nombre LIKE ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, "%" + nombre + "%");
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Producto producto = new Producto(
                    rs.getInt("id"),
                    rs.getString("codigo"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getDouble("precio_unitario"),
                    rs.getInt("cantidad"),
                    rs.getString("categoria_nombre"),
                    rs.getString("imagen")
                );
                productos.add(producto);
            }
        } catch (SQLException e) {
            System.err.println("Error al buscar productos por nombre");
            e.printStackTrace();
        }
        
        return productos;
    }
    
    /**
     * Busca productos por categoría
     */
    public List<Producto> buscarPorCategoria(String categoria) {
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT p.*, c.nombre as categoria_nombre FROM productos p " +
                     "LEFT JOIN categorias c ON p.categoria_id = c.id " +
                     "WHERE c.nombre = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, categoria);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Producto producto = new Producto(
                    rs.getInt("id"),
                    rs.getString("codigo"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getDouble("precio_unitario"),
                    rs.getInt("cantidad"),
                    rs.getString("categoria_nombre"),
                    rs.getString("imagen")
                );
                productos.add(producto);
            }
        } catch (SQLException e) {
            System.err.println("Error al buscar productos por categoría");
            e.printStackTrace();
        }
        
        return productos;
    }
    
    /**
     * Obtiene el ID de una categoría por su nombre
     */
    private int obtenerIdCategoria(String nombreCategoria) {
        String sql = "SELECT id FROM categorias WHERE nombre = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, nombreCategoria);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("id");
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener ID de categoría");
            e.printStackTrace();
        }
        
        // Si no existe la categoría, devolver 1 (categoría por defecto)
        return 1;
    }
    
    /**
     * Métodos para manejo de favoritos con base de datos
     */
    
    /**
     * Guarda un favorito en la base de datos
     */
    public boolean guardarFavorito(int usuarioId, int productoId) {
        String sql = "INSERT INTO favoritos (usuario_id, producto_id) VALUES (?, ?)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, usuarioId);
            pstmt.setInt(2, productoId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error al guardar favorito");
            e.printStackTrace();
        }
        
        return false;
    }
    
    /**
     * Elimina un favorito de la base de datos
     */
    public boolean eliminarFavorito(int usuarioId, int productoId) {
        String sql = "DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, usuarioId);
            pstmt.setInt(2, productoId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error al eliminar favorito");
            e.printStackTrace();
        }
        
        return false;
    }
    
    /**
     * Obtiene los IDs de productos favoritos de un usuario
     */
    public List<Integer> obtenerFavoritosUsuario(int usuarioId) {
        List<Integer> favoritos = new ArrayList<>();
        String sql = "SELECT producto_id FROM favoritos WHERE usuario_id = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, usuarioId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                favoritos.add(rs.getInt("producto_id"));
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener favoritos del usuario");
            e.printStackTrace();
        }
        
        return favoritos;
    }
    
    /**
     * Métodos de utilidad
     */
    
    /**
     * Obtiene estadísticas de la base de datos
     */
    public String obtenerEstadisticas() {
        StringBuilder estadisticas = new StringBuilder();
        
        try {
            // Total de productos
            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM productos")) {
                if (rs.next()) {
                    estadisticas.append("Total productos: ").append(rs.getInt("total")).append("\n");
                }
            }
            
            // Productos por categoría
            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery(
                     "SELECT c.nombre, COUNT(*) as cantidad FROM productos p " +
                     "LEFT JOIN categorias c ON p.categoria_id = c.id " +
                     "GROUP BY c.nombre ORDER BY cantidad DESC")) {
                
                estadisticas.append("Productos por categoría:\n");
                while (rs.next()) {
                    estadisticas.append("  ").append(rs.getString("nombre"))
                               .append(": ").append(rs.getInt("cantidad")).append("\n");
                }
            }
            
            // Valor total del inventario
            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery(
                     "SELECT SUM(precio_unitario * cantidad) as valor_total FROM productos")) {
                if (rs.next()) {
                    estadisticas.append("Valor total inventario: Q")
                               .append(String.format("%.2f", rs.getDouble("valor_total")));
                }
            }
            
        } catch (SQLException e) {
            System.err.println("Error al obtener estadísticas");
            e.printStackTrace();
        }
        
        return estadisticas.toString();
    }
}