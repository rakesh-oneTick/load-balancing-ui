import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog as Alert,
  AlertDialogTitle as AlertTitle,
  AlertDialogDescription as AlertDescription,
} from "./ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { APICONSTANTS } from "@/constants/ApiURl";

const API_BASE_URL = APICONSTANTS.BASE_URL;

const AskAgent = () => {
  const [question, setQuestion] = useState("");
  // const [truckId, setTruckId] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    // Changed e: React.FormEvent to e
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    const payload = {
      question: question,
      // truck_id: truckId,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}agent/ask-agent`,
        payload
      );
      setAnswer(response.data.answer);
    } catch (err) {
      // Changed err: any to err
      setError(err.message || "Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Ask Agent</CardTitle>
        <CardDescription>
          Ask a question to the logistics AI agent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="question">Question</label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="Enter your question (e.g., What are the most urgent loads?)"
              className="min-h-[100px]"
            />
          </div>
          {/* <div className="space-y-2">
            <label htmlFor="truckId">Truck ID</label>
            <Input
              id="truckId"
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              required
              placeholder="Enter Truck ID (e.g., T123)"
            />
          </div> */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Ask"}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>

        {answer && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Answer:</h3>
            <p>{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AskAgent;
