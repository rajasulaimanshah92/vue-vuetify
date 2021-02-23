export default {
    data() {
        return {}
    },
    methods: {
        gotoPage(url) {
            this.$router.push({ path: url })
        },
        getImgURL(img) {
            return require('img/' + img)
        },
        setPageNumber(index, pageNumber, rowsPerPage) {
            // console.log(index, pageNumber, rowsPerPage)
            if (pageNumber === 1) {
                return index
            } else {
                let no = (pageNumber - 1) * rowsPerPage + index
                return no
            }
        },
        stringToList(val) {
            // let temp = val.split('\n')
            if (val == null) return ''
            else return val.split('\n')
        },
        numberOnly(evt) {
            if (!isNaN(evt.key) || evt.key == 'Backspace' || evt.key == '.') {
                return true
            } else {
                evt.preventDefault()
            }
        },
        validate24HourFormat(evt, inputField) {
            if (inputField.length >= 5) {
                if (evt.key == 'Backspace' || evt.key == ':' || event.keyCode == 37 || event.keyCode == 39) {
                    return true
                }
                evt.preventDefault()
            } else if (!isNaN(evt.key) || evt.key == 'Backspace' || evt.key == ':') {
                return true
            } else {
                evt.preventDefault()
            }
        },
    },
    computed: {
        userTeam() {
            return this.$store.getters.user.userAccesses.team
        },
        userIsAuthenticated() {
            return this.$store.getters.user !== null && this.$store.getters.user !== undefined
        },
        userCanPerformAction() {
            return this.$store.getters.userPermission === 'General User' ? false : true
        },
    },
}
