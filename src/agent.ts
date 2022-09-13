import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { FORTA_ADDRESS, CREATE_AGENT_FUNCTION, NETHERMIND_ADDRESS } from "./constants";

export function provideHandleTransaction(
  agentFunctionAbi: string,
  fortaContractAddress: string,
  nethermindDeployAddress: string
): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    // filter the transaction logs for createAgent functions from Forta contract
    const botDeployEvents = txEvent.filterFunction(agentFunctionAbi, fortaContractAddress);

    botDeployEvents.forEach((transferEvent) => {
      // Extract arguments from transaction
      const { agentId, metadata, chainIds, owner } = transferEvent.args;

      // Check if Bot was deployed by Nethermind
      if (owner === nethermindDeployAddress) {
        findings.push(
          Finding.fromObject({
            name: "Nethermind Bot Deployment",
            description: "Bot deployed from Nethermind",
            alertId: "NTRMND-1",
            severity: FindingSeverity.Low,
            type: FindingType.Info,
            metadata: {
              agentId: agentId,
              metadata: metadata,
              chainIds: chainIds,
            },
          })
        );
      }
    });

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(CREATE_AGENT_FUNCTION, FORTA_ADDRESS, NETHERMIND_ADDRESS),
};
