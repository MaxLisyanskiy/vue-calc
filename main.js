Vue.createApp({
    data() {
        return {
            result: '',
            numbers: [1,2,3,4,5,6,7,8,9],
            operators: ['*', '/', '+', '-']
        };
    },
    methods: {
        onClick(value) {
            this.result += value;
        },
        reset() {
            this.result = '';
        },
        calc() {
            this.result = eval(this.result);
            this.result = String(this.result);
        }
    }
}).mount('#app');