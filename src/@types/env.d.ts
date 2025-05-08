declare namespace NodeJS {
  interface ProcessEnv {
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    NEXT_PUBLIC_API_URL: string;
    JWT_SECRET: string;
    NEXT_PUBLIC_IMAGEKIT_SECRET_KEY: string;
    NEXT_PUBLIC_BUCKET_NAME: string;
    NEXT_PUBLIC_BUCKET_URL: string;
    NEXT_PUBLIC_AWS_REGION: string;
    NEXT_PUBLIC_AWS_ACCESS_KEY: string;
    NEXT_PUBLIC_AWS_SECRET_KEY: string;
  }
}
