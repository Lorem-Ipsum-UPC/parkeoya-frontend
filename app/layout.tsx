import type { Metadata } from 'next'
import React from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Parkeoya - Gestión de Espacios de Estacionamiento',
  description:
    'Plataforma para gestionar y reservar espacios de estacionamiento de manera eficiente',
  keywords: ['estacionamiento', 'reservas', 'espacios', 'gestión'],
  authors: [{ name: 'Parkeoya Team' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  )
}
