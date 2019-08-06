<template>
  <v-card>
    <v-img :src="imgSrc" height="200px" alt="portfolio_image">
    </v-img>
    <v-card-title primary-title>
      <div>
        <div class="headline jemok">{{title}}</div>
        <span class="grey--text content">{{body}}</span>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
	name: 'Portfolio',
	props: {
		date: {type: String},
		title: {type: String},
		body: {type: String},
		imgSrc: {type: String},
	},
	data() {
		return {
			//
		}
	}
}
</script>

<style>
.jemok {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.content {
	display: -webkit-box;
	height: 4.5em;
	overflow: hidden;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
</style>

