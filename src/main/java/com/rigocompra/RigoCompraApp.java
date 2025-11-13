package com.rigocompra;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;

/**
 * Clase RigoCompraApp - Aplicación principal con GUI Swing
 * Basada en el ejemplo PrincipalGUI.java del repositorio de clase
 * 
 * @author Tu nombre
 * @version 1.0
 */
public class RigoCompraApp {
    private JFrame ventana;
    private GestorProductos gestorProductos;
    private SistemaFavoritos sistemaFavoritos;
    private JTable tablaProductos;
    private DefaultTableModel modeloTabla;
    private JTextField txtBusqueda;
    private JComboBox<String> comboCategorias;
    private JLabel lblTotalProductos;
    private JLabel lblTotalFavoritos;
    
    public RigoCompraApp() {
        this.gestorProductos = new GestorProductos();
        this.sistemaFavoritos = SistemaFavoritos.getInstancia();
        inicializarVentana();
        cargarProductos();
        actualizarEstadisticas();
    }
    
    /**
     * Inicializa la ventana principal de la aplicación
     */
    private void inicializarVentana() {
        ventana = new JFrame("RigoCompra! - Tienda Virtual");
        ventana.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        ventana.setSize(1000, 700);
        ventana.setLayout(new BorderLayout());
        
        // Panel superior con controles
        JPanel panelSuperior = new JPanel(new FlowLayout(FlowLayout.LEFT));
        panelSuperior.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        txtBusqueda = new JTextField(20);
        comboCategorias = new JComboBox<>(new String[]{"Todas", "Tecnología", "Ropa", "Hogar", "Comida", "Servicios"});
        JButton btnBuscar = new JButton("🔍 Buscar");
        JButton btnFavoritos = new JButton("❤️ Ver Favoritos");
        JButton btnAgregar = new JButton("➕ Agregar Producto");
        
        // Estadísticas
        lblTotalProductos = new JLabel("Total: 0");
        lblTotalFavoritos = new JLabel("Favoritos: 0");
        
        panelSuperior.add(new JLabel("Buscar:"));
        panelSuperior.add(txtBusqueda);
        panelSuperior.add(new JLabel("Categoría:"));
        panelSuperior.add(comboCategorias);
        panelSuperior.add(btnBuscar);
        panelSuperior.add(btnFavoritos);
        panelSuperior.add(btnAgregar);
        panelSuperior.add(Box.createHorizontalStrut(20));
        panelSuperior.add(lblTotalProductos);
        panelSuperior.add(lblTotalFavoritos);
        
        // Tabla de productos
        String[] columnas = {"ID", "Código", "Nombre", "Precio (Q)", "Categoría", "Stock", "❤️"};
        modeloTabla = new DefaultTableModel(columnas, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // Tabla no editable directamente
            }
            
            @Override
            public Class<?> getColumnClass(int columnIndex) {
                if (columnIndex == 6) { // Columna de favoritos
                    return Boolean.class;
                }
                return super.getColumnClass(columnIndex);
            }
        };
        
        tablaProductos = new JTable(modeloTabla);
        tablaProductos.setRowHeight(25);
        tablaProductos.getTableHeader().setReorderingAllowed(false);
        
        // Configurar renderizador para la columna de favoritos
        tablaProductos.getColumnModel().getColumn(6).setCellRenderer(new FavoritoRenderer());
        
        JScrollPane scrollPane = new JScrollPane(tablaProductos);
        scrollPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        // Panel inferior con información
        JPanel panelInferior = new JPanel(new FlowLayout(FlowLayout.LEFT));
        panelInferior.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        panelInferior.add(new JLabel("💡 Doble clic en un producto para ver detalles"));
        
        // Agregar componentes a la ventana
        ventana.add(panelSuperior, BorderLayout.NORTH);
        ventana.add(scrollPane, BorderLayout.CENTER);
        ventana.add(panelInferior, BorderLayout.SOUTH);
        
        // Eventos
        btnBuscar.addActionListener(e -> buscarProductos());
        btnFavoritos.addActionListener(e -> mostrarFavoritos());
        btnAgregar.addActionListener(e -> mostrarDialogoAgregar());
        
