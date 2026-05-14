---
name: <kebab-case-name>
description: >-
  <2-3 sentence summary of what the agent does. Be specific about inputs, outputs, and stop conditions.>
tools: [Read, Write, Edit, Bash, Grep, Glob]
model: opus
---

# Agent: <agent-name>

## Mission

<One paragraph stating the agent's purpose and the boundary of what it does vs doesn't do.>

## Inputs expected

```yaml
<structured input shape>
```

## Output artifacts

1. <File 1>
2. <File 2>

## Safety guarantees

- <Pre-flight check 1>
- <Pre-flight check 2>
- <Idempotency / safety property>

## Stop conditions

- <When the agent hands back to human>
- <Failure modes that escalate>

## Related

- Skill: [`skills/engineering/<skill>`](../skills/engineering/<skill>/SKILL.md)
- Templates: [`templates/<template>`](../templates/<template>)
- Rules: <list relevant rules>
