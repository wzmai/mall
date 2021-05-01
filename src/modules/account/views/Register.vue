<template>
    <div id="register">
        <van-nav-bar :border="false" @click-left="redirectRouter('/login')">
            <van-icon name="arrow-left" size="20" color="#333333" slot="left"/>
        </van-nav-bar>

        <div class="content">
            <div class="header">
                <van-image :src="getLogo" round width="80px" height="80px"></van-image>
            </div>

            <div class="main">
                <van-field
                        v-model="registerForm.Mobile"
                        type="tel"
                        maxlength="11"
                        placeholder="电话号码"
                                />

                <van-field
                        v-model="registerForm.UserAccount"
                        type="text"
                        placeholder="请输入用户名"
                        class="mt-4"
                ></van-field>

                <van-field v-model="registerForm.UserPassword" maxlength="16" class="mt-4"
                           :type="passwordType" placeholder="请输入登录密码" @click-right-icon="changeType" ref="password">
                    <van-icon :name="passwordType ? 'closed-eye' : 'eye-o'" size="20" color="#333333"
                              slot="right-icon"/>
                </van-field>


                <div class="register-btn">
                    <van-button round block @click="handleRegister">注册</van-button>
                </div>

                <div class="footer">
                    <van-checkbox v-model="checked" icon-size="14" checked-color="rgba(0,0,0,0.7)">同意用户软件协议
                    </van-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {setToken} from '@/utils/auth'
import {validUserName, validPwd} from '@/utils/validate'

export default {
	name: 'Register',

	data: () => ({
		checked: true,
		registerForm: {
			Mobile: null,
			UserAccount: null,
			UserPassword: null
		},

		passwordType: 'password'
	}),

	computed: {
		getLogo() {
			let d = this.siteConfig && this.siteConfig.MallCustomer
			if (d === '' || !d) return '/logo.png'
			else return d
		},
	},

	methods: {
		handleRegister() {
			if (validUserName(this.registerForm.UserAccount) && validPwd(this.registerForm.UserPassword)) {
				this.showProgress()
				this.$get('/api/UserAccountCheck/AccountRegister', this.registerForm)
					.then(resp => {
						return this.checkResp(resp, (r) => r.data.Code === 2)
					})
					.then(data => {
						let d = data.Data
						setToken(d.Token)
						sessionStorage.setItem('NickName', d.NickName)
						this.$sessionSet('tabbar', 'dashboard')
						this.$router.push('/app/dashboard')
						this.$success(data.Message)
						this.showProgress(false)
					})
					.catch(error => {
						this.showProgress(false)
						this.procError(error)
					})
			}
		},

		changeType() {
			if (this.passwordType === 'password') {
				this.passwordType = ''
			} else {
				this.passwordType = 'password'
			}
			this.$nextTick(() => {
				this.$refs.password.focus()
			})
		},
	}
}
</script>

<style lang="less" scoped>
#register {
    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* margin-top: 128rpx; */
    }

    /* 头部 logo */

    .header {
        box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        background-color: #000000;
        margin-top: 64px;
        margin-bottom: 36px;
        margin-left: auto;
        margin-right: auto;
    }

    .main {
        display: flex;
        flex-direction: column;
        padding-left: 35px;
        padding-right: 35px;

        .van-field {
            border: none;
            border-radius: 30px;
            -webkit-box-shadow: 0 0 30px 0 rgba(43, 86, 112, .1);
            box-shadow: 0 0 30px 0 rgba(43, 86, 112, .1);
        }
    }

    .register-btn {
        margin-top: 48px;

        .van-button {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFFFFF;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6));
            box-shadow: 0 0 7.5px 0 rgba(164, 217, 228, 0.4);
        }
    }


    .footer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        margin-top: 32px;
        color: rgba(0, 0, 0, 0.7);
        text-align: center;
        height: 20px;
        line-height: 20px;

        span {
            font-size: 12px;
            margin-left: 7.5px;
            margin-right: 7.5px;
        }
    }
}
</style>
