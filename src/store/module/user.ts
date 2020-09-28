import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import store from '@/store';
import { doLogin, getUserInfo, doLogout, refresh } from '@/api/user';
import { removeToken, setAccessToken, setRefreshToken, hasAccessToken, hasRefreshToken, getAccessToken } from '@/utils/cookies';
import { resetRouter } from "@/router";
import {RSA_Decrypt} from '@/utils/crypt';
import { message } from 'ant-design-vue';

export interface IUserState {
    user_id: number
    username: string
    nickname: string
    access_token: string
    refresh_token: string
    roles: string[]
    permissions: string[]
    phone: string
    appId: string
    appSecret: string
}

@Module({dynamic: true, store, name: 'user'})
class User extends VuexModule implements IUserState {
    public user_id = 0;
    public username = '';
    public nickname = '';
    public roles: string[] = [];
    public access_token: any = getAccessToken() || '';
    public refresh_token = '';
    public permissions: string[] = [];
    public phone = '';
    public appId= 'client';
    public appSecret = 'secret';

    @Mutation
    private SET_ACCESS_TOKEN(access_token: string) {
        this.access_token = access_token;
    }

    @Mutation
    private SET_REFRESH_TOKEN(refresh_token: string) {
        this.refresh_token = refresh_token;
    }

    @Mutation
    private SET_USERNAME(username: string) {
        this.username = username;
    }

    @Mutation
    private SET_NICKNAME(nickname: string) {
        this.nickname = nickname;
    }

    @Mutation
    private SET_ROLES(roles: string[]) {
        this.roles = roles;
    }

    @Mutation
    private SET_PERMISSIONS(permissions: string[]) {
        this.permissions = permissions;
    }

    @Mutation
    private SET_PHONE(phone: string) {
        this.phone = phone;
    }

    @Mutation
    private SET_USER_ID(user_id: number) {
        this.user_id = user_id;
    }

    @Action
    public async Login(userInfo: {username: string, password: string}): Promise<boolean> {
        const params = {
            appId: this.appId,
            appSecret: this.appSecret,
            ...userInfo
        }
        let res: any = await doLogin(params);
        res = RSA_Decrypt(res);
        if (res.code === 200) {
            const data = res.data;
            const access_token = data.access_token;
            const refresh_token = data.refresh_token;
            setAccessToken(access_token, parseInt(data.expires_in));
            setRefreshToken(refresh_token, 43200);
            this.SET_ACCESS_TOKEN(access_token);
            this.SET_REFRESH_TOKEN(refresh_token);
            return true;
        } else {
            this.ResetToken()
        }
        return false;
    }

    @Action
    public ResetToken() {
        removeToken();
        this.SET_ACCESS_TOKEN('');
        this.SET_REFRESH_TOKEN('');
    }

    @Action
    public ResetUserInfo() {
        this.SET_USER_ID(0);
        this.SET_USERNAME('');
        this.SET_NICKNAME('');
        this.SET_PHONE('');
        this.SET_ROLES([]);
        this.SET_PERMISSIONS([]);
    }

    @Action
    public async GetUserInfo() {
        if (this.access_token === '') {
            throw Error('GetUserInfo: access_token is undefined!');
        }
        const res: any = await getUserInfo();
        if (res.code === '200') {
            const data = res.data;
            this.SET_USER_ID(data.userId);
            this.SET_USERNAME(data.username);
            this.SET_NICKNAME(data.nickname);
            this.SET_PHONE(data.phone);
            this.SET_ROLES(data.roles);
            this.SET_PERMISSIONS(data.permissions);
        }
    }

    @Action
    public async LogOut(): Promise<boolean> {
        if (this.access_token != '') {
            const res: any = await doLogout();
            if (res.code === '200') {
                resetRouter();
                this.ResetToken();
                this.ResetUserInfo();
                return true;
            }
        }
        return false;
    }

    @Action
    public hasAccessToken() {
        return hasAccessToken();
    }
}

export const UserModule = getModule(User);
