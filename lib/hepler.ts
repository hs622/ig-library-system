



// for sidebar and breadcrumbs components
export function formatSegmentName(segment: string): string {

  switch (segment) {
    case "d":
      return "Dashboard"
    case "ci":
      return "Cataloguing & Inventory"
    case "mm":
      return "Member Management"
    case "cc":
      return "Circulation Control"
    case "sc":
      return "Settings & Configurations"
    default:
      return segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
}