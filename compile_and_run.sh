#!/bin/bash

# Script para compilar y ejecutar RigoCompra Java
# Autor: Tu nombre
# Fecha: $(date)

echo "🛒 RigoCompra Java - Compilación y Ejecución"
echo "=============================================="

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Java
if ! command_exists java; then
    echo "❌ Java no está instalado. Por favor instala Java 11 o superior."
    exit 1
fi

# Verificar Maven
if ! command_exists mvn; then
    echo "⚠️  Maven no está instalado. Intentando compilar con javac..."
    
    # Compilar manualmente
    echo "📦 Compilando con javac..."
    cd src/main/java
    
    # Limpiar clases anteriores
    rm -rf ../../../../target/classes/com/rigocompra/*.class 2>/dev/null
    mkdir -p ../../../../target/classes/com/rigocompra
    
    # Compilar
    javac -d ../../../../target/classes com/rigocompra/*.java
    
    if [ $? -eq 0 ]; then
        echo "✅ Compilación exitosa!"
        echo "🚀 Ejecutando aplicación..."
        cd ../../../../target/classes
        java com.rigocompra.RigoCompraApp
    else
        echo "❌ Error en la compilación"
        exit 1
    fi
else
    echo "✅ Java y Maven encontrados"
    echo "📦 Usando Maven para compilar y ejecutar..."
    
    # Limpiar y compilar
    echo "🧹 Limpiando proyecto anterior..."
    mvn clean
    
    echo "📦 Compilando con Maven..."
    mvn compile
    
    if [ $? -eq 0 ]; then
        echo "✅ Compilación exitosa!"
        echo "🚀 Ejecutando aplicación..."
        mvn exec:java
    else
        echo "❌ Error en la compilación con Maven"
        echo "🔄 Intentando con javac..."
        
        # Fallback a compilación manual
        cd src/main/java
        mkdir -p ../../../../target/classes/com/rigocompra
        javac -d ../../../../target/classes com/rigocompra/*.java
        
        if [ $? -eq 0 ]; then
            echo "✅ Compilación manual exitosa!"
            echo "🚀 Ejecutando aplicación..."
            cd ../../../../target/classes
            java com.rigocompra.RigoCompraApp
        else
            echo "❌ Error en la compilación manual"
            exit 1
        fi
    fi
fi