export interface ResponseDTO<T> {
  status: number;
  message: string;
  content: T;
}
