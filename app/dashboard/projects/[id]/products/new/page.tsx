import { ProductForm } from '@/components/dashboard/product-form'

interface NewProductPageProps {
  params: {
    id: string
  }
}

export default function NewProductPage({ params }: NewProductPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Nuevo Producto CTeI
        </h1>
        <p className="text-gray-600">
          Agregue un producto de ciencia, tecnología e innovación a este proyecto.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <ProductForm projectId={params.id} />
      </div>
    </div>
  )
}