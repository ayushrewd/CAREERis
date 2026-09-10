import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";
import { Badge } from "../badge";
import { EmptyState } from "../empty-state";
import { StatusBadge } from "../status-badge";

describe("Core UI Design System Components", () => {
  it("renders Button with proper label and default styling", () => {
    render(<Button>Explore Careers</Button>);
    expect(screen.getByRole("button", { name: /Explore Careers/i })).toBeInTheDocument();
  });

  it("renders Badge with semantic text", () => {
    render(<Badge variant="success">Verified</Badge>);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("renders StatusBadge with verified badge variant", () => {
    render(<StatusBadge status="ASSESSMENT_VERIFIED" />);
    expect(screen.getByText("Proctored Verified")).toBeInTheDocument();
  });

  it("renders EmptyState with title, description, and action button", () => {
    render(
      <EmptyState
        title="No items found"
        description="Please try another filter."
        actionLabel="Clear Filter"
        onAction={() => {}}
      />
    );
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Please try another filter.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear Filter" })).toBeInTheDocument();
  });
});
