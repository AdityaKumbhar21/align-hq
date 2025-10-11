import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-select';
import Link from 'next/link';
import React from 'react'

const page = () => {
 const assignedProjects = [
    { id: "1", title: "Website Redesign", manager: "John Doe", role: "Frontend Developer" },
    { id: "2", title: "Mobile App Launch", manager: "Sarah Lee", role: "QA Tester" },
  ];

  const assignedTasks = [
    { id: "101", task: "Fix Navbar Bug", project: "Website Redesign", status: "In Progress", deadline: "2025-10-15" },
    { id: "102", task: "Write Test Cases", project: "Mobile App Launch", status: "Pending", deadline: "2025-10-18" },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Team Member Dashboard</h1>
        <Button variant="outline">View Profile</Button>
      </div>

      <Separator />

      {/* Assigned Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Assigned Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {assignedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{project.title}</span>
                  <Badge variant="secondary">{project.role}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Manager: {project.manager}</p>
                <Link href={`/project/${project.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">View Project</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Assigned Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Tasks</h2>
        <div className="space-y-3">
          {assignedTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-600">Project: {task.project}</p>
                  <p className="text-xs text-gray-500">Deadline: {task.deadline}</p>
                </div>
                <Badge className={`${task.status === "Pending" ? "bg-yellow-500" : "bg-blue-500"}`}>
                  {task.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
export default page 