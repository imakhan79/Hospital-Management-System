
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { OTStation } from "@/components/ot/OTStation";
import { LayoutGrid, ClipboardList, Settings } from "lucide-react";

const OTModule = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <MainLayout>
            <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row gap-0 overflow-hidden">
                {/* Left Sidebar Menu */}
                <aside className="w-full lg:w-64 flex-shrink-0 border-r bg-slate-50/50 overflow-y-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full flex flex-col">
                        <div className="p-4">
                            <h2 className="font-semibold text-lg px-2 mb-2">OT & Surgery</h2>
                            <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
                                <TabsTrigger value="dashboard" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <LayoutGrid className="w-4 h-4 mr-2" /> Dashboard
                                </TabsTrigger>
                                <TabsTrigger value="schedule" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <ClipboardList className="w-4 h-4 mr-2" /> Daily Schedule
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Settings className="w-4 h-4 mr-2" /> OT Management
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-white h-full">
                    <Tabs value={activeTab} className="h-full">
                        <TabsContent value="dashboard" className="h-full mt-0">
                            <OTStation />
                        </TabsContent>
                        <TabsContent value="schedule" className="h-full mt-0 p-6">
                            <div className="text-center text-muted-foreground py-10 font-medium">Daily Schedule View (Coming Soon)</div>
                        </TabsContent>
                        <TabsContent value="settings" className="h-full mt-0 p-6">
                            <div className="text-center text-muted-foreground py-10 font-medium">OT Configuration & Settings</div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </MainLayout>
    );
};

export default OTModule;
