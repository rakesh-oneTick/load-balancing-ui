import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { CheckCircle } from "lucide-react";
import { APICONSTANTS } from "@/constants/ApiURl";

const API_BASE_URL = APICONSTANTS.BASE_URL;

const PostFeedback = () => {
  const [truckId, setTruckId] = useState("");
  const [loadOrigin, setLoadOrigin] = useState("");
  const [loadDestination, setLoadDestination] = useState("");
  const [aiScore, setAiScore] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    // Changed e: React.FormEvent to e
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const payload = {
      truck_id: truckId,
      load_origin: loadOrigin,
      load_destination: loadDestination,
      ai_score: parseFloat(aiScore),
      action: action,
    };

    try {
      await axios.post(`${API_BASE_URL}feedback/feedback`, payload);
      setSuccess(true);
      // Reset form fields upon successful submission
      setTruckId("");
      setLoadOrigin("");
      setLoadDestination("");
      setAiScore("");
      setAction("");
    } catch (err) {
      // Changed err: any to err
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Post Feedback</CardTitle>
        <CardDescription>
          Submit feedback on a load recommendation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="truckId">Truck ID</label>
            <Input
              id="truckId"
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              required
              placeholder="Enter Truck ID"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="loadOrigin">Load Origin</label>
            <Input
              id="loadOrigin"
              value={loadOrigin}
              onChange={(e) => setLoadOrigin(e.target.value)}
              required
              placeholder="Enter Load Origin"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="loadDestination">Load Destination</label>
            <Input
              id="loadDestination"
              value={loadDestination}
              onChange={(e) => setLoadDestination(e.target.value)}
              required
              placeholder="Enter Load Destination"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="aiScore">AI Score</label>
            <Input
              id="aiScore"
              type="text"
              value={aiScore}
              onChange={(e) => setAiScore(e.target.value)}
              required
              placeholder="Enter AI Score"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label htmlFor="action">Action</label>
            <Select onValueChange={setAction} value={action}>
              <SelectTrigger id="action">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Submit Feedback"}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Feedback submitted successfully!
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PostFeedback;
