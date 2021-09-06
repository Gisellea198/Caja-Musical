import React, { useEffect } from "react";
import { Sounds, OtherSounds } from "./sounds";
import { AiFillControl } from "react-icons/ai";
import "./App.css";

const soundsName = {
  heaterKit: "Heater Kit",
  smoothPianoKit: "Smooth Piano Kit",
};

const soundsGroup = {
  heaterKit: Sounds,
  smoothPianoKit: OtherSounds,
};
const KeyboardKey = ({
  play,
  deactivateAudio,
  sound: { id, key, url, keyCode },
}) => {
  const handleKeyDown = (e) => {
    if (keyCode === e.keyCode) {
      const audio = document.getElementById(key);
      play(key, id);
      deactivateAudio(audio);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  });

  return (
    <button
      value="test"
      id={keyCode}
      className="drum-pad"
      onClick={() => play(key, id)}
    >
      <audio className="clip" src={url} id={key} />
      {key}
    </button>
  );
};

const Keyboard = ({ sounds, play, power, deactivateAudio }) => (
  <div className="keyboard">
    {power
      ? sounds.map((sound) => (
          <KeyboardKey
            sound={sound}
            play={play}
            deactivateAudio={deactivateAudio}
          />
        ))
      : sounds.map((sound) => (
          <KeyboardKey
            sound={{ ...sound, url: "#" }}
            play={play}
            deactivateAudio={deactivateAudio}
          />
        ))}
  </div>
);

const DumControle = ({
  stop,
  name,
  power,
  volume,
  handleVolumeChange,
  changeSoundGroup,
}) => (
  <div className="controle">
    <button onClick={stop}> {power ? "OFF" : "ON"}</button>

    <h2>
      <AiFillControl />
      Volumen: %{Math.round(volume * 100)}
    </h2>
    <input
      max="1"
      min="0"
      step="0.01"
      type="range"
      value={volume}
      onChange={handleVolumeChange}
    />
    <h2 id="display">{name}</h2>
    <button onClick={changeSoundGroup}>Cambio de Sonido</button>
  </div>
);

const App = () => {
  const [power, setPower] = React.useState(true);
  const [volume, setVolume] = React.useState(1);
  const [soundName, setSoundName] = React.useState("");
  const [soundType, setSoundType] = React.useState("heaterKit");
  const [sounds, setSounds] = React.useState(soundsGroup[soundType]);

  const styleActiveKey = (key) => {
    key.parentElement.style.backgroundColor = "#000000";
    key.parentElement.style.color = "#ffffff";
  };

  const deActivatedKey = (audio) => {
    audio.parentElement.style.backgroundColor = "#ffffff";
    audio.parentElement.style.color = "#000000";
  };

  const deactivateAudio = (audio) => {
    setTimeout(() => {
      audio.parentElement.style.backgroundColor = "#ffffff";
      audio.parentElement.style.color = "#000000";
    }, 300);
  };

  const play = (key, sound) => {
    setSoundName(sound);
    const audio = document.getElementById(key);
    styleActiveKey(audio);
    audio.currentTime = 0;
    audio.play();
    deactivateAudio(audio);
    deActivatedKey(audio);
  };

  const stop = () => {
    setPower(!power);
  };

  const changeSoundGroup = () => {
    setSoundName("");
    if (soundType === "heaterKit") {
      setSoundType("smoothPianoKit");
      setSounds(soundsGroup.smoothPianoKit);
    } else {
      setSoundType("heaterKit");
      setSounds(soundsGroup.heaterKit);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const setKeyVolume = () => {
    const audioes = sounds.map((sound) => document.getElementById(sound.key));
    audioes.forEach((audio) => {
      if (audio) {
        audio.volume = volume;
      }
    });
  };

  return (
    <div id="drum-machine">
      {setKeyVolume()}
      <div className="wrapper">
        <Keyboard
          sounds={sounds}
          play={play}
          power={power}
          deactivateAudio={deactivateAudio}
        />
        <DumControle
          stop={stop}
          power={power}
          volume={volume}
          name={soundName || soundsName[soundType]}
          changeSoundGroup={changeSoundGroup}
          handleVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default App;