        // Evento de doble clic en tabla
        tablaProductos.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                if (evt.getClickCount() == 2) {
                    int fila = tablaProductos.rowAtPoint(evt.getPoint());
                    if (fila >= 0) {
                        mostrarDetallesProducto(fila);
                    }
                }
            }
        });
        
        // Evento para alternar favorito
        tablaProductos.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                int fila = tablaProductos.rowAtPoint(evt.getPoint());
                int columna = tablaProductos.columnAtPoint(evt.getPoint());
                
                if (fila >= 0 && columna == 6) { // Columna de favoritos
                    alternarFavorito(fila);
                }
            }
        });
        
        ventana.setLocationRelativeTo(null); // Centrar ventana
        ventana.setVisible(true);
    }
    
    /**
     * Carga todos los productos en la tabla
     */
    private void cargarProductos() {
        modeloTabla.setRowCount(0); // Limpiar tabla
        List<Producto> productos = gestorProductos.listarProductos();
        
        for (Producto producto : productos) {
            agregarProductoATabla(producto);
        }
    }
    
    /**
     * Agrega un producto a la tabla
     */
    private void agregarProductoATabla(Producto producto) {
        Object[] fila = {
            producto.getId(),
            producto.getCodigo(),
            producto.getNombre(),
            String.format("%.2f", producto.getPrecioUnitario()),
            producto.getCategoria(),
            producto.getCantidad(),
            sistemaFavoritos.esFavorito(producto.getId())
        };
        modeloTabla.addRow(fila);
    }
    
    /**
     * Busca productos según los criterios especificados
     */
    private void buscarProductos() {
        String textoBusqueda = txtBusqueda.getText().trim();
        String categoriaSeleccionada = comboCategorias.getSelectedItem().toString();
        
        List<Producto> resultados;
        
        if (!textoBusqueda.isEmpty()) {
            resultados = gestorProductos.buscarPorNombre(textoBusqueda);
        } else if (!categoriaSeleccionada.equals("Todas")) {
            resultados = gestorProductos.buscarPorCategoria(categoriaSeleccionada);
        } else {
            resultados = gestorProductos.listarProductos();
        }
        
        // Actualizar tabla con resultados
        modeloTabla.setRowCount(0);
        for (Producto producto : resultados) {
            agregarProductoATabla(producto);
        }
        
        actualizarEstadisticas();
    }
    
    /**
     * Muestra el diálogo de favoritos
     */
    private void mostrarFavoritos() {
        JDialog dialogoFavoritos = new JDialog(ventana, "Productos Favoritos", true);
        dialogoFavoritos.setSize(600, 400);
        dialogoFavoritos.setLayout(new BorderLayout());
        dialogoFavoritos.setLocationRelativeTo(ventana);
        
        DefaultTableModel modeloFavoritos = new DefaultTableModel(
            new String[]{"ID", "Nombre", "Precio (Q)", "Categoría"}, 0
        );
        
        JTable tablaFavoritos = new JTable(modeloFavoritos);
        
        // Cargar favoritos
        Set<Integer> favoritos = sistemaFavoritos.getFavoritos();
        if (favoritos.isEmpty()) {
            modeloFavoritos.addRow(new Object[]{"", "No hay productos favoritos", "", ""});
        } else {
            for (Integer id : favoritos) {
                Producto producto = gestorProductos.buscarProducto(id);
                if (producto != null) {
                    modeloFavoritos.addRow(new Object[]{
                        producto.getId(),
                        producto.getNombre(),
                        String.format("%.2f", producto.getPrecioUnitario()),
                        producto.getCategoria()
                    });
                }
            }
        }
        
        // Panel de botones
        JPanel panelBotones = new JPanel();
        JButton btnLimpiar = new JButton("🗑️ Limpiar Todos");
        JButton btnCerrar = new JButton("Cerrar");
        
        btnLimpiar.addActionListener(e -> {
            sistemaFavoritos.limpiarFavoritos();
            cargarProductos();
            actualizarEstadisticas();
            dialogoFavoritos.dispose();
        });
        
        btnCerrar.addActionListener(e -> dialogoFavoritos.dispose());
        
        panelBotones.add(btnLimpiar);
        panelBotones.add(btnCerrar);
        
        dialogoFavoritos.add(new JScrollPane(tablaFavoritos), BorderLayout.CENTER);
        dialogoFavoritos.add(panelBotones, BorderLayout.SOUTH);
        dialogoFavoritos.setVisible(true);
    }
    
    /**
     * Muestra el diálogo para agregar un nuevo producto
     */
    private void mostrarDialogoAgregar() {
        JDialog dialogo = new JDialog(ventana, "Agregar Producto", true);
        dialogo.setSize(400, 500);
        dialogo.setLayout(new GridLayout(8, 2, 5, 5));
        dialogo.setLocationRelativeTo(ventana);
        
        JTextField txtCodigo = new JTextField();
        JTextField txtNombre = new JTextField();
        JTextArea txtDescripcion = new JTextArea(3, 20);
        JTextField txtPrecio = new JTextField();
        JTextField txtCantidad = new JTextField();
        JComboBox<String> comboCat = new JComboBox<>(new String[]{"Tecnología", "Ropa", "Hogar", "Comida", "Servicios"});
        JTextField txtImagen = new JTextField();
        
        dialogo.add(new JLabel("Código:"));
        dialogo.add(txtCodigo);
        dialogo.add(new JLabel("Nombre:"));
        dialogo.add(txtNombre);
        dialogo.add(new JLabel("Descripción:"));
        dialogo.add(new JScrollPane(txtDescripcion));
        dialogo.add(new JLabel("Precio:"));
        dialogo.add(txtPrecio);
        dialogo.add(new JLabel("Cantidad:"));
        dialogo.add(txtCantidad);
        dialogo.add(new JLabel("Categoría:"));
        dialogo.add(comboCat);
        dialogo.add(new JLabel("Imagen:"));
        dialogo.add(txtImagen);
        
        JPanel panelBotones = new JPanel();
        JButton btnGuardar = new JButton("Guardar");
        JButton btnCancelar = new JButton("Cancelar");
        
        btnGuardar.addActionListener(e -> {
            try {
                Producto nuevoProducto = new Producto(
                    0, // ID será asignado por el gestor
                    txtCodigo.getText(),
                    txtNombre.getText(),
                    txtDescripcion.getText(),
                    Double.parseDouble(txtPrecio.getText()),
                    Integer.parseInt(txtCantidad.getText()),
                    comboCat.getSelectedItem().toString(),
                    txtImagen.getText()
                );
                
                gestorProductos.guardarProducto(nuevoProducto);
                cargarProductos();
                actualizarEstadisticas();
                dialogo.dispose();
                
                JOptionPane.showMessageDialog(ventana, "Producto agregado exitosamente");
                
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(dialogo, "Precio y cantidad deben ser números válidos", "Error", JOptionPane.ERROR_MESSAGE);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialogo, "Error al guardar producto: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        
        btnCancelar.addActionListener(e -> dialogo.dispose());
        
        panelBotones.add(btnGuardar);
        panelBotones.add(btnCancelar);
        dialogo.add(panelBotones);
        
        dialogo.setVisible(true);
    }
    
    /**
     * Muestra los detalles de un producto
     */
    private void mostrarDetallesProducto(int fila) {
        int id = (int) modeloTabla.getValueAt(fila, 0);
        Producto producto = gestorProductos.buscarProducto(id);
        
        if (producto != null) {
            String mensaje = producto.toString();
            boolean esFavorito = sistemaFavoritos.esFavorito(id);
            
            Object[] opciones = {"Cerrar", esFavorito ? "Quitar de Favoritos" : "Agregar a Favoritos"};
            
            int opcion = JOptionPane.showOptionDialog(ventana, mensaje, "Detalles del Producto",
                    JOptionPane.DEFAULT_OPTION, JOptionPane.INFORMATION_MESSAGE,
                    null, opciones, opciones[0]);
            
            if (opcion == 1) {
                alternarFavorito(fila);
            }
        }
    }
    
    /**
     * Alterna el estado de favorito de un producto
     */
    private void alternarFavorito(int fila) {
        int id = (int) modeloTabla.getValueAt(fila, 0);
        boolean ahoraEsFavorito = sistemaFavoritos.alternarFavorito(id);
        
        // Actualizar la visualización en la tabla
        modeloTabla.setValueAt(ahoraEsFavorito, fila, 6);
        actualizarEstadisticas();
        
        String mensaje = ahoraEsFavorito ? "Agregado a favoritos" : "Quitado de favoritos";
        JOptionPane.showMessageDialog(ventana, mensaje);
    }
    
    /**
     * Actualiza las estadísticas en la interfaz
     */
    private void actualizarEstadisticas() {
        lblTotalProductos.setText("Total: " + gestorProductos.contarProductos());
        lblTotalFavoritos.setText("Favoritos: " + sistemaFavoritos.getCantidadFavoritos());
    }
    
    /**
     * Renderizador personalizado para la columna de favoritos
     */
    private static class FavoritoRenderer extends JLabel implements TableCellRenderer {
        public FavoritoRenderer() {
            setHorizontalAlignment(SwingConstants.CENTER);
            setFont(new Font("Segoe UI Emoji", Font.PLAIN, 16));
        }
        
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value,
                boolean isSelected, boolean hasFocus, int row, int column) {
            Boolean esFavorito = (Boolean) value;
            setText(esFavorito ? "❤️" : "🤍");
            return this;
        }
    }
    
    /**
     * Método principal para ejecutar la aplicación
     */
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                // Establecer look and feel del sistema
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeel());
            } catch (Exception e) {
                // Usar look and feel por defecto si falla
            }
            new RigoCompraApp();
        });
    }
}