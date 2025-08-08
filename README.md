# 🎓 Sistema de Monitoreo y Alerta Temprana para Estudiantes

Este proyecto es una plataforma web para **monitorear el estado emocional y académico de estudiantes**, con el objetivo de identificar a tiempo posibles riesgos y activar mecanismos de apoyo. Se procesan cuestionarios estandarizados de bienestar (**autoestima, depresión, ansiedad y estrés**) y se visualizan resultados interpretados y filtrables.

---

## 🚧 En Desarrollo

Este repositorio corresponde al desarrollo de una **aplicación web full stack** con enfoque en el análisis de datos psicológicos para entornos educativos.

---

## 🧱 Tecnologías Utilizadas

### ⚙️ Frontend

- **React 19** con **TypeScript** para interfaces robustas y tipadas.
- **Tailwind CSS** para estilos rápidos y personalizables.
- **html2canvas** + **jsPDF** para generación de reportes PDF desde el navegador.

### 🗄️ Backend

- **Supabase (PostgreSQL)** como backend-as-a-service, autenticación, base de datos y API RESTful.
- **EmailJS** para notificaciones por correo electrónico (alertas, reportes, etc.).

### 🚢 Despliegue

- **Docker** para contenerización y entornos reproducibles.
- **Nginx** como servidor de producción para frontend.

---

## 📊 Funcionalidades Planeadas

- Ingreso seguro de estudiantes y personal autorizado.
- Carga y procesamiento de archivos CSV con respuestas a:
  - **RSES (Autoestima)**
  - **PHQ-9 (Depresión)**
  - **GAD-7 (Ansiedad)**
  - **PSS-14 (Estrés)**
- Interpretación automática de resultados según puntuaciones.
- Visualización de resultados en tablas interactivas.
- Filtrado por cédula y criterios de alerta.
- Generación de reportes PDF descargables.
- Alerta por correo cuando se detectan casos críticos.
- Panel administrativo con control de usuarios e historial.

---

## 📁 Formato de Archivo CSV Esperado

- **Delimitador:** Punto y coma (`;`)
- **Codificación:** `ISO-8859-1 (latin1)`
- **Estructura esperada:**

  | Índices | Contenido                     |
  |--------:|-------------------------------|
  | 0–9     | RSES (Autoestima)             |
  | 10–18   | PHQ-9 (Depresión)             |
  | 19      | Funcionalidad PHQ-9 (omitida) |
  | 20–26   | GAD-7 (Ansiedad)              |
  | 27      | Funcionalidad GAD-7 (omitida) |
  | 28–41   | PSS-14 (Estrés)               |
  | Última  | Cédula del estudiante         |

> ⚠️ Las columnas de funcionalidad (PHQ-9 y GAD-7) deben estar presentes aunque no se utilicen en el cálculo.

---

## 🎯 Objetivo

Facilitar la **detección temprana de factores de riesgo emocional o psicológico** en estudiantes a través de un sistema automatizado, visual y con mecanismos de respuesta rápida.

---

## 📌 Estado del Proyecto

🟨 **En fase de desarrollo (MVP)**

---

