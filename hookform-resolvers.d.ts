declare module '@hookform/resolvers/zod' {
  import type { Resolver } from 'react-hook-form'

  export function zodResolver<TFieldValues extends Record<string, unknown>>(
    schema: unknown,
    schemaOptions?: unknown,
    resolverOptions?: unknown
  ): Resolver<TFieldValues>
}

declare module 'storybook/actions' {
  export function action(name: string, options?: unknown): (...args: unknown[]) => void
  export const actions: (...args: unknown[]) => unknown
}
