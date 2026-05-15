#!/usr/bin/env python3
"""
AI Skills Library — MCP Server

Serves every skill, rule, and agent as callable tools via the Model Context
Protocol (stdio transport). Any MCP-compatible AI (Claude Desktop, Cursor,
Claude Code) gets the full library as its brain on startup — zero manual
injection.

Install:
  pip install mcp   # or: uv pip install mcp

Add to Claude Desktop (~/.claude/claude_desktop_config.json):
  {
    "mcpServers": {
      "ai-skills-library": {
        "command": "python3",
        "args": ["/path/to/ai-skills-library/mcp/server.py"]
      }
    }
  }

Add to Cursor (.cursor/mcp.json):
  {
    "mcpServers": {
      "ai-skills-library": {
        "command": "python3",
        "args": ["/path/to/ai-skills-library/mcp/server.py"]
      }
    }
  }
"""
from __future__ import annotations
import glob, json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent

# ── Try to use the mcp package; fall back to bare stdio ──────────────────────
try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent, CallToolResult
    MCP_AVAILABLE = True
except ImportError:
    MCP_AVAILABLE = False

# ── Product index ────────────────────────────────────────────────────────────

def build_index() -> list[dict]:
    index = []
    for path in glob.glob(str(ROOT / "skills" / "**" / "SKILL.md"), recursive=True):
        p = _parse_product(path, "skill")
        if p: index.append(p)
    for path in glob.glob(str(ROOT / "rules" / "library" / "*" / "body.md")):
        p = _parse_product(path, "rule")
        if p: index.append(p)
    for path in glob.glob(str(ROOT / "agents" / "*" / "AGENT.md")):
        p = _parse_product(path, "agent")
        if p: index.append(p)
    return index


def _parse_product(path: str, ptype: str) -> dict | None:
    try:
        content = open(path).read()
    except Exception:
        return None
    p = {"path": path, "type": ptype, "body": content}
    in_fm = fm_open = False
    for line in content.splitlines():
        s = line.strip()
        if s == "---":
            if not fm_open: fm_open = in_fm = True
            else: in_fm = False
            continue
        if in_fm:
            for field in ("name","id","hash","goal","description"):
                if s.startswith(f"{field}:"):
                    p[field] = s[len(field)+1:].strip().strip("\"'>-").strip()
            if s.startswith("keywords:"):
                p["keywords"] = [k.strip() for k in s[9:].strip().strip("[]").split(",")]
    return p if "name" in p else None


def score(request: str, product: dict) -> float:
    req = set(re.split(r"[\s\-_,]", request.lower()))
    s = 0.0
    for kw in product.get("keywords", []):
        if any(w in req for w in kw.replace("-"," ").split()): s += 3.0
    name_w = set(re.split(r"[\s\-_]", product.get("name","").lower()))
    s += len(req & name_w) * 2.0
    desc = product.get("description","").lower()
    s += sum(1 for w in req if len(w)>3 and w in desc)
    goal = product.get("goal","").lower()
    s += sum(0.5 for w in req if len(w)>3 and w in goal)
    return s


# ── Tool implementations ─────────────────────────────────────────────────────

INDEX: list[dict] = []


def tool_search_library(query: str, limit: int = 5) -> str:
    """Search the library for products matching a query."""
    results = sorted([(score(query, p), p) for p in INDEX], key=lambda x: -x[0])
    top = [(sc, p) for sc, p in results[:limit] if sc > 0]
    if not top:
        return json.dumps({"matches": [], "note": "No products matched. Try the catchall."})
    return json.dumps({
        "matches": [
            {
                "name":     p["name"],
                "id":       p.get("id","?"),
                "type":     p["type"],
                "score":    round(sc, 1),
                "goal":     p.get("goal",""),
                "keywords": p.get("keywords",[]),
            }
            for sc, p in top
        ]
    })


def tool_get_product(name_or_id: str) -> str:
    """Get the full content of a specific skill, rule, or agent."""
    target = name_or_id.lower().strip()
    for p in INDEX:
        if p.get("name","").lower() == target or p.get("id","").lower() == target:
            return json.dumps({
                "name":        p.get("name"),
                "id":          p.get("id"),
                "type":        p.get("type"),
                "goal":        p.get("goal",""),
                "description": p.get("description",""),
                "keywords":    p.get("keywords",[]),
                "body":        p.get("body","")[:8000],  # cap for context
            })
    return json.dumps({"error": f"No product found matching '{name_or_id}'"})


def tool_list_products(category: str = "") -> str:
    """List all products, optionally filtered by category folder."""
    cat = category.lower().strip()
    filtered = [p for p in INDEX
                if not cat or cat in p.get("path","").lower()]
    return json.dumps({
        "count": len(filtered),
        "products": [
            {"name": p["name"], "id": p.get("id","?"), "type": p["type"],
             "goal": p.get("goal","")[:80]}
            for p in filtered
        ]
    })


def tool_get_guide() -> str:
    """Return the Gamer's Guide — how any AI should use this library as its brain."""
    guide_path = ROOT / "GUIDE.md"
    if guide_path.exists():
        return open(guide_path).read()
    return "GUIDE.md not found. See README.md for the schema."


