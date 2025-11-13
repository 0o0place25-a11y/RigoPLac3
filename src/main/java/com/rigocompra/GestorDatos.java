package com.rigocompra;

import java.util.List;

/**
 * Interface GestorDatos - Contrato para gestión de datos
 * Basada en el patrón de interfaces del repositorio de clase
 * 
 * @author Tu nombre
 * @version 1.0
 */
public interface GestorDatos {
    
    /**
     * Guarda un producto en el sistema
     * @param producto El producto a guardar
     */
    public void guardarProducto(Producto producto);
    
    /**
     * Busca un producto por su ID
     * @param id El ID del producto
     * @return El producto encontrado o null si no existe
     */
    public Producto buscarProducto(int id);
    
    /**
     * Lista todos los productos del sistema
     * @return Lista de productos
     */
    public List<Producto> listarProductos();
    
    /**
     * Actualiza un producto existente
     * @param producto El producto con los datos actualizados
     */
    public void actualizarProducto(Producto producto);
    
    /**
     * Elimina un producto del sistema
     * @param id El ID del producto a eliminar
     */
    public void eliminarProducto(int id);
    
    /**
     * Busca productos por categoría
     * @param categoria La categoría a buscar
     * @return Lista de productos de esa categoría
     */
    public List<Producto> buscarPorCategoria(String categoria);
    
    /**
     * Busca productos por nombre
     * @param nombre El nombre o parte del nombre a buscar
     * @return Lista de productos que coinciden con la búsqueda
     */
    public List<Producto> buscarPorNombre(String nombre);
    
    /**
     * Obtiene el número total de productos
     * @return Cantidad total de productos
     */
    public int contarProductos();
    
    /**
     * Verifica si existe un producto con el ID especificado
     * @param id El ID a verificar
     * @return true si existe, false si no
     */
    public boolean existeProducto(int id);
}