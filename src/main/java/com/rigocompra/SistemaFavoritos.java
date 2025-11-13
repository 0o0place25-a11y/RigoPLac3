package com.rigocompra;

import java.util.HashSet;
import java.util.Set;

/**
 * Clase SistemaFavoritos - Implementación del patrón Singleton
 * Maneja los productos favoritos del usuario
 * 
 * @author Tu nombre
 * @version 1.0
 */
public class SistemaFavoritos {
    // Instancia única (Singleton)
    private static SistemaFavoritos instancia;
    
    // Set de IDs de productos favoritos
    private Set<Integer> productosFavoritos;
    
    /**
     * Constructor privado (Singleton)
     */
    private SistemaFavoritos() {
        this.productosFavoritos = new HashSet<>();
    }
    
    /**
     * Obtiene la instancia única del sistema de favoritos
     * @return La instancia única
     */
    public static SistemaFavoritos getInstancia() {
        if (instancia == null) {
            instancia = new SistemaFavoritos();
        }
        return instancia;
    }
    
    /**
     * Agrega un producto a favoritos
     * @param productoId ID del producto a agregar
     * @return true si se agregó, false si ya existía
     */
    public boolean agregarAFavoritos(int productoId) {
        return productosFavoritos.add(productoId);
    }
    
    /**
     * Quita un producto de favoritos
     * @param productoId ID del producto a quitar
     * @return true si se quitó, false si no existía
     */
    public boolean quitarDeFavoritos(int productoId) {
        return productosFavoritos.remove(productoId);
    }
    
    /**
     * Verifica si un producto es favorito
     * @param productoId ID del producto a verificar
     * @return true si es favorito, false si no
     */
    public boolean esFavorito(int productoId) {
        return productosFavoritos.contains(productoId);
    }
    
    /**
     * Obtiene todos los IDs de productos favoritos
     * @return Set de IDs de productos favoritos
     */
    public Set<Integer> getFavoritos() {
        return new HashSet<>(productosFavoritos);
    }
    
    /**
     * Limpia todos los favoritos
     */
    public void limpiarFavoritos() {
        productosFavoritos.clear();
    }
    
    /**
     * Obtiene la cantidad de productos favoritos
     * @return Número de productos favoritos
     */
    public int getCantidadFavoritos() {
        return productosFavoritos.size();
    }
    
    /**
     * Alterna el estado de favorito de un producto
     * @param productoId ID del producto
     * @return true si ahora es favorito, false si ya no lo es
     */
    public boolean alternarFavorito(int productoId) {
        if (esFavorito(productoId)) {
            quitarDeFavoritos(productoId);
            return false;
        } else {
            agregarAFavoritos(productoId);
            return true;
        }
    }
    
    /**
     * Obtiene los IDs de favoritos como array
     * @return Array de IDs de productos favoritos
     */
    public Integer[] getFavoritosArray() {
        return productosFavoritos.toArray(new Integer[0]);
    }
    
    /**
     * Importa favoritos desde un array de IDs
     * @param ids Array de IDs a importar
     */
    public void importarFavoritos(Integer[] ids) {
        if (ids != null) {
            for (Integer id : ids) {
                if (id != null) {
                    agregarAFavoritos(id);
                }
            }
        }
    }
    
    /**
     * Muestra información del sistema de favoritos
     * @return String con información estadística
     */
    @Override
    public String toString() {
        return "SistemaFavoritos{" +
               "totalFavoritos=" + getCantidadFavoritos() +
               ", favoritos=" + productosFavoritos +
               '}';
    }
}