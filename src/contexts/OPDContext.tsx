import React, { createContext, useContext, useState, useEffect } from 'react';
import { OPDVisit, calculateNextStep, fetchOPDVisits } from '@/services/opdService';

interface OPDContextType {
    activeVisit: OPDVisit | null;
    setActiveVisit: (visit: OPDVisit | null) => void;
    isLoading: boolean;
    refreshVisits: () => Promise<void>;
    nextAction: { label: string, tab: string } | null;
}

const OPDContext = createContext<OPDContextType | undefined>(undefined);

export const OPDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeVisit, setActiveVisit] = useState<OPDVisit | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nextAction, setNextAction] = useState<{ label: string, tab: string } | null>(null);

    useEffect(() => {
        if (activeVisit) {
            setNextAction(calculateNextStep(activeVisit));
        } else {
            setNextAction(null);
        }
    }, [activeVisit]);

    const refreshVisits = async () => {
        setIsLoading(true);
        try {
            // In a real app, we might refresh the active visit's latest data
            if (activeVisit) {
                const visits = await fetchOPDVisits();
                const updated = visits.find(v => v.id === activeVisit.id);
                if (updated) setActiveVisit(updated);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OPDContext.Provider value={{ activeVisit, setActiveVisit, isLoading, refreshVisits, nextAction }}>
            {children}
        </OPDContext.Provider>
    );
};

export const useOPD = () => {
    const context = useContext(OPDContext);
    if (context === undefined) {
        throw new Error('useOPD must be used within an OPDProvider');
    }
    return context;
};
