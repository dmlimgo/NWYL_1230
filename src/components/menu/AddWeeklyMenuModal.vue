<template>
    <div id="add-weekly-modal" class="modal-wrapper">
        <a href="#" class="modal-back"/>
        <div class="modal-box">
            <div class="modal-header">
                <span class="modal-title">주간 식단표 등록</span>
                <a href="#" class="modal-close">&times;</a>
            </div>
            <div class="modal-content">
                <div class="modal-info">
                    <!-- <input @change="test" id="file" ref="myfile" name="weekly-menu" type="file" class="filecontainer"/> -->
                    <input @change="getMenuData" id="menudata" type="file" class="filecontainer"/>
                    <input type="file" id="csvfileinput" accept=".csv"/>
                    <button id="formButton" @click="postPortfolio(title,body,imgSrc)" class="form-button" disabled="" type="button">제출</button>
                </div>
                <!-- postWeekMenus(menudata.menus[i]["date"], menudata.menus[i]["korean"], menudata.menus[i]["star"], menudata.menus[i]["special"])
                postWeekMenus(menudata.menus[0]['date'], menudata.menus[0]['korean'], menudata.menus[0]['star'], menudata.menus[0]['special']
                v-for"menu in menudata.menus" :menu="menu" :key="menu.id"
                sendData -->
            </div>
            <div class="modal-content2">
                <div class="modal-content2-title">
                    업로드된 식단표 미리보기
                </div>
                <div id="uploaded-menu">
                    <table>
                        <thead>
                            <tr>
                                <td></td>
                                <td>월</td>
                                <td>화</td>
                                <td>수</td>
                                <td>목</td>
                                <td>금</td>
                            </tr>
                            <tr id="menu-date"/>
                        </thead>
                        <tbody>
                            <tr id="menu-korean"/>
                            <tr id="menu-star"/>
                            <tr id="menu-special"/>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '@/main'
import firebase from 'firebase/app'
import { firestore } from '@/services/FirebaseService'

const db = firebase.firestore();
// const testdata = require('./5thJul2019.json')
function csvJSON(csv){
                var lines=csv.split('\n');
                console.log(lines.length)
                var result = [];
                var headers=lines[0].split(",");
                console.log(headers)
                for(var i in lines){
                    console.log('azzzzz')
                    var obj = {};
                    var currentline=lines[i].split(",");
                    for(var j in headers){
                        console.log('asdsadasd')
                        obj[headers[j]] = currentline[j];
                    }
                    console.log(obj)
                    result.push(obj);
                }
                console.log(result)
                console.log(JSON.stringify(result))
                return JSON.stringify(result);
            }

function  fileExtention(filename) {
                var parts = filename.split('.');
                console.log(parts)
                return parts[parts.length - 1];
            }
export default {
    name: "AddWeeklyMenuModal",
    props: {

    },
    data() {
        return {
            menudata: []
        }
    },
    props: {

    },
    created() {
        this.menudata.date = this.date,
        this.menudata.korean = this.korean,
        this.menudata.star = this.star,
        this.menudata.special = this.special
    },
    mounted() {
        
      $("#csvfileinput").change(function () {
        console.log('아아아이이이잉ㅇ 앗살라마라이쿰')
            var file = this.files[0];
            if (file && fileExtention($(this).val()) == 'csv') {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (evt) {
            // code to convert file data and render in json format
            document.getElementById("fileContents").innerHTML = csvJSON(evt.target.result);
            } 
            reader.onerror = function (evt) { 
            document.getElementById("fileContents").innerHTML = "error reading file"; 
            } 
            } 
            else{ 
            document.getElementById("fileContents").innerHTML = "Not a csv file"; 
            } 
        });  
    },
    methods: {
        getMenuData() {
            const selectedFile = document.querySelector('#menudata').files[0]

            var reader = new FileReader()
            reader.onload = (e) => {
                this.menudata = JSON.parse(e.target.result)
                console.log('after parse', this.menudata)
                this.showMenuData(this.menudata)
            }
            reader.readAsText(selectedFile)

        },
        showMenuData(data) {
            this.getDataFromJson(data, "date", '#menu-date', '')
            this.getDataFromJson(data, "korean", '#menu-korean', '한식')
            this.getDataFromJson(data, "star", '#menu-star', '별식')
            this.getDataFromJson(data, "special", '#menu-special', '스페셜')
        },
        getDataFromJson(data, key, id, first) {
            let query = document.querySelector(id)
            for (let i = 0; i < 6; i++) {
                var cell = document.createElement('td')
                if (i == 0) {
                    var cellText = document.createTextNode(first)
                    cell.appendChild(cellText)
                    query.appendChild(cell)
                } else {
                    let keydata = data["menus"][i-1][key]
                    if (keydata.length) {
                        for (let j = 0; j < keydata.length; j++) {
                            var cellText = document.createTextNode(keydata[j])
                            cell.appendChild(cellText)
                            var br = document.createElement('br')
                            cell.appendChild(br)
                        }
                    } else {
                        var cellText = document.createTextNode(keydata)
                        cell.appendChild(cellText)
                    }
                    query.appendChild(cell)
                }
            }
        },
        sendData() {
            // console.log(this.menudata)
            this.$emit("child", this.menudata)
            // console.log('sendData')
            // eventBus 를 통해서 형제 컴포넌트에게 값을 전송할 수 있다.
            // eventBus가 하나의 부모 컴포넌트 역할을 하며  $emit를 통해서 신호를 받는다.
            // eventBus.$emit('userWasEdited', new Date()) 한개의 경우 전송 방법
            // main.js에 선언한 메소드로 전달
            // eventBus.menuSended(new Date() )
            console.log('eventBus.menuSended')
        },
        menudatafunction(a) {
          store.state.menudate = ''
          store.state.korean = ''
          store.state.star = ''
          store.state.special = ''

          store.state.menudataid = a
          console.log(typeof(a))
          console.log(typeof(store.state.menudataid))
          var docRef = db.collection("Weeklymenus").doc(store.state.menudataid);
        },
        postWeeklyMenu(date, korean, star, special) {
          return firestore.collection('weeklymenus').add({
            date,
            korean,
            star,
            special
          }).then(function(doRef) {
              firestore.collection('weeklymenus').doc(doRef.id).update({
                id: dcRef.id
              })
              location.href="/weeklymenu"
          })
          console.log('in')
        },
    },
}
</script>

<style lang="scss">
@import './AddWeeklyMenuModal.scss';
</style>
