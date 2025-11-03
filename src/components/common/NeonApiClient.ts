import {
  accessTokenAuthRequest,
  accessTokenAuthResponse,
  insertUserInfoRequest,
  insertUserInfoResponse,
  loginAuthRequest,
  loginAuthResponse,
  refreshTokenAuthRequest,
  refreshTokenAuthResponse,
} from "../../types/NeonApiInterface";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
class NeonClientApi {
  private _backendApiUrl: string;
  constructor() {
    this._backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || "";
  }
  /**
   *セッションストレージに格納されている情報を取得する。
   * @returns セッションストレージに格納されているユーザーIDとアクセストークン
   */
  public getSessionStorage() {
    // データの取得
    const accessToken = localStorage.getItem("shitai-accessToken") || "";
    const refreshToken = localStorage.getItem("shitai-refreshToken") || "";
    console.log(accessToken, refreshToken);
    return { accessToken, refreshToken };
  }
  /**
   * ログイン認証を行うメソッド
   * 成功時にアクセストークン情報をセッションストレージに格納する。
   * @returns {Promise<loginAuthResponse['status']>}
   *
   */
  public async loginAuth(param: loginAuthRequest) {
    localStorage.removeItem("shitai-accessToken");
    localStorage.removeItem("shitai-refreshToken");
    let statusCode = 200;
    let id = null;
    let email = "";
    let name = "";
    try {
      const options: AxiosRequestConfig<loginAuthRequest> = {
        url: `${this._backendApiUrl}/api/v1/auth/login`,
        method: "POST",
        data: param,
      };
      await axios<any, AxiosResponse<loginAuthResponse>, loginAuthRequest>(
        options
      )
        .then((res) => {
          statusCode = res.data.status;
          if ("result" in res.data) {
            const accessToken = res.data.result.accessToken;
            const refreshToken = res.data.result.refreshToken;
            // データの保存
            localStorage.setItem("shitai-accessToken", accessToken);
            localStorage.setItem("shitai-refreshToken", refreshToken);
            id = res.data.result.id;
            name = res.data.result.name;
            email = res.data.result.email;
          }
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return { statusCode, id, email, name };
    }
  }
  public async accessTokenAuth(param: accessTokenAuthRequest) {
    let statusCode = 200;
    let message = "";
    let id = null;
    let name = "";
    let email = "";
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<accessTokenAuthRequest> = {
          url: `${this._backendApiUrl}/api/v1/auth/accessToken`,
          method: "POST",
          data: param,
        };
        await axios<
          any,
          AxiosResponse<accessTokenAuthResponse>,
          accessTokenAuthRequest
        >(options)
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              id = res.data.result.id;
              name = res.data.result.name;
              email = res.data.result.email;
              isExec = false;
            }
          })
          .catch(async (error) => {
            statusCode = error.response.data.status;
            message = error.response.data.error;
            console.log(error);
            const obj = await this.wrapRefreshTokenAuth(message, statusCode);
            statusCode = obj.statusCode;
            isExec = obj.isExec;
            if (isExec) {
              param.userInfo.accessToken = obj.accessToken;
              options.data = param;
            }
          });
      }
    } catch (e) {
      console.error(e);
    } finally {
      return { statusCode, id, name, email };
    }
  }
  private async wrapRefreshTokenAuth(message: string, statusCode: number) {
    if (message === "アクセストークンが有効期限切れです。") {
      const { statusCode: newStatusCode, accessToken } =
        await this.refreshTokenAuth({
          userInfo: { refreshToken: this.getSessionStorage().refreshToken },
        });
      return { statusCode: newStatusCode, isExec: true, accessToken };
    }
    return { statusCode, isExec: false, accessToken: "" };
  }
  private async refreshTokenAuth(param: refreshTokenAuthRequest) {
    let statusCode = 200;
    let accessToken = "";
    try {
      const options: AxiosRequestConfig<refreshTokenAuthRequest> = {
        url: `${this._backendApiUrl}/api/v1/auth/refreshToken`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<refreshTokenAuthResponse>,
        refreshTokenAuthRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
          if ("result" in res.data) {
            accessToken = res.data.result.accessToken;
            const refreshToken = res.data.result.refreshToken;
            // データの保存
            localStorage.setItem("shitai-accessToken", accessToken);
            localStorage.setItem("shitai-refreshToken", refreshToken);
          }
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
          localStorage.removeItem("shitai-accessToken");
          localStorage.removeItem("shitai-refreshToken");
        });
    } catch (e) {
      console.error(e);
    } finally {
      return { statusCode, accessToken };
    }
  }
  public async insertUserInfo(param: insertUserInfoRequest) {
    let statusCode = 200;
    try {
      const options: AxiosRequestConfig<insertUserInfoRequest> = {
        url: `${this._backendApiUrl}/api/v1/post/insertUserInfo`,
        method: "POST",
        data: param,
      };
      await axios<
        any,
        AxiosResponse<insertUserInfoResponse>,
        insertUserInfoRequest
      >(options)
        .then((res) => {
          statusCode = res.data.status;
        })
        .catch((error) => {
          statusCode = error.response.data.status;
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return statusCode;
    }
  }
}
export { NeonClientApi };
