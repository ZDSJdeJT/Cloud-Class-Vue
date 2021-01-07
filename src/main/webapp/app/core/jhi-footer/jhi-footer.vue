<template>
    <div id="footer" class="footer">
        <p class="footer-text" v-text="$t('footer')">云班级开发组</p>
    </div>
</template>

<script lang="ts" src="./jhi-footer.component.ts">
</script>

<style scoped>
    .footer {
        text-align: center;
    }
    .footer-text {
        padding: 0.625rem;
    }
</style>
