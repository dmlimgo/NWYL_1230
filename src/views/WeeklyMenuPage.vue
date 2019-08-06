s<template>
    <div style="height: 100%; width: 100%;">
        <div class="main-bg"/>
        <div class="main-wrapper">
            <SideNav/>
            <div class="body-wrapper">
                <div class="body-flex">
                    <div class="WeeklyMenu-title">
                        <span id="showMonth"/>월 식단표
                    </div>
                    <a href="#add-weekly-modal" class="button">식단표 추가</a>
                    <div class="WeeklyMenu-content">
                        <table id="calendar">
                            <thead>
                                <tr>
                                    <th>월</th>
                                    <th>화</th>
                                    <th>수</th>
                                    <th>목</th>
                                    <th>금</th>
                                </tr>
                            </thead>
                            <tbody id="calendar-body" style="text-align: center;"/>
                        </table>
                    </div>
                </div>
            </div>
            <AddWeeklyMenuModal/>
        </div>
    </div>
</template>

<script>
import SideNav from '@/components/mainview/SideNav'
import AddWeeklyMenuModal from '@/components/menu/AddWeeklyMenuModal'

export default {
    name: 'WeeklyMenuPage',
    components: {
        SideNav,
        AddWeeklyMenuModal,
    },
    mounted() {
        this.createCalendar()
    },
    methods: {
        daysInMonth(iMonth, iYear) {
            return 32 - new Date(iYear, iMonth, 32).getDate()
        },
        createCalendar() {
            const month = new Date().getMonth()
            const year = new Date().getFullYear()
            const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            
            const today = new Date()

            let tbl = document.querySelector('#calendar-body')
            tbl.innerHTML = ""

            let showMonth = document.querySelector('#showMonth')
            showMonth.innerHTML = months[month]
            
            let date = today.getDate() - today.getDay() + 1;
            // date가 -4일 경우 안나옴! 해결해야 할지도..

            let row = document.createElement("tr")
            for (let j = 0; j < 5; j++) {
                if (date < 1) {
                    let cell = document.createElement("td")
                    let cellText = document.createTextNode("")
                    cell.appendChild(cellText)
                    row.appendChild(cell)
                    date++
                }
                else if (date > this.daysInMonth(month, year)) {
                    break
                }
                else {
                    let cell = document.createElement("td")
                    let cellText = document.createTextNode(date)
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cell.classList.add("bg-info")
                    }
                    cell.appendChild(cellText)
                    row.appendChild(cell)
                    date++
                }
            }
            tbl.appendChild(row)
        },
        createCalendar_wholemonth(month, year) {
            let firstDay = (new Date(year, month)).getDay()
            let tbl = document.querySelector('#calendar-body')
            tbl.innerHTML = ""

            let showMonth = document.querySelector('#showMonth')
            showMonth.innerHTML = months[month]
            
            let date = 1;
            for (let i = 0; i < 6; i++) {
                let row = document.createElement("tr")
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        let cell = document.createElement("td")
                        let cellText = document.createTextNode("")
                        cell.appendChild(cellText)
                        row.appendChild(cell)
                    }
                    else if (date > this.daysInMonth(month, year)) {
                        break
                    }
                    else {
                        let cell = document.createElement("td")
                        let cellText = document.createTextNode(date)
                        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                            cell.classList.add("bg-info")
                        }
                        cell.appendChild(cellText)
                        row.appendChild(cell)
                        date++
                    }
                }
                tbl.appendChild(row)
            }
        },
        getMenu() {

        }
    }
}
</script>

<style lang="scss">
@import './WeeklyMenuPage.scss';
</style>
