import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProjectForm } from '@/components/dashboard/project-form'

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Fetch the project
  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!project) {
    redirect('/dashboard')
  }

  // Convert dates to strings for the form
  const projectForForm = {
    ...project,
    startDate: project.startDate?.toISOString().split('T')[0] || null,
    endDate: project.endDate?.toISOString().split('T')[0] || null,
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Editar Proyecto
        </h1>
        <p className="text-gray-600">
          Modifica la información de tu proyecto de investigación.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <ProjectForm project={projectForForm} />
      </div>
    </div>
  )
}