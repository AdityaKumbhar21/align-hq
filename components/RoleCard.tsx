"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface RoleCardProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
}

export function RoleCard({ label, description, icon, selected, onSelect }: RoleCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer border transition-all rounded-2xl hover:shadow-md hover:scale-[1.02] ${
        selected ? "border-primary bg-primary/5" : "border-muted"
      }`}
    >
      <CardHeader className="flex flex-col items-center justify-center text-center space-y-2 py-6">
        <div className={`text-3xl ${selected ? "text-primary" : "text-muted-foreground"}`}>
          {icon}
        </div>
        <CardTitle className="text-lg font-semibold">{label}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground px-2">
          {description}
        </CardDescription>
        {selected && <CheckCircle2 className="text-primary w-5 h-5 mt-2" />}
      </CardHeader>
    </Card>
  );
}
