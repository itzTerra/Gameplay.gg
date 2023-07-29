<template>
    <Transition name="longFade">
        <div v-show="show" class="shadow fixed bottom-16 left-1/2 -translate-x-1/2 self-center w-auto" role="alert">
            <div class="relative alert" :class="typeClass">
                <SVGInfo v-if="alertType == 'info'" class="stroke-info shrink-0" />
                <svg v-else-if="alertType == 'success'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0"
                    fill="none" width="24px" height="24px" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="alertType == 'error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0"
                    fill="none" width="24px" height="24px" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="alertType == 'danger'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0"
                    fill="none" width="24px" height="24px" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="me-2">
                    <slot></slot>
                </span>
                <button class="btn btn-xs btn-ghost btn-circle absolute top-0 right-0" @click="hideAlert">
                    <SVGClose />
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const props = defineProps(["change", "interval", "alertType"])

const show = ref(false)

watch(() => props.change, (newVal, oldVal) => {
    show.value = true
    if (props.interval) {
        setInterval(() => {
            show.value = false
        }, props.interval)
    }
})

const hideAlert = () => {
    show.value = false
}

const typeClass = computed(() => ({
    "alert-info": props.alertType == "info",
    "alert-success": props.alertType == "success",
    "alert-danger": props.alertType == "danger",
    "alert-error": props.alertType == "error",
}))

</script>