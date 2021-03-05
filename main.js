

Vue.createApp({
    data() {
        return {
            nav: ['Главная', "О нас", "Портфолио", "Контакты"],
            title: 'Главная',
            isActive: 'Home',
            result: '',
            numbers: [1,2,3,4,5,6,7,8,9],
            operators: ['*', '/', '+', '-'],
            services: [
                {
                    name: 'Веб разработка',
                    price: 300,
                    active: false
                },{
                    name: 'Дизайн',
                    price: 400,
                    active:false
                },{
                    name: 'Интеграция',
                    price: 250,
                    active:false
                },{
                    name: 'Обучение',
                    price: 220,
                    active:false
                }
            ],
            finallPrice: '0'
        };
    },
    computed: {
        count() {
            let sum = 0;

            this.services.forEach((item) => {
                if (item.active) {
                    sum += item.price;
                }
            });

            return sum;
        }
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
        },
        changedTitle(value) {
            this.title = value;
            if(value == 'Главная') {
                this.isActive = 'Home';
            } else if (value == 'О нас') {
                this.isActive = 'About';
            } else if (value == 'Портфолио') {
                this.isActive = 'Works';
            } else if (value == 'Контакты') {
                this.isActive = 'Contacts';
            }
        },
        toggleActive(v) {
            v.active = !v.active;
        }
    }
}).mount('#app');