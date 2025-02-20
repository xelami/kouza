declare module "next-international/server" {
  export * from "next-international/dist/app/server"
  export const createI18nServer: any
}

declare module "next-international/client" {
  export * from "next-international/dist/app/client"
  export const createI18nClient: any
}
