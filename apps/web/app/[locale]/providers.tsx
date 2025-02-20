"use client"

import { I18nProviderClient } from "@/locales/client"
import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"

type ProviderProps = {
  children: ReactNode
  locale: string
}

export function Providers({ children, locale }: ProviderProps) {
  return (
    <I18nProviderClient locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </I18nProviderClient>
  )
}
