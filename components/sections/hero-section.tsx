'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          CTeI<span className="text-primary-600">Nexus4</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plataforma integral para la gestión de proyectos de investigación científica y tecnológica.
          Centraliza, colabora y acelera tu investigación.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8">
              Comenzar Ahora
            </Button>
          </Link>
          <Link href="#proyectos">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Ver Proyectos Públicos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}