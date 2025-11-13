# RigoCompra Java 🛒

Aplicación de comercio electrónico en Java con GUI Swing, implementando todos los conceptos de Programación Orientada a Objetos (POO) aprendidos en clase.

## 🎯 Características

### Funcionalidades Principales
- ✅ **Catálogo de Productos**: Visualización completa de productos con detalles
- ✅ **Sistema de Búsqueda**: Búsqueda por nombre y filtrado por categoría
- ✅ **Sistema de Favoritos**: Agregar/quitar productos de favoritos con persistencia
- ✅ **Gestión de Productos**: Agregar nuevos productos al catálogo
- ✅ **Interfaz Gráfica**: GUI completa con Swing
- ✅ **Estadísticas**: Contadores de productos y favoritos

### Conceptos POO Implementados
- ✅ **Encapsulamiento**: Atributos privados con getters/setters
- ✅ **Herencia**: Jerarquía de clases (Usuario, Producto)
- ✅ **Interfaces**: GestorDatos como contrato
- ✅ **Polimorfismo**: Métodos sobrescritos (toString)
- ✅ **Singleton**: SistemaFavoritos para estado global
- ✅ **Abstracción**: Clases bien definidas con responsabilidades claras

## 🏗️ Estructura del Proyecto

```
RigoCompraJava/
├── src/main/java/com/rigocompra/
│   ├── Producto.java              # Clase Producto con encapsulamiento
│   ├── Usuario.java               # Clase Usuario para autenticación
│   ├── GestorDatos.java           # Interface para gestión de datos
│   ├── GestorProductos.java       # Implementación de GestorDatos
│   ├── SistemaFavoritos.java      # Singleton para favoritos
│   └── RigoCompraApp.java         # Aplicación principal con GUI
├── pom.xml                        # Configuración Maven
└── README.md                      # Este archivo
```

## 🚀 Cómo Compilar y Ejecutar

### Requisitos Previos
- Java 11 o superior
- Maven 3.6 o superior
- MySQL (opcional, para versión con base de datos)

### Opción 1: Con Maven

1. **Compilar el proyecto**:
```bash
mvn clean compile
```

2. **Ejecutar la aplicación**:
```bash
mvn exec:java
```

3. **Crear JAR ejecutable**:
```bash
mvn clean package
java -jar target/rigocompra-java-1.0.0.jar
```

### Opción 2: Sin Maven (Java puro)

1. **Compilar manualmente**:
```bash
cd src/main/java
javac com/rigocompra/*.java
```

2. **Ejecutar**:
```bash
java com.rigocompra.RigoCompraApp
```

## 📋 Uso de la Aplicación

### Interfaz Principal
- **Barra de Búsqueda**: Busca productos por nombre
- **Filtro por Categoría**: Filtra productos por tipo
- **Tabla de Productos**: Muestra todos los productos con sus detalles
- **Botón de Favoritos**: Corazón para agregar/quitar de favoritos

### Funcionalidades

1. **Buscar Productos**:
   - Escribe en el campo de búsqueda
   - Selecciona una categoría del combo box
   - Haz clic en "Buscar"

2. **Agregar a Favoritos**:
   - Haz clic en la columna "❤️" de cualquier producto
   - El corazón se pondrá rojo si es favorito

3. **Ver Favoritos**:
   - Haz clic en "Ver Favoritos"
   - Se abrirá una ventana con todos tus favoritos
   - Puedes limpiar todos los favoritos

4. **Agregar Nuevo Producto**:
   - Haz clic en "Agregar Producto"
   - Completa el formulario con los datos
   - El producto se agregará al catálogo

5. **Ver Detalles**:
   - Haz doble clic en cualquier producto
   - Verás información completa del producto
   - Puedes agregar/quitar de favoritos desde el diálogo

## 🎨 Aspecto de la Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│ RigoCompra! - Tienda Virtual                               │
├─────────────────────────────────────────────────────────────┤
│ Buscar: [___________] Categoría: [Todas ▼] 🔍 Buscar      │
│ ❤️ Ver Favoritos ➕ Agregar Producto  Total: 10 Favoritos: 3│
├─────────────────────────────────────────────────────────────┤
│ ┌───┬─────────┬────────────────────┬─────────┬────────────┐│
│ │ID │Código   │Nombre              │Precio   │Categoría   ││
│ ├───┼─────────┼────────────────────┼─────────┼────────────┤│
│ │1  │LAP001   │Laptop Gaming HP    │8500.00  │Tecnología  ││
│ │2  │PHN002   │Smartphone Samsung  │3200.00  │Tecnología  ││
│ │...│...      │...                 │...      │...         ││
│ └───┴─────────┴────────────────────┴─────────┴────────────┘│
├─────────────────────────────────────────────────────────────┤
│ 💡 Doble clic en un producto para ver detalles              │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Personalización

