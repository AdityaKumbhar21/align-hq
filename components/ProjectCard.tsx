"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectCardProps {
  _id: string;
  title: string;
  description?: string;
  managerName?: string;
  members?: string[];
}

export const ProjectCard = ({
  _id,
  title,
  description = "No description",
  managerName,
  members = []
}: ProjectCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Link href={`/manager/dashboard/project/${_id}`}>
            <Button variant="outline" size="sm">View</Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
        {managerName && (
          <p className="text-sm mt-2">
            <strong>Manager:</strong> {managerName}
          </p>
        )}
        <p className="text-sm">
          <strong>Members:</strong>{" "}
          {members.length > 0 ? members.join(", ") : "No members yet"}
        </p>
      </CardContent>
    </Card>
  );
};
