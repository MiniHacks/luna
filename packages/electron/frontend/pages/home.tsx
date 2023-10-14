import type { NextPage } from "next";
import { Heading } from "@chakra-ui/react";
import React from "react";
import PageLayout from "../components/Layout/PageLayout";

const Home: NextPage = () => {
  return (
    <PageLayout title={"geese, by minihacks"}>
      <Heading>geese</Heading>
    </PageLayout>
  );
};
export default Home;
