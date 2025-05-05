import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const streamURL = '/api/stream?url=' + encodeURIComponent('https://windnew.newkso.ru/wind/premium521/mono.m3u8')

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(streamURL)
      hls.attachMedia(video!)
    } else if (video!.canPlayType('application/vnd.apple.mpegurl')) {
      video!.src = streamURL
    }
  }, [])

  return (
    <div>
      <h1>Live TV Stream</h1>
      <video ref={videoRef} controls style={{ width: '100%', maxWidth: 800 }} />
    </div>
  )
}
