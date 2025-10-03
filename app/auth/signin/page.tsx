import { getProviders } from 'next-auth/react'
import { SignInButton } from '@/components/auth/signin-button'

export default async function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión en CTeINexus4
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta de investigador para gestionar proyectos
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <SignInButton />
        </div>
      </div>
    </div>
  )
}