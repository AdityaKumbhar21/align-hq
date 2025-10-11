"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { toast } from "sonner";

interface AddMemberDialogProps {
  projectId: string;
  onSuccess?: () => void; 
}

export function AddMemberDialog({ projectId, onSuccess }: AddMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleAddMember = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.patch(`/api/project/${projectId}/add-member`, { memberEmail: email });
      
      if (res.data.success) {
        setEmail("");
        toast.success(res.data.message || "Member added successfully");
        onSuccess?.();
      } else {
        setError(res.data.message || "Failed to add member");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Member</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Input
          type="email"
          placeholder="Enter member email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button onClick={handleAddMember} disabled={loading}>
          {loading ? "Adding..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
