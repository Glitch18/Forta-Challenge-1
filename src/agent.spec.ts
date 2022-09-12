import { FindingType, FindingSeverity, Finding, HandleTransaction, createTransactionEvent } from "forta-agent";
import { provideHandleTransaction } from "./agent";
import { CREATE_AGENT_FUNCTION } from "./constants";

const MOCK_FORTA_ADDRESS = "0x123";
const MOCK_NETHERMIND_ADDRESS = "0xabc";

describe("Nethermind bot deployment agent", () => {
  let handleTransaction: HandleTransaction;
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = provideHandleTransaction(CREATE_AGENT_FUNCTION, MOCK_FORTA_ADDRESS, MOCK_NETHERMIND_ADDRESS);
  });

  describe("handleTransaction", () => {
    it("returns empty findings if there are no Nethermind bots deployed", async () => {
      mockTxEvent.filterFunction = jest.fn().mockReturnValue([]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledWith(CREATE_AGENT_FUNCTION, MOCK_FORTA_ADDRESS);
    });

    it("returns a finding if there is a Nethermind bot deployment", async () => {
      const mockNethermindBotDeployment = {
        args: {
          agentId: "123",
          owner: MOCK_NETHERMIND_ADDRESS,
          metadata: "",
          chainIds: "137",
        },
      };
      mockTxEvent.filterFunction = jest.fn().mockReturnValue([mockNethermindBotDeployment]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Nethermind Bot Deployment",
          description: "Bot deployed from Nethermind",
          alertId: "NTRMND-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            agentId: mockNethermindBotDeployment.args.agentId,
            metadata: mockNethermindBotDeployment.args.metadata,
            chainIds: mockNethermindBotDeployment.args.chainIds,
          },
        }),
      ]);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledWith(CREATE_AGENT_FUNCTION, MOCK_FORTA_ADDRESS);
    });

    it("returns an empty finding if there is a non-Nethermind bot deployment", async () => {
      const mockNethermindBotDeployment = {
        args: {
          agentId: "123",
          owner: "0x123",
          metadata: "",
          chainIds: "137",
        },
      };
      mockTxEvent.filterFunction = jest.fn().mockReturnValue([mockNethermindBotDeployment]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledWith(CREATE_AGENT_FUNCTION, MOCK_FORTA_ADDRESS);
    });
  });
});
