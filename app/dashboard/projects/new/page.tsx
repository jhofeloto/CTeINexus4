import { ProjectForm } from '@/components/dashboard/project-form'

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Nuevo Proyecto
        </h1>
        <p className="text-gray-600">
          Completa la información de tu proyecto de investigación científica y tecnológica.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <ProjectForm />
      </div>
    </div>
  )
}