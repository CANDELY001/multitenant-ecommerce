import type { ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}
import { Footer } from "./footer";
import { Navbar } from "./navbar";

const layout = ({ children }: layoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#F4F4F4]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
