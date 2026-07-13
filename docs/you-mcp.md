# You.com MCP setup

Track B can use You.com in two modes.

Free `you-search` over remote MCP:

```json
{
  "mcpServers": {
    "ydc-server": {
      "type": "http",
      "url": "https://api.you.com/mcp?profile=free"
    }
  }
}
```

Paid/API-key mode for higher limits and `you-research`:

```json
{
  "mcpServers": {
    "ydc-server": {
      "type": "http",
      "url": "https://api.you.com/mcp",
      "headers": {
        "Authorization": "Bearer <YDC_API_KEY>"
      }
    }
  }
}
```

The app code reads `YOU_MCP_URL` and defaults to the free endpoint when `YOUCOM_API_KEY` is absent. Free mode is search-only and limited to 100 queries/day.
