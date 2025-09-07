import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenchange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenchange }: Props) => {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  return (
    <Sheet open={open} onOpenChange={onOpenchange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link
              onClick={() => onOpenchange(false)}
              key={item.href}
              href={item.href}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
            >
              {item.children}
            </Link>
          ))}
          {/* Auth Links */}
          {!session.data ? (
            <div className="border-t">
              <Link
                onClick={() => onOpenchange(false)}
                href="/sign-in"
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              >
                Log in
              </Link>
              <Link
                onClick={() => onOpenchange(false)}
                href="/sign-up"
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              >
                Start Selling
              </Link>
            </div>
          ) : (
            <div className="border-t">
              <Link
                onClick={() => onOpenchange(false)}
                href="/admin"
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              >
                Dashboard
              </Link>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
