"use client"

export default function GaleriaPage() {
  const screenshots = [
    {
      title: "Página de Inicio",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/c6d5592829d86ccb7d92980d2b8f60d738414c12163adb73b26507cf9db2162c.jpg",
      description: "Landing page principal de ParkeoYa",
    },
    {
      title: "Iniciar Sesión",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/0c1d54179aa36f558e22ab6811232e85e7359ab650b8f307b91067ec135698a4.jpg",
      description: "Página de login para propietarios",
    },
    {
      title: "Crear Cuenta",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/74e76d00df30153e8e0a90cea50f8f9c1b0dd0b5f4e862204c4ae58498613e7c.jpg",
      description: "Formulario de registro",
    },
    {
      title: "Onboarding",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/aa535f0cf1055dad051803f71e2055c6c5064f0cc1bcf3b6f2ee5a11188cb157.jpg",
      description: "Configuración inicial del estacionamiento",
    },
    {
      title: "Dashboard Principal",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/b8639d9a23bcbd685ef7ab3275845349dda5c44475ade7a34f480ea3619ad76d.jpg",
      description: "Vista general del panel de control",
    },
    {
      title: "Gestión de Espacios IoT",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/e3c9e3419c381600696ee15d9812b3e2cd7e99da56bb4a7addeb1f559ad2c394.jpg",
      description: "Matriz visual de espacios con sensores",
    },
    {
      title: "Monitoreo de Reservas",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/cc6bf4d4eff6b10aba04675cda97057e61029edf1a4b0319c04af3fb8c50f09b.jpg",
      description: "Gestión de reservas activas y programadas",
    },
    {
      title: "Reportes Financieros",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/4648761ecd9affe36c231b8fb049c796830d23cb39fe970528510f554f453803.png",
      description: "Dashboard de análisis financiero",
    },
    {
      title: "Gestión de Reseñas",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/ed73d3ab7dc9e1529473337d4d8c342e6f712727933f7bbe8483c0b2d3331c52.jpg",
      description: "Sistema de calificaciones y comentarios",
    },
    {
      title: "Configuración",
      url: "https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/ed95ed3a439695eb8c22c19a62f0e934308c1a20bcac974042a4f86bb6060a51.jpg",
      description: "Ajustes de cuenta y perfil",
    },
  ]

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Galería de Pantallas - ParkeoYa</h1>
          <p className="text-muted-foreground">
            Haz clic en "Copiar URL" para obtener el enlace directo de cada imagen para Figma
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-card-foreground mb-1">{screenshot.title}</h2>
                <p className="text-sm text-muted-foreground">{screenshot.description}</p>
              </div>

              <div className="mb-4 overflow-hidden rounded-md border">
                <img src={screenshot.url || "/placeholder.svg"} alt={screenshot.title} className="w-full h-auto" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={screenshot.url}
                    readOnly
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(screenshot.url)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Copiar URL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h3 className="text-lg font-semibold mb-3">Instrucciones para Figma:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Haz clic en "Copiar URL" en la imagen que desees usar</li>
            <li>En Figma, crea un rectángulo o frame</li>
            <li>En el panel de propiedades, ve a "Fill" → "Image"</li>
            <li>Pega la URL copiada en el campo de imagen</li>
            <li>La imagen se cargará directamente desde el enlace</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
