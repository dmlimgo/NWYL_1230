<template>
  <v-layout mt-5 wrap>
    <v-flex v-for="i in portfolios.length > limits ? limits : portfolios.length" xs12 sm6 :key="i">
      <Portfolio class="ma-3"
              :date="portfolios[i - 1].created_at.toString()"
              :title="portfolios[i - 1].title"
              :body="portfolios[i - 1].body"
              :imgSrc="portfolios[i - 1].imgSrc"
			  :id="portfolios[i-1].documentId"
      ></Portfolio>
    </v-flex>

    <v-flex xs12 text-xs-center round my-5 v-if="loadMore">
      <v-btn color="info" dark v-on:click="loadMorePortfolios"><v-icon size="25" class="mr-2">fa-plus</v-icon> 더 보기</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import Portfolio from '@/components/portfolio/Portfolio'
import FirebaseService from '@/services/FirebaseService'
import { firestore } from '@/services/FirebaseService'
import firebase from 'firebase/app'

const db = firebase.firestore();

export default {
	name: 'PortfoliosList',
	props: {
		limits: {type: Number, default: 3},
		loadMore: {type: Boolean, default: false},
	},
	data() {
		return {
			portfolios: []
		}
	},
	components: {
		Portfolio
	},
	mounted() {
		this.getPortfolios()
		db.collection('portfolios').onSnapshot(res => {
    	const changes = res.docChanges();
    	changes.forEach(change => {
        	if (change.type === 'added') { // each change has 3 type. (added, removed, modified)
            	this.portfolios.push({
                	...change.doc.data(),
                	id: change.doc.id,
            		})
					// console.log(change.doc.id)
					// console.log(db.collection('portfolios').doc(change.doc.id).get())
					var docRef = db.collection('portfolios').doc(change.doc.id)
					docRef.get().then(function(doc) {
    				if (doc.exists) {
        			// console.log("Document data:", doc.data());
    				} else {
        			// doc.data() will be undefined in this case
        			console.log("No such document!");
    				}
					}).catch(function(error) {
    					console.log("Error getting document:", error);
					});
				}
   			})
		})
	},
	methods: {
		async getPortfolios() {
			this.portfolios = await FirebaseService.getPortfolios()
			// console.log(this.portfolios[0])
		},
		loadMorePortfolios() {
			this.limits += 2
    	}
	},
}
</script>

<style>
	.mw-700 {
		max-width: 700px;
		margin: auto;
	}
</style>
