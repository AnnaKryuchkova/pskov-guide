/// <reference types="vite/client" />

type ImageModule = {
  default: string;
};

declare module '*.jpg' {
  const content: ImageModule;
  export default content.default;
}

declare module '*.jpeg' {
  const content: ImageModule;
  export default content.default;
}

declare module '*.png' {
  const content: ImageModule;
  export default content.default;
}

declare module '*.svg' {
  const content: ImageModule;
  export default content.default;
}
