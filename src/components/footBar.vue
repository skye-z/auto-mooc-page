<template>
    <div class="foot text-gray">
        <span class="copy">Copyright &copy; {{ year }}</span>
        <a href="https://github.com/skye-z" rel="noopener" target="_blank">
            <n-button text class="text-gray">Skye Z</n-button>
        </a>
        <span class="ml-10">&hearts;</span>
        <span class="ml-10">Use <a href="https://github.com/skye-z/auto-mooc" rel="noopener" target="_blank"><n-button text class="text-gray">GPL-3.0</n-button></a> license</span>
    </div>
</template>
<script>
export default {
    name: "FootBar",
    data: () => ({
        year: '',
    }),
    mounted() {
        this.year = new Date().getFullYear();
    },
};
</script>
<style scoped>
.foot{
    text-align: center;
    position: absolute;
    bottom: 10px;
    width: 100%;
    left: 0;
}

.text-gray{
    color: #999;
}

.copy{
    margin-right: 5px;
}

.ml-10{
    margin-left: 10px;
}
</style>