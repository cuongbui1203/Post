/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BE_API_ENDPOINT: string;
  readonly IMG_DEFAULT_WP: string;
  readonly TEMPLATE_DOC: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
