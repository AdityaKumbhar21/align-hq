
  interface SessionClaims {
    metadata?: {
      role?: "Admin" | "Manager" | "Team Member";
      plan?: "Free" | "Pro" | "Enterprise";
      projectCount?: number;
    };
  }
