import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { APICONSTANTS } from "@/constants/ApiURl";

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Icon for the delete button
import { Trash2 } from "lucide-react"; // <--- Import the Trash2 icon

// Base URL for your API
const API_BASE_URL = APICONSTANTS.BASE_URL;
// const API_BASE_URL = "http://localhost:8000/api/v1/load";
const DELETE_API_URL_BASE = `${API_BASE_URL}delete-load/loads`;

const ManageLoads = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchLoads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}load/get-all-loads`);
      if (response.data.status === true) {
        setLoads(response.data.loads || []);
        toast.success("Loads fetched successfully!", {
          toastId: "loads-fetch-success",
        });
      } else {
        toast.error(response.data.message || "Failed to fetch loads.");
        setLoads([]);
      }
    } catch (error) {
      console.error("Error fetching loads:", error);
      toast.error("Error fetching loads. Please try again.");
      setLoads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  const handleDelete = async (loadIdToDelete) => {
    setDeletingId(loadIdToDelete);
    try {
      const res = await axios.delete(
        `${DELETE_API_URL_BASE}/${loadIdToDelete}`
      );

      if (res.status === 200) {
        const message = res.data?.message || "Load deleted successfully";
        toast.success(message);
        setLoads((prevLoads) =>
          prevLoads.filter((load) => load.load_id !== loadIdToDelete)
        );
      } else {
        const message = res.data?.message || "Failed to delete load";
        toast.error(message);
      }
    } catch (error) {
      console.error("Error deleting load:", error);
      if (error.response?.data?.detail) {
        const errDetail = error.response.data.detail;
        if (typeof errDetail === "object" && errDetail.message) {
          toast.error(errDetail.message);
        } else if (typeof errDetail === "string") {
          toast.error(errDetail);
        } else {
          toast.error("Failed to delete load");
        }
      } else {
        toast.error("Failed to delete load");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Manage Logistics Loads
        </CardTitle>
        <Button onClick={fetchLoads} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Loads"}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[280px]" />
            <Skeleton className="h-4 w-[220px]" />
          </div>
        ) : loads.length === 0 ? (
          <p className="text-center text-gray-500">No loads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Load ID</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cargo Type</TableHead>
                  <TableHead>Weight (tons)</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loads.map((load) => (
                  <TableRow key={load.load_id}>
                    <TableCell className="font-medium">
                      {load.load_id}
                    </TableCell>
                    <TableCell>{load.pickup_point}</TableCell>
                    <TableCell>{load.destination}</TableCell>
                    <TableCell>{load.rate}</TableCell>
                    <TableCell className="capitalize">{load.status}</TableCell>
                    <TableCell>{load.cargo_type}</TableCell>
                    <TableCell>{load.weight_tons}</TableCell>
                    <TableCell>{load.expected_delivery_date}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          {/* Use the Trash2 icon inside the button */}
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={deletingId === load.load_id}
                          >
                            {deletingId === load.load_id ? (
                              // You can use a loading spinner icon here if you have one
                              <span className="animate-spin">🌀</span>
                            ) : (
                              <Trash2 className="h-4 w-4" /> // <--- The Trash2 icon
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the load with ID{" "}
                              <span className="font-bold">{load.load_id}</span>{" "}
                              from your records.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(load.load_id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageLoads;
