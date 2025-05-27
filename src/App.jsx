import React from "react";
import GetLoads from "./components/GetLoads.jsx"; // Corrected import paths
import GetSummary from "./components/GetSummary.jsx";
import AskAgent from "./components/AskAgent.jsx";
import PostFeedback from "./components/PostFeedback.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Load Balancing</h1>
      <Tabs defaultValue="getLoads" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="getLoads">Get Loads</TabsTrigger>
          <TabsTrigger value="getSummary">Get Summary</TabsTrigger>
          <TabsTrigger value="askAgent">Ask Agent</TabsTrigger>
          <TabsTrigger value="postFeedback">Post Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="getLoads">
          <GetLoads />
        </TabsContent>
        <TabsContent value="getSummary">
          <GetSummary />
        </TabsContent>
        <TabsContent value="askAgent">
          <AskAgent />
        </TabsContent>
        <TabsContent value="postFeedback">
          <PostFeedback />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
