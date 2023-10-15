import type { NextPage } from "next";
import { Box, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Channels } from "@luna/common";
import PageLayout from "../components/Layout/PageLayout";
import { useIPCEvent } from "../components/useIPCEvent";

const Home: NextPage = () => {
  const [currentPrompt, setCurrentPrompt] = useState("Loading...");
  const sendPrompt = useIPCEvent<string, string>(
    Channels.CurrentVoicePrompt,
    (text) => setCurrentPrompt(text)
  );
  return (
    <PageLayout title={"luna, by minihacks"}>
      <Box
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"end"}
        justifyContent={"flex-end"}
      >
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"end"}
          flexDirection={"column"}
          border={"1px solid #929292"}
          borderRadius={"lg"}
          px={8}
          minW={300}
          py={4}
          pt={1}
          background={"rgba(53, 53, 53, 0.7)"}
        >
          <Input
            opacity={0}
            _hover={{
              opacity: 1,
            }}
            placeholder={"prompt"}
            color={"white"}
            size={"xs"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendPrompt(currentPrompt);
              }
            }}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            value={currentPrompt}
          />
          <Text fontSize={"4xl"} color={"white"}>
            {currentPrompt}
          </Text>
          <Text
            color={"#929292"}
            fontSize={"xs"}
            style={{
              letterSpacing: "-0.05em",
            }}
          >
            luna: your truly personal assistant
          </Text>
        </Box>
      </Box>
    </PageLayout>
  );
};
export default Home;
