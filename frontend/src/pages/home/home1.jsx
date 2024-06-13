import { CornerDownLeft, Mic, Paperclip, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MainForm from "./mainform";
import { Input } from "@/components/ui/input";
import Content from "./content";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function Home1() {
  const [csvfile, setCsvfile] = useState();
  const [data, setData] = useState(null);

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">Playground</h1>
        <Drawer>
          <DrawerTrigger>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Settings className="size-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>Configuration</DrawerTitle>
              <DrawerDescription>
                Configure the Data and Choose the algorithm
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
              <MainForm
                csvfile={csvfile}
                setCsvfile={setCsvfile}
                setData={setData}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </header>
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">

          <div
            className="relative hidden flex-col items-start gap-8 md:flex md:px-2"
            x-chunk="dashboard-03-chunk-0"
          >
            <MainForm
              csvfile={csvfile}
              setCsvfile={setCsvfile}
              setData={setData}
            />
          </div>
       
          <div className="relative flex h-rfull min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <Content
              csvfile={csvfile}
              setCsvfile={setCsvfile}
              data={data}
              setData={setData}
            />
          </div>
        
  
      </main>
    </div>
  );
}
