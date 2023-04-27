<script setup>
// Vues
import { ref, reactive, watch, onMounted, computed } from "vue"

// Stores
import { useStore } from "@/store/menus.js"
const menuStore = useStore()

// Variables
const formRef = ref(null)
const formData = ref({
	name: "",
	description: "",
	isPrivate: false,
})
let loading = ref(false)

const formDataRules = {
	name: [
		{
			required: true,
			message: "请输入分类名称",
			trigger: "change",
    },
    {
      max: 32,
      message: "分类名称不能超过32个字符",
    }
	],
	description: [
		{
			required: true,
			message: "请输入分类描述",
      trigger: "change",
    },
    {
      max: 128,
      message: "分类描述不能超过128个字符",
    }
	],
}

// Methods
const handleOk = async () => {
	formRef.value
		.validateFields()
		.then(async () => {
			const res = await menuStore.createCategory(formData.value)
			if (res) {
				menuStore.setCreateCategoryModalVisible(false)
			}
		})
		.catch((err) => {
			console.log(err)
		})
}

const handleCancel = () => {
	menuStore.setCreateCategoryModalVisible(false)
}
</script>

<template>
	<div class="categories-create">
		<a-modal ref="modalRef" :visible="menuStore.getCategoryModalVisible" :wrap-style="{ overflow: 'hidden' }" @cancel="handleCancel" @ok="handleOk">
			<template #title>
				<div ref="modalTitleRef" style="width: 100%; cursor: move">创建分类</div>
			</template>

			<a-form ref="formRef" :model="formData" :rules="formDataRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
				<a-form-item has-feedback label="分类名称" name="name">
					<a-input v-model:value="formData.name" :placeholder="'请输入分类名称'" show-count :maxlength="32" />
				</a-form-item>

				<a-form-item has-feedback label="分类描述" name="description">
					<a-textarea v-model:value="formData.description" :placeholder="'请输入分类描述'" show-count :maxlength="128" />
				</a-form-item>

				<a-form-item label="私有分类" name="isPrivate">
					<a-radio-group v-model:value="formData.isPrivate">
						<a-radio :value="true">私有</a-radio>
						<a-radio :value="false">公开</a-radio>
					</a-radio-group>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<style lang="less" scoped>
.categories-create {
}
</style>
