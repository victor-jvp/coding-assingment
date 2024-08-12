import ReactPlayer from "react-player";

const YoutubePlayer = ({ videoKey }) => (
  <ReactPlayer
    className="video-player"
    url={`https://www.youtube.com/watch?v=${videoKey}`}
    controls={true}
    playing={true}
    width="100%"
    height="100%"
    data-testid="youtube-player"
  />
);

export default YoutubePlayer;
