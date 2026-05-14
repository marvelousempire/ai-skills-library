# Hardware Doc Checklist

Before writing a hardware compatibility doc for a new machine.

## Required information to gather first
```
[ ] CPU: brand, GHz, core/thread count, microarchitecture (for AVX2 support)
[ ] GPU: model, VRAM, vendor (AMD/NVIDIA/Intel/Apple) — determine CUDA/ROCm/Metal availability
[ ] RAM: total GB, speed, whether it's official or unofficial upgrade
[ ] OS: current version, latest officially supported version
[ ] Xcode max: what Xcode version can this OS run?
    - Ventura (13): Xcode 15.4 max → cannot build iPadOS 18
    - Sonoma (14): Xcode 16 max → can build iPadOS 18 + visionOS 2
    - Sequoia (15): Xcode 16+ → full support
```

## Required sections in the doc
```
[ ] Machine specs table
[ ] Role assignment (one sentence)
[ ] Full capability matrix (✅/⚠️/❌ for each service)
[ ] Ollama model table with token/sec estimates
[ ] Recommended model + reason
[ ] .env block ready to paste
[ ] One-liner installer reference
[ ] Cross-reference to hardware-topology.md
```

## Ollama CPU speed rule of thumb
```
Intel i5 4C (3.4GHz, 2017):   8-15 tok/sec for 3b models  → real-time voice OK
Intel i7 8C (4.0GHz, 2019):  15-25 tok/sec for 3b models  → real-time voice good
Apple M1 (8C):                40-60 tok/sec for 3b models  → fast
Apple M4 Pro (14C):           60-90 tok/sec for 3b models  → very fast
Apple M5 Max (18C):          80-120 tok/sec for 3b models  → excellent
```

Voice turns need ≥ 6 tok/sec to feel real-time (30-token reply in ≤5 sec).
Below that: usable for text but laggy for voice.
