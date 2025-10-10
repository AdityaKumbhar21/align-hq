"use client"

import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectCard } from '@/components/ProjectCard';

export interface Project {
  _id: string;
  title: string;
  description: string;
  managerId: { fullName: string; email: string };
  teamMembers: { fullName: string; email: string }[];
}

const page = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/project");
        if (res.data.success) {
          setProjects(res.data.projects);
        } else {
          setError(res.data.message || "Failed to load projects");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Internal server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading projects...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;


  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Projects</h1>
        <Link href="/projects/create">
          <Button>Create Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Create one to get started.</p>
        ) : (
        projects.map((project) => (
            <ProjectCard
            key={project._id}
            _id={project._id}
            title={project.title}
            description={project.description}
            managerName={project.managerId?.fullName}
            members={project.teamMembers?.map((m) => m.fullName)}
            />
        ))
        )}

    </div>
  );
};

export default page