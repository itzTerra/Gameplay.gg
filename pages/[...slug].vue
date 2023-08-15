<template>
    <div>
        <ContentDoc class="prose mx-auto bg-base-200 shadow px-10 py-4">
            <template #not-found>
                <div class="mt-10">
                    <h1 class="text-center">Document not found</h1>
                </div>
            </template>
        </ContentDoc>
    </div>
</template>
<script setup>
definePageMeta({
    middleware: ["save-url"]
})
</script>