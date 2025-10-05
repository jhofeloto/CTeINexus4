-- Manual Seed Script for CTeINexus4
-- Execute this AFTER running manual-migration.sql

-- Insert Product Types
INSERT INTO "product_types" ("id", "code", "description", "quality", "category", "createdAt", "updatedAt") VALUES
('pt1', 'ARTICULO_CIENTIFICO', 'Artículo científico publicado en revista indexada', 'Alto', 'Publicaciones Científicas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt2', 'LIBRO', 'Libro o capítulo de libro', 'Alto', 'Publicaciones Científicas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt3', 'PATENTE', 'Patente registrada', 'Muy Alto', 'Propiedad Intelectual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt4', 'SOFTWARE', 'Software o aplicación desarrollada', 'Alto', 'Productos Tecnológicos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt5', 'PROTOTIPO', 'Prototipo funcional', 'Medio', 'Productos Tecnológicos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt6', 'MODELO_MATEMATICO', 'Modelo matemático o algoritmo', 'Medio', 'Productos Tecnológicos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt7', 'BASE_DATOS', 'Base de datos especializada', 'Medio', 'Productos Tecnológicos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt8', 'CONSULTORIA', 'Servicio de consultoría especializada', 'Medio', 'Servicios', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt9', 'CAPACITACION', 'Programa de capacitación o curso', 'Bajo', 'Servicios', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt10', 'INFORME_TECNICO', 'Informe técnico o de investigación', 'Bajo', 'Documentos Técnicos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt11', 'GUIA_METODOLOGICA', 'Guía metodológica o manual', 'Bajo', 'Documentos Técnicos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt12', 'ESTUDIO_PILOTO', 'Estudio piloto o de viabilidad', 'Medio', 'Investigación Aplicada', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt13', 'DIAGNOSTICO_TECNOLOGICO', 'Diagnóstico tecnológico sectorial', 'Medio', 'Investigación Aplicada', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt14', 'MAPA_TECNOLOGICO', 'Mapa tecnológico o de capacidades', 'Alto', 'Investigación Aplicada', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt15', 'INNOVACION_PROCESO', 'Innovación en procesos productivos', 'Alto', 'Innovación Empresarial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt16', 'INNOVACION_PRODUCTO', 'Innovación en productos', 'Alto', 'Innovación Empresarial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt17', 'TRANSFERENCIA_TECNOLOGICA', 'Proyecto de transferencia tecnológica', 'Muy Alto', 'Innovación Empresarial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt18', 'DESARROLLO_PRODUCTIVO', 'Desarrollo productivo regional', 'Alto', 'Desarrollo Regional', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt19', 'CLUSTER_TECNOLOGICO', 'Formación de cluster tecnológico', 'Muy Alto', 'Desarrollo Regional', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pt20', 'CENTRO_INNOVACION', 'Centro de innovación creado', 'Muy Alto', 'Infraestructura', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

-- Success message
SELECT 'Seed completed successfully! Created ' || COUNT(*) || ' product types' as status
FROM "product_types";