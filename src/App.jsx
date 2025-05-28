import React from "react";
import GetLoads from "./components/GetLoads.jsx"; // Corrected import paths
// import GetSummary from "./components/GetSummary.jsx";
import AskAgent from "./components/AskAgent.jsx";
import { ToastContainer } from "react-toastify";
// import PostFeedback from "./components/PostFeedback.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddLoad from "./components/addLoad.jsx";
import DeleteLoad from "./components/DeleteLoad.jsx";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Load Balancing</h1>
      <Tabs defaultValue="getLoads" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="getLoads">Get Loads</TabsTrigger>
          {/* <TabsTrigger value="getSummary">Get Summary</TabsTrigger> */}
          <TabsTrigger value="askAgent">Ask Agent</TabsTrigger>
          <TabsTrigger value="add-load">Add New Load</TabsTrigger>
          <TabsTrigger value="delete-load">Delete Load</TabsTrigger>

          {/* <TabsTrigger value="postFeedback">Post Feedback</TabsTrigger> */}
        </TabsList>
        <TabsContent value="getLoads">
          <GetLoads />
        </TabsContent>
        {/* <TabsContent value="getSummary">
          <GetSummary />
        </TabsContent> */}
        <TabsContent value="askAgent">
          <AskAgent />
        </TabsContent>
        <TabsContent value="add-load">
          <AddLoad />
        </TabsContent>
        <TabsContent value="delete-load">
          <DeleteLoad />
        </TabsContent>

        {/* <TabsContent value="postFeedback">
          <PostFeedback />
        </TabsContent> */}
      </Tabs>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
