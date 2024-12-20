export type APIResponse<result> = {
  status: number;
  message: string;
  result: {
    data: result;
    total: number;
  };
};

export type FormStateType<T = null> = {
  code: number;
  message: string;
  success: boolean;
  result?: T;
};
