

interface ActionResponse<TData, TError> {
  data?: TData, 
  errors?: TError,
  message: string, 
  statusCode: number
}

export const ActionResponse = <TData, TError>(props: ActionResponse<TData, TError>) => {
  return {
    data: props.data ? props.data : null,
    errors: props.errors ? props : null,
    message: props.message,
    code: props.statusCode
  }
}