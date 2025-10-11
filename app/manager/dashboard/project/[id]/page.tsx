"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-select';
import React, { useEffect, useState } from 'react'
import { Project } from '@/app/manager/dashboard/page';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { AddMemberDialog } from '@/components/AddMemberDialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


const page = () => {
    const {id} = useParams()
    const [project, setProject] = useState<Project>()
    const [loading, setLoading] = useState(true)

    const fetchProject = async()=>{
            try {
                const res = await axios.get(`/api/project/${id}`)
                if(res.data?.success){
                    setProject(res.data.project)
                }
            } catch (error: any) {
                console.log("Error getting projects (FE): ", error);
            }finally{
                setLoading(false)
            }
        }

    useEffect(()=>{
        fetchProject();
    },[id])

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!project) return <p className="text-center mt-10">Project not found</p>;


    const handleRemove = async(memberEmail: string) => {
        try {
            const res = await axios.patch(`/api/project/${project._id}/remove-member`, { memberEmail });
            if(res.data?.success){
                toast.success(res.data.message || "Member removed successfully");
                fetchProject();
            }
        } catch (error) {
            console.log("Error in deleting member: ", error);
            toast.error("Failed to remove member");
        }
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 space-y-8">
        {/* Project Header */}
        <Card>
            <CardHeader>
            <CardTitle className="text-2xl font-semibold flex justify-between">
                <span>{project.title}</span>
                <Button variant="outline">Edit Project</Button>
            </CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-gray-600 mb-2">{project.description || "No description provided."}</p>
            <p className="text-sm"><strong>Manager:</strong> {project.managerId.fullName} ({project.managerId.email})</p>
            </CardContent>
        </Card>

        <Separator />

        {/* Team Members Section */}
        <div>
            <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <AddMemberDialog projectId={project._id} onSuccess={fetchProject} />
            </div>
            <Card>
            <CardContent className="p-4 space-y-2">
                {project.teamMembers && project.teamMembers.length ? (
                project.teamMembers.map((member, idx) => (
                    <p key={idx} className="text-sm flex justify-between">
                    <span>
                        {typeof member === 'object' && member.fullName 
                            ? `${member.fullName} (${member.email})`
                            : "Member information not available"
                        }
                    </span>
                    <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => typeof member === 'object' && member.email ? handleRemove(member.email) : null}
                        disabled={typeof member !== 'object' || !member.email}
                    >
                        Remove
                    </Button>
                    </p>
                ))
                ) : (
                <p className="text-gray-500 text-sm">No team members added yet.</p>
                )}
            </CardContent>
            </Card>
        </div>

        <Separator />

        {/* Tasks Section */}
        <div>
            <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button>Add Task</Button>
            </div>
            <Card>
            <CardContent className="p-4">
                <p className="text-gray-500 text-sm">No tasks yet. Start by adding one.</p>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}

export default page