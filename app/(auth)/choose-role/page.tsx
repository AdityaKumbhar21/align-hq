"use client"

import { Briefcase, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RoleCard } from '@/components/RoleCard';


const roles = [
  {
    label: "Manager",
    description: "Manage projects, assign tasks, and track progress efficiently.",
    icon: <Briefcase />,
  },
  {
    label: "Team Member",
    description: "Collaborate on tasks and contribute to your team's goals.",
    icon: <Users />,
  },
];


const page = () => {
  const [selectedRole, setSelectedRole] = useState<string>("Team Member")
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const handleSubmit = async ()=>{
    setLoading(true)
    try {
      const result = await axios.post("/api/auth/update-role", {role: selectedRole})
      if(result.data.success){
        toast.success("Role updated successfully!");
        router.push("/dashboard");
      }
      else{
        console.log("Error updating role (FE) ", result.data?.message);
        toast.error("Failed to update role, try again.")
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Internal Server error")
    }
    finally{
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-2">Choose Your Role</h1>
        <p className="text-center text-muted-foreground mb-8">
          Tell us how you’ll be using Align-HQ to personalize your experience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {roles.map((role) => (
            <RoleCard
              key={role.label}
              label={role.label}
              description={role.description}
              icon={role.icon}
              selected={selectedRole === role.label}
              onSelect={() => setSelectedRole(role.label)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            className="w-1/2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default page