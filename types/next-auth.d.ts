import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: 'USER' | 'ADMIN'
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: 'USER' | 'ADMIN'
      phoneNumber?: string | null
      postalCode?: string | null
      prefecture?: string | null
      city?: string | null
      addressLine1?: string | null
      addressLine2?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'USER' | 'ADMIN'
  }
}
