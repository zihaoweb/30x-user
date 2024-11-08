export function wxLogin(): Promise<any> {
  return new Promise((resolve) => {
    uni.login({
      provider: 'weixin',
      success: async (result: UniApp.LoginRes) => {
        uni.getUserInfo({
          provider: 'weixin',
          success: (infoRes) => {
            const { nickName, avatarUrl } = infoRes.userInfo;
            if (result.code) {
              resolve({ code: result.code, nickName, avatarUrl });
            }
          },
          fail: (err) => {
            console.log('getUserInfo error: ', err);
            resolve({ code: 'NG' });
          },
        });
      },
    });
  });
}

export function getUserInfo(): Promise<UniApp.GetUserInfoRes> {
  return new Promise((resolve, reject) => {
    uni.getUserInfo({
      provider: 'weixin',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.error(`getUserInfo error: ${err}`);
        reject(err);
      },
    });
  });
}
