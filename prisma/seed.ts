import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear tipos de producto CTeI
  const productTypes = [
    // Investigación y Desarrollo
    {
      code: 'ARTICULO_CIENTIFICO',
      description: 'Artículo científico publicado en revista indexada',
      quality: 'Alto',
      category: 'Publicaciones Científicas'
    },
    {
      code: 'LIBRO',
      description: 'Libro o capítulo de libro',
      quality: 'Alto',
      category: 'Publicaciones Científicas'
    },
    {
      code: 'PATENTE',
      description: 'Patente registrada',
      quality: 'Muy Alto',
      category: 'Propiedad Intelectual'
    },
    {
      code: 'SOFTWARE',
      description: 'Software o aplicación desarrollada',
      quality: 'Alto',
      category: 'Productos Tecnológicos'
    },
    {
      code: 'PROTOTIPO',
      description: 'Prototipo funcional',
      quality: 'Medio',
      category: 'Productos Tecnológicos'
    },
    {
      code: 'MODELO_MATEMATICO',
      description: 'Modelo matemático o algoritmo',
      quality: 'Medio',
      category: 'Productos Tecnológicos'
    },
    {
      code: 'BASE_DATOS',
      description: 'Base de datos especializada',
      quality: 'Medio',
      category: 'Productos Tecnológicos'
    },
    {
      code: 'CONSULTORIA',
      description: 'Servicio de consultoría especializada',
      quality: 'Medio',
      category: 'Servicios'
    },
    {
      code: 'CAPACITACION',
      description: 'Programa de capacitación o curso',
      quality: 'Bajo',
      category: 'Servicios'
    },
    {
      code: 'INFORME_TECNICO',
      description: 'Informe técnico o de investigación',
      quality: 'Bajo',
      category: 'Documentos Técnicos'
    },
    {
      code: 'GUIA_METODOLOGICA',
      description: 'Guía metodológica o manual',
      quality: 'Bajo',
      category: 'Documentos Técnicos'
    },
    {
      code: 'ESTUDIO_PILOTO',
      description: 'Estudio piloto o de viabilidad',
      quality: 'Medio',
      category: 'Investigación Aplicada'
    },
    {
      code: 'DIAGNOSTICO_TECNOLOGICO',
      description: 'Diagnóstico tecnológico sectorial',
      quality: 'Medio',
      category: 'Investigación Aplicada'
    },
    {
      code: 'MAPA_TECNOLOGICO',
      description: 'Mapa tecnológico o de capacidades',
      quality: 'Alto',
      category: 'Investigación Aplicada'
    },
    {
      code: 'INNOVACION_PROCESO',
      description: 'Innovación en procesos productivos',
      quality: 'Alto',
      category: 'Innovación Empresarial'
    },
    {
      code: 'INNOVACION_PRODUCTO',
      description: 'Innovación en productos',
      quality: 'Alto',
      category: 'Innovación Empresarial'
    },
    {
      code: 'TRANSFERENCIA_TECNOLOGICA',
      description: 'Proyecto de transferencia tecnológica',
      quality: 'Muy Alto',
      category: 'Innovación Empresarial'
    },
    {
      code: 'DESARROLLO_PRODUCTIVO',
      description: 'Desarrollo productivo regional',
      quality: 'Alto',
      category: 'Desarrollo Regional'
    },
    {
      code: 'CLUSTER_TECNOLOGICO',
      description: 'Formación de cluster tecnológico',
      quality: 'Muy Alto',
      category: 'Desarrollo Regional'
    },
    {
      code: 'CENTRO_INNOVACION',
      description: 'Centro de innovación creado',
      quality: 'Muy Alto',
      category: 'Infraestructura'
    }
  ]

  console.log('📝 Creando tipos de producto...')

  for (const productType of productTypes) {
    await prisma.productType.upsert({
      where: { code: productType.code },
      update: {},
      create: productType,
    })
  }

  console.log('✅ Seed completado exitosamente!')
  console.log(`📊 Se crearon ${productTypes.length} tipos de producto CTeI`)
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })