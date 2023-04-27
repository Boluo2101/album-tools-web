<script setup>
// Vues
import { ref, reactive, watch, onMounted, computed } from "vue"
import { Modal, message } from "ant-design-vue"
import { useRouter, useRoute } from "vue-router"

// APIs
import { getUsernameByEmail, registerUser, loginByEmail as loginByEmailAPI } from "@/api/users.js"

// Components
import Tabs from "@/components/Tabs/PageIndex.vue"

// Stores
import { useStore } from "@/store/bus.js"
import { useStore as useStoreUserinfo } from "@/store/userinfo.js"
import { useStore as FeedsStore } from "@/store/feeds.js"
const EventBus = useStore()
const userinfoStore = useStoreUserinfo()
const feedsStore = FeedsStore()

// routers
const $router = useRouter()
const $route = useRoute()

// Variables
const tabs = reactive([
	{
		tab: "登录",
		key: "Login",
	},
	{
		tab: "注册",
		key: "Register",
	},
])

const formData = reactive({
	email: "",
	password: "",
	username: "",
	name: "",
})

const loading = ref(false)
let emailIsExist = ref(true)

// Computeds
const getBtnText = computed(() => {
	return emailIsExist.value ? "登录" : "注册"
})

const getPasswordInputType = computed(() => {
	return emailIsExist.value ? "password" : "text"
})

// Lifes
onMounted(() => {
	EventBus.sentMessage("fullScreen")
})

// Methods
const handleEmailChange = async (e) => {
	console.log("handleEmailChange", e)
	const { code } = await getUsernameByEmail(formData.email)
	emailIsExist.value = code === 1
}

const login = async () => {
	console.log("login", formData)
	if (emailIsExist.value) {
		// 登录
		loginByEmail(formData)
	} else {
		// 注册
		registerByEmail(formData)
	}
}

const loginResMsg = {
	USERS_LOGIN_ERROR: "登录失败，请检查邮箱和密码是否正确",
	USERS_LOGIN_SUCCESS: "登录成功",
}

const loginByEmail = async (data) => {
	// 检查是否填写email password
	if (!data.email || !data.password) {
		return message.error("请填写完整信息")
	}

	loading.value = true
	const { code, message: msg, data: res } = await loginByEmailAPI(data.email, data.password).finally(() => (loading.value = false))

	if (code !== 1) {
		return message.error(loginResMsg[msg] || msg)
	}

  message.success('登录成功')
	// 登录成功
  userinfoStore.setUserinfo(res)
  getAndSetCategories(res.uuid)

	// 跳转到首页
	$router.push({ path: "/" })
}

const registerByEmail = async (data) => {
	// 检查是否填写email username name password
	if (!data.email || !data.username || !data.name || !data.password) {
		return message.error("请填写完整信息")
	}

	// 检查email格式
	if (!data.email.includes("@")) {
		return message.error("邮箱格式不正确")
	}

	// 检查密码长度，大于6位
	if (data.password.length < 6) {
		return message.error("密码长度至少6位")
	}

	// 检查用户名必须大于等于3，小于等于32
	if (data.username.length < 3 || data.username.length > 32) {
		return message.error("用户名长度必须大于等于3位，小于等于32位")
	}

	// 检查用户名只允许字母、数字、下划线
	if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
		return message.error("用户名只允许字母、数字、下划线")
	}

	// 检查昵称不能超过32位
	if (data.name.length > 32) {
		return message.error("昵称不能超过32位")
	}

	loading.value = true
	const { code, message: msg, data: res } = await registerUser(data).finally(() => (loading.value = false))

	if (code !== 1) {
		return message.error(msg)
	}

	message.success("注册成功")
	emailIsExist.value = true
  userinfoStore.setUserinfo(res)
  getAndSetCategories(res.uuid)

	// 跳转到首页
	$router.push({ path: "/" })
}

const getAndSetCategories = async (uuid) => {
  feedsStore.fetchCategoriesByUsersUUID(uuid)
}
</script>

