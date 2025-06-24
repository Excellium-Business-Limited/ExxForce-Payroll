"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

// interface BulkUploadModalProps {
//   open: any;
//   onClose: () => any;
// }

const BulkUploadModal = ({title }: {title: string}) => {
  return (
    <div className="">
      <span className="max-w-lg w-fit rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Bulk Upload {title ? title : 'Employees'}</h2>

        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
          <UploadCloud className="mx-auto mb-2 text-gray-400 w-8 h-8" />
          <p className="mb-2 text-gray-600 text-sm">Drag and drop CSV file here (Maximum 5mb)</p>
          <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200">Upload file</Button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Click <a href="#" className="text-blue-600 underline">here</a> to download CSV file template.
        </p>

        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-3 rounded mb-6">
          <p className="m-0">
            <strong>i</strong> Ensure your data is clean and validated before import. <br /> Invalid rows will be ignored and reported after processing.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Close</Button>
          <Button className="bg-blue-700 text-white hover:bg-blue-800">Save</Button>
        </div>
      </span>
    </div>
  );
};

export default BulkUploadModal;
