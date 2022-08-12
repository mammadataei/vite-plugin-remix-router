export interface Options {
  /**
   * Path to the directory to search for page components.
   * @default 'src/pages'
   */
  pageDir: string

  /**
   * Valid file extensions for page components.
   * @default ['tsx', 'jsx']
   */
  extensions: string[]
}

export type UserOptions = Partial<Options>

export interface ResolvedOptions extends Options {
  /**
   * Resolves to the `root` value from Vite config.
   */
  root: string
}
