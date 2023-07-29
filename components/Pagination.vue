<template>
    <div>
        <div class="join shadow">
            <button @click="$emit('pageChange', currPage-1)" class="join-item btn" :disabled="currPage == 1">«</button>
            <button v-show="currPage != 1" @click="$emit('pageChange', 1)" class="join-item btn">1</button>
            <button v-show="pages > 5 && currPage > 3" class="join-item btn" disabled>...</button>
            <button v-show="pages == 5 && (currPage == 5 || currPage == 4)" @click="$emit('pageChange', 2)"
                class="join-item btn">2</button>
            <button v-show="currPage == pages && pages >= 4" @click="$emit('pageChange', currPage-2)"
                class="join-item btn">{{ currPage - 2 }}</button>
            <button v-show="currPage >= 3" @click="$emit('pageChange', currPage-1)"
                class="join-item btn">{{ currPage - 1 }}</button>
            <button class="join-item btn btn-active btn-secondary">{{ currPage }}</button>
            <button v-show="currPage < pages - 1" @click="$emit('pageChange', currPage+1)"
                class="join-item btn">{{ currPage + 1 }}</button>
            <button v-show="currPage == 1 && pages >= 4" @click="$emit('pageChange', currPage+2)"
                class="join-item btn">{{ currPage + 2 }}</button>
            <button v-show="pages == 5 && (currPage == 1 || currPage == 2)" @click="$emit('pageChange', 4)"
                class="join-item btn">4</button>
            <button v-show="pages > 5 && (pages - currPage) > 2" class="join-item btn" disabled>...</button>
            <button v-show="pages > 1 && currPage != pages" @click="$emit('pageChange', pages)"
                class="join-item btn">{{ pages }}</button>
            <button @click="$emit('pageChange', currPage + 1)" class="join-item btn" :disabled="currPage == pages">»</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps(["pages", "currPage"])
defineEmits(["pageChange"])
</script>