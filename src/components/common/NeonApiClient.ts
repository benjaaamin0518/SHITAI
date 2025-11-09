import {
  accessTokenAuthRequest,
  accessTokenAuthResponse,
  getGroupsRequest,
  getGroupsResponse,
  getWishByIdRequest,
  getWishByIdResponse,
  getWishesRequest,
  getWishesResponse,
  Group,
  insertAnswerRequest,
  insertAnswerResponse,
  insertGroupRequest,
  insertGroupResponse,
  insertUserInfoRequest,
  insertUserInfoResponse,
  insertWishRequest,
  insertWishResponse,
  invitationGroupRequest,
  invitationGroupResponse,
  joinWishRequest,
  joinWishResponse,
  loginAuthRequest,
  loginAuthResponse,
  refreshTokenAuthRequest,
  refreshTokenAuthResponse,
  updateWishRequest,
  updateWishResponse,
  Wish,
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
  public async insertWish(param: insertWishRequest) {
    let statusCode = 200;
    let message = "";
    let id = null;
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<insertWishRequest> = {
          url: `${this._backendApiUrl}/api/v1/post/insertWish`,
          method: "POST",
          data: param,
        };
        await axios<any, AxiosResponse<insertWishResponse>, insertWishRequest>(
          options
        )
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const { id: resId } = res.data.result;
              id = resId;
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
      return { statusCode, id };
    }
  }
  public async getWishById(param: getWishByIdRequest) {
    let statusCode = 200;
    let message = "";
    let wish = {};
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<getWishesRequest> = {
          url: `${this._backendApiUrl}/api/v1/get/wishById`,
          method: "POST",
          data: param,
        };
        await axios<
          any,
          AxiosResponse<getWishByIdResponse>,
          getWishByIdRequest
        >(options)
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const { wish: resWish } = res.data.result;
              wish = resWish;
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
      return { statusCode, wish };
    }
  }
  public async insertAnswer(param: insertAnswerRequest) {
    let statusCode = 200;
    let message = "";
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<insertAnswerRequest> = {
          url: `${this._backendApiUrl}/api/v1/post/insertAnswer`,
          method: "POST",
          data: param,
        };
        await axios<
          any,
          AxiosResponse<insertAnswerResponse>,
          insertAnswerRequest
        >(options)
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const str = res.data.result;
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
      return { statusCode };
    }
  }
  public async updateWish(param: updateWishRequest) {
    let statusCode = 200;
    let message = "";
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<updateWishRequest> = {
          url: `${this._backendApiUrl}/api/v1/post/updateWish`,
          method: "POST",
          data: param,
        };
        await axios<any, AxiosResponse<updateWishResponse>, updateWishRequest>(
          options
        )
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const str = res.data.result;
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
      return { statusCode };
    }
  }
  public async getWishes(param: getWishesRequest) {
    let statusCode = 200;
    let message = "";
    let wishes: Wish[] = [];
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<getWishesRequest> = {
          url: `${this._backendApiUrl}/api/v1/get/wishes`,
          method: "POST",
          data: param,
        };
        await axios<any, AxiosResponse<getWishesResponse>, getWishesRequest>(
          options
        )
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const { wishes: resWishes } = res.data.result;
              wishes = resWishes;
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
      return { statusCode, wishes };
    }
  }
  public async getGroups(param: getGroupsRequest) {
    let statusCode = 200;
    let message = "";
    let groups: Group[] = [];
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<getGroupsRequest> = {
          url: `${this._backendApiUrl}/api/v1/get/groups`,
          method: "POST",
          data: param,
        };
        await axios<any, AxiosResponse<getGroupsResponse>, getGroupsRequest>(
          options
        )
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const { groups: resGroups } = res.data.result;
              groups = resGroups;
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
      return { statusCode, groups };
    }
  }
  public async insertGroup(param: insertGroupRequest) {
    let statusCode = 200;
    let message = "";
    let id = null;
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<insertGroupRequest> = {
          url: `${this._backendApiUrl}/api/v1/post/insertGroup`,
          method: "POST",
          data: param,
        };
        await axios<
          any,
          AxiosResponse<insertGroupResponse>,
          insertGroupRequest
        >(options)
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const { id: resId } = res.data.result;
              id = resId;
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
      return { statusCode, id };
    }
  }
  public async invitationGroup(param: invitationGroupRequest) {
    let statusCode = 200;
    let message = "";
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<invitationGroupRequest> = {
          url: `${this._backendApiUrl}/api/v1/post/invitationGroup`,
          method: "POST",
          data: param,
        };
        await axios<
          any,
          AxiosResponse<invitationGroupResponse>,
          invitationGroupRequest
        >(options)
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const str = res.data.result;
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
      return { statusCode };
    }
  }
  public async joinWish(param: joinWishRequest) {
    let statusCode = 200;
    let message = "";
    try {
      let isExec = true;
      while (isExec) {
        let options: AxiosRequestConfig<joinWishRequest> = {
          url: `${this._backendApiUrl}/api/v1/post/joinWish`,
          method: "POST",
          data: param,
        };
        await axios<any, AxiosResponse<joinWishResponse>, joinWishRequest>(
          options
        )
          .then((res) => {
            statusCode = res.data.status;
            if ("result" in res.data) {
              const str = res.data.result;
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
      return { statusCode };
    }
  }
}
export { NeonClientApi };
