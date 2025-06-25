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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup
import { Label } from "@/components/ui/label"; // Import Label for RadioGroup
import { APICONSTANTS } from "@/constants/ApiURl";

const SAMPLE_FILE_URL = "Book1.xlsx"; // Make sure this file exists in public/assets/

const BASE_URL = APICONSTANTS.BASE_URL;
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
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [addMode, setAddMode] = useState("single"); // 'single' or 'multiple'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rate" || name === "weight_tons"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const resetSingleLoadForm = () => {
    setFormData({
      pickup_point: "",
      destination: "",
      rate: 0,
      status: "available",
      cargo_type: "",
      weight_tons: 0,
      expected_delivery_date: "",
    });
  };

  const handleSubmitSingleLoad = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}load/add-load`, formData);

      if (res.data.status === true) {
        const message = res.data.message || "Load added successfully";
        toast.success(message);
        resetSingleLoadForm();
      } else {
        const message = res.data.message || "Failed to add load";
        toast.error(message);
      }
    } catch (error) {
      handleApiError(error, "Failed to add load");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const handleFileUpload = async () => {
  //   if (!file) {
  //     toast.error("Please select a file first.");
  //     return;
  //   }
  //   setFileLoading(true);

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     try {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = XLSX.read(data, { type: "array", cellDates: true });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //       if (jsonData.length < 2) {
  //         toast.error("The Excel file is empty or has no data rows.");
  //         setFileLoading(false);
  //         return;
  //       }

  //       const headers = jsonData[0].map((header) =>
  //         header.toString().trim().toLowerCase().replace(/\s+/g, "_")
  //       );
  //       const expectedHeaders = [
  //         "pickup_point",
  //         "destination",
  //         "rate",
  //         "status",
  //         "cargo_type",
  //         "weight_tons",
  //         "expected_delivery_date",
  //       ];

  //       const missingHeaders = expectedHeaders.filter(
  //         (eh) => !headers.includes(eh)
  //       );
  //       if (missingHeaders.length > 0) {
  //         toast.error(
  //           `Missing columns in Excel file: ${missingHeaders.join(
  //             ", "
  //           )}. Please use the sample file format.`
  //         );
  //         setFileLoading(false);
  //         return;
  //       }

  //       const loadsToUpload = jsonData
  //         .slice(1)
  //         .map((row, rowIndex) => {
  //           const loadData = {};
  //           headers.forEach((header, index) => {
  //             if (expectedHeaders.includes(header)) {
  //               let value = row[index];
  //               if (header === "rate" || header === "weight_tons") {
  //                 value = parseFloat(value) || 0;
  //               } else if (header === "expected_delivery_date") {
  //                 if (value instanceof Date) {
  //                   value = value.toISOString().split("T")[0];
  //                 } else if (typeof value === "number") {
  //                   const excelEpoch = new Date(1899, 11, 30);
  //                   const jsDate = new Date(
  //                     excelEpoch.getTime() + value * 24 * 60 * 60 * 1000
  //                   );
  //                   value = jsDate.toISOString().split("T")[0];
  //                 } else if (
  //                   typeof value === "string" &&
  //                   value.match(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/)
  //                 ) {
  //                   const parts = value.split(/[\/-]/);
  //                   // Try to intelligently guess format or enforce one, e.g., YYYY-MM-DD from sample
  //                   // For simplicity, assuming parts are MM, DD, YYYY or DD, MM, YYYY
  //                   // This part might need robust date parsing library if formats vary wildly
  //                   const year =
  //                     parts[2].length === 2 ? `20${parts[2]}` : parts[2];
  //                   const month = parts[0].padStart(2, "0"); // Assuming MM/DD first
  //                   const day = parts[1].padStart(2, "0");
  //                   value = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
  //                   if (isNaN(new Date(value).getTime())) {
  //                     // Basic validation
  //                     toast.warn(
  //                       `Invalid date format '${row[index]}' in row ${
  //                         rowIndex + 2
  //                       }. Please use YYYY-MM-DD.`
  //                     );
  //                     value = null; // or skip row
  //                   }
  //                 } else if (typeof value === "string") {
  //                   value = value.trim();
  //                 }
  //               } else if (header === "status") {
  //                 value = value
  //                   ? value.toString().toLowerCase().trim()
  //                   : "available";
  //               } else {
  //                 value = value ? value.toString().trim() : "";
  //               }
  //               loadData[header] = value;
  //             }
  //           });

  //           if (
  //             !loadData.pickup_point ||
  //             !loadData.destination ||
  //             !loadData.cargo_type ||
  //             !loadData.expected_delivery_date
  //           ) {
  //             toast.warn(
  //               `Skipping row ${
  //                 rowIndex + 2
  //               } due to missing required fields (Pickup, Destination, Cargo Type, or valid Delivery Date).`
  //             );
  //             return null;
  //           }
  //           const validStatuses = ["available", "urgent", "in_transit"];
  //           if (!loadData.status || !validStatuses.includes(loadData.status)) {
  //             loadData.status = "available";
  //           }
  //           return loadData;
  //         })
  //         .filter((load) => load !== null);

  //       if (loadsToUpload.length === 0) {
  //         toast.info("No valid loads found in the Excel file to upload.");
  //         setFileLoading(false);
  //         return;
  //       }

  //       let successCount = 0;
  //       let errorCount = 0;

  //       for (const load of loadsToUpload) {
  //         try {
  //           const res = await axios.post(
  //             "http://localhost:8000/api/v1/load/upload-loads-excel",
  //             load
  //           );
  //           if (res.data.status === true) {
  //             successCount++;
  //           } else {
  //             errorCount++;
  //             toast.error(
  //               `Failed for ${load.pickup_point} to ${load.destination}: ${
  //                 res.data.message || "Unknown error"
  //               }`
  //             );
  //           }
  //         } catch (error) {
  //           errorCount++;
  //           handleApiError(
  //             error,
  //             `Error for load ${load.pickup_point || "N/A"} to ${
  //               load.destination || "N/A"
  //             }`
  //           );
  //         }
  //       }

  //       if (successCount > 0)
  //         toast.success(`${successCount} load(s) added successfully.`);
  //       if (errorCount > 0) toast.error(`${errorCount} load(s) failed to add.`);
  //       if (
  //         successCount === 0 &&
  //         errorCount === 0 &&
  //         loadsToUpload.length > 0
  //       ) {
  //         toast.info(
  //           "File processed, but no loads were added. Check data format or server response details."
  //         );
  //       }

  //       setFile(null);
  //       if (document.getElementById("file-upload")) {
  //         document.getElementById("file-upload").value = "";
  //       }
  //     } catch (parseError) {
  //       console.error("Error parsing Excel file:", parseError);
  //       toast.error(
  //         "Failed to parse Excel. Check file format & ensure data on first sheet."
  //       );
  //     } finally {
  //       setFileLoading(false);
  //     }
  //   };
  //   reader.onerror = () => {
  //     toast.error("Failed to read the file.");
  //     setFileLoading(false);
  //   };
  //   reader.readAsArrayBuffer(file);
  // };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    setFileLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // 'excelFile' should match the name your backend expects for the file

      // If your backend also needs other data (e.g., a specific upload type), add them here:
      // formData.append("uploadType", "load_data");

      const res = await axios.post(
        `${BASE_URL}load/upload-loads-excel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status === true) {
        toast.success(res.data.message || "File uploaded successfully!");
      } else {
        toast.error(
          res.data.message || "File upload failed due to an unknown error."
        );
      }
    } catch (error) {
      handleApiError(error, "Error uploading the Excel file.");
    } finally {
      setFileLoading(false);
      setFile(null);
      if (document.getElementById("file-upload")) {
        document.getElementById("file-upload").value = "";
      }
    }
  };

  const handleApiError = (error, defaultMessage) => {
    let msg = defaultMessage || "An unexpected error occurred.";
    if (error.response && error.response.data) {
      const detail = error.response.data.detail;
      if (typeof detail === "string") {
        msg = detail;
      } else if (typeof detail === "object" && detail.message) {
        msg = detail.message;
      } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
        msg = detail.map((e) => `${e.loc.join(".")} - ${e.msg}`).join("; ");
      } else if (error.response.data.message) {
        msg = error.response.data.message;
      }
    } else if (error.message) {
      msg = error.message;
    }
    toast.error(msg);
  };

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = SAMPLE_FILE_URL;
    link.setAttribute("download", "Book1.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Downloading sample file...");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Add New Load</CardTitle>
        <div className="pt-4">
          <RadioGroup
            defaultValue="single"
            onValueChange={(value) => setAddMode(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="r-single" />
              <Label htmlFor="r-single">Single Load</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple" id="r-multiple" />
              <Label htmlFor="r-multiple">Multiple from Excel</Label>
            </div>
          </RadioGroup>
        </div>
      </CardHeader>
      <CardContent>
        {addMode === "single" ? (
          <form
            onSubmit={handleSubmitSingleLoad}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="pickup_point">Pickup Point</Label>
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
              <Label htmlFor="destination">Destination</Label>
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
              <Label htmlFor="rate">Rate (₹/km)</Label>
              <Input
                id="rate"
                name="rate"
                type="text"
                step="any"
                value={formData.rate}
                onChange={handleChange}
                placeholder="e.g., 50"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleSelectChange}
              >
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
              <Label htmlFor="cargo_type">Cargo Type</Label>
              <Input
                id="cargo_type"
                name="cargo_type"
                value={formData.cargo_type}
                onChange={handleChange}
                placeholder="e.g., Electronics, Textiles"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="weight_tons">Weight (tons)</Label>
              <Input
                id="weight_tons"
                name="weight_tons"
                type="text"
                step="any"
                value={formData.weight_tons}
                onChange={handleChange}
                placeholder="e.g., 10"
                required
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label htmlFor="expected_delivery_date">
                Expected Delivery Date
              </Label>
              <Input
                id="expected_delivery_date"
                name="expected_delivery_date"
                type="date"
                value={formData.expected_delivery_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding Load..." : "Submit Single Load"}
              </Button>
            </div>
          </form>
        ) : (
          // Multiple Loads from Excel UI
          <div className="space-y-6">
            <div>
              <Button
                onClick={handleDownloadSample}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Download Sample Excel File
              </Button>
              {/* <p className="text-sm text-muted-foreground mt-2">
                Required columns: pickup_point, destination, rate, status,
                cargo_type, weight_tons, expected_delivery_date (YYYY-MM-DD).
              </p> */}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="file-upload">Upload Excel File </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                className="h-13 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            <div>
              <Button
                onClick={handleFileUpload}
                disabled={!file || fileLoading}
                className="w-full"
              >
                {fileLoading ? "Uploading Loads..." : "Upload Loads from File"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
