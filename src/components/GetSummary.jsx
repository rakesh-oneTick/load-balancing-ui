import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const GetSummary = () => {
  const [truckId, setTruckId] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    // Changed e: React.FormEvent to e
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary("");

    const payload = {
      truck_id: truckId,
      location: location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      capacity: parseInt(capacity, 10),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}recommendations/recommend/summary`,
        payload
      );
      setSummary(response.data.summary);
    } catch (err) {
      // Changed err: any to err
      setError(err.message || "Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Get Summary</CardTitle>
        <CardDescription>
          Get AI summary of recommended loads for a truck
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
              placeholder="Enter Truck ID (e.g., T123)"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location">Location</label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location (e.g., Faridabad)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="latitude">Latitude</label>
              <Input
                id="latitude"
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                placeholder="Enter Latitude"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="longitude">Longitude</label>
              <Input
                id="longitude"
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                placeholder="Enter Longitude"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="capacity">Capacity</label>
            <Input
              id="capacity"
              type="text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              placeholder="Enter Capacity (tons)"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Get Summary"}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>

        {summary && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GetSummary;
