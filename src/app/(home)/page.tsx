import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  return (
    <div className="p-4">
      {" "}
      <div className="flex flex-col p-4 gap-7">
        <div>
          {" "}
          <Button variant="elevated">I'm a button</Button>
        </div>
        <div>
          <Input placeholder="I'm an input" />
        </div>
        <div>
          <Progress value={50} className="w-full" />
        </div>
        <div>
          <Textarea placeholder="I'm a textarea" className="w-full" />
        </div>
        <div>
          <Checkbox />
        </div>
      </div>
    </div>
  );
}
