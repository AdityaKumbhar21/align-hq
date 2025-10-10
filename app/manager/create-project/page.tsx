"use client"

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import {toast} from "sonner"

const page = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { userId } = useAuth();


    const handleSubmit =async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        setIsSubmitting(true)
        setError("")

        const res = await axios.post("/api/project", {
          title,
          description
        })

        if(res.data?.success){
          toast.success("Project created successfully")
          router.push("/manager/dashboard")
        }else{
          setError(res.data?.message || "Failed to create Project")
        }
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to create Project")
      }finally{
        setIsSubmitting(false)
      }
    }

 return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Create New Project</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description (optional)"
                rows={4}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground justify-center">
          You can add team members later from the project page.
        </CardFooter>
      </Card>
    </div>
  );
};

export default page