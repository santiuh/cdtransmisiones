<template>
  <div
    class="flex place-content-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#0071BC]"
  >
    <div class="flex flex-col w-full max-w-[1440px] px-10 gap-20 py-20">
      <h1
        class="text-4xl font-raleway font-bold text-center text-shadow-lg text-white"
        data-aos="fade-up"
      >
        Novedades
      </h1>

      <ul
        class="flex flex-col gap-20 justify-around w-full"
        v-if="videos.length"
      >
        <li
          class="w-full flex flex-row gap-4 items-center"
          v-for="video in videos"
          :key="video.id.videoId"
        >
          <iframe
            :src="`https://www.youtube.com/embed/${video.id.videoId}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-2/5 rounded-xl !h-auto"
          ></iframe>
          <div class="flex flex-col gap-4 w-3/5">
            <h2 class="text-white text-xl text-shadow-lg font-semibold">
              {{ video.snippet.title }}
            </h2>
            <hr class="w-1/4 pl-4" />
            <p class="text-shadow-lg text-lg font-semibold text-white">
              {{ video.snippet.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [],
      apiKey: "AIzaSyC9mzQZPU4IbQ4lyH1bjEu0S6D5KkyfYQ4",
      channelId: "UCHDLcJ_xBY_YLzgA6p2oBqg",
      maxResults: 3,
      playingVideoId: null,
    };
  },
  async mounted() {
    await this.fetchLatestVideos();
  },
  methods: {
    async fetchLatestVideos() {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${this.maxResults}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        this.videos = data.items;
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const month = date
        .toLocaleString("es-ES", { month: "long" })
        .toUpperCase();
      const day = date.getDate();
      return `${month} ${day}`;
    },
    playVideo(videoId) {
      this.playingVideoId = videoId;
    },
  },
};
</script>

<style scoped>
.video-title {
  font-weight: bold;
  margin-top: 10px;
}

.video-description {
  color: grey;
  margin-top: 5px;
}
</style>
