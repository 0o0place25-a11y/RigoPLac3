-- Configuración de Base de Datos para RigoCompra Java
-- Este script configura la base de datos MySQL para la aplicación

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS rigocompra_java;
USE rigocompra_java;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(200),
    ciudad VARCHAR(50),
    telefono VARCHAR(20),
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_nombre_usuario (nombre_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    categoria_id INT,
    imagen VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria_id),
    INDEX idx_precio (precio_unitario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, producto_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de historial de precios (opcional)
CREATE TABLE IF NOT EXISTS historial_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    precio_anterior DECIMAL(10,2) NOT NULL,
    precio_nuevo DECIMAL(10,2) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto_fecha (producto_id, fecha_cambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion) VALUES
('Tecnología', 'Productos electrónicos y tecnológicos'),
('Ropa', 'Prendas de vestir y accesorios'),
('Hogar', 'Artículos para el hogar y decoración'),
('Comida', 'Productos alimenticios y bebidas'),
('Servicios', 'Servicios profesionales y técnicos')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Insertar productos de ejemplo
INSERT INTO productos (codigo, nombre, descripcion, precio_unitario, cantidad, categoria_id, imagen) VALUES
('LAP001', 'Laptop Gaming HP Pavilion', 'Laptop de alto rendimiento para gaming con RTX 3060, 16GB RAM, perfecto estado', 8500.00, 5, 1, 'laptop.jpg'),
('PHN002', 'Smartphone Samsung Galaxy S23', 'Teléfono inteligente de última generación con cámara de 108MP', 3200.00, 10, 1, 'phone.jpg'),
('TAB003', 'iPad Pro 12.9', 'Tablet profesional con pantalla Liquid Retina XDR', 4800.00, 8, 1, 'tablet.jpg'),
('CLT004', 'Chaqueta de Cuero Genuino', 'Chaqueta elegante de cuero genuino, perfecta para invierno', 450.00, 15, 2, 'jacket.jpg'),
('SHO005', 'Zapatos Nike Air Max', 'Calzado deportivo cómodo y resistente', 180.00, 25, 2, 'shoes.jpg'),
('FUR006', 'Sofá de 3 Plazas', 'Sofá cómodo de tela en excelente estado', 1200.00, 3, 3, 'sofa.jpg'),
('LIG007', 'Lámpara de Pie LED', 'Lámpara moderna con control de brillo', 85.00, 12, 3, 'lamp.jpg'),
('COF008', 'Café Especialidad Guatemala', 'Café de alta calidad de las montañas guatemaltecas', 25.00, 50, 4, 'coffee.jpg'),
('CHO009', 'Chocolate Artesanal', 'Chocolate orgánico de cacao guatemalteco', 15.00, 30, 4, 'chocolate.jpg'),
('WEB010', 'Desarrollo Web Personalizado', 'Servicio de desarrollo de sitios web a medida', 1500.00, 100, 5, 'web.jpg')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio_unitario = VALUES(precio_unitario),
    cantidad = VALUES(cantidad),
    categoria_id = VALUES(categoria_id),
    imagen = VALUES(imagen);

-- Insertar usuario de ejemplo
INSERT INTO usuarios (nombre_completo, nombre_usuario, correo, contraseña, ciudad, telefono) VALUES
('Usuario Demo', 'demo', 'demo@rigocompra.com', 'demo123', 'Guatemala', '55501234')
ON DUPLICATE KEY UPDATE 
    nombre_completo = VALUES(nombre_completo),
    nombre_usuario = VALUES(nombre_usuario),
    ciudad = VALUES(ciudad),
    telefono = VALUES(telefono);

-- Crear vistas útiles
CREATE OR REPLACE VIEW vista_productos_con_categoria AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.descripcion,
    p.precio_unitario,
    p.cantidad,
    c.nombre as categoria,
    p.imagen,
    p.fecha_creacion
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id;

CREATE OR REPLACE VIEW vista_productos_bajo_stock AS
SELECT 
    p.*,
    c.nombre as categoria
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.cantidad <= 5;

-- Procedimientos almacenados útiles
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_agregar_producto(
    IN p_codigo VARCHAR(50),
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_precio DECIMAL(10,2),
    IN p_cantidad INT,
    IN p_categoria_id INT,
    IN p_imagen VARCHAR(255)
)
BEGIN
    INSERT INTO productos (codigo, nombre, descripcion, precio_unitario, cantidad, categoria_id, imagen)
    VALUES (p_codigo, p_nombre, p_descripcion, p_precio, p_cantidad, p_categoria_id, p_imagen);
END//

CREATE PROCEDURE IF NOT EXISTS sp_actualizar_stock(
    IN p_producto_id INT,
    IN p_cantidad INT
)
BEGIN
    UPDATE productos 
    SET cantidad = cantidad + p_cantidad 
    WHERE id = p_producto_id;
END//

DELIMITER ;

-- Permisos (ajustar según tu configuración de seguridad)
-- CREATE USER 'rigocompra_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON rigocompra_java.* TO 'rigocompra_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Mostrar estado
SELECT 'Base de datos configurada exitosamente' as mensaje;
SELECT 'Tablas creadas:' as info;
SHOW TABLES;

SELECT 'Productos insertados:' as info;
SELECT COUNT(*) as total_productos FROM productos;

SELECT 'Categorías disponibles:' as info;
SELECT nombre FROM categorias ORDER BY nombre;