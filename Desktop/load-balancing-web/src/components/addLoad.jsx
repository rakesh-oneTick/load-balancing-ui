import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AddLoad() {
  const [formData, setFormData] = useState({
    pickup_point: "",
    destination: "",
    rate: 0,
    status: "available",
    cargo_type: "",
    weight_tons: 0,
    expected_delivery_date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/load/add-load",
        formData
      );

      if (res.data.status === true) {
        const message = res.data.message || "Added successfully";
        toast.success(message);
      } else {
        const message = res.data.message || "Failed to add load";
        toast.error(message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        const errData = error.response.data.detail;
        if (typeof errData === "object" && errData.message) {
          toast.error(errData.message);
        } else if (typeof errData === "string") {
          toast.error(errData);
        } else {
          toast.error("Failed to add load");
        }
      } else {
        toast.error("Failed to add load");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Add New Load</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="pickup_point">Pickup Point</label>
            <Input
              id="pickup_point"
              name="pickup_point"
              value={formData.pickup_point}
              onChange={handleChange}
              placeholder="Pickup point"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="destination">Destination</label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Destination point"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rate">Rate (₹/km)</label>
            <Input
              id="rate"
              name="rate"
              type="number"
              value={formData.rate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="status">Status</label>
            <Select value={formData.status} onValueChange={handleSelectChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cargo_type">Cargo Type</label>
            <Input
              id="cargo_type"
              name="cargo_type"
              value={formData.cargo_type}
              onChange={handleChange}
              placeholder="Cargo type"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="weight_tons">Weight (tons)</label>
            <Input
              id="weight_tons"
              name="weight_tons"
              type="number"
              value={formData.weight_tons}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="expected_delivery_date">
              Expected Delivery Date
            </label>
            <Input
              id="expected_delivery_date"
              name="expected_delivery_date"
              type="date"
              value={formData.expected_delivery_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
