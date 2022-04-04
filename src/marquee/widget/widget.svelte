<script lang="ts" >
  import NextIcon from "../../../media/next.png";
  import PauseIcon from "../../../media/pause-button.png";
  import PlayIcon from "../../../media/play-buttton.png";
  import PreviousIcon from "../../../media/previous.png";
  import RepeatIcon from "../../../media/repeat.png";
  import ShuffleIcon from "../../../media/shuffle-arrows.png";
  import type { ILoginState, IPlayerState, ITrack } from "../../state/state";
  import Channel from "tangle/webviews";

  interface Track extends ITrack{
    artwork_url: string
  } 

  const ch = new Channel<{
    track: Track;
    playerState: IPlayerState;
    loginState: ILoginState;
  }>("shyykoserhiy.vscode-spotify");
  const client = ch.attach(window.vscode as any);
    
  let track: Track;
  let pauseOrPlay: 'pause' | 'play' = 'pause';
  let isShuffling: boolean = false;
  let isRepeating: boolean = false;
  let isHoveringControls: boolean;
  client.on("track", (tck) => {
    track = tck    
  });
  client.on("playerState", (state) => {
    if (state.state === "paused") {
      pauseOrPlay = 'play';
    } else if (state.state === "playing") {
      pauseOrPlay = 'pause';
    }
    if (state.isShuffling) {
      isShuffling = true;
    } else {
      isShuffling = false; 
    }
    if (state.isRepeating) {
      isRepeating = true;
    } else {
      isRepeating = false;
    }
  })
  function triggerSpotifyCommand(command:string){
    window.vscode.postMessage({
      west: { execCommands: [{
        command
      }]},
    });
  }
</script>

{#if track === null || track === undefined }
  <div class="defaultWrapper">
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>
{:else}
  <div class="img-wrapper">
    <img id="trackArtwork" class={isHoveringControls ? 'trackArtwork-darkened' : "trackArtwork"} src={track.artwork_url} alt='Wrapper view for the album.' />
    <div class="name-controller-wrapper" on:mouseenter={() => isHoveringControls = true} on:mouseleave={() => isHoveringControls = false}>
      <div class="name-wrapper">
        <p>{track.name}</p> 
        <p>{track.artist}</p>
      </div>
      
      <section class="controller">
        <div class="shuffle-repeat-btn" on:click={() => triggerSpotifyCommand("spotify.toggleShuffling")}>
          <button class="shuffle" >
            <img src={ShuffleIcon} class="icons" alt='shuffle icon' />
          </button>
          <div class={isShuffling ? 'shuffleActive' : 'hidden'}>.</div>
        </div>
        <button
          class="prevBtn" on:click={() => triggerSpotifyCommand("spotify.previous")}>
          <img src={PreviousIcon} class="icons" alt='Previous icon button.' />
        </button>

        <button class="pausePlay" on:click={() => triggerSpotifyCommand("spotify.playPause")}>
          {#if pauseOrPlay === 'pause'}
            <img src={PauseIcon} id="pausePlayIcon" class="icons" alt='Pause or play icon button.' />
            {:else}
            <img src={PlayIcon} id="pausePlayIcon" class="icons" alt='Pause or play icon button.' />
          {/if}
        </button>

        <button class="nextBtn" on:click={() => triggerSpotifyCommand("spotify.next")} >
          <img src={NextIcon} class="icons" alt='Next icon button.' />
        </button>
        <div class="shuffle-repeat-btn" on:click={() => triggerSpotifyCommand("spotify.toggleRepeating")} >
          <button class="repeat">
            <img src={RepeatIcon} class="icons" alt='Shuffle icon button.' />
          </button>
          <div class={isRepeating ? 'repeatActive' : 'hidden'}>.</div>
        </div>
      </section>
    </div>
  </div>
  {/if}

  <style>   
    .img-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .name-wrapper {
      position: absolute;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      transition: all 0.5s ease-in-out;
      bottom: 40px;
    }
    .name-wrapper p {
      font-size: 18px;
      color: white;
      margin: 0;
    }
    .trackArtwork {
      width: 100%;
      height: 100%;
      transition: all 0.5s ease-in-out;
      object-fit: cover;
    }
    .defaultWrapper{ 
        width:100%;   
        height: 100%;
        display: flex;
       
        justify-content: center;
        align-items: center;
        filter: brightness(0.3);
        opacity: 0.5;
        
        overflow: hidden;
    }
    .trackArtwork-darkened {
      width: 100%;
      height: 100%;
      transition: all 0.5s ease-in-out;
      object-fit: cover;
      filter: brightness(0.3);
    }
    .icons {
      width: 16px;
      height: 16px;
      color: white;
      filter: brightness(0) invert(1);
    }
    .shuffle-repeat-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      cursor: pointer;
      justify-content: center;
      height: 45px;
    }
    .shuffleActive {
      position: absolute;
      bottom: 0;
      left: 45%;
      right: 50%;
      font-size: 25px;
      color: green;
    }
    .repeatActive {
      position: absolute;
      bottom: 0;
      left: 45%;
      font-size: 25px;
      color: green;
    }
    section {
      position: absolute;
      width: 90%;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.5s ease-in-out;
      height: 35px;
      bottom: 0;
    }
    button {
      background: none;
      cursor: pointer;
      outline: none;
      border: none;
      color: white;
      font-size: 20px;
    }
    .hidden{
        display: none;
    }
    .lds-ellipsis {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-ellipsis div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }

</style>

