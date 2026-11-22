/** YouTube video id from youtu.be / watch?v= / embed / shorts links */
export const youtubeId = (url: string) =>
  url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1]
