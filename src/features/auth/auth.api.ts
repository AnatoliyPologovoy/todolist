import {instance} from "common/common.api";
import {LoginRequestType, ResponseType} from "features/todos/todolist-api";
import {AxiosResponse} from "axios";

export const authAPI = {
		login(RequestPayload: LoginRequestType) {
				return instance
						.post<ResponseType<{ userId: number }>,
								AxiosResponse<ResponseType<{ userId: number }>>,
								LoginRequestType>('auth/login', RequestPayload)
		},
		me() {
				return instance
						.get<ResponseType<{
								id: string,
								email: string,
								login: string
						}>>('auth/me')
		},
		logout() {
				return instance
						.delete<ResponseType>('auth/login')
		}
}