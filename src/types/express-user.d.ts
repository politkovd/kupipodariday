declare module "express" {
  export interface Request {
    user?: {
      userId: number;
      username: string;
    };
  }
}