<template>
	<div class="login">
		<div class="page-box">
			<!-- 左侧表单 -->
			<div class="left-box">
				<div class="logo">
					<img src="../../assets/images/bg.png" alt />
					<div class="text">惯性聚合 工具箱</div>
				</div>

				<div :class="['left-body', emailIsExist ? '' : 'with-reg']">
					<div class="input-box">
						<div class="one">
							<div class="name">电子邮箱</div>
							<input v-model="formData.email" type="email" placeholder="请输入您的电子邮箱" @change="handleEmailChange" />
						</div>

						<div class="one">
							<div class="name">密码</div>
							<input v-model="formData.password" :type="getPasswordInputType" placeholder="请输入密码" />
						</div>

						<!-- 注册 -->
						<template v-if="!emailIsExist">
							<div class="one">
								<div class="name">用户名</div>
								<input v-model="formData.username" placeholder="请输入用户名" />
							</div>

							<div class="one">
								<div class="name">昵称</div>
								<input v-model="formData.name" placeholder="请输入昵称" />
							</div>
						</template>

						<div class="text">注册和登录即表示同意 惯性聚合 的《用户协议和隐私政策》</div>
					</div>

					<div class="btns">
						<div class="btn" @click="login">{{ getBtnText }}</div>
					</div>
				</div>
			</div>

			<!-- 右侧背景图 -->
			<div class="right-box">
				<div class="title">惯性聚合 工具箱</div>
				<div class="text">图片、视频管理、去重工具</div>
				<div class="text">RSS阅读器</div>
				<div class="text">高效高质量的阅读体验</div>
			</div>
		</div>

		<div :class="['bg', loading ? 'cool' : '']"></div>
	</div>
</template>

<style lang="less" scoped>
.bg {
	position: fixed;
	top: -200px;
	bottom: -200px;
	left: -200px;
	right: -200px;
	background-image: url("../../assets/images/login_bg.jpg");
	background-size: 100% auto;
	z-index: 100;
	filter: blur(20px);
	// transition: all 10s;

	&.cool {
		filter: blur(200px);
		transition: all 10s;
	}
}
.login {
	@height: 100vh;

	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: @height;
	max-height: @height !important;
	min-height: @height !important;
	margin: 0 !important;
	padding: 0 !important;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to right, rgb(60, 80, 240), rgb(120, 60, 240));
	background-image: url("../../assets/images/login_bg.jpg");
	// background-size: 100% auto;
	overflow: hidden;
	font-weight: 300;
	user-select: none;

	.page-box {
		max-width: 1000px;
		height: 660px;
		position: relative;
		width: 100%;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 12px 20px 0px;
		display: flex;
		justify-content: space-between;
		background: rgb(255, 255, 255);
		transition: all 0.4s;
		z-index: 101;

		.left-box {
			width: 40%;
			position: relative;
			color: #000;

			.left-body {
				padding: 30px 20px;
				margin: 20px;
				&.with-reg {
					padding: 0 20px;
					.input-box {
						.one {
							margin-bottom: 25px;
						}
					}
				}

				.btns {
					position: absolute;
					bottom: 0;
					right: 0;
					padding: 30px;
					.btn {
						color: #fff;
						cursor: pointer;
						padding: 10px 20px;
						border-radius: 25px;
						background-color: @PrimaryColor;
						transition: all 0.3s;
						&:hover {
							box-shadow: 0 5px 10px #eee;
						}
					}
				}
				.input-box {
					.text {
						color: #aaa;
					}
					.one {
						margin-bottom: 40px;
						.name {
							margin: 10px 0;
						}
						input {
							border: none;
							border-bottom: 1px solid #eee;
							width: 100%;
							height: 32px;
							line-height: 32px;
							font-size: 15px;
							transition: all 0.3s;
							outline: none;

							&:focus {
								border-bottom: 1px solid @PrimaryColor;
							}
						}
					}
				}
			}
			.logo {
				font-size: 22px;
				display: flex;
				align-items: center;
				padding: 30px 20px;
				font-weight: 300;
				img {
					width: 50px;
					height: 50px;
					margin: 20px;
					border-radius: 4px;
				}
			}
		}

		.right-box {
			height: 100%;
			font-weight: 300;
			flex: 1 1 0%;
			background: url(../../assets/images/login_bg.jpg) 0% 0% / cover no-repeat;
			display: flex;
			flex-direction: column;
			color: #fff;
			padding: 30px;
			line-height: 60px;
			user-select: none;
			cursor: pointer;
			-webkit-app-region: drag;
			.title {
				font-size: 42px;
				margin-top: 20px;
			}
			.text {
				font-size: 20px;
			}
		}
	}
}
</style>