def tool_decompose_question(raw: str, session: str = "mcp") -> str:
    """Decompose a question into concise form + function label."""
    sys.path.insert(0, str(ROOT / "scripts"))
    try:
        import decompose_question as dq
        dq.DRY_RUN = True
        result = dq.log_question(raw, session=session)
        return json.dumps({
            "concise":   result["concise"],
            "function":  result["function"],
            "skill":     result["skill"],
            "skill_id":  result["skill_id"],
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


def tool_add_to_catchall(question: str, session: str = "mcp",
                          attempted: str = "none") -> str:
    """Log an unmatched request to the catchall queue."""
    from datetime import datetime, timezone
    ts   = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    title = question[:60].strip()
    entry = f"""
## {date} | {title}
**Received:** {ts}
**Request:** {question}
**Session:** {session}
**Attempted matches:** {attempted}
**Status:** pending

---
"""
    queue_path = ROOT / "docs" / "catchall" / "queue.md"
    queue_path.parent.mkdir(parents=True, exist_ok=True)
    with open(queue_path, "a") as f:
        f.write(entry)
    return json.dumps({
        "logged": True,
        "note": "Added to catchall queue. GitHub Actions will process it within 1 hour."
    })


# ── MCP server ───────────────────────────────────────────────────────────────

TOOLS = [
    {
        "name": "search_library",
        "description": (
            "Search the AI Skills Library for products (skills, rules, agents) "
            "matching a query. Returns ranked matches with goal and keywords. "
            "Use this FIRST whenever a user makes a request — find the right skill before acting."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "What the user wants to do"},
                "limit": {"type": "integer", "description": "Max results (default 5)", "default": 5}
            },
            "required": ["query"]
        }
    },
    {
        "name": "get_product",
        "description": (
            "Get the full content of a specific skill, rule, or agent by name or ID. "
            "Returns the complete SKILL.md or body.md including all sections."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "name_or_id": {"type": "string", "description": "Skill name or ID (e.g. 'create-skill' or 'SK-0021')"}
            },
            "required": ["name_or_id"]
        }
    },
    {
        "name": "list_products",
        "description": "List all products in the library, optionally filtered by category.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "category": {"type": "string", "description": "Category filter (e.g. 'methodology', 'engineering')"}
            }
        }
    },
    {
        "name": "get_guide",
        "description": (
            "Return the Gamer's Guide — the complete operating manual for how any AI "
            "should use this library as its brain. Read this first in any new session."
        ),
        "inputSchema": {"type": "object", "properties": {}}
    },
    {
        "name": "decompose_question",
        "description": (
            "Decompose a raw question into its concise form (≤20 words) and function label "
            "(action-verb category → skill ID). Run before routing to get clean signal."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "raw":     {"type": "string", "description": "The raw question or prompt"},
                "session": {"type": "string", "description": "Project or session context", "default": "mcp"}
            },
            "required": ["raw"]
        }
    },
    {
        "name": "add_to_catchall",
        "description": (
            "Log an unmatched request to the catchall queue. GitHub Actions will process it, "
            "match it to the closest skill, or file a proposal for a new skill."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "question":  {"type": "string", "description": "The unmatched question"},
                "session":   {"type": "string", "description": "Session context"},
                "attempted": {"type": "string", "description": "Skill names tried"}
            },
            "required": ["question"]
        }
    }
]


def handle_tool(name: str, args: dict) -> str:
    dispatch = {
        "search_library":    lambda: tool_search_library(args.get("query",""), args.get("limit",5)),
        "get_product":       lambda: tool_get_product(args.get("name_or_id","")),
        "list_products":     lambda: tool_list_products(args.get("category","")),
        "get_guide":         lambda: tool_get_guide(),
        "decompose_question":lambda: tool_decompose_question(args.get("raw",""), args.get("session","mcp")),
        "add_to_catchall":   lambda: tool_add_to_catchall(args.get("question",""), args.get("session","mcp"), args.get("attempted","none")),
    }
    fn = dispatch.get(name)
    if fn:
        return fn()
    return json.dumps({"error": f"Unknown tool: {name}"})


def run_stdio_server():
    """Minimal stdio MCP server for environments without the mcp package."""
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            continue

        method = msg.get("method", "")
        msg_id = msg.get("id")

        if method == "initialize":
            resp = {
                "jsonrpc": "2.0", "id": msg_id,
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {"tools": {}},
                    "serverInfo": {"name": "ai-skills-library", "version": "1.0.0"}
                }
            }
        elif method == "tools/list":
            resp = {"jsonrpc": "2.0", "id": msg_id, "result": {"tools": TOOLS}}
        elif method == "tools/call":
            params = msg.get("params", {})
            tool_name = params.get("name", "")
            tool_args = params.get("arguments", {})
            result_text = handle_tool(tool_name, tool_args)
            resp = {
                "jsonrpc": "2.0", "id": msg_id,
                "result": {"content": [{"type": "text", "text": result_text}]}
            }
        elif method == "notifications/initialized":
            continue
        else:
            resp = {
                "jsonrpc": "2.0", "id": msg_id,
                "error": {"code": -32601, "message": f"Method not found: {method}"}
            }

        print(json.dumps(resp), flush=True)


if __name__ == "__main__":
    INDEX.extend(build_index())
    if MCP_AVAILABLE:
        server = Server("ai-skills-library")

        @server.list_tools()
        async def list_tools():
            from mcp.types import Tool
            return [Tool(name=t["name"], description=t["description"],
                         inputSchema=t["inputSchema"]) for t in TOOLS]

        @server.call_tool()
        async def call_tool(name: str, arguments: dict):
            from mcp.types import TextContent
            return [TextContent(type="text", text=handle_tool(name, arguments))]

        import asyncio
        asyncio.run(stdio_server(server))
    else:
        run_stdio_server()
