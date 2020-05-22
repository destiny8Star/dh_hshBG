<template>
    <div class="footer-1">
        {{oemData.copyright}}
    </div>
</template>

<script>
    export default {
        name: "CommonFooter",
        data: function () {
            return{
                oemData: this.$ls.get(this.$webConfig.oemData) || {},
            }
        }
    }
</script>