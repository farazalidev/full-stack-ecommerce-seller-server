export interface CustomError<dataToSend> {
  data: dataToSend | undefined;
  success: boolean;
  error?: {
    message: string;
    statusCode: number;
  };
}
