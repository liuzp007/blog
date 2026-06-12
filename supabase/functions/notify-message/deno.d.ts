/**
 * Deno runtime types for Supabase Edge Functions.
 * Provides ambient declarations so the project's TS checker recognises
 * Deno globals without installing the full Deno SDK.
 */
declare namespace Deno {
  function serve(handler: (req: Request) => Promise<Response> | Response): void

  const env: {
    get(key: string): string | undefined
  }
}
