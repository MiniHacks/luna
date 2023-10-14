import { Box } from "@chakra-ui/react";
import React from "react";

const TitleBar = (): React.ReactElement => {
  return (
    <Box
      style={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        WebkitAppRegion: "drag",
        height: "10px",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.1)",
        cursor: "move",
      }}
    />
  );
};

export default TitleBar;
