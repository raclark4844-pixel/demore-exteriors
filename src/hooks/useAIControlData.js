import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const LIVE_QUERY_OPTIONS = {
  staleTime: 0,
  refetchInterval: 5000,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

const useList = (entityName) =>
  useQuery({
    queryKey: ["ai-control", entityName],
    queryFn: () => base44.entities[entityName].list("-created_date", 200),
    ...LIVE_QUERY_OPTIONS,
  });

// Archived/test records are retained permanently in the database and audit
// history, but excluded from default dashboard views and operational KPIs.
const useActiveList = (entityName) =>
  useQuery({
    queryKey: ["ai-control", entityName, "active"],
    queryFn: async () => {
      const rows = await base44.entities[entityName].list("-created_date", 200);
      return rows.filter((r) => !r.archived);
    },
    ...LIVE_QUERY_OPTIONS,
  });

export const useAgents = () => useList("AgentRegistry");
export const useJobs = () => useActiveList("AgentJobs");
export const useHandoffs = () => useActiveList("AgentHandoffs");
export const useApprovals = () => useActiveList("AgentApprovals");
export const useResults = () => useActiveList("AgentResults");
export const useImplementations = () => useActiveList("ImplementationQueue");
export const useConflicts = () => useActiveList("AgentConflicts");
export const useAudit = () => useList("AgentAuditLog");
export const useKnowledge = () => useList("SharedKnowledge");
export const useLocks = () => useList("SystemLocks");
export const useProviders = () => useList("AIProviderRegistry");
export const useRoles = () => useList("AISpecialistRole");
export const useAILogs = () => useList("AIProviderRequestLog");
export const useAutonomousAuditConfig = () => useList("AutonomousAuditConfig");
export const useWebsiteAuditRuns = () => useActiveList("WebsiteAuditRun");
export const useImprovementRecommendations = () =>
  useQuery({
    queryKey: ["ai-control", "ImprovementRecommendation", "active"],
    queryFn: async () => {
      const rows = await base44.entities.ImprovementRecommendation.list("-priorityScore", 200);
      return rows.filter((r) => !r.archived);
    },
    ...LIVE_QUERY_OPTIONS,
  });
export const useStagedWebsiteChanges = () => useActiveList("StagedWebsiteChange");