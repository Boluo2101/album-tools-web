<script setup>
// Tools
import { defineProps, ref, watch, defineEmits, reactive } from "vue"

// Components

// Props
const props = defineProps({
	status: Boolean,
})

// Vars
let visible = ref(props.status)

// tabs
const formState = reactive({
	email: "",
	password: "",
	remember: true,
})

watch(
	() => props.status,
	(newValues) => {
		console.info("watch status", newValues)
		visible.value = newValues
	}
)

// Methods
const emit = defineEmits(["showDetails"])

const handleClose = (val) => {
	emit("close", val)
}
</script>

<template>
	<a-modal v-model:visible="visible" width="1000px" title="登录账号" @cancel="handleClose" @ok="handleClose">
		<!-- 登录 -->
		<a-form :model="formState" name="basic" :label-col="{ span: 2 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
			<a-form-item label="邮箱" name="email">
				<a-input v-model:value="formState.email" />
			</a-form-item>

			<a-form-item label="密码" name="password">
				<a-input-password v-model:value="formState.password" />
			</a-form-item>

			<a-form-item name="remember" :wrapper-col="{ offset: 2, span: 16 }">
				<a-checkbox v-model:checked="formState.remember" disabled>记住登录账号</a-checkbox>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
