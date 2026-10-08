

export interface ActionResponse<TData, TError> {
  data?: TData | undefined, 
  errors?: TError | undefined,
  message: string, 
  statusCode: number
}

export const ActionResponse = <TData, TError>(props: ActionResponse<TData, TError>) => {
  return {
    data: props.data,
    errors: props.errors,
    message: props.message,
    statusCode: props.statusCode
  }
}