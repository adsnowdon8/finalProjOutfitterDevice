import SolidButton from "@/components/SolidButton";
import { ThemedView } from "@/components/ThemedView";
import { locationThenWeather } from "@/helperFns/data";
import { askGpt } from "@/hooks/askGPT";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [location, setLocation] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [filenames, setFilenames] = useState<string[]>([]);

  // console.log(files);

  const handleButtonPress = async (button: "B1" | "B2") => {
    // get weather data
    setPrompt("");
    setGeneratedResponse("");
    console.log("button", button);
    const curWeather = await locationThenWeather(setLocation);

    // get query from flask server
    const res = await fetch("https://adsnowdon8.pythonanywhere.com/get");
    const json = await res.json();
    const prompt = button === "B1" ? json["B1"] : json["B2"];
    console.log("prompt", prompt);
    if (!prompt) {
      setPrompt("No prompt found");
      setGeneratedResponse(`${button} prompt is not set up`);
      return;
    }
    const match = prompt.match(/"([^"]+)"/);

    if (match) {
      console.log(match[1]); // "Today I plan to Run for 50 minutes"
      const updatedPrompt = prompt.replace("$$$$$$", curWeather);
      // Send prompt to gemini
      const response = await askGpt(updatedPrompt);
      const geminiResponse = response.split("***")[0];
      const itemsUsed = response.split("***")[1];
      const itemsUsedArray = itemsUsed.split(",");
      const itemsUsedNamesArray = itemsUsedArray.map((item: string) =>
        item.trim().replace(/\s+/g, "_")
      );
      console.log("itemsUsedNamesArray", itemsUsedNamesArray);

      setPrompt(match[1]);
      setGeneratedResponse(geminiResponse);
    }
    // setPrompt(updatedPrompt);
  };
  useEffect(() => {
    const getVoicesAndSpeak = async () => {
      // const voices = await Speech.getAvailableVoicesAsync();
      // console.log(voices);
      Speech.stop();
      if (generatedResponse) {
        Speech.speak(generatedResponse, {
          // voice: "com.apple.speech.synthesis.voice.Ralph",
        });
      }
    };

    getVoicesAndSpeak();
  }, [generatedResponse]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedView style={{ width: "100%", height: "100%" }}>
        <ThemedView
          style={{
            flexDirection: "column",
            gap: 10,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 30 }}>
            {prompt}
          </Text>
          <Text style={{ fontSize: 20, marginTop: 80 }}>
            {generatedResponse}
          </Text>

          {/* images */}
          {/* <ItemsUsedDisplay itemsUsedObjs={itemsUsedObjs} /> */}
        </ThemedView>

        <ThemedView
          style={{
            flexDirection: "row",
            gap: 30,
            position: "absolute",
            bottom: 20,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              position: "absolute",
              right: -150,
              alignSelf: "center",
              fontSize: 16,
              color: "red",
            }}
            onPress={() => {
              console.log("clear");
              setPrompt("");
              setGeneratedResponse("");
            }}
          >
            Clear
          </Text>
          <SolidButton
            color="green"
            title="B1"
            disabled={loading}
            onPress={() => {
              console.log("B1");
              setLoading(true);
              handleButtonPress("B1").then(() => setLoading(false));
            }}
          />
          <SolidButton
            title="B2"
            color="blue"
            disabled={loading}
            onPress={() => {
              console.log("B2");
              setLoading(true);
              handleButtonPress("B2").then(() => setLoading(false));
            }}
          />
          {/* <SolidButton
            color="green"
            title="B3"
            disabled={loading}
            onPress={() => {
              console.log("B3");
              setLoading(true);
              // handleButtonPress("B3").then(() => setLoading(false));
            }}
          /> */}
        </ThemedView>
      </ThemedView>
    </View>
  );
}
