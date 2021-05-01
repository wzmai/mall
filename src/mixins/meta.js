export default {
  watch: {
    '$route' () {
      this.setMeta()
    }
  },

  mounted () {
    this.setMeta()
  },

  methods: {
    setMeta () {
      let meta = this.$route.meta
      let title = meta.title
      if (typeof document === 'undefined') return
      document.title = title
    }
  }
}
