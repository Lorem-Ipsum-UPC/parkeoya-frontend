// Global type declarations for the project

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.ico' {
  const content: string
  export default content
}

declare module '*.bmp' {
  const content: string
  export default content
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_APP_URL: string
    readonly NEXT_PUBLIC_API_URL: string
    readonly API_SECRET_KEY: string
    readonly DATABASE_URL?: string
    readonly NEXTAUTH_SECRET?: string
    readonly NEXTAUTH_URL?: string
    readonly GOOGLE_MAPS_API_KEY?: string
    readonly STRIPE_SECRET_KEY?: string
    readonly STRIPE_PUBLISHABLE_KEY?: string
  }
}

// CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}