### Agregar Nuevos Productos
Los productos iniciales están definidos en `GestorProductos.cargarProductosIniciales()`. Puedes modificar este método para agregar tus propios productos.

### Cambiar Categorías
Las categorías están definidas en:
- `RigoCompraApp.comboCategorias`: Para el filtro
- `GestorProductos.cargarProductosIniciales()`: Para los productos de ejemplo

### Modificar Aspecto Visual
La aplicación usa el Look and Feel del sistema operativo. Puedes cambiarlo modificando la línea en `RigoCompraApp.main()`:

```java
// Para Look and Feel personalizado:
UIManager.setLookAndFeel("javax.swing.plaf.nimbus.NimbusLookAndFeel");
// O cualquier otro Look and Feel disponible
```

## 🗄️ Integración con Base de Datos (Próxima Versión)

La aplicación está preparada para integración con MySQL:

1. **Agregar dependencia MySQL** en `pom.xml` (ya incluida)
2. **Crear clase `ProductoDAO`** con JDBC
3. **Modificar `GestorProductos`** para usar la base de datos
4. **Configurar conexión** con tu base de datos MySQL

### Script SQL para Base de Datos
```sql
CREATE DATABASE IF NOT EXISTS rigocompra;
USE rigocompra;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagen VARCHAR(255)
);

CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

## 🧪 Pruebas

### Pruebas Unitarias
Puedes agregar pruebas unitarias usando JUnit:

```java
import org.junit.Test;
import static org.junit.Assert.*;

public class ProductoTest {
    @Test
    public void testCrearProducto() {
        Producto producto = new Producto(1, "PROD001", "Test", "Descripción", 100.0, 10, "Test", "img.jpg");
        assertNotNull(producto);
        assertEquals("Test", producto.getNombre());
    }
}
```

### Ejecutar Pruebas
```bash
mvn test
```

## 🎓 Conceptos de POO Aplicados

### 1. **Encapsulamiento** ✅
- Todos los atributos son privados
- Acceso controlado mediante getters/setters
- Validación en métodos setters

### 2. **Herencia** ✅
- Clase base con comportamiento común
- Extensión de funcionalidad en clases hijas

### 3. **Interfaces** ✅
- `GestorDatos` define contrato para operaciones CRUD
- Implementación flexible (memoria, BD, archivos)

### 4. **Polimorfismo** ✅
- Métodos `toString()` sobrescritos
- Uso de la interface `GestorDatos`

### 5. **Singleton** ✅
- `SistemaFavoritos` garantiza una única instancia
- Estado global para favoritos

### 6. **Abstracción** ✅
- Clases con responsabilidades bien definidas
- Interface como capa de abstracción

## 🐛 Solución de Problemas

### Error: "No se puede encontrar la clase principal"
```bash
# Verificar que estás en el directorio correcto
cd RigoCompraJava
mvn clean compile
mvn exec:java
```

### Error: "No se puede conectar a MySQL"
```bash
# Verificar que MySQL esté ejecutándose
# Verificar credenciales en la conexión
# Verificar que el driver esté en el classpath
```

### Error: "Look and Feel no soportado"
```bash
# Comentar la línea de UIManager.setLookAndFeel()
# Usar el Look and Feel por defecto
```

## 📚 Recursos Adicionales

- [Documentación Java Swing](https://docs.oracle.com/javase/tutorial/uiswing/)
- [Maven Documentation](https://maven.apache.org/guides/)
- [MySQL Connector/J](https://dev.mysql.com/doc/connector-j/8.0/en/)

## 🤝 Contribuciones

Este proyecto es para fines educativos. Puedes:
- Agregar más funcionalidades
- Mejorar la interfaz gráfica
- Implementar la versión con base de datos
- Agregar pruebas unitarias

## 📄 Licencia

Proyecto educativo - Universidad
Basado en conceptos de Programación Orientada a Objetos en Java

---

**¡Disfruta de tu aplicación RigoCompra Java! 🎉**