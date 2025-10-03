import { CheckCircle, Users, Brain, Globe, FileText, BarChart3, Shield } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      title: 'Gestión Integral de Proyectos',
      description: 'Administra el ciclo completo de vida de tus proyectos de investigación desde la propuesta hasta la finalización',
      icon: FileText
    },
    {
      title: 'Productos CTeI Estructurados',
      description: 'Registra y clasifica productos de ciencia, tecnología e innovación con tipologías estandarizadas',
      icon: BarChart3
    },
    {
      title: 'Colaboración Segura',
      description: 'Trabaja en equipo con control de acceso y permisos granulares para proteger tu investigación',
      icon: Shield
    },
    {
      title: 'Portal Público Transparente',
      description: 'Comparte proyectos destacados con la comunidad científica y stakeholders interesados',
      icon: Globe
    },
    {
      title: 'Análisis con IA',
      description: 'Obtén evaluaciones inteligentes y recomendaciones para mejorar la calidad de tus propuestas',
      icon: Brain
    },
    {
      title: 'Reportes y Métricas',
      description: 'Genera reportes automáticos y visualiza métricas de impacto de tu investigación',
      icon: Users
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Qué es CTeINexus4?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Una plataforma integral para la gestión de proyectos de investigación científica y tecnológica
            que conecta investigadores, instituciones y la sociedad civil.
          </p>
          <div className="bg-primary-50 rounded-lg p-6 max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              CTeINexus4 nace de la necesidad de centralizar y modernizar la gestión de proyectos CTeI
              en Colombia. Nuestra plataforma permite a investigadores gestionar proyectos completos,
              registrar productos de innovación, compartir conocimientos y acceder a análisis inteligentes
              que mejoran la calidad y el impacto de la investigación.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Características Principales
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Beneficios adicionales */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Beneficios para el Ecosistema CTeI
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Para Investigadores</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Gestión simplificada del ciclo completo de investigación
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Acceso a herramientas de evaluación inteligente
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Mayor visibilidad de proyectos y productos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Colaboración segura con equipos de investigación
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Para Instituciones</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Seguimiento centralizado de proyectos institucionales
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Reportes automáticos para acreditación y evaluación
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Mayor transparencia en la gestión de recursos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Apoyo a la toma de decisiones estratégicas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}