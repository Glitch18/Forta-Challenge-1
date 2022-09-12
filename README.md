# Nethermind Bot-Deployment Bot

## Description

This bot detects other bots that were deployed by Nethermind

## Supported Chains

- Polygon

## Alerts

The following alerts are fired by this bot:

- NTRMND-1
  - Fired when a bot is created on Forta by Nethermind ([0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8](https://polygonscan.com/address/0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8))
  - Has severity of "Low"
  - Has type of "Info"
  - Alert metadata is comprised of:
    - agentId: AgentID Given to the Bot
    - chainIds: List of chain IDs assigned to the Bot
    - metadata: Metadata given to the bot

## Test Data

The bot behaviour can be verified with the following transactions:

- [0x8ef79a79f23aca68acf59055229d685d6a5137d6a2eebc9890a3fdeba358c737](https://polygonscan.com/tx/0x8ef79a79f23aca68acf59055229d685d6a5137d6a2eebc9890a3fdeba358c737)
