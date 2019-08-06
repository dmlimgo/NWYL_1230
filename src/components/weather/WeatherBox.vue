<template>
    <div class="card-wrapper">
        <div class="card-title">
            {{ today.getMonth()+1 }}월 {{ today.getDate() }}일 {{ weatherdata.city }}의 날씨
        </div>
        <div class="card-bar"/>
        <div class="card-content-wrapper">
            <img :src="weathericon" style="height:100px; width:100px;" alt="weather_icon"/>
            {{ weatherdata.weather }}
        </div>
    </div>
</template>
<script>

export default {
    name: 'WeatherBox',
    components: {
    },
    data() {
        return {
            today: new Date(),
            weatherdata : {
                city: '',
                weather: '',
                icon: '',
            },
        }
    },
    mounted() {
        var key = '69d0d9ea132e148068fc83dc5fed6a42'
        const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=Daejeon&appid=${key}&lang=kr`
        console.log(BASE_URL)
        this.$http.get(`${BASE_URL}`)
        .then((result) => {
            this.country = result.data.sys.country
            this.weatherdata.city = result.data.name
            this.weatherdata.weather = result.data.weather[0].main
            this.weatherdata.icon = result.data.weather[0].icon
            this.view = true
            console.log('weather result:',result)
        })
    },
    methods: {
    },
    computed: {
        weathericon() {
            return 'https://openweathermap.org/img/wn/' + this.weatherdata.icon + '@2x.png'
        }
    },
}
</script>