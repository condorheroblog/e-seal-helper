<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useSpinStore } from '~/store/spin'
import { DrawSeal } from '~/utils'
import { domtoimage } from '~/utils/dom2Image'
const { openSpin, closeSpin } = useSpinStore()

const message = useMessage()
let isShowModal = $ref(false)
let imageUrl = $ref('')
const sealFormRef = $ref<FormInst | null>(null)
const sealModel = $ref({
	cnFontFamily: 'SimSun',
	enFontFamily: 'Arial',
	legalName: '中原武林布袋和尚有限责任公司',
	specialName: '化缘专用章',
	infoEncode: '0123456789ABCDEF',
	emulateLevel: '0',
})
const sealRules = $ref({
	cnFontFamily: {
		required: true,
		trigger: ['blur', 'input'],
		message: '请选择',
	},
	enFontFamily: {
		trigger: ['blur', 'input'],
		message: '请选择',
	},
	legalName: {
		required: true,
		trigger: ['blur', 'input'],
		max: 20,
		min: 6,
	},
	specialName: {
		trigger: ['blur', 'input'],
		message: '请输入',
		max: 10,
	},
	infoEncode: {
		trigger: ['blur', 'input'],
		message: '请输入',
		max: 20,
	},
	emulateLevel: {
		required: true,
		trigger: ['blur', 'input'],
		message: '请选择',
	},
})
const generalOptions = [
	{
		label: '宋体',
		value: 'SimSun',
	},
	{
		label: '仿宋',
		value: 'FangSong',
	},
	{
		label: '楷体',
		value: 'KaiTi',
	},
	{
		label: '黑体',
		value: 'SimHei',
	},
	{
		label: '汉仪新蒂手札体',
		value: 'HanyiSentyJournal',
	},
	{
		label: 'Arial',
		value: 'Arial',
	},
]

const handleValidateButtonClick = (e: MouseEvent) => {
	e.preventDefault()
	sealFormRef?.validate((errors) => {
		if (!errors) {
			// message.success('验证成功')
			openSpin()
			fetch('/.netlify/functions/generate-seal', {
				method: 'POST',
				body: JSON.stringify({
					...sealModel,
					legalNameFontSize: 30,
					specialNameFontSize: 22,
					infoEncodeFontSize: 20,
				}),
			})
				.then(res => res.json())
				.then(async (textPaths) => {
					const { legalNamePaths, specialNamePaths, codePaths } = textPaths
					const sealInstance = new DrawSeal(sealModel)
					const result = sealInstance
						.createSeal()
						.renderBackground()
						.renderArc()
						.renderLineText(specialNamePaths)
						.rangeCircularText(legalNamePaths)
						.midpointCircularText(codePaths)
						.renderStar()
						.toDataURL()

					const ret = await sealInstance.blendLayer(result!)
					// console.log(result)
					message.success('生成成功')
					isShowModal = true
					imageUrl = ret
				}).finally(() => closeSpin())
		}
		else {
			message.error('验证失败')
		}
	})
}
</script>

<template>
	<div>
		<div text-4xl inline-block w30>
			<!-- <img src="../../favicon.svg" alt="favicon"> -->
		</div>
		<p>
			<a rel="noreferrer" target="_blank">
				电子印章生成工具
			</a>
		</p>
		<div max-w-md m-auto mt-10>
			<n-form
				ref="sealFormRef" :model="sealModel" :rules="sealRules" label-placement="left" label-width="auto"
				require-mark-placement="right-hanging" size="medium"
			>
				<n-form-item label="汉字字体" path="cnFontFamily">
					<n-select v-model:value="sealModel.cnFontFamily" placeholder="请选择……" :options="generalOptions" />
				</n-form-item>
				<n-form-item label="信息编码字体" path="enFontFamily">
					<n-select v-model:value="sealModel.enFontFamily" placeholder="请选择……" :options="generalOptions" />
				</n-form-item>
				<n-form-item label="法定名称" path="legalName">
					<n-input v-model:value="sealModel.legalName" placeholder="请输入……" />
				</n-form-item>
				<n-form-item label="专用章名" path="specialName">
					<n-input v-model:value="sealModel.specialName" placeholder="请输入……" />
				</n-form-item>
				<n-form-item label="信息编码" path="infoEncode">
					<n-input v-model:value="sealModel.infoEncode" placeholder="请输入……" />
				</n-form-item>
				<n-form-item label="破损等级" path="emulateLevel">
					<n-radio-group v-model:value="sealModel.emulateLevel" name="emulateLevel">
						<n-space>
							<n-radio value="0">
								清晰
							</n-radio>
							<n-radio value="1">
								1 级
							</n-radio>
							<n-radio value="2">
								2 级
							</n-radio>
							<n-radio value="3">
								3 级
							</n-radio>
							<n-radio value="4">
								4 级
							</n-radio>
						</n-space>
					</n-radio-group>
				</n-form-item>
				<div>
					<n-button round @click="handleValidateButtonClick">
						预览
					</n-button>
				</div>
			</n-form>
		</div>
		<n-modal v-model:show="isShowModal" preset="dialog" title="Dialog">
			<template #header>
				<div>预览</div>
			</template>
			<n-image id="image" round :src="imageUrl" alt="imageUrl" />
			<template #action>
				<n-button size="large" w30>
					下载
				</n-button>
			</template>
		</n-modal>
	</div>
</template>
