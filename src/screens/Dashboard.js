import React, { useState,useEffect,useRef } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { View, PermissionsAndroid } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { Audio } from 'expo-av';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';


export default function Dashboard({ navigation }) {


  const [uri,setUri] = useState(null);
  const [playing,setPlaying]= useState(false);
  const [recording, setRecording] = React.useState(null);
  const [sound, setSound] = React.useState(null);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    setUri(recording.getURI());
    console.log('Recording stopped and stored at', uri);
  }

  async function playRecording() {
    setPlaying(true);
    try {
      if (sound){
        console.log('Replaying playback..');
        await sound.playAsync();
      }
      else{
        console.log('Playing recording..',uri);
        const { sound } = await Audio.Sound.createAsync({ uri });
        setSound(sound);
        await sound.playAsync();
        console.log("end of the audio",sound)
      }
    } catch (error) {
      console.error('Failed to play recording', error);
    }
  }


  async function pausePlayback() {
    setPlaying(false);
    console.log('Pausing playback..');
    await sound.pauseAsync();
  }

  async function stopPlayback() {
    setPlaying(false);
    console.log('Stopping playback..');
    await sound.stopAsync();
    await sound.unloadAsync();
    setSound(null);
  }


  return (
    <Background>
      <Logo />
      <Header>Let’s start Recoding</Header>
      <Header>{}</Header>
      <Button
        mode="contained"
        icon="record"
        onPress={startRecording}
        disabled={false}
      >
        RECORD
      </Button>

      <Button
        icon="stop"
        mode="outlined"
        onPress={stopRecording}
        disabled={!true}
      >
        STOP
      </Button>

      {/* <Title>{this.state.playTime} / {this.state.duration}</Title> */}
      <Button
        mode="contained"
        icon={playing?"pause":"play"}
        onPress={playing?pausePlayback: playRecording}
        disabled={false}
      >
        {!playing?"PLAY":"PAUSE"}
      </Button>


      <Button
        icon="stop"
        mode="outlined"
        onPress={stopPlayback}
        disabled={false}
      >
        STOP
      </Button>

      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  );
}
