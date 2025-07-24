"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const EndEmploymentModal = ({ employeeName }: { employeeName: string }) => {
  return (
    <div className="">
      <span className="max-w-md w-full bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <XCircle className="text-red-500 w-10 h-10 mb-3" />
          <h2 className="text-lg font-semibold mb-2">End Employment</h2>
          <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to end employment for <strong>{employeeName}</strong>? This action will mark them as inactive and stop salary processing.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="text-gray-700 border-gray-300">Cancel</Button>
          <Button className="bg-blue-700 text-white hover:bg-blue-800">Confirm End</Button>
        </div>
      </span>
    </div>
  );
};

export default EndEmploymentModal;
