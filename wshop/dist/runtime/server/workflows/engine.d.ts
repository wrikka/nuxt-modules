export interface WorkflowTrigger {
    event: string;
    data?: Record<string, any>;
}
export declare function triggerWorkflow(trigger: WorkflowTrigger): Promise<void>;
//# sourceMappingURL=engine.d.ts.map