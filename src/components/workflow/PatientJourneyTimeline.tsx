import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { WorkflowStation, PatientStatus, WORKFLOW_STAGES } from "@/types/workflow-types";
import { cn } from "@/lib/utils";

interface PatientJourneyTimelineProps {
    currentStatus: PatientStatus;
    history?: { station: WorkflowStation; completedAt: string; by: string }[];
}

const STAGES_ORDER: WorkflowStation[] = ['registration', 'vitals', 'doctor', 'pharmacy', 'exit'];

export function PatientJourneyTimeline({ currentStatus }: PatientJourneyTimelineProps) {
    const getStageStatus = (stage: WorkflowStation) => {
        // This is a simplified logic. Real logic would rely on history logs.
        // For now, we map based on the currentStatus enum order roughly.
        const statusMap: Record<PatientStatus, number> = {
            'registered': 1,
            'waiting_vitals': 2,
            'in_vitals': 2,
            'waiting_doctor': 3,
            'in_consultation': 3,
            'waiting_pharmacy': 4,
            'waiting_lab': 4,
            'completed': 5
        };

        const stageMap: Record<WorkflowStation, number> = {
            'registration': 1,
            'vitals': 2,
            'doctor': 3,
            'pharmacy': 4,
            'lab': 4,
            'billing': 4,
            'exit': 5
        };

        const currentStep = statusMap[currentStatus] || 1;
        const stageStep = stageMap[stage];

        if (currentStep > stageStep) return 'completed';
        if (currentStep === stageStep) return 'active';
        return 'pending';
    };

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Connector Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10" />

                {STAGES_ORDER.map((stage, index) => {
                    const status = getStageStatus(stage);
                    return (
                        <div key={stage} className="flex flex-col items-center bg-white px-2">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors",
                                status === 'completed' && "bg-green-500 border-green-500 text-white",
                                status === 'active' && "bg-blue-600 border-blue-200 text-white shadow-lg scale-110",
                                status === 'pending' && "bg-white border-gray-200 text-gray-300",
                            )}>
                                {status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                                    status === 'active' ? <Clock className="w-5 h-5 animate-pulse" /> :
                                        <Circle className="w-5 h-5" />}
                            </div>
                            <div className="mt-3 text-center">
                                <p className={cn(
                                    "text-sm font-semibold",
                                    status === 'active' && "text-blue-600",
                                    status === 'pending' && "text-muted-foreground"
                                )}>{WORKFLOW_STAGES[stage]}</p>
                                {status === 'active' && <p className="text-xs text-blue-500 font-medium">In Progress</p>}
                                {status === 'completed' && <p className="text-xs text-green-600">Completed</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
