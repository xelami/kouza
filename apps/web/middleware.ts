import { createI18nMiddleware } from "next-international/middleware"
import { type NextRequest, NextResponse } from "next/server"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "es", "fr", "no", "pt"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
})

export async function middleware(request: NextRequest) {
  const response = await I18nMiddleware(request)

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|monitoring).*)"],
}
