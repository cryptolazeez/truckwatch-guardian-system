
import { CheckCircle } from "lucide-react";
import React from "react";

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
    <span>{children}</span>
  </li>
);

export default ListItem;
